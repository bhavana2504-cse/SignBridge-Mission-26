import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Video, 
  Award, 
  BarChart2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Play,
  Sparkles,
  Layers
} from '../common/Icons';
import { InstructorHeroIllustration, PathRoadGraphic } from '../common/Illustrations';
import { VideoPlayer } from '../common/VideoPlayer';
import { SignCard } from '../common/SignCard';
import { signService } from '../../services/signService';
import { storageService } from '../../services/storageService';

export function HomePage({ setActiveTab, onSelectSign, onStartPractice }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const totalSigns = signService.getAllSigns().length;
  const featuredSigns = signService.getFeaturedSigns();
  const helloSign = signService.getSignById('hello');

  const [coins, setCoins] = useState(() => storageService.getCoins());
  const [streakDays, setStreakDays] = useState(() => storageService.getDisplayStreak());

  const updateProgress = () => {
    setCompletedCount(storageService.getCompletedLessons().length);
    setQuizAttempts(storageService.getQuizHistory().length);
    setCoins(storageService.getCoins());
    setStreakDays(storageService.getDisplayStreak());
  };

  useEffect(() => {
    updateProgress();
    window.addEventListener(storageService.SYNC_EVENT, updateProgress);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, updateProgress);
    };
  }, []);

  const progressPercentage = Math.round((completedCount / totalSigns) * 100) || 0;
  const dailyGoalTarget = 5;
  const dailyGoalDone = Math.min(dailyGoalTarget, completedCount % 5 || (completedCount > 0 ? 5 : 2));
  const dailyGoalPct = Math.round((dailyGoalDone / dailyGoalTarget) * 100);

  return (
    <div>
      {/* 1. Hero Section matching reference design */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-grid">
            {/* Left Column: Headline, subtext, action buttons */}
            <div>
              <h1 id="hero-title" className="hero-title">
                Bridging the World<br />
                <span style={{ color: 'var(--color-primary-600)' }}>Through Signs</span>
              </h1>
              <p className="hero-lead">
                Discover Indian Sign Language through interactive lessons, animated signing demonstrations, and fun challenges.
              </p>

              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveTab('lessons')}
                >
                  <span>Start Learning</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab('quiz')}
                >
                  <span>Test Your Skills</span>
                </button>
              </div>

              <div className="hero-tag-text">
                <span>🌟</span>
                <span>Every sign brings us closer</span>
              </div>
            </div>

            {/* Right Column: Female ISL Instructor Character Illustration */}
            <div style={{ position: 'relative' }}>
              <InstructorHeroIllustration />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* 2. Top Statistics 4-Card Row */}
        <section className="metrics-row" aria-label="Learning metrics summary">
          {/* Card 1: Current Level */}
          <div className="metric-tile">
            <span className="metric-tile-label">Current Level</span>
            <span className="metric-tile-val blue">Beginner</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Module 1 of 6
            </span>
          </div>

          {/* Card 2: Lessons Completed */}
          <div className="metric-tile">
            <span className="metric-tile-label">Lessons Completed</span>
            <span className="metric-tile-val purple">
              {completedCount} <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)' }}>of {totalSigns}</span>
            </span>
            <div className="metric-progress-track">
              <div className="metric-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          {/* Card 3: Learning Streak */}
          <div className="metric-tile">
            <span className="metric-tile-label">Learning Streak</span>
            <span className="metric-tile-val" style={{ color: '#ea580c' }}>
              {streakDays} Days
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              🔥 Keep learning today!
            </span>
          </div>

          {/* Card 4: Total Coins */}
          <div className="metric-tile">
            <span className="metric-tile-label">Total Coins</span>
            <span className="metric-tile-val gold">
              🪙 {coins}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Earn coins with quizzes
            </span>
          </div>
        </section>

        {/* 3. Promotional Cards Row (Learn Signs, Test Yourself, Daily Goal) */}
        <section className="promo-cards-grid" aria-label="Quick start options">
          {/* Promo Card 1: LEARN SIGNS */}
          <div className="promo-card learn">
            <div>
              <span className="promo-card-badge purple">
                <span>📚</span>
                <span>CURATED ISL</span>
              </span>
              <h2 className="promo-card-title">LEARN SIGNS</h2>
              <p className="promo-card-desc">
                Learn from curated signs and video signing demonstrations.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: 'fit-content' }}
              onClick={() => setActiveTab('lessons')}
            >
              <span>Learn Signs</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Promo Card 2: TEST YOURSELF */}
          <div className="promo-card test">
            <div>
              <span className="promo-card-badge orange">
                <span>🎯</span>
                <span>CHALLENGE</span>
              </span>
              <h2 className="promo-card-title">TEST YOURSELF</h2>
              <p className="promo-card-desc">
                Test your sign recall, answer questions, and master new signs.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: 'fit-content', backgroundColor: '#4f46e5' }}
              onClick={() => setActiveTab('quiz')}
            >
              <span>Test Yourself</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Promo Card 3: Daily Goal */}
          <div className="promo-card goal">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Daily Goal</strong>
                <span style={{ fontSize: '1.2rem' }}>🔥</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
                Learn 5 new signs today
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                <span>Progress</span>
                <span>{dailyGoalDone} / {dailyGoalTarget} Signs</span>
              </div>
              <div className="metric-progress-track">
                <div 
                  className="metric-progress-fill" 
                  style={{ width: `${dailyGoalPct}%`, backgroundColor: '#f43f5e' }}
                ></div>
              </div>
            </div>
            <button
              type="button"
              className="footer-btn-link"
              style={{ marginTop: '1rem', fontWeight: '700', color: 'var(--color-primary-700)' }}
              onClick={() => setActiveTab('lessons')}
            >
              Continue Today's Goal →
            </button>
          </div>
        </section>

        {/* 4. Choose Your Learning Path Section (Matching Road Layout) */}
        <section className="learning-path-section" aria-labelledby="learning-path-heading">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 id="learning-path-heading" style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Choose Your Learning Path
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.25rem' }}>
              Follow the guided pathway from foundational basics to fluent recall.
            </p>
          </div>

          {/* Decorative Path Road Graphic */}
          <PathRoadGraphic />

          <div className="learning-path-grid">
            {/* Stage 1: Beginner */}
            <div className="path-card">
              <div className="path-card-icon-box">
                <span>👋</span>
              </div>
              <h3 className="path-card-title">Beginner</h3>
              <p className="path-card-desc">
                Discover Indian Sign Language through everyday greetings and polite essentials.
              </p>
              <div className="path-card-meta">
                <span>11 Lessons</span>
                <span style={{ color: 'var(--color-success)', fontWeight: '800' }}>✓ Unlocked</span>
              </div>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setActiveTab('lessons')}
              >
                <span>Start Beginner</span>
              </button>
            </div>

            {/* Stage 2: Intermediate */}
            <div className="path-card">
              <div className="path-card-icon-box">
                <span>👨‍👩‍👧</span>
              </div>
              <h3 className="path-card-title">Intermediate</h3>
              <p className="path-card-desc">
                Learn signs for family relationships, common meals, drinks, and daily places.
              </p>
              <div className="path-card-meta">
                <span>15 Lessons</span>
                <span style={{ color: 'var(--color-primary-700)', fontWeight: '800' }}>In Progress</span>
              </div>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setActiveTab('lessons')}
              >
                <span>Continue</span>
              </button>
            </div>

            {/* Stage 3: Advanced */}
            <div className="path-card">
              <div className="path-card-icon-box">
                <span>🏃</span>
              </div>
              <h3 className="path-card-title">Advanced</h3>
              <p className="path-card-desc">
                Master conversational movement actions, questions (what, where, when), and hospital signs.
              </p>
              <div className="path-card-meta">
                <span>14 Lessons</span>
                <span style={{ color: 'var(--color-success)', fontWeight: '800' }}>✓ Unlocked</span>
              </div>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setActiveTab('lessons')}
              >
                <span>Explore</span>
              </button>
            </div>

            {/* Stage 4: Practice & Recall */}
            <div className="path-card">
              <div className="path-card-icon-box">
                <span>📹</span>
              </div>
              <h3 className="path-card-title">Camera Practice</h3>
              <p className="path-card-desc">
                Self-evaluate your signing posture side-by-side with reference video demonstrations.
              </p>
              <div className="path-card-meta">
                <span>Studio + Quizzes</span>
                <span style={{ color: 'var(--color-success)', fontWeight: '800' }}>✓ Unlocked</span>
              </div>
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ backgroundColor: '#4f46e5' }}
                onClick={() => setActiveTab('practice')}
              >
                <span>Practice Now</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. Featured Demonstration Preview */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="category-badge">Featured Sign</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.35rem' }}>
                Video Demonstration Showcase
              </h2>
            </div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setActiveTab('dictionary')}
            >
              <span>Explore All 40 Signs</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {helloSign && (
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Sign: "{helloSign.word}"</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{helloSign.description}</p>
                  </div>
                  <span className="category-badge teal">Source: {helloSign.sourceDataset}</span>
                </div>
                <VideoPlayer
                  src={helloSign.videoPath}
                  title="Hello"
                  autoPlay={false}
                  loop={true}
                />
              </div>
            )}
          </div>
        </section>

        {/* 6. Standard Alignment Notice */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-xl)', padding: '1.5rem 1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={32} color="#5c54e5" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
            <div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary-900)' }}>
                Standardized Indian Sign Language Curriculum
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginTop: '0.35rem', lineHeight: '1.55' }}>
                SignBridge is grounded in standardized ISL vocabulary verified through the CISLR and ISL500 benchmarks. Our platform follows WCAG 2.1 AA accessibility guidelines for color contrast, visible keyboard focus, and inclusive learning.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
