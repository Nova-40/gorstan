/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  TimeDilation spell implementation
*/

import { Actor, Spell } from '../../types/combat';
import { BALANCE } from '../../data/balance';
import { combatAudio } from '../../audio/sfx';
import { showCombatCue } from '../../vfx/cues';

/** TimeDilation spell - creates slow-motion effect */
export const TimeDilation: Spell = {
  id: 'TimeDilation',
  name: 'Time Dilation',
  focusCost: BALANCE.focusCosts.TimeDilation,
  cooldownMs: 20000,
  cast: {
    windupMs: 1000,
    recoveryMs: 500,
  },
  requiresTarget: false,
  description: 'Slows time around the caster, providing tactical advantage.',

  execute: (caster: Actor) => {
    // Apply time dilation effect
    // This would typically involve modifying game time scale
    // For this implementation, we'll use a visual cue system

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Static emphasis variant
      showCombatCue(() => ({
        text: '⏱️ TIME DILATION ACTIVE ⏱️',
        durationMs: 2000,
        className: 'time-dilation-static',
        respectPRM: true,
        staticVariant: {
          emphasis: '⏱️ TIME DILATION ACTIVE ⏱️',
          color: 'purple',
        },
      }));
    } else {
      // Motion variant with slow-mo visual effect
      showCombatCue(() => ({
        text: '⏱️ Time Dilated',
        durationMs: 2000,
        className: 'time-dilation-motion',
        respectPRM: true,
        motionVariant: {
          animation: 'time-pulse 2s ease-in-out',
          transform: 'scale(1.1)',
        },
      }));

      // In a full implementation, you might temporarily modify:
      // - Animation speeds
      // - Game update rate
      // - Enemy action timing
    }

    // Grant tactical advantage (enhanced dodge/parry windows)
    caster.data = caster.data || {};
    caster.data.enhancedReflexes = true;

    // Remove effect after duration
    setTimeout(() => {
      if (caster.data) {
        caster.data.enhancedReflexes = false;
      }
    }, 2000);

    // Play sound effect
    combatAudio.spellCast('timeDilation');
  },
};
