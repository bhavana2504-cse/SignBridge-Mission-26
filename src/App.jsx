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
import { signService } from './services/signService';
import './styles/App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeModalSign, setActiveModalSign] = useState(null);
  const [practiceSignId, setPracticeSignId] = useState(null);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs = ['home', 'lessons', 'dictionary', 'practice', 'quiz', 'progress'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
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
    <div className="app-layout">
      {/* Accessible Header & Navigation */}
      <Header activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      {/* Main Dynamic View */}
      <main className="main-content" id="main-content" role="main">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={handleSetActiveTab}
            onSelectSign={handleSelectSign}
            onStartPractice={handleStartPractice}
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
          />
        )}
      </main>

      {/* Global Sign Detail Modal */}
      <SignDetailModal
        sign={activeModalSign}
        isOpen={Boolean(activeModalSign)}
        onClose={() => setActiveModalSign(null)}
        onStartPractice={handleStartPractice}
      />

      {/* Accessible Site Footer */}
      <Footer setActiveTab={handleSetActiveTab} />
    </div>
  );
}

export default App;
