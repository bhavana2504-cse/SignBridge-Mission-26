import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SIGN_VOCABULARY, CATEGORIES } from './signVocabulary.js';
import { VIDEO_MAPPINGS, getVideoPath } from './videoMapping.js';
import { validateDataset } from './datasetSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const publicVideosDir = path.join(projectRoot, 'public', 'videos');

console.log('==============================================');
console.log('🔍 SignBridge - Dataset & Assets Verification');
console.log('==============================================\n');

let pass = true;

// Test 1: Count of signs
console.log(`Checking sign vocabulary count... Found: ${SIGN_VOCABULARY.length}`);
if (SIGN_VOCABULARY.length !== 40) {
  console.error(`❌ Expected exactly 40 signs, found ${SIGN_VOCABULARY.length}`);
  pass = false;
} else {
  console.log('✅ Exactly 40 signs defined in vocabulary.');
}

// Test 2: Categories
console.log(`Checking categories... Found: ${CATEGORIES.length}`);
const expectedCategories = [
  'Everyday Communication',
  'People and Family',
  'Food and Drinks',
  'Places',
  'Actions',
  'Questions'
];
const catMismatch = expectedCategories.filter(c => !CATEGORIES.includes(c));
if (catMismatch.length > 0) {
  console.error(`❌ Missing categories: ${catMismatch.join(', ')}`);
  pass = false;
} else {
  console.log('✅ All 6 standard categories verified.');
}

// Test 3: Schema validation
const validation = validateDataset(SIGN_VOCABULARY);
if (!validation.valid) {
  console.error('❌ Dataset schema validation failed:', validation.report);
  pass = false;
} else {
  console.log('✅ Schema validator passed (0 errors, 0 duplicates).');
}

// Test 4: Video existence on disk in public/videos
console.log(`\nVerifying physical video files in ${publicVideosDir}...`);
let missingFiles = 0;
SIGN_VOCABULARY.forEach(sign => {
  const filePath = path.join(publicVideosDir, sign.videoFile);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing video file for "${sign.word}": ${sign.videoFile}`);
    missingFiles++;
    pass = false;
  }
});

if (missingFiles === 0) {
  console.log(`✅ All ${SIGN_VOCABULARY.length} video files exist in public/videos/!`);
} else {
  console.error(`❌ Found ${missingFiles} missing files.`);
}

// Test 5: Verify getVideoPath resolver for hyphens, spaces, and underscores
const testKeys = ['thank_you', 'thank-you', 'thank you', 'hello', 'mother'];
let resolverErrors = 0;
testKeys.forEach(k => {
  const p = getVideoPath(k);
  if (!p) {
    console.error(`❌ getVideoPath failed to resolve key: "${k}"`);
    resolverErrors++;
    pass = false;
  }
});
if (resolverErrors === 0) {
  console.log('✅ Key resolution engine passed for hyphens, underscores, and spaces.');
}

console.log('\n----------------------------------------------');
if (pass) {
  console.log('🎉 ALL 5 VERIFICATION SUITES PASSED CLEANLY!');
} else {
  console.error('⚠️ SOME VERIFICATION CHECKS FAILED!');
  process.exit(1);
}
console.log('----------------------------------------------\n');
