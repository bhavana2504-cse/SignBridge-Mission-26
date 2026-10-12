import { validateDataset, validateSignEntry } from '../data/datasetSchema';
import { SIGN_VOCABULARY } from '../data/signVocabulary';

/**
 * SignBridge Future Dataset Integration Service
 * 
 * Provides isolated dataset ingestion, schema validation, duplicate detection,
 * and safe merging capabilities without requiring UI changes or risking regression.
 */

export const futureDatasetService = {
  /**
   * Dry-run inspection of candidate dataset JSON
   * @param {Array} newEntries Candidate array of sign objects
   * @returns {Object} Comprehensive audit report
   */
  inspectCandidateDataset(newEntries) {
    if (!Array.isArray(newEntries)) {
      return {
        passed: false,
        summary: 'Dataset must be an array of sign objects.',
        details: []
      };
    }

    const validation = validateDataset(newEntries);
    const existingWords = new Set(SIGN_VOCABULARY.map((s) => s.word.toLowerCase()));
    const existingIds = new Set(SIGN_VOCABULARY.map((s) => s.id.toLowerCase()));

    const overlapWords = [];
    const novelEntries = [];

    newEntries.forEach((entry) => {
      const isWordExisting = entry.word && existingWords.has(entry.word.toLowerCase());
      const isIdExisting = entry.id && existingIds.has(entry.id.toLowerCase());

      if (isWordExisting || isIdExisting) {
        overlapWords.push(entry.word || entry.id);
      } else {
        novelEntries.push(entry);
      }
    });

    return {
      passed: validation.valid && validation.errorCount === 0,
      totalCandidateRecords: newEntries.length,
      validRecords: validation.validCount,
      invalidRecords: validation.errorCount,
      validationReport: validation.report,
      duplicateWithinCandidate: validation.duplicates,
      overlapWithCurrentVocabulary: overlapWords,
      potentialNewSignsCount: novelEntries.length,
      readyForIntegration: validation.valid && validation.errorCount === 0
    };
  },

  /**
   * Generate boilerplate import template for documentation / manual dataset addition
   * @returns {string} Sample JSON structure
   */
  getDatasetTemplate() {
    return JSON.stringify(
      [
        {
          id: 'welcome',
          word: 'Welcome',
          category: 'Everyday Communication',
          videoFile: 'welcome__DATASET__001.mp4',
          videoPath: '/videos/welcome__DATASET__001.mp4',
          sourceDataset: 'ISL_Extension_2026',
          description: 'A friendly greeting welcoming guests or participants.',
          example: 'Welcome everyone to the workshop.',
          difficulty: 'Beginner',
          tags: ['greeting', 'welcome', 'hospitality']
        }
      ],
      null,
      2
    );
  }
};
