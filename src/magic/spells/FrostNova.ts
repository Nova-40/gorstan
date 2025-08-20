/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  FrostNova spell implementation
*/

import { Actor, Spell } from '../../types/combat';
import { BALANCE } from '../../data/balance';
import { HitResolver, DamageUtils } from '../../combat/HitResolver';
import { statusSystem, StatusEffects } from '../../status/StatusSystem';
import { combatAudio } from '../../audio/sfx';

/** FrostNova spell - AoE frost damage with chill stacks */
export const FrostNova: Spell = {
  id: 'FrostNova',
  name: 'Frost Nova',
  focusCost: BALANCE.focusCosts.FrostNova,
  cooldownMs: 4000,
  cast: {
    windupMs: 1200,
    recoveryMs: 600
  },
  requiresTarget: false,
  description: 'Erupts frost in an area, dealing damage and applying chill stacks.',
  
  execute: (caster: Actor, target?: Actor) => {
    // In a full implementation, this would hit all enemies in range
    // For now, hit the primary target if provided, or all nearby enemies
    const targets = target ? [target] : [];

    for (const currentTarget of targets) {
      // Create frost damage packet
      const damage = DamageUtils.frost(BALANCE.baseDamage.FrostNova, caster.id);
      
      // Apply caster's power scaling
      damage.base *= caster.stats.power;

      // Resolve damage
      const result = HitResolver.resolveDamage(currentTarget, damage);

      // Apply chill stacks on hit
      if (result.damage > 0) {
        // Apply 2 chill stacks (closer to freeze threshold)
        statusSystem.applyStatus(currentTarget, () => StatusEffects.chill(2));
      }
    }

    // Play sound effect
    combatAudio.spellCast('frostNova');
  }
};
