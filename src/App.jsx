import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { LessonsPage } from './components/lessons/LessonsPage';
import { DictionaryPage } from './components/dictionary/DictionaryPage';
import { PracticePage } from './components/practice/PracticePage';
import { QuizPage } from './components/quiz/QuizPage';
import { ProgressPage } from './components/progress/ProgressPage';
import { SignDetailModal } from './components/common/SignDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { signService } from './services/signService';
import './styles/App.css';

function AuthNotificationBanner({ onOpenAuth }) {
  const { authNotice, clearAuthNotice } = useAuth();
  if (!authNotice) return null;

  const isSuccess = authNotice.type === 'success';

  return (
    <div 
      style={{
        backgroundColor: isSuccess ? '#ecfdf5' : '#fef2f2',
        borderBottom: `1px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}`,
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        color: isSuccess ? '#065f46' : '#991b1b',
        fontSize: '0.875rem',
        fontWeight: '500',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
      role="status"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{isSuccess ? '✅' : '⚠️'}</span>
        <div>
          <strong>{authNotice.title}:</strong> {authNotice.message}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {!isSuccess && onOpenAuth && (
          <button
            type="button"
            className="btn-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
            onClick={onOpenAuth}
          >
            Resend Email
          </button>
        )}
        <button
          type="button"
          onClick={clearAuthNotice}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'inherit', padding: '0.2rem 0.4rem', lineHeight: 1 }}
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeModalSign, setActiveModalSign] = useState(null);
  const [practiceSignId, setPracticeSignId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs = ['home', 'lessons', 'dictionary', 'practice', 'quiz', 'progress'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else if (hash === 'login' || hash === 'signin' || hash === 'signup') {
        setIsAuthModalOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleSelectSign = (sign) => {
    setActiveModalSign(sign);
  };

  const handleStartPractice = (signId) => {
    setPracticeSignId(signId);
    handleSetActiveTab('practice');
  };

  return (
    <AuthProvider>
      <div className="app-layout">
        {/* Accessible Header & Navigation with Supabase Auth */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={handleSetActiveTab} 
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Global Auth Status Notification (for email confirmation & callbacks) */}
        <AuthNotificationBanner onOpenAuth={() => setIsAuthModalOpen(true)} />

        {/* Main Dynamic View */}
        <main className="main-content" id="main-content" role="main">
          {activeTab === 'home' && (
            <HomePage
              setActiveTab={handleSetActiveTab}
              onSelectSign={handleSelectSign}
              onStartPractice={handleStartPractice}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'lessons' && (
            <LessonsPage
              onStartPractice={handleStartPractice}
            />
          )}

          {activeTab === 'dictionary' && (
            <DictionaryPage
              onSelectSign={handleSelectSign}
              onStartPractice={handleStartPractice}
            />
          )}

          {activeTab === 'practice' && (
            <PracticePage
              preselectedSignId={practiceSignId}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizPage />
          )}

          {activeTab === 'progress' && (
            <ProgressPage
              onSelectSign={handleSelectSign}
              onStartPractice={handleStartPractice}
              setActiveTab={handleSetActiveTab}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>

        {/* Global Sign Detail Modal with Gemini AI Coach */}
        <SignDetailModal
          sign={activeModalSign}
          isOpen={Boolean(activeModalSign)}
          onClose={() => setActiveModalSign(null)}
          onStartPractice={handleStartPractice}
        />

        {/* Global Supabase Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

        {/* Accessible Site Footer */}
        <Footer setActiveTab={handleSetActiveTab} />
      </div>
    </AuthProvider>
  );
}

export default App;
