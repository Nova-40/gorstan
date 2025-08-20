/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  FireBolt spell implementation
*/

import { Actor, Spell } from '../../types/combat';
import { BALANCE } from '../../data/balance';
import { HitResolver, DamageUtils } from '../../combat/HitResolver';
import { statusSystem, StatusEffects } from '../../status/StatusSystem';
import { combatAudio } from '../../audio/sfx';

/** FireBolt spell - basic fire damage with burn chance */
export const FireBolt: Spell = {
  id: 'FireBolt',
  name: 'Fire Bolt',
  focusCost: BALANCE.focusCosts.FireBolt,
  cooldownMs: 2000,
  cast: {
    windupMs: 800,
    recoveryMs: 400
  },
  requiresTarget: true,
  description: 'Launches a bolt of flame that deals fire damage and may inflict burn.',
  
  execute: (caster: Actor, target?: Actor) => {
    if (!target) return;

    // Create fire damage packet
    const damage = DamageUtils.fire(BALANCE.baseDamage.FireBolt, caster.id);
    
    // Apply caster's power scaling
    damage.base *= caster.stats.power;

    // Resolve damage
    const result = HitResolver.resolveDamage(target, damage);

    // Apply burn on successful hit
    if (result.damage > 0 && Math.random() < 0.7) {
      statusSystem.applyStatus(target, () => StatusEffects.burn(1));
    }

    // Play sound effect
    combatAudio.spellCast('fireBolt');
  }
};
