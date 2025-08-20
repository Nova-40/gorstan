/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Damage resolution and calculation system
*/

import { Actor, DamagePacket, Stats } from '../types/combat';
import { Element } from '../types/enums';
import { BALANCE } from '../data/balance';
import { statusSystem, StatusEffects } from '../status/StatusSystem';
import { showCombatCue, COMBAT_CUES } from '../vfx/cues';
import { combatAudio } from '../audio/sfx';

/** Damage calculation result */
export interface DamageResult {
  /** Final damage dealt */
  damage: number;
  /** Whether this was a critical hit */
  wasCritical: boolean;
  /** Whether damage was blocked */
  wasBlocked: boolean;
  /** Damage absorbed by ward */
  wardAbsorption: number;
  /** Poise damage dealt */
  poiseDamage: number;
}

/** Hit resolver system for damage calculations */
export class HitResolver {
  /** Resolve damage against a target */
  static resolveDamage(target: Actor, packet: DamagePacket): DamageResult {
    const result: DamageResult = {
      damage: 0,
      wasCritical: false,
      wasBlocked: false,
      wardAbsorption: 0,
      poiseDamage: 0
    };

    // Check for invincibility frames
    if (statusSystem.hasStatus(target, 'IFrames' as any)) {
      return result; // No damage during i-frames
    }

    let baseDamage = packet.base * BALANCE.global.TUNING_MULTIPLIER;

    // Apply power scaling from source
    // Note: In a full implementation, we'd get source actor stats
    // For now, assume packet includes power scaling

    // Check for critical hit
    if (packet.crit || this.rollCritical(target.stats)) {
      baseDamage *= target.stats.critMult;
      result.wasCritical = true;
    }

    // Apply elemental resistances
    const resistance = this.calculateResistance(target.stats, packet.element);
    baseDamage *= (1 - resistance);

    // Apply armor reduction for physical damage
    if (packet.element === Element.Physical) {
      const armorReduction = Math.min(
        target.stats.armor * BALANCE.resistance.armorReduction,
        BALANCE.resistance.maxReduction
      );
      baseDamage *= (1 - armorReduction);
    }

    // Check ward absorption
    const wardStatus = target.statuses.find(s => s.id === 'Ward' as any);
    if (wardStatus?.data?.absorption && wardStatus.data.absorption > 0) {
      const absorbed = Math.min(baseDamage, wardStatus.data.absorption);
      wardStatus.data.absorption -= absorbed;
      result.wardAbsorption = absorbed;
      baseDamage -= absorbed;

      // Remove ward if depleted
      if (wardStatus.data.absorption <= 0) {
        statusSystem.removeStatus(target, 'Ward' as any);
      }
    }

    // Apply final damage
    result.damage = Math.max(0, Math.floor(baseDamage));
    target.hp = Math.max(0, target.hp - result.damage);

    // Calculate poise damage
    result.poiseDamage = this.calculatePoiseDamage(packet);
    target.poise = Math.max(0, target.poise - result.poiseDamage);

    // Check for stagger
    if (target.poise <= 0) {
      statusSystem.applyStatus(target, StatusEffects.stagger);
      target.poise = target.stats.poise; // Reset poise after stagger
    }

    // Apply elemental status effects
    this.applyElementalEffects(target, packet);

    // Trigger feedback
    this.triggerDamageFeedback(result, packet.element);

    return result;
  }

  /** Roll for critical hit */
  private static rollCritical(stats: Stats): boolean {
    return Math.random() < stats.crit;
  }

  /** Calculate elemental resistance */
  private static calculateResistance(stats: Stats, element: Element): number {
    const baseResistance = stats.resists[element] || 0;
    return Math.max(-1, Math.min(1, baseResistance)); // Clamp between -100% and +100%
  }

  /** Calculate poise damage based on attack */
  private static calculatePoiseDamage(packet: DamagePacket): number {
    let poiseDamage = 0;

    // Base poise damage from tags
    if (packet.tags?.includes('light')) {
      poiseDamage = BALANCE.poiseDamage.light;
    } else if (packet.tags?.includes('heavy')) {
      poiseDamage = BALANCE.poiseDamage.heavy;
    } else if (packet.tags?.includes('riposte')) {
      poiseDamage = BALANCE.poiseDamage.riposte;
    }

    // Apply multipliers
    if (packet.crit) {
      poiseDamage *= 1.5; // Crits deal more poise damage
    }

    return poiseDamage * BALANCE.global.TUNING_MULTIPLIER;
  }

  /** Apply elemental status effects */
  private static applyElementalEffects(target: Actor, packet: DamagePacket): void {
    switch (packet.element) {
      case Element.Fire:
        if (Math.random() < 0.6) { // 60% chance to apply burn
          statusSystem.applyStatus(target, () => StatusEffects.burn(1));
        }
        break;

      case Element.Frost:
        if (Math.random() < 0.8) { // 80% chance to apply chill
          statusSystem.applyStatus(target, () => StatusEffects.chill(1));
        }
        break;

      case Element.Shock:
        if (Math.random() < 0.7) { // 70% chance to apply shock
          statusSystem.applyStatus(target, StatusEffects.shock);
          this.triggerShockArc(target);
        }
        break;

      case Element.Poison:
        // Future implementation for poison effects
        break;
    }
  }

  /** Trigger shock arcing to nearby enemies */
  private static triggerShockArc(target: Actor): void {
    // In a full implementation, this would find nearby enemies
    // For now, just apply enhanced shock if target is wet
    if (statusSystem.hasStatus(target, 'Wet' as any)) {
      const shockDamage = 15 * (1 + BALANCE.status.overloadBonus);
      target.hp = Math.max(0, target.hp - shockDamage);
      showCombatCue(COMBAT_CUES.overload);
    }
  }

  /** Trigger visual and audio feedback for damage */
  private static triggerDamageFeedback(result: DamageResult, element: Element): void {
    if (result.wasCritical) {
      showCombatCue(COMBAT_CUES.criticalHit);
      combatAudio.criticalHit();
    }

    if (result.wardAbsorption > 0) {
      // Ward absorbed damage - could add specific feedback
    }

    // Element-specific feedback
    switch (element) {
      case Element.Fire:
        combatAudio.statusEffect('burn');
        break;
      case Element.Frost:
        // Frost feedback handled in status application
        break;
      case Element.Shock:
        combatAudio.statusEffect('shock');
        break;
    }
  }

  /** Calculate healing effectiveness */
  static resolveHealing(target: Actor, amount: number): number {
    const finalHealing = Math.floor(amount * BALANCE.global.TUNING_MULTIPLIER);
    const actualHealing = Math.min(finalHealing, target.stats.maxHP - target.hp);
    
    target.hp += actualHealing;
    return actualHealing;
  }

  /** Check if attack would trigger special effects */
  static checkSpecialTriggers(attacker: Actor, target: Actor, packet: DamagePacket): void {
    // Check for frozen shatter
    if (statusSystem.hasStatus(target, 'Frozen' as any) && packet.tags?.includes('heavy')) {
      this.triggerShatter(target);
    }

    // Check for riposte opportunity
    if (statusSystem.hasStatus(attacker, 'Riposte' as any)) {
      // Enhanced damage for riposte attacks
      packet.base *= 1.5;
      statusSystem.removeStatus(attacker, 'Riposte' as any);
      combatAudio.riposte();
    }
  }

  /** Trigger frozen shatter effect */
  private static triggerShatter(target: Actor): void {
    // Remove frozen status and deal bonus damage
    statusSystem.removeStatus(target, 'Frozen' as any);
    const shatterDamage = 25;
    target.hp = Math.max(0, target.hp - shatterDamage);
    
    showCombatCue(COMBAT_CUES.shatter);
    combatAudio.statusEffect('freeze');
  }
}

/** Utility functions for damage calculations */
export const DamageUtils = {
  /** Create a basic physical damage packet */
  physical: (base: number, sourceId: string, tags?: string[]): DamagePacket => ({
    base,
    element: Element.Physical,
    sourceId,
    tags
  }),

  /** Create a fire damage packet */
  fire: (base: number, sourceId: string): DamagePacket => ({
    base,
    element: Element.Fire,
    sourceId
  }),

  /** Create a frost damage packet */
  frost: (base: number, sourceId: string): DamagePacket => ({
    base,
    element: Element.Frost,
    sourceId
  }),

  /** Create a shock damage packet */
  shock: (base: number, sourceId: string): DamagePacket => ({
    base,
    element: Element.Shock,
    sourceId
  }),

  /** Create a critical hit packet */
  critical: (base: number, element: Element, sourceId: string): DamagePacket => ({
    base,
    element,
    sourceId,
    crit: true
  })
};
