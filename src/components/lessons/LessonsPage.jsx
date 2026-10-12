import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Heart, 
  Video, 
  BookOpen, 
  Sparkles, 
  RotateCcw,
  Layers 
} from '../common/Icons';
import { InstructorHeroIllustration } from '../common/Illustrations';
import { VideoPlayer } from '../common/VideoPlayer';
import { signService } from '../../services/signService';
import { storageService } from '../../services/storageService';

export function LessonsPage({ onStartPractice, initialCategory = null }) {
  const categories = signService.getCategories();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || categories[0]);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const signsInCategory = signService.getSignsByCategory(selectedCategory);
  const currentSign = signsInCategory[currentSignIndex] || signsInCategory[0];

  useEffect(() => {
    setCurrentSignIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (currentSign) {
      setIsCompleted(storageService.isLessonCompleted(currentSign.id));
      setIsFav(storageService.isFavorite(currentSign.id));
      storageService.addRecentlyViewed(currentSign.id);
    }
  }, [currentSign]);

  const handleNext = () => {
    if (currentSignIndex < signsInCategory.length - 1) {
      setCurrentSignIndex(currentSignIndex + 1);
    } else {
      const currentCatIdx = categories.indexOf(selectedCategory);
      if (currentCatIdx < categories.length - 1) {
        setSelectedCategory(categories[currentCatIdx + 1]);
        setCurrentSignIndex(0);
      } else {
        setCurrentSignIndex(0);
      }
    }
  };

  const handlePrev = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(currentSignIndex - 1);
    }
  };

  const handleToggleComplete = () => {
    if (!currentSign) return;
    const updated = storageService.toggleLessonCompletion(currentSign.id);
    setIsCompleted(updated);
  };

  const handleToggleFavorite = () => {
    if (!currentSign) return;
    const updated = storageService.toggleFavorite(currentSign.id);
    setIsFav(updated);
  };

  const completedInCat = signsInCategory.filter((s) => 
    storageService.isLessonCompleted(s.id)
  ).length;

  const catProgressPercent = Math.round((completedInCat / signsInCategory.length) * 100) || 0;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Top Learning Banner matching Reference Screenshot */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #f4f6fe 100%)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <span className="category-badge" style={{ marginBottom: '0.5rem' }}>
              <span>📖</span>
              <span>Interactive Curriculum</span>
            </span>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Learn Indian Sign Language
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', marginTop: '0.25rem' }}>
              Explore standardized video demonstrations, observe correct handshapes, and master everyday ISL phrases.
            </p>
          </div>

          <div style={{ width: '130px', height: '130px', flexShrink: 0, display: 'none' }}>
            <InstructorHeroIllustration width="100%" height="100%" />
          </div>
        </div>
      </div>

      <div className="lesson-layout">
        {/* Left Column: Category Navigation */}
        <aside className="category-nav-panel" aria-label="Curriculum categories">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <BookOpen size={20} color="var(--color-primary-600)" aria-hidden="true" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>Categories</h2>
          </div>

          <ul className="category-nav-list">
            {categories.map((cat) => {
              const catSigns = signService.getSignsByCategory(cat);
              const completedCount = catSigns.filter((s) => storageService.isLessonCompleted(s.id)).length;
              const isSelected = selectedCategory === cat;

              return (
                <li key={cat}>
                  <button
                    type="button"
                    className={`category-nav-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <span>{cat}</span>
                    <span className="category-nav-badge">
                      {completedCount}/{catSigns.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              <span>Module Progress</span>
              <span>{catProgressPercent}%</span>
            </div>
            <div className="metric-progress-track">
              <div className="metric-progress-fill" style={{ width: `${catProgressPercent}%` }}></div>
            </div>
          </div>

          {/* Signs Quick Selector List */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem' }}>
              Signs in this module:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {signsInCategory.map((s, idx) => {
                const isCurrent = idx === currentSignIndex;
                const isDone = storageService.isLessonCompleted(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isCurrent ? 'var(--color-primary-600)' : isDone ? 'var(--color-success-bg)' : 'var(--bg-subtle)',
                      color: isCurrent ? '#ffffff' : isDone ? 'var(--color-success)' : 'var(--text-body)',
                      border: isCurrent ? '1px solid var(--color-primary-600)' : '1px solid var(--border-light)'
                    }}
                    onClick={() => setCurrentSignIndex(idx)}
                  >
                    {s.word} {isDone && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Active Sign Lesson Viewer */}
        <main className="lesson-viewer-card" aria-labelledby="lesson-sign-title">
          {currentSign ? (
            <>
              <div className="lesson-viewer-header">
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="category-badge">{currentSign.category}</span>
                    <span className="category-badge teal">Sign {currentSignIndex + 1} of {signsInCategory.length}</span>
                  </div>
                  <h2 id="lesson-sign-title" className="lesson-word-title">{currentSign.word}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Dataset Source: <strong>{currentSign.sourceDataset}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`icon-btn ${isFav ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    type="button"
                    className={`icon-btn ${isCompleted ? 'completed' : ''}`}
                    onClick={handleToggleComplete}
                    aria-label={isCompleted ? 'Mark lesson incomplete' : 'Mark lesson completed'}
                    title={isCompleted ? 'Lesson completed' : 'Mark completed'}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <VideoPlayer
                src={currentSign.videoPath}
                title={currentSign.word}
                autoPlay={false}
                loop={true}
              />

              {/* Meaning & Usage */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  How to Sign "{currentSign.word}"
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: '1.55' }}>
                  {currentSign.description}
                </p>
              </div>

              {/* Example in Context */}
              {currentSign.example && (
                <div className="lesson-context-box">
                  <strong style={{ fontSize: '0.825rem', color: 'var(--color-primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Example Sentence
                  </strong>
                  <p style={{ marginTop: '0.25rem', fontStyle: 'italic', color: 'var(--text-main)', fontSize: '1rem' }}>
                    "{currentSign.example}"
                  </p>
                </div>
              )}

              {/* Quick Action Navigation */}
              <div className="lesson-controls-bar">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handlePrev}
                    disabled={currentSignIndex === 0}
                    style={{ opacity: currentSignIndex === 0 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleNext}
                  >
                    <span>Next Sign</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn-primary btn-sm`}
                    style={{ backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-primary-600)' }}
                    onClick={handleToggleComplete}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isCompleted ? 'Done ✓' : 'Mark Done'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => onStartPractice(currentSign.id)}
                  >
                    <Video size={16} />
                    <span>Practice with Camera</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No signs found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
