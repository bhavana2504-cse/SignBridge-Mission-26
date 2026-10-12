/**
 * SignBridge Local Storage Service
 * Handles persistence for user progress, favorites, recent views, and quiz scores.
 * Emits custom events on changes so all UI components remain seamlessly synced.
 */

const STORAGE_KEYS = {
  COMPLETED_LESSONS: 'signbridge_completed_lessons_v1',
  FAVORITES: 'signbridge_favorites_v1',
  RECENTLY_VIEWED: 'signbridge_recently_viewed_v1',
  QUIZ_HISTORY: 'signbridge_quiz_history_v1',
  USER_PROFILE: 'signbridge_user_profile_v1'
};

const SYNC_EVENT = 'signbridge_storage_update';

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }
}

function safeGet(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.warn(`Error reading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange();
    return true;
  } catch (err) {
    console.warn(`Error writing key "${key}" to localStorage:`, err);
    return false;
  }
}

export const storageService = {
  SYNC_EVENT,

  // --- Completed Lessons ---
  getCompletedLessons() {
    return safeGet(STORAGE_KEYS.COMPLETED_LESSONS, []);
  },

  isLessonCompleted(signId) {
    const list = this.getCompletedLessons();
    return list.includes(signId);
  },

  toggleLessonCompletion(signId) {
    const list = this.getCompletedLessons();
    const index = list.indexOf(signId);
    let updated;
    if (index > -1) {
      updated = list.filter((id) => id !== signId);
    } else {
      updated = [...list, signId];
    }
    safeSet(STORAGE_KEYS.COMPLETED_LESSONS, updated);
    return updated.includes(signId);
  },

  markLessonCompleted(signId) {
    const list = this.getCompletedLessons();
    if (!list.includes(signId)) {
      safeSet(STORAGE_KEYS.COMPLETED_LESSONS, [...list, signId]);
    }
  },

  // --- Favorites ---
  getFavorites() {
    return safeGet(STORAGE_KEYS.FAVORITES, []);
  },

  isFavorite(signId) {
    const list = this.getFavorites();
    return list.includes(signId);
  },

  toggleFavorite(signId) {
    const list = this.getFavorites();
    const index = list.indexOf(signId);
    let updated;
    if (index > -1) {
      updated = list.filter((id) => id !== signId);
    } else {
      updated = [...list, signId];
    }
    safeSet(STORAGE_KEYS.FAVORITES, updated);
    return updated.includes(signId);
  },

  // --- Recently Viewed ---
  getRecentlyViewed() {
    return safeGet(STORAGE_KEYS.RECENTLY_VIEWED, []);
  },

  addRecentlyViewed(signId) {
    if (!signId) return;
    const current = this.getRecentlyViewed();
    // Remove if already present, put at start, cap at 12 items
    const filtered = current.filter((id) => id !== signId);
    const updated = [signId, ...filtered].slice(0, 12);
    safeSet(STORAGE_KEYS.RECENTLY_VIEWED, updated);
  },

  // --- Quiz History ---
  getQuizHistory() {
    return safeGet(STORAGE_KEYS.QUIZ_HISTORY, []);
  },

  saveQuizResult(result) {
    const history = this.getQuizHistory();
    const record = {
      id: `quiz_${Date.now()}`,
      date: new Date().toISOString(),
      category: result.category || 'All Categories',
      score: result.score,
      total: result.total,
      percentage: Math.round((result.score / result.total) * 100)
    };
    const updated = [record, ...history].slice(0, 30); // keep last 30 quizzes
    safeSet(STORAGE_KEYS.QUIZ_HISTORY, updated);
    return record;
  },

  // --- Profile & Personalisation ---
  getUserProfile() {
    return safeGet(STORAGE_KEYS.USER_PROFILE, {
      name: 'Sign Learner',
      avatar: 'avatar_sage',
      joinedAt: new Date().toISOString()
    });
  },

  updateUserProfile(updates) {
    const current = this.getUserProfile();
    const updated = { ...current, ...updates };
    safeSet(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  // --- Reset All Progress ---
  resetAllProgress() {
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
      notifyChange();
      return true;
    } catch (err) {
      console.error('Error resetting progress:', err);
      return false;
    }
  }
};
