/**
 * SignBridge Local & Cloud Storage Service
 * Handles persistence for user progress, favorites, recent views, and quiz scores.
 * Seamlessly integrates local offline storage with Supabase cloud database synchronization.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

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
    this.pushCloudUpdate({ completed_lessons: updated });
    return updated.includes(signId);
  },

  markLessonCompleted(signId) {
    const list = this.getCompletedLessons();
    if (!list.includes(signId)) {
      const updated = [...list, signId];
      safeSet(STORAGE_KEYS.COMPLETED_LESSONS, updated);
      this.pushCloudUpdate({ completed_lessons: updated });
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
    this.pushCloudUpdate({ favorites: updated });
    return updated.includes(signId);
  },

  // --- Recently Viewed ---
  getRecentlyViewed() {
    return safeGet(STORAGE_KEYS.RECENTLY_VIEWED, []);
  },

  addRecentlyViewed(signId) {
    if (!signId) return;
    const current = this.getRecentlyViewed();
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
    const updated = [record, ...history].slice(0, 30);
    safeSet(STORAGE_KEYS.QUIZ_HISTORY, updated);
    this.pushCloudUpdate({ quiz_attempts: updated.length });
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
    this.pushCloudUpdate({ 
      display_name: updated.name, 
      avatar: updated.avatar 
    });
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
  },

  // --- Supabase Cloud Sync & Merge Logic ---
  async syncWithSupabase(user) {
    if (!supabase || !isSupabaseConfigured() || !user) return;

    try {
      // 1. Fetch cloud record for current authenticated user
      const { data: cloudData, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const localCompleted = this.getCompletedLessons();
      const localFavorites = this.getFavorites();
      const localProfile = this.getUserProfile();
      const localQuizzes = this.getQuizHistory();

      // If user row does not exist yet in public.user_progress, insert it
      if (!cloudData) {
        const initialRecord = {
          user_id: user.id,
          display_name: localProfile.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Sign Learner',
          avatar: localProfile.avatar || 'avatar_sage',
          completed_lessons: localCompleted,
          favorites: localFavorites,
          coins: 120 + (localCompleted.length * 10) + (localQuizzes.length * 15),
          streak: Math.max(1, Math.min(30, 5 + Math.floor(localCompleted.length / 3))),
          longest_streak: Math.max(1, Math.min(30, 5 + Math.floor(localCompleted.length / 3))),
          quiz_attempts: localQuizzes.length,
          last_activity_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        };

        const { error: insertErr } = await supabase.from('user_progress').insert(initialRecord);
        if (insertErr) {
          console.warn('[SignBridge] Supabase initial progress insert notice:', insertErr.message);
        }
        return;
      }

      // Merge arrays safely (no duplicates)
      const mergedCompleted = Array.from(new Set([...(cloudData.completed_lessons || []), ...localCompleted]));
      const mergedFavorites = Array.from(new Set([...(cloudData.favorites || []), ...localFavorites]));
      const mergedName = cloudData.display_name || localProfile.name || 'Sign Learner';
      const mergedAvatar = cloudData.avatar || localProfile.avatar || 'avatar_sage';

      // Update local storage with merged state
      safeSet(STORAGE_KEYS.COMPLETED_LESSONS, mergedCompleted);
      safeSet(STORAGE_KEYS.FAVORITES, mergedFavorites);
      safeSet(STORAGE_KEYS.USER_PROFILE, {
        ...localProfile,
        name: mergedName,
        avatar: mergedAvatar
      });

      // Update Supabase with merged values
      await supabase
        .from('user_progress')
        .update({
          completed_lessons: mergedCompleted,
          favorites: mergedFavorites,
          display_name: mergedName,
          avatar: mergedAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      notifyChange();
    } catch (syncErr) {
      console.warn('[SignBridge] Supabase sync fallback to offline local storage:', syncErr);
    }
  },

  // Helper to push non-blocking updates to cloud if logged in
  async pushCloudUpdate(fields) {
    if (!supabase || !isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_progress')
        .update({
          ...fields,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } catch (err) {
      // Graceful offline fallback
    }
  }
};

export default storageService;
