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
        <linearGradient id="kurtiGrad" x1="160" y1="260" x2="300" y2="480" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c66f5"/>
          <stop stopColor="#5c54e5"/>
          <stop stopColor="#4f46e5"/>
        </linearGradient>
        <linearGradient id="skinGrad" x1="200" y1="120" x2="260" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffdbb5"/>
          <stop stopColor="#f3be91"/>
        </linearGradient>
        <linearGradient id="hairGrad" x1="230" y1="50" x2="230" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#241b2e"/>
          <stop stopColor="#15111c"/>
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#5c54e5" floodOpacity="0.12"/>
        </filter>
      </defs>

      {/* Background Soft Glow & Placards */}
      <circle cx="230" cy="240" r="190" fill="url(#auraGlow)" />

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

      {/* Character Hair Back */}
      <path d="M150 190C140 140 170 60 230 60C290 60 320 140 310 190C315 250 310 320 300 340C270 330 260 270 260 270L200 270C200 270 190 330 160 340C150 320 145 250 150 190Z" fill="url(#hairGrad)" />

      {/* Body & Kurti (Purple Indian Attire) */}
      <path d="M165 300L130 480H330L295 300C280 290 260 280 230 280C200 280 180 290 165 300Z" fill="url(#kurtiGrad)" />
      {/* Kurti Neckline & Embroidery */}
      <path d="M205 282C215 315 245 315 255 282L230 330L205 282Z" fill="#ffdbb5" stroke="#fcd34d" strokeWidth="2"/>
      <path d="M228 330V430" stroke="#fcd34d" strokeWidth="2.5" strokeDasharray="4 4"/>
      <circle cx="230" cy="350" r="3" fill="#fcd34d"/>
      <circle cx="230" cy="375" r="3" fill="#fcd34d"/>
      <circle cx="230" cy="400" r="3" fill="#fcd34d"/>

      {/* Shoulders & Arms */}
      {/* Left Arm raised in Sign (Viewer's left) */}
      <path d="M165 300C145 305 120 280 115 235L145 220C150 250 165 270 185 285L165 300Z" fill="url(#kurtiGrad)"/>
      {/* Left Hand Waving/Signing */}
      <path d="M110 235C100 220 95 180 105 155C110 145 125 145 130 155C135 145 145 145 150 155C155 150 165 155 165 165C170 165 175 175 170 185L150 225C135 240 120 245 110 235Z" fill="url(#skinGrad)"/>

      {/* Right Arm across gesturing */}
      <path d="M295 300C325 310 355 350 350 400L315 410C315 370 295 335 275 315L295 300Z" fill="url(#kurtiGrad)"/>
      {/* Right Hand */}
      <path d="M350 400C350 425 330 435 305 435C290 435 280 420 285 405L315 410L350 400Z" fill="url(#skinGrad)"/>

      {/* Neck */}
      <path d="M210 230H250V290H210V230Z" fill="url(#skinGrad)" />

      {/* Head & Face */}
      <ellipse cx="230" cy="180" rx="42" ry="50" fill="url(#skinGrad)" />

      {/* Hair Front Framing & Parting */}
      <path d="M188 165C188 125 210 100 230 115C250 100 272 125 272 165C275 185 265 195 260 175C255 140 240 130 230 130C220 130 205 140 200 175C195 195 185 185 188 165Z" fill="url(#hairGrad)" />

      {/* Earrings (Jhumkas/Studs) */}
      <circle cx="184" cy="190" r="4.5" fill="#f59e0b" />
      <circle cx="276" cy="190" r="4.5" fill="#f59e0b" />

      {/* Eyebrows */}
      <path d="M205 160C212 156 220 157 224 161" stroke="#241b2e" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M236 161C240 157 248 156 255 160" stroke="#241b2e" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Big Expressive Eyes (crucial in ISL for facial expression!) */}
      <ellipse cx="214" cy="172" rx="7" ry="5.5" fill="#ffffff" />
      <ellipse cx="246" cy="172" rx="7" ry="5.5" fill="#ffffff" />
      <circle cx="215" cy="172" r="4" fill="#241b2e" />
      <circle cx="245" cy="172" r="4" fill="#241b2e" />
      <circle cx="213" cy="170" r="1.5" fill="#ffffff" />
      <circle cx="243" cy="170" r="1.5" fill="#ffffff" />

      {/* Nose */}
      <path d="M230 172V185C227 186 233 186 230 188" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Warm Friendly Smile */}
      <path d="M218 198C224 207 236 207 242 198" stroke="#be123c" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M221 198C226 202 234 202 239 198" fill="#ffffff"/>

      {/* Traditional Small Bindi */}
      <circle cx="230" cy="155" r="2.2" fill="#be123c" />

      {/* Decorative Lavender Twigs/Leaves at Bottom Corners */}
      <path d="M40 440C50 400 70 380 90 370M50 430C65 420 75 425 70 410M70 400C85 390 95 395 90 380" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M420 440C410 400 390 380 370 370M410 430C395 420 385 425 390 410M390 400C375 390 365 395 370 380" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

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
