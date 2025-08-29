/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Core combat system managing actions, timing, and state
*/

import { Actor, CombatAction } from '../types/combat';
import { CombatState } from '../types/enums';
import { BALANCE } from '../data/balance';
import { statusSystem, StatusEffects } from '../status/StatusSystem';
import { HitResolver, DamageUtils } from './HitResolver';
import { showCombatCue, COMBAT_CUES } from '../vfx/cues';
import { combatAudio } from '../audio/sfx';

/** Combat action queue entry */
interface QueuedAction {
  actor: Actor;
  action: CombatAction;
  targetId?: string;
  queueTime: number;
}

/** Combat system managing all combat interactions */
export class CombatSystem {
  private static instance: CombatSystem;
  private actionQueue: QueuedAction[] = [];
  private activeCombat: boolean = false;
  private combatStartTime: number = 0;
  private player: Actor | null = null;
  private enemies: Actor[] = [];

  private constructor() {}

  /** Get singleton instance */
  static getInstance(): CombatSystem {
    if (!CombatSystem.instance) {
      CombatSystem.instance = new CombatSystem();
    }
    return CombatSystem.instance;
  }

  /** Initialize combat encounter */
  startCombat(actors: Actor[]): void {
    this.activeCombat = true;
    this.combatStartTime = Date.now();
    
    // Reset all actors to idle state
    for (const actor of actors) {
      actor.state = CombatState.Idle;
      actor.poise = actor.stats.poise;
      statusSystem.clearAllStatuses(actor);
    }
  }

  /** End combat encounter */
  endCombat(): void {
    this.activeCombat = false;
    this.actionQueue.length = 0;
  }

  /** Update combat system */
  update(actors: Actor[], deltaTime: number): void {
    if (!this.activeCombat) return;

    // Update all actors
    for (const actor of actors) {
      this.updateActor(actor, deltaTime);
    }

    // Process action queue
    this.processActionQueue(actors);
  }

  /** Queue a combat action */
  queueAction(actor: Actor, action: CombatAction, targetId?: string): boolean {
    // Check if actor can perform action
    if (!this.canPerformAction(actor, action)) {
      return false;
    }

    // Consume resources
    this.consumeResources(actor, action);

    // Queue the action
    this.actionQueue.push({
      actor,
      action,
      ...(targetId && { targetId }),
      queueTime: Date.now()
    });

    // Set actor state
    actor.state = CombatState.Windup;

    return true;
  }

  /** Execute light attack */
  lightAttack(attacker: Actor, target?: Actor): boolean {
    const action: CombatAction = {
      id: 'light_attack',
      costs: { stamina: BALANCE.staminaCosts.light },
      timing: { windup: 300, active: 200, recovery: 400 },
      damage: DamageUtils.physical(BALANCE.baseDamage.light, attacker.id, ['light'])
    };

    return this.queueAction(attacker, action, target?.id);
  }

  /** Execute heavy attack */
  heavyAttack(attacker: Actor, target?: Actor): boolean {
    const action: CombatAction = {
      id: 'heavy_attack',
      costs: { stamina: BALANCE.staminaCosts.heavy },
      timing: { windup: 600, active: 300, recovery: 800 },
      damage: DamageUtils.physical(BALANCE.baseDamage.heavy, attacker.id, ['heavy'])
    };

    return this.queueAction(attacker, action, target?.id);
  }

  /** Execute dodge */
  dodge(actor: Actor): boolean {
    const action: CombatAction = {
      id: 'dodge',
      costs: { stamina: BALANCE.staminaCosts.dodge },
      timing: { windup: 100, active: BALANCE.timing.dodgeIFrames, recovery: 300 },
      effects: [{ id: 'IFrames' as any, durationMs: BALANCE.timing.dodgeIFrames }]
    };

    const success = this.queueAction(actor, action);
    if (success) {
      combatAudio.dodge();
    }
    return success;
  }

  /** Execute parry */
  parry(actor: Actor): boolean {
    const action: CombatAction = {
      id: 'parry',
      costs: { stamina: BALANCE.staminaCosts.parry },
      timing: { windup: 50, active: BALANCE.timing.parryWindow, recovery: 200 },
      effects: [{ id: 'ParryWindow' as any, durationMs: BALANCE.timing.parryWindow }]
    };

    const success = this.queueAction(actor, action);
    return success;
  }

  /** Execute riposte attack */
  riposte(attacker: Actor, target?: Actor): boolean {
    // Can only riposte during riposte window
    if (!statusSystem.hasStatus(attacker, 'Riposte' as any)) {
      return false;
    }

    const action: CombatAction = {
      id: 'riposte',
      costs: { stamina: 5 }, // Reduced cost during riposte window
      timing: { windup: 200, active: 250, recovery: 300 },
      damage: DamageUtils.physical(BALANCE.baseDamage.riposte, attacker.id, ['riposte'])
    };

    const success = this.queueAction(attacker, action, target?.id);
    if (success) {
      statusSystem.removeStatus(attacker, 'Riposte' as any);
    }
    return success;
  }

  /** Check if actor can perform action */
  private canPerformAction(actor: Actor, action: CombatAction): boolean {
    // Check if actor is in valid state
    if (actor.state !== CombatState.Idle && actor.state !== CombatState.Recovery) {
      return false;
    }

    // Check if actor can act (not staggered, etc.)
    if (actor.data?.canAct === false) {
      return false;
    }

    // Check resource costs
    if (action.costs.stamina && actor.stamina < action.costs.stamina) {
      return false;
    }
    if (action.costs.focus && actor.focus < action.costs.focus) {
      return false;
    }
    if (action.costs.tension && actor.tension < action.costs.tension) {
      return false;
    }

    return true;
  }

  /** Consume resources for action */
  private consumeResources(actor: Actor, action: CombatAction): void {
    if (action.costs.stamina) {
      actor.stamina = Math.max(0, actor.stamina - action.costs.stamina);
    }
    if (action.costs.focus) {
      actor.focus = Math.max(0, actor.focus - action.costs.focus);
    }
    if (action.costs.tension) {
      actor.tension = Math.max(0, actor.tension - action.costs.tension);
    }
  }

  /** Update individual actor */
  private updateActor(actor: Actor, deltaTime: number): void {
    // Update status effects
    statusSystem.updateStatuses(actor, deltaTime);

    // Regenerate resources
    this.regenerateResources(actor, deltaTime);

    // Update state timers (handled in processActionQueue)
  }

  /** Regenerate actor resources */
  private regenerateResources(actor: Actor, deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;

    // Regenerate stamina
    actor.stamina = Math.min(
      actor.stats.stamina,
      actor.stamina + BALANCE.regen.stamina * deltaSeconds
    );

    // Regenerate focus
    actor.focus = Math.min(
      actor.stats.focus,
      actor.focus + BALANCE.regen.focus * deltaSeconds
    );

    // Regenerate poise
    actor.poise = Math.min(
      actor.stats.poise,
      actor.poise + BALANCE.regen.poise * deltaSeconds
    );

    // Decay tension
    actor.tension = Math.max(
      0,
      actor.tension - BALANCE.regen.tensionDecay * deltaSeconds
    );
  }

  /** Process queued actions */
  private processActionQueue(actors: Actor[]): void {
    const currentTime = Date.now();

    for (let i = this.actionQueue.length - 1; i >= 0; i--) {
      const queuedAction = this.actionQueue[i];
      if (!queuedAction) {
        continue; // Defensive: should not happen, satisfies noUncheckedIndexedAccess
      }
      const timeElapsed = currentTime - queuedAction.queueTime;
      const action = queuedAction.action;

      // Check windup phase
      if (timeElapsed < action.timing.windup) {
        continue; // Still in windup
      }

      // Check active phase
      if (timeElapsed < action.timing.windup + action.timing.active) {
        if (queuedAction.actor.state !== CombatState.Active) {
          queuedAction.actor.state = CombatState.Active;
          this.executeAction(queuedAction, actors);
        }
        continue;
      }

      // Check recovery phase
      if (timeElapsed < action.timing.windup + action.timing.active + action.timing.recovery) {
        if (queuedAction.actor.state !== CombatState.Recovery) {
          queuedAction.actor.state = CombatState.Recovery;
        }
        continue;
      }

      // Action complete
  queuedAction.actor.state = CombatState.Idle;
      this.actionQueue.splice(i, 1);
    }
  }

  /** Execute queued action */
  private executeAction(queuedAction: QueuedAction, actors: Actor[]): void {
    const { actor, action, targetId } = queuedAction;
    let target: Actor | undefined;

    if (targetId) {
      target = actors.find(a => a.id === targetId);
    }

    // Apply action effects to self
    if (action.effects) {
      for (const effectTemplate of action.effects) {
        // Provide required fields with safe defaults to satisfy Status interface
        const noop = () => {};
        const statusFactory = () => ({
          id: effectTemplate.id!,
          // Ensure duration always defined; fall back to 0 meaning immediate expiry if absent
          durationMs: effectTemplate.durationMs ?? 0,
          stacks: effectTemplate.stacks ?? 1,
          onTick: effectTemplate.onTick ?? noop,
          onApply: effectTemplate.onApply ?? noop,
          onRemove: effectTemplate.onRemove ?? noop,
          data: effectTemplate.data ?? {}
        });
        statusSystem.applyStatus(actor, statusFactory);
      }
    }

    // Apply damage if target exists
    if (action.damage && target) {
      // Check for special triggers first
      HitResolver.checkSpecialTriggers(actor, target, action.damage);

      // Resolve damage
      const result = HitResolver.resolveDamage(target, action.damage);

      // Handle parry attempts
      if (statusSystem.hasStatus(target, 'ParryWindow' as any) && action.damage.element === 'Physical') {
        this.handleParryAttempt(target, actor, result);
      }

      // Trigger attack feedback
      combatAudio.weaponSwing();
      if (result.damage > 0) {
        combatAudio.weaponHit();
      }
    }

    // Handle special action types
    switch (action.id) {
      case 'dodge':
        this.handlePerfectDodge(actor);
        break;
      case 'parry':
        // Parry window is handled in status effects
        break;
    }
  }

  /** Handle perfect dodge timing */
  private handlePerfectDodge(actor: Actor): void {
    // Grant riposte window on perfect dodge
    statusSystem.applyStatus(actor, StatusEffects.riposte);
    showCombatCue(COMBAT_CUES.perfectDodge);
  }

  /** Handle parry attempt */
  private handleParryAttempt(defender: Actor, attacker: Actor, damageResult: any): void {
    if (statusSystem.hasStatus(defender, 'ParryWindow' as any)) {
      // Successful parry
      statusSystem.removeStatus(defender, 'ParryWindow' as any);
      statusSystem.applyStatus(defender, StatusEffects.riposte);
      statusSystem.applyStatus(attacker, StatusEffects.stagger);
      
      showCombatCue(COMBAT_CUES.parry);
      combatAudio.parrySuccess();
      
      // Negate damage
      damageResult.damage = 0;
    } else {
      // Failed parry
      showCombatCue(COMBAT_CUES.parryFail);
      combatAudio.parryFail();
    }
  }

  /** Get combat statistics */
  getCombatStats(): {
    duration: number;
    actionsPerformed: number;
    isActive: boolean;
  } {
    return {
      duration: this.activeCombat ? Date.now() - this.combatStartTime : 0,
      actionsPerformed: this.actionQueue.length,
      isActive: this.activeCombat
    };
  }

  /** Initialize combat with player and enemies */
  initializeCombat(player: Actor, enemies: Actor[]): void {
    this.player = player;
    this.enemies = enemies;
    this.activeCombat = true;
    this.combatStartTime = Date.now();
    this.actionQueue = [];
  }

  /** Get current combat state for UI */
  getCombatState() {
    return {
      isActive: this.activeCombat,
      player: this.player,
      enemies: this.enemies,
      actionQueue: this.actionQueue
    };
  }

  /** Get current combat state for UI (alias for getCombatState) */
  getState() {
    return {
      inCombat: this.activeCombat,
      player: this.player,
      enemies: this.enemies,
      round: this.calculateRound(),
      actionQueue: this.actionQueue
    };
  }

  /** Derived round: every 5s or every 4 queued actions (whichever higher) */
  private calculateRound(): number {
    if (!this.activeCombat) return 0;
    const elapsed = Date.now() - this.combatStartTime;
    const timeRound = Math.floor(elapsed / 5000) + 1;
    const actionRound = Math.floor(this.actionQueue.length / 4) + 1;
    return Math.max(timeRound, actionRound);
  }

  /** Queue an action by name and return result */
  queueActionByName(actor: Actor, actionType: string, options?: any): { success: boolean; message: string } {
    try {
      // Get costs from BALANCE config
      const staminaCost = BALANCE.staminaCosts[actionType as keyof typeof BALANCE.staminaCosts] || 0;
      const focusCost = BALANCE.focusCosts[actionType as keyof typeof BALANCE.focusCosts] || 0;
      const timing = BALANCE.timing[actionType as keyof typeof BALANCE.timing] || 300;

      // Convert string action to CombatAction
      const action: CombatAction = {
        id: actionType,
        costs: {
          stamina: staminaCost,
          focus: focusCost
        },
        timing: {
          windup: Array.isArray(timing) ? timing[0] : Math.floor(timing * 0.3),
          active: Array.isArray(timing) ? timing[1] : Math.floor(timing * 0.4),
          recovery: Array.isArray(timing) ? timing[2] : Math.floor(timing * 0.3)
        }
      };

      const success = this.queueAction(actor, action, options?.target?.id);
      return { 
        success, 
        message: success ? `${actionType} queued successfully` : `Failed to queue ${actionType}` 
      };
    } catch (error) {
      return { success: false, message: `Failed to queue ${actionType}: ${error}` };
    }
  }
}
