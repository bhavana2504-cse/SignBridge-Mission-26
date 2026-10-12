import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Heart, 
  Video, 
  BookOpen, 
  Sparkles, 
  RotateCcw 
} from '../common/Icons';
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
      // Loop or go to next category
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

  // Completed count in this category
  const completedInCat = signsInCategory.filter((s) => 
    storageService.isLessonCompleted(s.id)
  ).length;

  const catProgressPercent = Math.round((completedInCat / signsInCategory.length) * 100) || 0;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-header">
        <span className="section-eyebrow">Structured Curriculum</span>
        <h1 className="section-title">ISL Video Lessons</h1>
        <p className="section-subtitle">
          Master vocabulary sign-by-sign with slow-motion replays, context sentences, and progress tracking.
        </p>
      </div>

      <div className="lesson-layout">
        {/* Left Column: Category Navigation */}
        <aside className="category-nav-panel" aria-label="Curriculum categories">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <BookOpen size={18} color="var(--color-primary-700)" aria-hidden="true" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Modules</h2>
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

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              <span>Module Mastery</span>
              <span>{catProgressPercent}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${catProgressPercent}%` }}></div>
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
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Source Benchmark: <strong>{currentSign.sourceDataset}</strong>
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

              {/* Meaning & Context */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  How to Use This Sign
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-body)' }}>
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
                    className={`btn-secondary btn-sm ${isCompleted ? 'btn-outline-green' : ''}`}
                    onClick={handleToggleComplete}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isCompleted ? 'Lesson Completed ✓' : 'Mark Completed'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
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
