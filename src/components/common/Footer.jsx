import React from 'react';
import { Heart, ShieldCheck, ExternalLink } from './Icons';

export function Footer({ setActiveTab }) {
  const handleNav = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="brand-icon-box" style={{ width: '2rem', height: '2rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                </svg>
              </div>
              <strong style={{ fontSize: '1.2rem', color: 'var(--color-primary-900)' }}>SignBridge</strong>
            </div>
            <p className="footer-brand-desc">
              Bridging everyday communication barriers through accessible, video-driven Indian Sign Language (ISL) learning. Built for inclusive education, healthcare, and public service spaces.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Learning Modules</h4>
            <ul className="footer-list">
              <li><button className="footer-btn-link" onClick={() => handleNav('lessons')}>Video Lessons</button></li>
              <li><button className="footer-btn-link" onClick={() => handleNav('dictionary')}>Sign Dictionary</button></li>
              <li><button className="footer-btn-link" onClick={() => handleNav('practice')}>Self-Practice Studio</button></li>
              <li><button className="footer-btn-link" onClick={() => handleNav('quiz')}>Interactive Quizzes</button></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Standards & Community</h4>
            <ul className="footer-list">
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={16} color="var(--color-primary-600)" />
                  Standardized ISL Signs
                </span>
              </li>
              <li>
                <button className="footer-btn-link" onClick={() => handleNav('progress')}>
                  Future Dataset Integrations
                </button>
              </li>
              <li>
                <span style={{ fontSize: '0.85rem' }}>Curriculum verified against CISLR & ISL500 benchmarks.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SignBridge. Built for College Hackathon '26. All data stored locally in your browser.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Dedicated to deaf awareness & accessibility</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
