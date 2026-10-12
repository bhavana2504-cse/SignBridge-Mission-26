import React from 'react';

/**
 * SignBridge - Custom Vector Illustrations & Badges
 * Recreating the visual language from the approved UI reference design:
 * - Friendly Indian ISL instructor in purple attire
 * - Learning path road badges
 * - Achievement shields
 * - SignBridge brand bridge logo
 */

// Dual-Triangle Bridge Logo from reference header
export function BridgeLogo({ size = 28, color = '#5c54e5' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Left bridge support */}
      <path d="M4 24L12 8L20 24" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right bridge support intersecting */}
      <path d="M12 24L20 8L28 24" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Horizontal deck */}
      <line x1="2" y1="24" x2="30" y2="24" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      {/* Central apex connection */}
      <circle cx="16" cy="16" r="2" fill={color} />
    </svg>
  );
}

// Female ISL Instructor Character Illustration (Hero & Lessons)
export function InstructorHeroIllustration({ className = '', width = '100%', height = 'auto' }) {
  return (
    <svg 
      viewBox="0 0 460 480" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width, height, maxWidth: '440px', display: 'block', margin: '0 auto' }}
      aria-label="Illustration of friendly Indian Sign Language instructor"
    >
      <defs>
        <linearGradient id="auraGlow" x1="230" y1="40" x2="230" y2="440" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e0e7ff" stopOpacity="0.7"/>
          <stop stopColor="#ede9fe" stopOpacity="0.3"/>
          <stop stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#5c54e5" floodOpacity="0.12"/>
        </filter>
      </defs>

      {/* Background Soft Glow & Placards */}
      <circle cx="230" cy="240" r="190" fill="url(#auraGlow)" />

      {/* Penguin Mascot Image - Preserving original navy-blue body, cream face & belly, orange beak & feet, blue scarf, and gold star */}
      <image 
        href="/assets/penguin-mascot.png" 
        x="65" 
        y="75" 
        width="330" 
        height="330" 
        preserveAspectRatio="xMidYMid meet"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Decorative Floating Sign Placards (matching reference) */}
      {/* Top Left: ISL Sign Card */}
      <g filter="url(#softShadow)" transform="translate(160, 45)">
        <line x1="30" y1="45" x2="30" y2="75" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        <rect x="0" y="0" width="60" height="45" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        <text x="30" y="28" fill="#5c54e5" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">ISL</text>
      </g>

      {/* Top Right: "I Love You" Hand Sign Placard */}
      <g filter="url(#softShadow)" transform="translate(360, 55)">
        <line x1="25" y1="40" x2="25" y2="70" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        <rect x="0" y="0" width="50" height="42" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        {/* Simplified ILY Sign Icon */}
        <path d="M18 32V20M25 32V15M32 32V20M14 26L20 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="25" cy="22" r="3" fill="#f59e0b"/>
      </g>

      {/* Left Placard: Hello Sign */}
      <g filter="url(#softShadow)" transform="translate(35, 125)">
        <line x1="25" y1="40" x2="25" y2="70" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        <rect x="0" y="0" width="50" height="42" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        <path d="M17 28C17 22 22 17 28 17M20 30L32 18" stroke="#7c66f5" strokeWidth="2.2" strokeLinecap="round"/>
      </g>

      {/* Right Placard: Open Palm Sign */}
      <g filter="url(#softShadow)" transform="translate(385, 180)">
        <line x1="25" y1="40" x2="25" y2="70" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
        <rect x="0" y="0" width="50" height="42" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        <circle cx="25" cy="21" r="9" fill="#fef3c7" />
        <path d="M21 21H29M25 17V25" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      </g>

      {/* Decorative Lavender Twigs/Leaves at Bottom Corners */}
      <path d="M40 440C50 400 70 380 90 370M50 430C65 420 75 425 70 410M70 400C85 390 95 395 90 380" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M420 440C410 400 390 380 370 370M410 430C395 420 385 425 390 410M390 400C375 390 365 395 370 380" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// Alias for semantic clarity
export const MascotHeroIllustration = InstructorHeroIllustration;

// Pathway Road Milestone Icons
export function PathRoadGraphic({ className = '' }) {
  return (
    <svg viewBox="0 0 960 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <path d="M20 45C160 15 320 75 480 45C640 15 800 75 940 45" stroke="#cbd5e1" strokeWidth="26" strokeLinecap="round"/>
      <path d="M20 45C160 15 320 75 480 45C640 15 800 75 940 45" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 16"/>
    </svg>
  );
}

// 4 Achievement Shield Badges matching the Progress Dashboard in the screenshot
export function AchievementBadgeItem({ type = 'first', label = 'Achievement', active = true }) {
  const badgeColors = {
    first: { bg: '#6366f1', border: '#4338ca', shadow: 'rgba(99, 102, 241, 0.35)', icon: '🖐️' },
    speed: { bg: '#10b981', border: '#059669', shadow: 'rgba(16, 185, 129, 0.35)', icon: '🚀' },
    perfect: { bg: '#f59e0b', border: '#d97706', shadow: 'rgba(245, 158, 11, 0.35)', icon: '⭐' },
    champion: { bg: '#8b5cf6', border: '#6d28d9', shadow: 'rgba(139, 92, 246, 0.35)', icon: '🏆' }
  };

  const conf = badgeColors[type] || badgeColors.first;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
      <div 
        style={{
          width: '76px',
          height: '84px',
          background: `linear-gradient(145deg, ${conf.bg}, ${conf.border})`,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: `0 8px 18px ${conf.shadow}`,
          filter: active ? 'none' : 'grayscale(0.85) opacity(0.6)',
          transition: 'transform 200ms ease',
          cursor: 'pointer'
        }}
        title={label}
      >
        <span>{conf.icon}</span>
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e1b4b', textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}
