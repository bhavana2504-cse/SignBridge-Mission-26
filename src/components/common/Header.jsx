import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Video, 
  Award, 
  BarChart2, 
  Menu, 
  X, 
  CheckCircle2,
  Sparkles
} from './Icons';
import { BridgeLogo } from './Illustrations';
import { storageService } from '../../services/storageService';
import { signService } from '../../services/signService';

export function Header({ activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [userProfile, setUserProfile] = useState({ name: 'Sign Learner', avatar: 'avatar_sage' });

  const totalSigns = signService.getAllSigns().length;

  const updateStats = () => {
    const completed = storageService.getCompletedLessons();
    setCompletedCount(completed.length);
    setQuizAttempts(storageService.getQuizHistory().length);
    setUserProfile(storageService.getUserProfile());
  };

  useEffect(() => {
    updateStats();
    window.addEventListener(storageService.SYNC_EVENT, updateStats);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, updateStats);
    };
  }, []);

  // Main nav items matching reference design: Home, Learn, Practice, Progress
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'lessons', label: 'Learn' },
    { id: 'dictionary', label: 'Dictionary' },
    { id: 'practice', label: 'Practice' },
    { id: 'quiz', label: 'Quizzes' },
    { id: 'progress', label: 'Progress' }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Coins calculated: base 120 + bonus for completed signs & quizzes
  const coins = 120 + (completedCount * 10) + (quizAttempts * 15);
  // Dynamic streak (default 5 days as displayed in reference)
  const streakDays = Math.max(5, Math.min(30, 5 + Math.floor(completedCount / 3)));

  return (
    <header className="site-header" role="banner">
      <div className="container">
        <div className="header-inner">
          {/* Brand Logo with Bridge Icon */}
          <a 
            href="#home" 
            className="brand-link" 
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            aria-label="SignBridge Home"
          >
            <div className="brand-icon-box" aria-hidden="true">
              <BridgeLogo size={30} color="#5c54e5" />
            </div>
            <div>
              <span className="brand-title">SignBridge</span>
            </div>
          </a>

          {/* Center Pill Navigation (Matching Reference) */}
          <nav className="desktop-nav" role="navigation" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'lessons' && activeTab === 'lessons');
              return (
                <button
                  key={item.id}
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Status Badges: Streak, Coins, Profile */}
          <div className="header-right">
            {/* Streak Badge */}
            <div className="pill-status-badge streak" title={`${streakDays} days active learning streak`}>
              <span>🔥</span>
              <span>{streakDays}</span>
            </div>

            {/* Coins Badge */}
            <div className="pill-status-badge coins" title={`${coins} learning coins earned`}>
              <span>🪙</span>
              <span>{coins} Coins</span>
            </div>

            {/* Profile Avatar */}
            <button 
              type="button"
              className="avatar-nav-circle"
              onClick={() => handleNavClick('progress')}
              title={`View ${userProfile.name}'s Progress`}
              aria-label="User Profile"
            >
              <span>👩‍🎓</span>
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
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
