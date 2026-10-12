import React, { useState, useMemo } from 'react';
import { guideService, GUIDE_CATEGORIES } from '../../data/signGuidesData';
import { GuideModal } from './GuideModal';
import { 
  Search, 
  X, 
  BookOpen, 
  Video, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Maximize2
} from '../common/Icons';

export function SignGuidesPage({ onSelectSign, onStartPractice }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGuide, setActiveGuide] = useState(null);

  const allGuides = useMemo(() => guideService.getAllGuides(), []);

  const filteredGuides = useMemo(() => {
    return guideService.searchGuides(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* 1. Header Section */}
      <div className="section-header">
        <span className="category-badge" style={{ marginBottom: '0.4rem' }}>
          <span>📚</span>
          <span>Educational Visual Library</span>
        </span>
        <h1 className="section-title">Sign Guides & Infographics</h1>
        <p className="section-subtitle">
          Step-by-step illustrated guides designed to help learners study handshapes, movements, and expressions in Indian Sign Language.
        </p>
      </div>

      {/* 2. Search & Category Filters */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              className="dict-search-input"
              style={{ paddingLeft: '2.75rem', paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              placeholder="Search guides by phrase, question, or keyword (e.g., Thank you, Washroom, Alphabet, Help)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search guides"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }} role="tablist" aria-label="Guide Categories">
            {GUIDE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Counter and Notes */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-light)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span>
              Showing <strong>{filteredGuides.length}</strong> of {allGuides.length} educational guides
            </span>
            <span style={{ fontSize: '0.8rem' }}>
              💡 Click any card to inspect full-size illustrations and synchronized videos.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Guides Cards Grid */}
      {filteredGuides.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredGuides.map((guide) => (
            <article
              key={guide.id}
              className="sign-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onClick={() => setActiveGuide(guide)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveGuide(guide);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Open guide for ${guide.phrase}`}
            >
              {/* Image Thumbnail Preview with Badges */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '210px',
                backgroundColor: '#f1f5f9',
                overflow: 'hidden'
              }}>
                <img
                  src={guide.imagePath}
                  alt={guide.altText}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    transition: 'transform 0.3s ease'
                  }}
                  className="guide-card-img"
                />

                {/* Top Badge: Category */}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '0.75rem',
                  display: 'flex',
                  gap: '0.35rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(4px)',
                    color: 'var(--color-primary-800)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    {guide.category}
                  </span>
                </div>

                {/* Top-Right Badge: Video available icon */}
                {guide.connectedSignId && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'rgba(5, 150, 105, 0.92)',
                    color: '#fff',
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Video size={13} />
                    <span>Video Linked</span>
                  </div>
                )}

                {/* Hover overlay hint */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.6rem',
                  right: '0.6rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  color: '#fff',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Maximize2 size={12} />
                  <span>View Details</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {guide.phrase}
                  </h2>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {guide.description}
                  </p>
                </div>

                {/* Footer action button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-600)', fontWeight: '700' }}>
                    Illustrated Steps
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary-600)', fontWeight: '700', fontSize: '0.85rem' }}>
                    <span>Inspect</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid var(--border-light)',
          marginTop: '1rem'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No matching sign guides found
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            We couldn't find any guides matching "{searchQuery}" in category "{selectedCategory}". Try adjusting your keywords or clearing the filter.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Full-Size Illustrated Guide Modal */}
      <GuideModal
        guide={activeGuide}
        isOpen={Boolean(activeGuide)}
        onClose={() => setActiveGuide(null)}
        onOpenSignLesson={onSelectSign}
        onStartPractice={onStartPractice}
      />
    </div>
  );
}

export default SignGuidesPage;
