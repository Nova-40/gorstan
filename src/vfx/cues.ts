/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Visual and audio cues for combat feedback
*/

/** Visual cue configuration */
export interface VisualCue {
  /** Text to display */
  text: string;
  /** Duration in milliseconds */
  durationMs: number;
  /** CSS classes for styling */
  className: string;
  /** Whether to respect prefers-reduced-motion */
  respectPRM: boolean;
  /** Motion variant (used when PRM is disabled) */
  motionVariant?: {
    animation: string;
    transform?: string;
  };
  /** Static variant (used when PRM is enabled) */
  staticVariant?: {
    emphasis: string;
    color?: string;
  };
}

/** Combat visual cues */
export const COMBAT_CUES = {
  // Parry feedback
  parry: (): VisualCue => ({
    text: '✧ Perfect Parry!',
    durationMs: 1000,
    className: 'combat-cue parry-success',
    respectPRM: true,
    motionVariant: {
      animation: 'sparkle-burst 0.8s ease-out',
      transform: 'scale(1.2)',
    },
    staticVariant: {
      emphasis: '✧ PERFECT PARRY! ✧',
      color: 'gold',
    },
  }),

  parryFail: (): VisualCue => ({
    text: '⚠ Parry Failed',
    durationMs: 800,
    className: 'combat-cue parry-fail',
    respectPRM: true,
    motionVariant: {
      animation: 'shake 0.3s ease-out',
    },
    staticVariant: {
      emphasis: '⚠ PARRY FAILED ⚠',
      color: 'red',
    },
  }),

  // Dodge feedback
  perfectDodge: (): VisualCue => ({
    text: '⟪ Slipstream ⟫ Riposte ready!',
    durationMs: 1200,
    className: 'combat-cue perfect-dodge',
    respectPRM: true,
    motionVariant: {
      animation: 'fade-slide 1.0s ease-out',
      transform: 'translateX(20px)',
    },
    staticVariant: {
      emphasis: '⟪ SLIPSTREAM ⟫ RIPOSTE READY!',
      color: 'cyan',
    },
  }),

  // Elemental effects
  burn: (): VisualCue => ({
    text: '🔥 Burning',
    durationMs: 500,
    className: 'combat-cue status-burn',
    respectPRM: true,
    motionVariant: {
      animation: 'flicker 0.5s ease-in-out',
    },
    staticVariant: {
      emphasis: '🔥 BURNING 🔥',
      color: 'orange',
    },
  }),

  freeze: (): VisualCue => ({
    text: '❄️ Frozen Solid',
    durationMs: 800,
    className: 'combat-cue status-freeze',
    respectPRM: true,
    motionVariant: {
      animation: 'freeze-pulse 0.8s ease-out',
    },
    staticVariant: {
      emphasis: '❄️ FROZEN SOLID ❄️',
      color: 'lightblue',
    },
  }),

  shock: (): VisualCue => ({
    text: '⚡ Shocked',
    durationMs: 600,
    className: 'combat-cue status-shock',
    respectPRM: true,
    motionVariant: {
      animation: 'electric-jitter 0.6s ease-out',
    },
    staticVariant: {
      emphasis: '⚡ SHOCKED ⚡',
      color: 'yellow',
    },
  }),

  overload: (): VisualCue => ({
    text: '⚡ Overload!',
    durationMs: 1000,
    className: 'combat-cue elemental-overload',
    respectPRM: true,
    motionVariant: {
      animation: 'overload-burst 1.0s ease-out',
      transform: 'scale(1.5)',
    },
    staticVariant: {
      emphasis: '⚡ OVERLOAD! ⚡',
      color: 'yellow',
    },
  }),

  shatter: (): VisualCue => ({
    text: '💎 Shatter!',
    durationMs: 800,
    className: 'combat-cue elemental-shatter',
    respectPRM: true,
    motionVariant: {
      animation: 'shatter-fragments 0.8s ease-out',
    },
    staticVariant: {
      emphasis: '💎 SHATTER! 💎',
      color: 'lightblue',
    },
  }),

  // Damage feedback
  criticalHit: (): VisualCue => ({
    text: '💥 Critical Hit!',
    durationMs: 1000,
    className: 'combat-cue critical-hit',
    respectPRM: true,
    motionVariant: {
      animation: 'crit-explosion 1.0s ease-out',
      transform: 'scale(1.3)',
    },
    staticVariant: {
      emphasis: '💥 CRITICAL HIT! 💥',
      color: 'red',
    },
  }),

  // Spell casting
  spellCast: (spellName: string): VisualCue => ({
    text: `✨ ${spellName}`,
    durationMs: 800,
    className: 'combat-cue spell-cast',
    respectPRM: true,
    motionVariant: {
      animation: 'spell-shimmer 0.8s ease-out',
    },
    staticVariant: {
      emphasis: `✨ ${spellName.toUpperCase()} ✨`,
      color: 'purple',
    },
  }),

  // Combat state
  stagger: (): VisualCue => ({
    text: '😵 Staggered',
    durationMs: 1500,
    className: 'combat-cue staggered',
    respectPRM: true,
    motionVariant: {
      animation: 'stagger-wobble 1.5s ease-out',
    },
    staticVariant: {
      emphasis: '😵 STAGGERED 😵',
      color: 'gray',
    },
  }),

  riposteReady: (): VisualCue => ({
    text: '⚔️ Riposte Window!',
    durationMs: 1000,
    className: 'combat-cue riposte-ready',
    respectPRM: true,
    motionVariant: {
      animation: 'pulse-glow 1.0s ease-in-out',
    },
    staticVariant: {
      emphasis: '⚔️ RIPOSTE WINDOW! ⚔️',
      color: 'gold',
    },
  }),
};

/** Display a combat cue with PRM consideration */
export function showCombatCue(cueGenerator: () => VisualCue, container?: HTMLElement): void {
  const cue = cueGenerator();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cueElement = document.createElement('div');
  cueElement.className = cue.className;

  if (prefersReducedMotion && cue.respectPRM && cue.staticVariant) {
    // Use static variant
    cueElement.textContent = cue.staticVariant.emphasis;
    cueElement.style.color = cue.staticVariant.color || '';
    cueElement.style.fontWeight = 'bold';
    cueElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
  } else {
    // Use motion variant or fallback to text
    cueElement.textContent = cue.text;
    if (cue.motionVariant) {
      cueElement.style.animation = cue.motionVariant.animation;
      if (cue.motionVariant.transform) {
        cueElement.style.transform = cue.motionVariant.transform;
      }
    }
  }

  // Position and style
  cueElement.style.position = 'fixed';
  cueElement.style.top = '20%';
  cueElement.style.left = '50%';
  cueElement.style.transform = 'translateX(-50%)';
  cueElement.style.zIndex = '9999';
  cueElement.style.fontSize = '1.5rem';
  cueElement.style.fontFamily = 'monospace';
  cueElement.style.pointerEvents = 'none';

  const targetContainer = container || document.body;
  targetContainer.appendChild(cueElement);

  // Remove after duration
  setTimeout(() => {
    if (cueElement.parentNode) {
      cueElement.parentNode.removeChild(cueElement);
    }
  }, cue.durationMs);
}

/** Console text formatting for combat feedback */
export function formatCombatText(
  message: string,
  type: 'success' | 'warning' | 'error' | 'info' = 'info',
): string {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = {
    success: '✓',
    warning: '⚠',
    error: '✗',
    info: '→',
  }[type];

  return `[${timestamp}] ${prefix} ${message}`;
}
