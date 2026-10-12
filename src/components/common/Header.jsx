import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Video, 
  Award, 
  BarChart2, 
  Menu, 
  X, 
  CheckCircle2 
} from './Icons';
import { storageService } from '../../services/storageService';
import { signService } from '../../services/signService';

export function Header({ activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const totalSigns = signService.getAllSigns().length;

  const updateStats = () => {
    const completed = storageService.getCompletedLessons();
    setCompletedCount(completed.length);
  };

  useEffect(() => {
    updateStats();
    window.addEventListener(storageService.SYNC_EVENT, updateStats);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, updateStats);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'dictionary', label: 'Sign Dictionary', icon: Search },
    { id: 'practice', label: 'Self Practice', icon: Video },
    { id: 'quiz', label: 'Quizzes', icon: Award },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="header-inner">
          {/* Brand Logo */}
          <a 
            href="#home" 
            className="brand-link" 
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            aria-label="SignBridge Home"
          >
            <div className="brand-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </div>
            <div>
              <span className="brand-title">SignBridge</span>
              <span className="brand-badge">ISL</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" role="navigation" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  {Icon && <Icon size={17} aria-hidden="true" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="header-right">
            <button 
              className="progress-pill-btn"
              onClick={() => handleNavClick('progress')}
              title="View your learning progress"
              aria-label={`Learning progress: ${completedCount} of ${totalSigns} signs completed`}
            >
              <CheckCircle2 size={16} color="var(--color-primary-600)" aria-hidden="true" />
              <span>{completedCount} / {totalSigns} Signs</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer" role="navigation" aria-label="Mobile Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {Icon && <Icon size={19} aria-hidden="true" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
