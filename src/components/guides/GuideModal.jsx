import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { VideoPlayer } from '../common/VideoPlayer';
import { signService } from '../../services/signService';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Maximize2, 
  Minimize2,
  Video
} from '../common/Icons';

export function GuideModal({ guide, isOpen, onClose, onOpenSignLesson, onStartPractice }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeViewMode, setActiveViewMode] = useState('split'); // 'split' | 'infographic' | 'video'
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Reset zoom and error on new guide
    setZoomLevel(1);
    setImgError(false);
    if (guide?.connectedSignId) {
      setActiveViewMode('split');
    } else {
      setActiveViewMode('infographic');
    }
  }, [guide]);

  if (!isOpen || !guide) return null;

  const connectedSign = guide.connectedSignId 
    ? signService.getSignById(guide.connectedSignId) 
    : null;

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : 1));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={guide.phrase}
      maxWidth="1100px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Top Header Information & Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="category-badge" style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)' }}>
              <span>📖</span>
              <span>{guide.category}</span>
            </span>
            {guide.badge && (
              <span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '700' }}>
                {guide.badge}
              </span>
            )}
            {connectedSign && (
              <span className="status-badge" style={{ backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: '700' }}>
                🎥 Video Available
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {connectedSign && (
              <div className="view-mode-toggles" style={{ display: 'flex', backgroundColor: 'var(--bg-main)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  className={`footer-btn-link ${activeViewMode === 'split' ? 'active' : ''}`}
                  style={{ 
                    padding: '0.35rem 0.65rem', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem',
                    fontWeight: activeViewMode === 'split' ? '800' : '600',
                    backgroundColor: activeViewMode === 'split' ? '#fff' : 'transparent',
                    boxShadow: activeViewMode === 'split' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                  onClick={() => setActiveViewMode('split')}
                >
                  Both Video & Steps
                </button>
                <button
                  type="button"
                  className={`footer-btn-link ${activeViewMode === 'infographic' ? 'active' : ''}`}
                  style={{ 
                    padding: '0.35rem 0.65rem', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem',
                    fontWeight: activeViewMode === 'infographic' ? '800' : '600',
                    backgroundColor: activeViewMode === 'infographic' ? '#fff' : 'transparent',
                    boxShadow: activeViewMode === 'infographic' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                  onClick={() => setActiveViewMode('infographic')}
                >
                  Guide Poster Only
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={toggleZoom}
              title={zoomLevel === 1 ? 'Zoom in (150%)' : 'Reset zoom (100%)'}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem', gap: '0.35rem' }}
            >
              {zoomLevel === 1 ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              <span>{zoomLevel === 1 ? 'Zoom In' : 'Reset Size'}</span>
            </button>
          </div>
        </div>

        {/* Description Banner */}
        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          {guide.description}
        </p>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: (connectedSign && activeViewMode === 'split') ? 'minmax(320px, 1fr) minmax(360px, 1.25fr)' : '1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Moving Video Demonstration if matched */}
          {connectedSign && (activeViewMode === 'split' || activeViewMode === 'video') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Video size={18} color="var(--color-primary-600)" />
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Moving Demonstration
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Dataset: {connectedSign.sourceDataset}
                  </span>
                </div>

                <VideoPlayer
                  src={connectedSign.videoPath}
                  alt={`Moving sign demonstration for ${connectedSign.word}`}
                  autoPlay={true}
                  loop={true}
                  aspectRatio="16/9"
                />

                <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>Practice Tip:</strong> Watch the video above to see continuous motion and cadence, and use the infographic on the right to study each static handshape.
                </div>

                {/* Quick actions for lesson and practice */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  {onStartPractice && (
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        onClose();
                        onStartPractice(connectedSign.id);
                      }}
                    >
                      <span>Practice in Studio</span>
                    </button>
                  )}
                  {onOpenSignLesson && (
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        onClose();
                        onOpenSignLesson(connectedSign);
                      }}
                    >
                      <span>Open Full Lesson</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Related tags */}
              {guide.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {guide.tags.map((t, idx) => (
                    <span key={idx} style={{
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary-800)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Column: High Resolution Illustrated Infographic Poster */}
          {(activeViewMode === 'split' || activeViewMode === 'infographic') && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              overflow: 'auto',
              maxHeight: '75vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
            }}>
              {!imgError ? (
                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'auto'
                }}>
                  <img
                    src={guide.imagePath}
                    alt={guide.altText}
                    onError={() => setImgError(true)}
                    style={{
                      width: `${zoomLevel * 100}%`,
                      maxWidth: zoomLevel === 1 ? '100%' : 'none',
                      height: 'auto',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                      transition: 'width 0.2s ease-in-out',
                      display: 'block'
                    }}
                  />
                </div>
              ) : (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Image asset temporarily unavailable
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    File path: <code>{guide.imagePath}</code>
                  </p>
                </div>
              )}

              <div style={{
                width: '100%',
                marginTop: '0.85rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.785rem',
                color: 'var(--text-muted)'
              }}>
                <span>Educational Aid • Indian Sign Language Guide</span>
                <span>Original Proportions Preserved</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default GuideModal;
