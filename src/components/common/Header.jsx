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
  Sparkles,
  User
} from './Icons';
import { BridgeLogo } from './Illustrations';
import { storageService } from '../../services/storageService';
import { signService } from '../../services/signService';
import { useAuth } from '../../context/AuthContext';

export function Header({ activeTab, setActiveTab, onOpenAuth }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [userProfile, setUserProfile] = useState({ name: 'Sign Learner', avatar: 'avatar_sage' });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [coins, setCoins] = useState(storageService.getCoins());
  const [streakDays, setStreakDays] = useState(storageService.getDisplayStreak());

  const { user, signOut } = useAuth();
  const totalSigns = signService.getAllSigns().length;

  const updateStats = () => {
    const completed = storageService.getCompletedLessons();
    setCompletedCount(completed.length);
    setQuizAttempts(storageService.getQuizHistory().length);
    setUserProfile(storageService.getUserProfile());
    setCoins(storageService.getCoins());
    setStreakDays(storageService.getDisplayStreak());
  };

  useEffect(() => {
    updateStats();
    window.addEventListener(storageService.SYNC_EVENT, updateStats);
    return () => {
      window.removeEventListener(storageService.SYNC_EVENT, updateStats);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'lessons', label: 'Learn' },
    { id: 'guides', label: 'Sign Guides' },
    { id: 'dictionary', label: 'Dictionary' },
    { id: 'practice', label: 'Practice' },
    { id: 'quiz', label: 'Quizzes' },
    { id: 'progress', label: 'Progress' }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Display user name
  const displayName = user?.user_metadata?.full_name || userProfile.name || (user?.email ? user.email.split('@')[0] : 'Sign Learner');

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

          {/* Header Right Status Badges: Streak, Coins, Auth/Profile */}
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

            {/* Profile Avatar / Auth Status */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  type="button"
                  className="avatar-nav-circle"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  title={`${displayName} - Click for Account`}
                  aria-label="User Account Options"
                  aria-expanded={showUserDropdown}
                >
                  <span>👩‍🎓</span>
                </button>

                {showUserDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '210px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    padding: '0.85rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                      <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayName}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {user.email}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="footer-btn-link"
                      style={{ fontSize: '0.85rem', textAlign: 'left', padding: '0.35rem 0' }}
                      onClick={() => handleNavClick('progress')}
                    >
                      📊 View Cloud Progress
                    </button>

                    <button
                      type="button"
                      className="footer-btn-link"
                      style={{ fontSize: '0.85rem', textAlign: 'left', padding: '0.35rem 0', color: '#ef4444', fontWeight: '700' }}
                      onClick={async () => {
                        await signOut();
                        setShowUserDropdown(false);
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                onClick={onOpenAuth}
              >
                <span>Sign In</span>
              </button>
            )}

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
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Signed in as {displayName}</span>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  style={{ color: '#ef4444' }}
                  onClick={async () => {
                    await signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenAuth) onOpenAuth();
                }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
