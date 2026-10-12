import { SIGN_VOCABULARY, CATEGORIES } from '../data/signVocabulary';

/**
 * SignBridge Content Service
 * Central data access layer abstracting vocabulary queries from UI components.
 */

export const signService = {
  /**
   * Get all verified signs
   * @returns {Array} List of all signs
   */
  getAllSigns() {
    return [...SIGN_VOCABULARY];
  },

  /**
   * Get all supported categories
   * @returns {string[]} List of category names
   */
  getCategories() {
    return [...CATEGORIES];
  },

  /**
   * Find a sign by its unique slug ID
   * @param {string} id
   * @returns {Object|null}
   */
  getSignById(id) {
    if (!id) return null;
    return SIGN_VOCABULARY.find((item) => item.id.toLowerCase() === id.toLowerCase()) || null;
  },

  /**
   * Find a sign by English word
   * @param {string} word
   * @returns {Object|null}
   */
  getSignByWord(word) {
    if (!word) return null;
    return (
      SIGN_VOCABULARY.find((item) => item.word.toLowerCase() === word.toLowerCase().trim()) || null
    );
  },

  /**
   * Get signs filtered by category
   * @param {string} category
   * @returns {Array}
   */
  getSignsByCategory(category) {
    if (!category || category === 'All') return this.getAllSigns();
    return SIGN_VOCABULARY.filter((item) => item.category === category);
  },

  /**
   * Search signs by query string and optional category
   * @param {string} query Search text
   * @param {string} category Category filter
   * @returns {Array} Matching signs
   */
  searchSigns(query = '', category = 'All') {
    let results = this.getAllSigns();

    if (category && category !== 'All') {
      results = results.filter((item) => item.category === category);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return results;
    }

    return results.filter((item) => {
      const matchWord = item.word.toLowerCase().includes(trimmed);
      const matchCategory = item.category.toLowerCase().includes(trimmed);
      const matchTags = item.tags && item.tags.some((t) => t.toLowerCase().includes(trimmed));
      const matchDesc = item.description && item.description.toLowerCase().includes(trimmed);

      return matchWord || matchCategory || matchTags || matchDesc;
    });
  },

  /**
   * Curated featured signs for home page preview
   * @returns {Array}
   */
  getFeaturedSigns() {
    const featuredIds = ['hello', 'thank-you', 'help', 'hospital', 'water', 'friend'];
    return featuredIds
      .map((id) => this.getSignById(id))
      .filter(Boolean);
  },

  /**
   * Group all signs into structured lesson modules by category
   * @returns {Array<{ category: string, count: number, signs: Array }>}
   */
  getLessonsGrouped() {
    return CATEGORIES.map((cat) => {
      const signs = this.getSignsByCategory(cat);
      return {
        category: cat,
        count: signs.length,
        signs
      };
    });
  },

  /**
   * Get random options for quiz questions
   * @param {number} count Total number of options
   * @param {string} correctId ID of the correct sign to exclude from distractors
   * @returns {Array} Distractor signs
   */
  getRandomDistractors(count, correctId) {
    const others = SIGN_VOCABULARY.filter((item) => item.id !== correctId);
    // Fisher-Yates shuffle copy
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
};
