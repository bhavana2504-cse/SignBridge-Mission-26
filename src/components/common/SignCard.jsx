import React, { useState, useEffect } from 'react';
import { Play, Heart, CheckCircle2 } from './Icons';
import { storageService } from '../../services/storageService';

export function SignCard({ sign, onSelectSign, onStartPractice }) {
  const [isFav, setIsFav] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsFav(storageService.isFavorite(sign.id));
    setIsCompleted(storageService.isLessonCompleted(sign.id));
  }, [sign.id]);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const updated = storageService.toggleFavorite(sign.id);
    setIsFav(updated);
  };

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    const updated = storageService.toggleLessonCompletion(sign.id);
    setIsCompleted(updated);
  };

  return (
    <article 
      className="sign-card"
      onClick={() => onSelectSign(sign)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectSign(sign);
        }
      }}
      aria-label={`View sign details for ${sign.word}`}
    >
      <div className="sign-card-header">
        <span className="category-badge">{sign.category}</span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`icon-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleToggleComplete}
            aria-label={isCompleted ? `Mark ${sign.word} as incomplete` : `Mark ${sign.word} as completed`}
            title={isCompleted ? 'Completed' : 'Mark Completed'}
          >
            <CheckCircle2 size={16} />
          </button>

          <button
            type="button"
            className={`icon-btn ${isFav ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFav ? `Remove ${sign.word} from favorites` : `Add ${sign.word} to favorites`}
            title={isFav ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <h3 className="sign-card-title">{sign.word}</h3>
      <p className="sign-card-desc">{sign.description}</p>

      <div className="sign-card-footer">
        <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
          {sign.sourceDataset || 'ISL'} Benchmark
        </span>
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelectSign(sign);
          }}
          aria-label={`Watch video demonstration for ${sign.word}`}
        >
          <Play size={14} fill="currentColor" />
          <span>Watch Sign</span>
        </button>
      </div>
    </article>
  );
}
