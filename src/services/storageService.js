/**
 * SignBridge Local & Cloud Storage Service
 * Handles persistence for user progress, favorites, recent views, and quiz scores.
 * Implements real daily streak tracking, idempotent coins system (100 starting coins),
 * and bidirectional Supabase cloud synchronization.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

const STORAGE_KEYS = {
  COMPLETED_LESSONS: 'signbridge_completed_lessons_v1',
  FAVORITES: 'signbridge_favorites_v1',
  RECENTLY_VIEWED: 'signbridge_recently_viewed_v1',
  QUIZ_HISTORY: 'signbridge_quiz_history_v1',
  USER_PROFILE: 'signbridge_user_profile_v1',
  COINS: 'signbridge_coins_v2',
  STREAK: 'signbridge_streak_v2',
  LONGEST_STREAK: 'signbridge_longest_streak_v2',
  LAST_ACTIVITY_DATE: 'signbridge_last_activity_date_v2',
  REWARDED_ACTIVITIES: 'signbridge_rewarded_activities_v2'
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
    return raw !== null ? JSON.parse(raw) : defaultValue;
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

// Consistent Local Calendar Date Helpers (YYYY-MM-DD)
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return Infinity;
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export const storageService = {
  SYNC_EVENT,

  // --- Real Coins System (Exactly 100 Starting Coins for New Users) ---
  getCoins() {
    return safeGet(STORAGE_KEYS.COINS, 100);
  },

  getRewardedActivities() {
    return safeGet(STORAGE_KEYS.REWARDED_ACTIVITIES, ['welcome_bonus']);
  },

  /**
   * Idempotently grant coins for a qualifying learning event.
   * Ensures the same event cannot grant duplicate rewards across refreshes or logins.
   */
  grantReward(activityId, amount) {
    if (!activityId || amount <= 0) return false;
    const rewarded = this.getRewardedActivities();
    if (rewarded.includes(activityId)) {
      return false; // Already awarded!
    }

    const currentCoins = this.getCoins();
    const updatedCoins = currentCoins + amount;
    const updatedRewarded = [...rewarded, activityId];

    safeSet(STORAGE_KEYS.COINS, updatedCoins);
    safeSet(STORAGE_KEYS.REWARDED_ACTIVITIES, updatedRewarded);
    this.pushCloudUpdate({ 
      coins: updatedCoins,
      rewarded_activities: updatedRewarded
    });
    return true;
  },

  // --- Real Daily Streak System ---
  getStreak() {
    return safeGet(STORAGE_KEYS.STREAK, 0);
  },

  getLongestStreak() {
    return safeGet(STORAGE_KEYS.LONGEST_STREAK, 0);
  },

  getLastActivityDate() {
    return safeGet(STORAGE_KEYS.LAST_ACTIVITY_DATE, null);
  },

  /**
   * Calculates whether the current streak is currently active or broken.
   * If a full calendar day was missed (last activity was 2 or more days ago),
   * the active display streak is 0 until a new qualifying activity is completed.
   */
  getDisplayStreak() {
    const lastDate = this.getLastActivityDate();
    const streak = this.getStreak();
    if (!lastDate || streak === 0) return 0;

    const today = getLocalDateString();
    const diff = getDayDifference(lastDate, today);

    // If active today (diff 0) or yesterday (diff 1 - still valid for today's session)
    if (diff <= 1) {
      return streak;
    }
    // Missed at least one full calendar day without activity
    return 0;
  },

  /**
   * Records a qualifying learning activity (lesson completed or quiz submitted).
   * Rules:
   * - Maximum 1 streak day increment per calendar day.
   * - First activity starts streak at 1.
   * - If active today, streak remains unchanged.
   * - If last activity was yesterday, streak increases by 1.
   * - If missed 1+ days, restarts streak at 1.
   * - Updates longest streak if current exceeds it.
   */
  recordQualifyingActivity() {
    const today = getLocalDateString();
    const lastDate = this.getLastActivityDate();
    let currentStreak = this.getStreak();
    let longest = this.getLongestStreak();

    if (!lastDate) {
      // First ever qualifying activity
      currentStreak = 1;
    } else {
      const diff = getDayDifference(lastDate, today);
      if (diff === 0) {
        // Already active today: keep streak unchanged!
        return { streak: currentStreak, updated: false };
      } else if (diff === 1) {
        // Active yesterday: advance streak by 1
        currentStreak += 1;
      } else if (diff > 1) {
        // Missed one or more days: restart streak at 1
        currentStreak = 1;
      }
    }

    if (currentStreak > longest) {
      longest = currentStreak;
    }

    safeSet(STORAGE_KEYS.STREAK, currentStreak);
    safeSet(STORAGE_KEYS.LONGEST_STREAK, longest);
    safeSet(STORAGE_KEYS.LAST_ACTIVITY_DATE, today);

    this.pushCloudUpdate({
      streak: currentStreak,
      longest_streak: longest,
      last_activity_date: today
    });

    return { streak: currentStreak, updated: true };
  },

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
    let isNowCompleted;

    if (index > -1) {
      updated = list.filter((id) => id !== signId);
      isNowCompleted = false;
    } else {
      updated = [...list, signId];
      isNowCompleted = true;
      // Record qualifying activity & grant reward (+10 coins once per unique sign)
      this.recordQualifyingActivity();
      this.grantReward(`lesson_${signId}`, 10);
    }

    safeSet(STORAGE_KEYS.COMPLETED_LESSONS, updated);
    this.pushCloudUpdate({ completed_lessons: updated });
    return isNowCompleted;
  },

  markLessonCompleted(signId) {
    const list = this.getCompletedLessons();
    if (!list.includes(signId)) {
      const updated = [...list, signId];
      safeSet(STORAGE_KEYS.COMPLETED_LESSONS, updated);
      this.recordQualifyingActivity();
      this.grantReward(`lesson_${signId}`, 10);
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

    // Record qualifying activity & grant reward (+15 coins once for this quiz)
    this.recordQualifyingActivity();
    this.grantReward(`quiz_${record.id}`, 15);

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

  // --- Reset Progress ---
  resetAllProgress() {
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
      safeSet(STORAGE_KEYS.COINS, 100);
      safeSet(STORAGE_KEYS.STREAK, 0);
      safeSet(STORAGE_KEYS.LONGEST_STREAK, 0);
      safeSet(STORAGE_KEYS.LAST_ACTIVITY_DATE, null);
      safeSet(STORAGE_KEYS.REWARDED_ACTIVITIES, ['welcome_bonus']);
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
      const { data: cloudData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const localCompleted = this.getCompletedLessons();
      const localFavorites = this.getFavorites();
      const localProfile = this.getUserProfile();
      const localCoins = this.getCoins();
      const localStreak = this.getStreak();
      const localLongest = this.getLongestStreak();
      const localLastDate = this.getLastActivityDate();
      const localRewarded = this.getRewardedActivities();
      const localQuizzes = this.getQuizHistory();

      // If user row does not exist in public.user_progress, create it
      if (!cloudData) {
        const initialRecord = {
          user_id: user.id,
          display_name: localProfile.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Sign Learner',
          avatar: localProfile.avatar || 'avatar_sage',
          completed_lessons: localCompleted,
          favorites: localFavorites,
          coins: localCoins,
          streak: localStreak,
          longest_streak: localLongest,
          last_activity_date: localLastDate,
          quiz_attempts: localQuizzes.length,
          rewarded_activities: localRewarded,
          updated_at: new Date().toISOString()
        };

        await supabase.from('user_progress').insert(initialRecord);
        return;
      }

      // Merge records safely without overwriting legitimate balances
      const mergedCompleted = Array.from(new Set([...(cloudData.completed_lessons || []), ...localCompleted]));
      const mergedFavorites = Array.from(new Set([...(cloudData.favorites || []), ...localFavorites]));
      const mergedRewarded = Array.from(new Set([...(cloudData.rewarded_activities || []), ...localRewarded]));
      const mergedName = cloudData.display_name || localProfile.name || 'Sign Learner';
      const mergedAvatar = cloudData.avatar || localProfile.avatar || 'avatar_sage';

      // Coins: Preserve highest legitimate balance; never reset to starting 100 on returning user
      const cloudCoins = typeof cloudData.coins === 'number' ? cloudData.coins : 100;
      const mergedCoins = Math.max(localCoins, cloudCoins);

      // Streak: Use record with the most recent activity date
      let mergedStreak = localStreak;
      let mergedLongest = Math.max(localLongest, cloudData.longest_streak || 0);
      let mergedLastDate = localLastDate;

      if (cloudData.last_activity_date) {
        if (!localLastDate || cloudData.last_activity_date > localLastDate) {
          mergedStreak = cloudData.streak || 0;
          mergedLastDate = cloudData.last_activity_date;
        }
      }

      // Update local storage
      safeSet(STORAGE_KEYS.COMPLETED_LESSONS, mergedCompleted);
      safeSet(STORAGE_KEYS.FAVORITES, mergedFavorites);
      safeSet(STORAGE_KEYS.COINS, mergedCoins);
      safeSet(STORAGE_KEYS.STREAK, mergedStreak);
      safeSet(STORAGE_KEYS.LONGEST_STREAK, mergedLongest);
      safeSet(STORAGE_KEYS.LAST_ACTIVITY_DATE, mergedLastDate);
      safeSet(STORAGE_KEYS.REWARDED_ACTIVITIES, mergedRewarded);
      safeSet(STORAGE_KEYS.USER_PROFILE, {
        ...localProfile,
        name: mergedName,
        avatar: mergedAvatar
      });

      // Update cloud with merged values
      await supabase
        .from('user_progress')
        .update({
          completed_lessons: mergedCompleted,
          favorites: mergedFavorites,
          coins: mergedCoins,
          streak: mergedStreak,
          longest_streak: mergedLongest,
          last_activity_date: mergedLastDate,
          rewarded_activities: mergedRewarded,
          display_name: mergedName,
          avatar: mergedAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      notifyChange();
    } catch (syncErr) {
      console.warn('[SignBridge] Supabase sync fallback to local storage:', syncErr);
    }
  },

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
      // Offline fallback
    }
  }
};

export default storageService;
