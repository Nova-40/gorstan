/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Posture system for combat balance and stagger mechanics
*/

import { Actor } from '../types/combat';
import { statusSystem, StatusEffects } from '../status/StatusSystem';
import { BALANCE } from '../data/balance';

/** Posture state tracking */
interface PostureState {
  /** Current posture value */
  current: number;
  /** Maximum posture value */
  maximum: number;
  /** Last damage time for regeneration */
  lastDamageTime: number;
  /** Regeneration rate modifier */
  regenModifier: number;
}

/** Posture system managing balance and stagger */
export class PostureSystem {
  private postureStates = new Map<string, PostureState>();

  /** Initialize posture tracking for actor */
  initializeActor(actor: Actor): void {
    this.postureStates.set(actor.id, {
      current: actor.stats.poise,
      maximum: actor.stats.poise,
      lastDamageTime: 0,
      regenModifier: 1.0,
    });
  }

  /** Apply posture damage to actor */
  damagePosture(actor: Actor, damage: number): boolean {
    const state = this.postureStates.get(actor.id);
    if (!state) {
      this.initializeActor(actor);
      return this.damagePosture(actor, damage);
    }

    // Apply damage
    state.current = Math.max(0, state.current - damage);
    state.lastDamageTime = Date.now();
    actor.poise = state.current;

    // Check for posture break (stagger)
    if (state.current <= 0) {
      this.breakPosture(actor);
      return true;
    }

    return false;
  }

  /** Break actor's posture (trigger stagger) */
  private breakPosture(actor: Actor): void {
    const state = this.postureStates.get(actor.id);
    if (!state) {
      return;
    }

    // Apply stagger status
    statusSystem.applyStatus(actor, StatusEffects.stagger);

    // Reset posture to partial amount after break
    state.current = state.maximum * 0.3; // 30% posture after break
    actor.poise = state.current;
  }

  /** Update posture regeneration */
  update(actor: Actor, deltaTime: number): void {
    const state = this.postureStates.get(actor.id);
    if (!state) {
      return;
    }

    const currentTime = Date.now();
    const timeSinceLastDamage = currentTime - state.lastDamageTime;

    // Only regenerate after grace period
    const gracePeriod = 2000; // 2 seconds
    if (timeSinceLastDamage < gracePeriod) {
      return;
    }

    // Calculate regeneration
    const deltaSeconds = deltaTime / 1000;
    const baseRegen = actor.stats.poiseRegen * state.regenModifier;
    const regenAmount = baseRegen * deltaSeconds;

    // Apply regeneration
    state.current = Math.min(state.maximum, state.current + regenAmount);
    actor.poise = state.current;
  }

  /** Get posture percentage */
  getPosturePercentage(actor: Actor): number {
    const state = this.postureStates.get(actor.id);
    if (!state || state.maximum <= 0) {
      return 1.0;
    }

    return state.current / state.maximum;
  }

  /** Check if actor is close to posture break */
  isCloseToBreak(actor: Actor, threshold: number = 0.2): boolean {
    return this.getPosturePercentage(actor) <= threshold;
  }

  /** Apply posture regeneration modifier */
  setRegenModifier(actor: Actor, modifier: number): void {
    const state = this.postureStates.get(actor.id);
    if (state) {
      state.regenModifier = Math.max(0, modifier);
    }
  }

  /** Reset posture to maximum */
  resetPosture(actor: Actor): void {
    const state = this.postureStates.get(actor.id);
    if (state) {
      state.current = state.maximum;
      actor.poise = state.current;
    }
  }

  /** Get posture damage multiplier based on current state */
  getDamageMultiplier(actor: Actor): number {
    const percentage = this.getPosturePercentage(actor);

    // Increased posture damage when already low
    if (percentage <= 0.2) {
      return 1.5;
    }
    if (percentage <= 0.5) {
      return 1.2;
    }
    return 1.0;
  }

  /** Calculate optimal posture damage for action type */
  calculatePostureDamage(actionType: string, attackerPower: number, defenderPoise: number): number {
    let baseDamage = 0;

    switch (actionType) {
      case 'light':
        baseDamage = BALANCE.poiseDamage.light;
        break;
      case 'heavy':
        baseDamage = BALANCE.poiseDamage.heavy;
        break;
      case 'riposte':
        baseDamage = BALANCE.poiseDamage.riposte;
        break;
      case 'parry_breaker':
        baseDamage = BALANCE.poiseDamage.parryBreaker;
        break;
      default:
        baseDamage = 10;
    }

    // Scale by attacker power
    baseDamage *= attackerPower;

    // Apply defender's posture resistance
    const poiseRatio = defenderPoise / 100; // Normalize to expected range
    const resistance = Math.min(0.5, poiseRatio * 0.1); // Max 50% reduction
    baseDamage *= 1 - resistance;

    return Math.floor(baseDamage * BALANCE.global.TUNING_MULTIPLIER);
  }

  /** Check if actor can perform actions requiring posture */
  canPerformAction(actor: Actor, requiredPosture: number = 0.1): boolean {
    const percentage = this.getPosturePercentage(actor);
    return percentage >= requiredPosture;
  }

  /** Clean up posture tracking for actor */
  removeActor(actorId: string): void {
    this.postureStates.delete(actorId);
  }

  /** Get posture state for debugging */
  getPostureState(actorId: string): PostureState | undefined {
    return this.postureStates.get(actorId);
  }
}

/** Global posture system instance */
export const postureSystem = new PostureSystem();
