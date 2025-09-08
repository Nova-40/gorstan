/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  ChainLightning spell implementation
*/

import { Actor, Spell } from '../../types/combat';
import { BALANCE } from '../../data/balance';
import { HitResolver, DamageUtils } from '../../combat/HitResolver';
import { statusSystem, StatusEffects } from '../../status/StatusSystem';
import { combatAudio } from '../../audio/sfx';

/** ChainLightning spell - arcing shock damage */
export const ChainLightning: Spell = {
  id: 'ChainLightning',
  name: 'Chain Lightning',
  focusCost: BALANCE.focusCosts.ChainLightning,
  cooldownMs: 6000,
  cast: {
    windupMs: 1000,
    recoveryMs: 800
  },
  requiresTarget: true,
  description: 'Lightning that arcs between enemies, dealing more damage when targets are wet.',
  
  execute: (caster: Actor, target?: Actor) => {
    if (!target) {return;}

    // Track targets hit to prevent infinite loops
    const hitTargets = new Set<string>();
    let currentTarget: Actor | undefined = target;
    let remainingArcs = BALANCE.status.shockArcTargets + 1; // Initial hit + arcs

    while (currentTarget && remainingArcs > 0 && !hitTargets.has(currentTarget.id)) {
      hitTargets.add(currentTarget.id);

      // Create shock damage packet
      const damage = DamageUtils.shock(BALANCE.baseDamage.ChainLightning, caster.id);
      
      // Apply caster's power scaling
      damage.base *= caster.stats.power;

      // Check if target is wet for bonus damage
      if (statusSystem.hasStatus(currentTarget, 'Wet' as any)) {
        damage.base *= (1 + BALANCE.status.overloadBonus);
      }

      // Resolve damage
      const result = HitResolver.resolveDamage(currentTarget, damage);

      // Apply shock on successful hit
      if (result.damage > 0) {
        statusSystem.applyStatus(currentTarget, StatusEffects.shock);
      }

      // Find next target for arc
      // In a full implementation, this would find the nearest unaffected enemy
      // For now, just stop after primary target
      currentTarget = undefined;
      remainingArcs--;
    }

    // Play sound effect
    combatAudio.spellCast('chainLightning');
  }
};
