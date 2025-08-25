// TailwindCSS Configuration - Generated from tokens.json
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';
import tokens from './tokens.json' with { type: 'json' };

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Token-based colors
      colors: {
        background: tokens.colors.background,
        surface: tokens.colors.surface,
        text: tokens.colors.text,
        console: tokens.colors.console,
        // Zone colors
        'zone-glitch': tokens.colors.zones.glitch,
        'zone-nexus': tokens.colors.zones.nexus,
        'zone-elfhame': tokens.colors.zones.elfhame,
        'zone-maze': tokens.colors.zones.maze,
        // Semantic colors
        success: tokens.colors.semantic.success,
        warning: tokens.colors.semantic.warning,
        error: tokens.colors.semantic.error,
        info: tokens.colors.semantic.info,
      },
      
      // Token-based spacing
      spacing: tokens.spacing,
      
      // Token-based border radius
      borderRadius: tokens.radius,
      
      // Token-based font family
      fontFamily: tokens.typography.fontFamily,
      
      // Min touch target sizes
      minHeight: {
        'hit-target': tokens.targets.minHit,
      },
      minWidth: {
        'hit-target': tokens.targets.minHit,
      },
      
      // Focus ring styles
      ringWidth: {
        'focus': tokens.accessibility.focusRingWidth,
      },
      
      // Animations
      animation: {
        'blink': `blink ${tokens.animation.blinkDuration}ms infinite`,
        'typewriter': 'typewriter',
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 300ms ease-out',
        'teleport-fractal': 'teleportFractal 600ms ease-in-out',
        'teleport-trek': 'teleportTrek 600ms ease-in-out',
      },
      
      // Keyframes
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        teleportFractal: {
          '0%': { transform: 'scale(1)', filter: 'hue-rotate(0deg)' },
          '50%': { transform: 'scale(1.1)', filter: 'hue-rotate(180deg)' },
          '100%': { transform: 'scale(1)', filter: 'hue-rotate(360deg)' },
        },
        teleportTrek: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.8)', opacity: '0.3' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
  ],
};
