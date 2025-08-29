// Auto-generated from tokens.json - DO NOT EDIT MANUALLY
// Run `npm run generate:tokens` to regenerate

export const COLORS = {
  background: '#0B0F0E',
  surface: '#111615', 
  text: '#A7B0A5',
  console: '#39FF14',
  zones: {
    glitch: '#8A2BE2',
    nexus: '#00E5FF',
    elfhame: '#7CFC00', 
    maze: '#FFB300'
  },
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px', 
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px'
} as const;

export const RADIUS = {
  sm: '8px',
  lg: '14px'
} as const;

export const TARGETS = {
  minHit: '40px'
} as const;

export const ANIMATION = {
  typeSpeed: 40,
  typeSpeedRange: [35, 45] as const,
  blinkDuration: 1000,
  punctuation: {
    comma: 50,
    period: 150,
    exclamation: 150,
    question: 150, 
    colon: 150,
    semicolon: 150,
    ellipsis: 400
  }
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    mono: ["'JetBrains Mono'", "'Fira Code'", "'Source Code Pro'", 'monospace']
  }
} as const;

export const ACCESSIBILITY = {
  contrastRatio: 4.5,
  focusRingWidth: '2px'
} as const;

// Convenience exports
export const ZONE_COLORS = COLORS.zones;
export const PUNCTUATION_DELAYS = ANIMATION.punctuation;
