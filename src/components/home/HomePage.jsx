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
  Layers,
  Sparkles
} from '../common/Icons';
import { VideoPlayer } from '../common/VideoPlayer';
import { SignCard } from '../common/SignCard';
import { signService } from '../../services/signService';
import { storageService } from '../../services/storageService';

export function HomePage({ setActiveTab, onSelectSign, onStartPractice }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const totalSigns = signService.getAllSigns().length;
  const featuredSigns = signService.getFeaturedSigns();
  const helloSign = signService.getSignById('hello');

  const updateProgress = () => {
    setCompletedCount(storageService.getCompletedLessons().length);
    setFavoritesCount(storageService.getFavorites().length);
    setQuizAttempts(storageService.getQuizHistory().length);
  };

  useEffect(() => {
    updateProgress();
    window.addEventListener(storageService.SYNC_EVENT, updateProgress);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, updateProgress);
    };
  }, []);

  const progressPercentage = Math.round((completedCount / totalSigns) * 100) || 0;

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <Sparkles size={16} color="var(--color-primary-600)" aria-hidden="true" />
                <span>Accessible ISL Learning Platform</span>
              </div>
              <h1 id="hero-title" className="hero-title">
                Bridge the Gap with <span style={{ color: 'var(--color-primary-800)' }}>Indian Sign Language</span>
              </h1>
              <p className="hero-lead">
                SignBridge provides structured, video-driven learning of standardized Indian Sign Language (ISL). Designed for students, healthcare workers, and educators to communicate effectively with Deaf and Hard-of-Hearing individuals.
              </p>

              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveTab('lessons')}
                >
                  <BookOpen size={18} aria-hidden="true" />
                  <span>Start Video Lessons</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab('dictionary')}
                >
                  <Search size={18} aria-hidden="true" />
                  <span>Search 40 Signs</span>
                </button>
              </div>

              <div className="hero-highlights">
                <div className="hero-highlight-item">
                  <CheckCircle2 size={18} className="hero-highlight-icon" aria-hidden="true" />
                  <span>40 Standardized Signs</span>
                </div>
                <div className="hero-highlight-item">
                  <CheckCircle2 size={18} className="hero-highlight-icon" aria-hidden="true" />
                  <span>Interactive Camera Practice</span>
                </div>
                <div className="hero-highlight-item">
                  <CheckCircle2 size={18} className="hero-highlight-icon" aria-hidden="true" />
                  <span>100% In-Browser & Offline-Ready</span>
                </div>
              </div>
            </div>

            {/* Hero Interactive Video Demonstration Preview */}
            <div>
              <div className="hero-preview-card">
                <div className="hero-preview-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="category-badge">Featured Greeting</span>
                    <strong style={{ fontSize: '1.1rem' }}>"Hello" in ISL</strong>
                  </div>
                  <span className="category-badge teal">Source: ISL500</span>
                </div>

                {helloSign ? (
                  <VideoPlayer
                    src={helloSign.videoPath}
                    title="Hello"
                    autoPlay={false}
                    loop={true}
                  />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>Demo video loading...</div>
                )}

                <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Watch sign at 0.5x, 0.75x or normal speed
                  </span>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => onSelectSign(helloSign)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Progress Summary Bar */}
      <div className="container">
        <aside className="quick-progress-card" aria-label="Learning progress summary">
          <div className="stat-item">
            <span className="stat-label">Mastery Progress</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="stat-val">{progressPercentage}%</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>completed</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Lessons Completed</span>
            <span className="stat-val">{completedCount} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>/ {totalSigns}</span></span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Quiz Attempts</span>
            <span className="stat-val">{quizAttempts}</span>
          </div>

          <div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={() => setActiveTab('progress')}
            >
              <BarChart2 size={16} aria-hidden="true" />
              <span>Full Progress</span>
            </button>
          </div>
        </aside>
      </div>

      {/* How SignBridge Works - 4 Pillars */}
      <section className="container" style={{ marginBottom: '4rem' }} aria-labelledby="how-it-works-title">
        <div className="section-header">
          <span className="section-eyebrow">Interactive Learning Journey</span>
          <h2 id="how-it-works-title" className="section-title">How SignBridge Helps You Learn</h2>
          <p className="section-subtitle">
            A comprehensive curriculum designed to build your visual sign vocabulary through structured instruction and active recall.
          </p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-box">
              <BookOpen size={24} aria-hidden="true" />
            </div>
            <h3 className="pillar-title">1. Structured Lessons</h3>
            <p className="pillar-desc">
              Progress through 6 organized categories including Everyday Greetings, Family, Actions, Food, and Questions with verified reference videos.
            </p>
            <button 
              type="button" 
              className="footer-btn-link" 
              style={{ marginTop: '0.75rem', fontWeight: '600' }}
              onClick={() => setActiveTab('lessons')}
            >
              Explore Lessons →
            </button>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Search size={24} aria-hidden="true" />
            </div>
            <h3 className="pillar-title">2. Searchable Dictionary</h3>
            <p className="pillar-desc">
              Look up any sign instantly. Filter by category, bookmark your favorites, and review recently viewed vocabulary anytime.
            </p>
            <button 
              type="button" 
              className="footer-btn-link" 
              style={{ marginTop: '0.75rem', fontWeight: '600' }}
              onClick={() => setActiveTab('dictionary')}
            >
              Open Dictionary →
            </button>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Video size={24} aria-hidden="true" />
            </div>
            <h3 className="pillar-title">3. Camera Practice Studio</h3>
            <p className="pillar-desc">
              Compare your signing posture side-by-side against expert video demonstrations using your webcam. 100% private and in-browser.
            </p>
            <button 
              type="button" 
              className="footer-btn-link" 
              style={{ marginTop: '0.75rem', fontWeight: '600' }}
              onClick={() => setActiveTab('practice')}
            >
              Try Self-Practice →
            </button>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Award size={24} aria-hidden="true" />
            </div>
            <h3 className="pillar-title">4. Active Recall Quizzes</h3>
            <p className="pillar-desc">
              Test your recognition with video-based multiple-choice quizzes. Get instant answer explanations and track your scores over time.
            </p>
            <button 
              type="button" 
              className="footer-btn-link" 
              style={{ marginTop: '0.75rem', fontWeight: '600' }}
              onClick={() => setActiveTab('quiz')}
            >
              Take a Quiz →
            </button>
          </div>
        </div>
      </section>

      {/* Featured Vocabulary Showcase */}
      <section className="container" style={{ marginBottom: '4rem' }} aria-labelledby="featured-signs-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-eyebrow">Essential Signs</span>
            <h2 id="featured-signs-title" className="section-title">Start With Everyday Basics</h2>
            <p className="section-subtitle">
              These fundamental signs are the building blocks of daily communication in classrooms and hospitals.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setActiveTab('dictionary')}
          >
            <span>View All 40 Signs</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="cards-grid">
          {featuredSigns.map((sign) => (
            <SignCard
              key={sign.id}
              sign={sign}
              onSelectSign={onSelectSign}
              onStartPractice={onStartPractice}
            />
          ))}
        </div>
      </section>

      {/* Standard Alignment Notice */}
      <section className="container" aria-label="Standards compliance statement">
        <div className="standard-notice-box">
          <ShieldCheck size={28} className="standard-notice-icon" aria-hidden="true" />
          <div>
            <h3 className="standard-notice-title">Standardized Content & Alignment</h3>
            <p className="standard-notice-text">
              SignBridge prioritizes standardized, verified Indian Sign Language (ISL) vocabulary sourced from verified academic datasets (CISLR and ISL500 benchmarks). While formal Bureau of Indian Standards (BIS) accessibility certifications will be validated as applicability criteria are finalized, our application follows WCAG 2.1 AA accessibility guidelines for color contrast, semantic navigation, and keyboard operable controls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
