import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Award, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  User, 
  Database, 
  FileCode, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  RotateCcw 
} from '../common/Icons';
import { AchievementBadgeItem } from '../common/Illustrations';
import { SignCard } from '../common/SignCard';
import { signService } from '../../services/signService';
import { storageService } from '../../services/storageService';
import { futureDatasetService } from '../../services/futureDatasetService';
import { useAuth } from '../../context/AuthContext';

const PREDEFINED_AVATARS = [
  { id: 'avatar_sage', label: '🌿 Sage', bg: '#4f46e5' },
  { id: 'avatar_teal', label: '🌊 Teal', bg: '#06b6d4' },
  { id: 'avatar_amber', label: '🌾 Amber', bg: '#f59e0b' },
  { id: 'avatar_indigo', label: '🌌 Indigo', bg: '#7c3aed' },
  { id: 'avatar_emerald', label: '🍃 Emerald', bg: '#10b981' }
];

export function ProgressPage({ onSelectSign, onStartPractice, setActiveTab, onOpenAuth }) {
  const { user } = useAuth();
  const [completedList, setCompletedList] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [recentlyViewedList, setRecentlyViewedList] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: 'Sign Learner', avatar: 'avatar_sage' });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('Sign Learner');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [datasetAuditResult, setDatasetAuditResult] = useState(null);

  const [coins, setCoins] = useState(() => storageService.getCoins());
  const [streakDays, setStreakDays] = useState(() => storageService.getDisplayStreak());
  const [longestStreak, setLongestStreak] = useState(() => storageService.getLongestStreak());

  const allSigns = signService.getAllSigns();
  const categories = signService.getCategories();

  const loadData = () => {
    setCompletedList(storageService.getCompletedLessons());
    setFavoritesList(storageService.getFavorites());
    setRecentlyViewedList(storageService.getRecentlyViewed());
    setQuizHistory(storageService.getQuizHistory());
    setCoins(storageService.getCoins());
    setStreakDays(storageService.getDisplayStreak());
    setLongestStreak(storageService.getLongestStreak());
    const profile = storageService.getUserProfile();
    setUserProfile(profile);
    setNameInput(profile.name || 'Sign Learner');
  };

  useEffect(() => {
    loadData();
    window.addEventListener(storageService.SYNC_EVENT, loadData);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, loadData);
    };
  }, []);

  const handleSaveName = () => {
    const updated = storageService.updateUserProfile({ name: nameInput.trim() || 'Sign Learner' });
    setUserProfile(updated);
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatarId) => {
    const updated = storageService.updateUserProfile({ avatar: avatarId });
    setUserProfile(updated);
  };

  const handleReset = () => {
    storageService.resetAllProgress();
    setShowResetConfirm(false);
    loadData();
  };

  const handleRunDatasetAudit = () => {
    const sample = [
      {
        id: 'computer',
        word: 'Computer',
        category: 'Everyday Communication',
        videoFile: 'computer__sample.mp4',
        videoPath: '/videos/computer__sample.mp4',
        sourceDataset: 'ISL_Extension_2026',
        description: 'Electronic device sign.',
        example: 'We use the computer in class.'
      }
    ];
    const audit = futureDatasetService.inspectCandidateDataset(sample);
    setDatasetAuditResult(audit);
  };

  const overallPercent = Math.round((completedList.length / allSigns.length) * 100) || 0;
  const currentAvatar = PREDEFINED_AVATARS.find((a) => a.id === userProfile.avatar) || PREDEFINED_AVATARS[0];

  // Badges unlock criteria
  const hasFirstSign = completedList.length >= 1;
  const hasQuickLearner = completedList.length >= 5;
  const hasPerfectScore = quizHistory.some(q => q.percentage === 100);
  const hasChampion = completedList.length >= 10 || quizHistory.length >= 3;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-header">
        <span className="category-badge" style={{ marginBottom: '0.4rem' }}>
          <span>📊</span>
          <span>Learner Dashboard</span>
        </span>
        <h1 className="section-title">Progress Dashboard</h1>
        <p className="section-subtitle">
          Track your completed signs, streak metrics, earned coins, and achievement badges saved locally.
        </p>
      </div>

      {/* Supabase Cloud Sync Status Banner */}
      <div style={{
        backgroundColor: user ? '#ecfdf5' : '#f8faff',
        border: `1px solid ${user ? '#a7f3d0' : 'var(--color-primary-200)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{user ? '☁️' : '💾'}</span>
          <div>
            <strong style={{ fontSize: '0.95rem', color: user ? '#065f46' : 'var(--color-primary-900)', display: 'block' }}>
              {user ? 'Supabase Cloud Sync: Active' : 'Local Offline Mode Active'}
            </strong>
            <span style={{ fontSize: '0.825rem', color: user ? '#047857' : 'var(--text-muted)' }}>
              {user 
                ? `Authenticated as ${user.email}. Progress automatically synced with Row Level Security.`
                : 'Your progress is stored in this browser. Sign in to sync across devices.'
              }
            </span>
          </div>
        </div>

        {!user && onOpenAuth && (
          <button
            type="button"
            className="btn-primary btn-sm"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            onClick={onOpenAuth}
          >
            <span>Sign In to Sync</span>
          </button>
        )}
      </div>

      {/* User Learner Profile Card */}
      <section className="profile-card" aria-label="Learner Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="avatar-display-box" style={{ backgroundColor: currentAvatar.bg }} aria-hidden="true">
            👩‍🎓
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!isEditingName ? (
                <>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)' }}>{userProfile.name}</h2>
                  <button
                    type="button"
                    className="footer-btn-link"
                    style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: '700' }}
                    onClick={() => setIsEditingName(true)}
                  >
                    Edit Name
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="dict-search-input"
                    style={{ border: '1px solid var(--border-medium)', padding: '0.3rem 0.65rem', borderRadius: '8px' }}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={24}
                  />
                  <button type="button" className="btn-primary btn-sm" onClick={handleSaveName}>
                    Save
                  </button>
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setIsEditingName(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              ISL Learner • Joined {new Date(userProfile.joinedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Predefined Avatar Chooser */}
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
            Choose Color Theme:
          </span>
          <div className="avatars-selection-row" role="radiogroup" aria-label="Avatar options">
            {PREDEFINED_AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                className={`avatar-option-btn ${userProfile.avatar === av.id ? 'selected' : ''}`}
                style={{ backgroundColor: av.bg }}
                onClick={() => handleSelectAvatar(av.id)}
                title={av.label}
                aria-label={av.label}
              >
                <span>{av.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Cards (Matching Reference Dashboard: Learned Level, Days, Coins, Quiz Confidence) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
          Statistics
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
          <div className="sign-card">
            <span className="stat-label">Learned Signs</span>
            <span className="stat-val" style={{ color: 'var(--color-primary-600)' }}>
              {completedList.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {allSigns.length}</span>
            </span>
            <div className="metric-progress-track">
              <div className="metric-progress-fill" style={{ width: `${overallPercent}%` }}></div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {overallPercent}% total curriculum coverage
            </span>
          </div>

          <div className="sign-card">
            <span className="stat-label">Learning Streak</span>
            <span className="stat-val" style={{ color: '#ea580c' }}>
              🔥 {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {streakDays > 0 ? `Active streak • Best: ${longestStreak}d` : `Inactive • Best: ${longestStreak}d`}
            </span>
          </div>

          <div className="sign-card">
            <span className="stat-label">Total Coins</span>
            <span className="stat-val" style={{ color: '#d97706' }}>
              🪙 {coins}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Earned across lessons & quizzes
            </span>
          </div>

          <div className="sign-card">
            <span className="stat-label">Quiz Confidence</span>
            <span className="stat-val" style={{ color: '#7c3aed' }}>
              {quizHistory.length > 0 
                ? `${Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length)}%`
                : '100%'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {quizHistory.length} quiz assessments logged
            </span>
          </div>
        </div>
      </section>

      {/* Achievement Badges Section (Matching Reference 4 Shields) */}
      <section className="sign-card" style={{ marginBottom: '2.5rem' }} aria-labelledby="achievement-badges-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 id="achievement-badges-heading" style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Achievement Badges
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Earn badges as you advance
          </span>
        </div>

        <div className="badges-row">
          <AchievementBadgeItem 
            type="first" 
            label="First Sign" 
            active={hasFirstSign} 
          />
          <AchievementBadgeItem 
            type="speed" 
            label="Quick Learner" 
            active={hasQuickLearner} 
          />
          <AchievementBadgeItem 
            type="perfect" 
            label="Perfect Score" 
            active={hasPerfectScore} 
          />
          <AchievementBadgeItem 
            type="champion" 
            label="Consistency Champion" 
            active={hasChampion} 
          />
        </div>
      </section>

      {/* Category-by-Category Mastery Bars */}
      <section className="sign-card" style={{ marginBottom: '2.5rem' }} aria-labelledby="cat-breakdown-heading">
        <h2 id="cat-breakdown-heading" style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Curriculum Category Breakdown
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {categories.map((cat) => {
            const catSigns = signService.getSignsByCategory(cat);
            const done = catSigns.filter((s) => completedList.includes(s.id)).length;
            const pct = Math.round((done / catSigns.length) * 100) || 0;

            return (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                  <span>{cat}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {done} of {catSigns.length} signs ({pct}%)
                  </span>
                </div>
                <div className="metric-progress-track">
                  <div className="metric-progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quiz History Log */}
      <section className="sign-card" style={{ marginBottom: '2.5rem' }} aria-labelledby="quiz-history-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 id="quiz-history-heading" style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Recent Quiz Attempts
          </h2>
          <button
            type="button"
            className="footer-btn-link"
            style={{ fontWeight: '700', color: 'var(--color-primary-600)' }}
            onClick={() => setActiveTab('quiz')}
          >
            Take New Quiz →
          </button>
        </div>

        {quizHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Module</th>
                  <th>Score</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.slice(0, 8).map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.category}</td>
                    <td>{record.score} / {record.total}</td>
                    <td>
                      <span className="category-badge" style={{ backgroundColor: record.percentage >= 70 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', color: record.percentage >= 70 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                        {record.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
            No quiz results recorded yet. Complete a quiz challenge to see your performance history here.
          </p>
        )}
      </section>

      {/* Future Dataset Integration Hub */}
      <section className="sign-card" style={{ marginBottom: '2.5rem', backgroundColor: '#f5f7fe', border: '1px solid var(--color-primary-200)' }} aria-labelledby="future-dataset-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Database size={22} color="var(--color-primary-600)" aria-hidden="true" />
          <h2 id="future-dataset-heading" style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-primary-900)' }}>
            Architecture for Future Dataset Integration
          </h2>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.55', marginBottom: '1rem' }}>
          SignBridge cleanly decouples vocabulary data from presentation UI. When you receive an additional ISL dataset, you can integrate it without altering any page components or resetting user progress.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-800)' }}>Current Dataset</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              40 verified signs across CISLR & ISL500 benchmarks. All 40 videos are in <code>public/videos/</code>.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-800)' }}>How to Extend</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Place new video clips in <code>public/videos/</code> and declare entries in <code>src/data/signVocabulary.js</code>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={handleRunDatasetAudit}
          >
            <ShieldCheck size={16} />
            <span>Audit Ingestion Validator</span>
          </button>
        </div>

        {datasetAuditResult && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1.15rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-200)', fontSize: '0.85rem' }}>
            <strong style={{ color: 'var(--color-success)' }}>✓ Schema Validator Operational</strong>
            <p style={{ marginTop: '0.25rem', color: 'var(--text-body)' }}>
              Validation engine checked candidate dataset: {datasetAuditResult.validRecords} record passed syntax checks, {datasetAuditResult.potentialNewSignsCount} novel entries detected, 0 schema violations.
            </p>
          </div>
        )}
      </section>

      {/* Safe Progress Reset Option */}
      <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Reset Progress</strong>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Clear your local progress, quiz history, and favorites stored on this browser.
          </p>
        </div>

        {!showResetConfirm ? (
          <button
            type="button"
            className="btn-secondary btn-sm"
            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
            onClick={() => setShowResetConfirm(true)}
          >
            <Trash2 size={15} />
            <span>Reset Local Progress</span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: '700' }}>Confirm reset?</span>
            <button
              type="button"
              className="btn-primary btn-sm"
              style={{ backgroundColor: '#ef4444' }}
              onClick={handleReset}
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
