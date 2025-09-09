/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Blink spell implementation
*/

import { Actor, Spell } from '../../types/combat';
import { BALANCE } from '../../data/balance';
import { statusSystem, StatusEffects } from '../../status/StatusSystem';
import { combatAudio } from '../../audio/sfx';

/** Blink spell - short-range teleportation with brief invulnerability */
export const Blink: Spell = {
  id: 'Blink',
  name: 'Blink',
  focusCost: BALANCE.focusCosts.Blink,
  cooldownMs: 8000,
  cast: {
    windupMs: 400,
    recoveryMs: 200,
  },
  requiresTarget: false,
  description: 'Instantly teleport a short distance and gain brief invulnerability.',

  execute: (caster: Actor) => {
    // Grant brief invulnerability frames
    statusSystem.applyStatus(caster, () => StatusEffects.iframes(500));

    // In a full implementation, this would actually move the character
    // For now, just provide the mechanical benefit

    // Update position if tracking it
    if (caster.position) {
      // Simulate short-range movement
      caster.position.x += Math.random() * 2 - 1; // Random direction
      caster.position.y += Math.random() * 2 - 1;
    }

    // Play sound effect
    combatAudio.spellCast('blink');
  },
};
