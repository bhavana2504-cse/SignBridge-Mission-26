import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { VideoPlayer } from './VideoPlayer';
import { Heart, CheckCircle2, Video, Sparkles } from './Icons';
import { storageService } from '../../services/storageService';

export function SignDetailModal({ sign, isOpen, onClose, onStartPractice }) {
  if (!sign) return null;

  const [isFav, setIsFav] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (sign && isOpen) {
      setIsFav(storageService.isFavorite(sign.id));
      setIsCompleted(storageService.isLessonCompleted(sign.id));
      // Track as recently viewed
      storageService.addRecentlyViewed(sign.id);
    }
  }, [sign, isOpen]);

  const handleToggleFavorite = () => {
    const updated = storageService.toggleFavorite(sign.id);
    setIsFav(updated);
  };

  const handleToggleComplete = () => {
    const updated = storageService.toggleLessonCompletion(sign.id);
    setIsCompleted(updated);
  };

  const handlePracticeClick = () => {
    onClose();
    if (onStartPractice) {
      onStartPractice(sign.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Sign Demonstration: "${sign.word}"`}>
      {/* Video Demonstration */}
      <VideoPlayer 
        src={sign.videoPath} 
        title={sign.word} 
        autoPlay={true}
        loop={true} 
      />

      {/* Badges & Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="category-badge">{sign.category}</span>
          <span className="category-badge teal">Source: {sign.sourceDataset || 'ISL'}</span>
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
            aria-label={isCompleted ? 'Mark as not completed' : 'Mark as completed'}
            title={isCompleted ? 'Completed' : 'Mark completed'}
          >
            <CheckCircle2 size={18} />
          </button>
        </div>
      </div>

      {/* Description & Context */}
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
          Sign Meaning & Usage
        </h4>
        <p style={{ color: 'var(--text-body)', fontSize: '0.925rem' }}>
          {sign.description}
        </p>
      </div>

      {/* Usage Example */}
      {sign.example && (
        <div className="lesson-context-box">
          <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Example Context
          </strong>
          <p style={{ marginTop: '0.25rem', fontStyle: 'italic', color: 'var(--text-main)' }}>
            "{sign.example}"
          </p>
        </div>
      )}

      {/* Bottom CTA to practice with webcam */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
        <button
          type="button"
          className={`btn-secondary btn-sm ${isCompleted ? 'btn-outline-green' : ''}`}
          onClick={handleToggleComplete}
        >
          <CheckCircle2 size={16} />
          <span>{isCompleted ? 'Completed ✓' : 'Mark Completed'}</span>
        </button>

        <button
          type="button"
          className="btn-primary btn-sm"
          onClick={handlePracticeClick}
        >
          <Video size={16} />
          <span>Practice in Studio</span>
        </button>
      </div>
    </Modal>
  );
}
