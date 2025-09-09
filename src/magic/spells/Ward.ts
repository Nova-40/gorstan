/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Ward spell implementation
*/

import { Actor, Spell } from '../../types/combat';
import { BALANCE } from '../../data/balance';
import { statusSystem, StatusEffects } from '../../status/StatusSystem';
import { combatAudio } from '../../audio/sfx';

/** Ward spell - absorbs elemental damage */
export const Ward: Spell = {
  id: 'Ward',
  name: 'Ward',
  focusCost: BALANCE.focusCosts.Ward,
  cooldownMs: 12000,
  cast: {
    windupMs: 600,
    recoveryMs: 400,
  },
  requiresTarget: false,
  description: 'Creates a magical barrier that absorbs incoming damage.',

  execute: (caster: Actor) => {
    // Apply ward protection
    const wardAbsorption = BALANCE.status.wardAbsorb * caster.stats.power;
    statusSystem.applyStatus(caster, () => StatusEffects.ward(wardAbsorption));

    // Play sound effect
    combatAudio.spellCast('ward');
  },
};
