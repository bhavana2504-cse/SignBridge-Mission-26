/**
 * Dataset Schema & Validation Specification for SignBridge
 * 
 * Provides strict validation and normalization rules for current and future datasets.
 * Ensures that adding new datasets does not corrupt the learning platform.
 */

export const REQUIRED_FIELDS = ['id', 'word', 'category', 'videoFile'];

export const SUPPORTED_CATEGORIES = [
  'Everyday Communication',
  'People and Family',
  'Food and Drinks',
  'Places',
  'Actions',
  'Questions'
];

/**
 * Validate a sign entry record
 * @param {Object} entry Candidate sign entry
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSignEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== 'object') {
    return { valid: false, errors: ['Entry must be a non-null object'] };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!entry[field] || typeof entry[field] !== 'string' || entry[field].trim() === '') {
      errors.push(`Missing or invalid required field: "${field}"`);
    }
  }

  // Check category
  if (entry.category && !SUPPORTED_CATEGORIES.includes(entry.category)) {
    errors.push(`Category "${entry.category}" is not in the recognized categories list: ${SUPPORTED_CATEGORIES.join(', ')}`);
  }

  // Check video filename format
  if (entry.videoFile && !entry.videoFile.endsWith('.mp4') && !entry.videoFile.endsWith('.webm')) {
    errors.push(`Video file "${entry.videoFile}" must have a valid video extension (.mp4, .webm)`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate an entire dataset array and detect duplicates
 * @param {Array} dataset Array of sign entries
 * @returns {{ valid: boolean, validCount: number, errorCount: number, duplicates: string[], report: Array }}
 */
export function validateDataset(dataset) {
  if (!Array.isArray(dataset)) {
    return {
      valid: false,
      validCount: 0,
      errorCount: 1,
      duplicates: [],
      report: [{ index: -1, errors: ['Dataset must be an array'] }]
    };
  }

  const seenIds = new Set();
  const seenWords = new Set();
  const duplicates = [];
  const report = [];

  dataset.forEach((entry, idx) => {
    const { valid, errors } = validateSignEntry(entry);
    const entryErrors = [...errors];

    if (entry.id) {
      if (seenIds.has(entry.id)) {
        duplicates.push(`Duplicate ID: "${entry.id}" at index ${idx}`);
        entryErrors.push(`Duplicate ID: "${entry.id}"`);
      } else {
        seenIds.add(entry.id);
      }
    }

    if (entry.word) {
      const lowerWord = entry.word.toLowerCase();
      if (seenWords.has(lowerWord)) {
        duplicates.push(`Duplicate Word: "${entry.word}" at index ${idx}`);
        entryErrors.push(`Duplicate Word: "${entry.word}"`);
      } else {
        seenWords.add(lowerWord);
      }
    }

    if (entryErrors.length > 0) {
      report.push({
        index: idx,
        word: entry.word || 'Unknown',
        errors: entryErrors
      });
    }
  });

  return {
    valid: report.length === 0,
    validCount: dataset.length - report.length,
    errorCount: report.length,
    duplicates,
    report
  };
}
