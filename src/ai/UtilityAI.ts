/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Utility AI system for enemy behavior
*/

import { Actor } from '../types/combat';
import { AIArchetype, CombatState } from '../types/enums';
import { AI_WEIGHTS } from '../data/balance';
import { statusSystem } from '../status/StatusSystem';
import { CombatSystem } from '../combat/CombatSystem';

/** AI behavior evaluation */
interface BehaviorScore {
  behavior: string;
  score: number;
  target?: Actor;
}

/** AI decision context */
interface AIContext {
  actor: Actor;
  allies: Actor[];
  enemies: Actor[];
  player?: Actor;
}

/** Utility AI system for combat behaviors */
export class UtilityAI {
  private lastDecisionTime = new Map<string, number>();
  private decisionCooldown = 1000; // 1 second between decisions

  /** Make AI decision for actor */
  makeDecision(actor: Actor, allActors: Actor[]): void {
    // Check decision cooldown
    const now = Date.now();
    const lastDecision = this.lastDecisionTime.get(actor.id) || 0;
    if (now - lastDecision < this.decisionCooldown) {
      return;
    }

    // Skip if actor can't act
    if (actor.state !== CombatState.Idle || actor.data?.canAct === false) {
      return;
    }

    // Build AI context
    const context = this.buildContext(actor, allActors);
    if (!context.player) {
      return;
    } // No player to fight

    // Get archetype-specific behaviors
    const behaviors = this.getBehaviorsForArchetype(actor);

    // Evaluate all behaviors
    const scoredBehaviors = behaviors
      .map((behavior) => this.evaluateBehavior(behavior, context))
      .filter((scored) => scored.score > 0);

    if (scoredBehaviors.length === 0) {
      return;
    }

    // Sort by score and execute best behavior
    scoredBehaviors.sort((a, b) => b.score - a.score);
    const chosenBehavior = scoredBehaviors[0];
    if (!chosenBehavior) {
      return;
    }

    this.executeBehavior(chosenBehavior, context);
    this.lastDecisionTime.set(actor.id, now);
  }

  /** Build AI decision context */
  private buildContext(actor: Actor, allActors: Actor[]): AIContext {
    const allies = allActors.filter(
      (a) => a.faction === actor.faction && a.id !== actor.id && a.hp > 0,
    );
    const enemies = allActors.filter((a) => a.faction !== actor.faction && a.hp > 0);
    const player = enemies.find((a) => a.id === 'player');

  // Cast to AIContext to avoid accidental exactOptionalPropertyTypes mismatches
  return { actor, allies, enemies, player } as AIContext;
  }

  /** Get behaviors for AI archetype */
  private getBehaviorsForArchetype(actor: Actor): string[] {
    // This would be expanded with actual archetype data
    // For now, return basic behaviors based on actor type
    const archetype = (actor as any).archetype || AIArchetype.Brute;

    switch (archetype) {
      case AIArchetype.Brute:
        return ['attack_melee', 'charge', 'guard'];
      case AIArchetype.Skirmisher:
        return ['attack_ranged', 'dodge', 'kite'];
      case AIArchetype.Caster:
        return ['cast_spell', 'maintain_distance', 'interrupt'];
      default:
        return ['attack_melee'];
    }
  }

  /** Evaluate behavior utility score */
  private evaluateBehavior(behavior: string, context: AIContext): BehaviorScore {
    const { actor, player } = context;
    let score = 0;
    const target = player;

    if (!player) {
      return { behavior, score: 0 };
    }

    // Base behavior scoring
    switch (behavior) {
      case 'attack_melee':
        score = this.scoreAttackMelee(actor, player);
        break;
      case 'attack_ranged':
        score = this.scoreAttackRanged(actor, player);
        break;
      case 'cast_spell':
        score = this.scoreCastSpell(actor, player);
        break;
      case 'dodge':
        score = this.scoreDodge(actor);
        break;
      case 'charge':
        score = this.scoreCharge(actor, player);
        break;
      case 'guard':
        score = this.scoreGuard(actor);
        break;
      case 'kite':
        score = this.scoreKite(actor, player);
        break;
      case 'maintain_distance':
        score = this.scoreMaintainDistance(actor, player);
        break;
      case 'interrupt':
        score = this.scoreInterrupt(player);
        break;
      default:
        score = 0;
    }

    // Avoid including `target` property when it's undefined so exactOptionalPropertyTypes
    // won't complain about `target: undefined` in object literals.
    if (target) {
      return { behavior, score, target };
    }

    return { behavior, score };
  }

  /** Score melee attack behavior */
  private scoreAttackMelee(actor: Actor, target: Actor): number {
    let score = 1.0;

    // Check stamina availability
    if (actor.stamina < 15) {
      score *= 0.1;
    }

    // Distance factor (prefer close range)
    const distance = this.getDistance(actor, target);
    if (distance <= 1) {
      score *= AI_WEIGHTS.distance.optimal;
    } else if (distance > 3) {
      score *= AI_WEIGHTS.distance.tooFar;
    }

    // Health factor
    const healthRatio = actor.hp / actor.stats.maxHP;
    if (healthRatio < 0.25) {
      score *= AI_WEIGHTS.health.critical;
    } else if (healthRatio < 0.5) {
      score *= AI_WEIGHTS.health.low;
    }

    // Target state bonuses
    if (statusSystem.hasStatus(target, 'Stagger' as any)) {
      score *= AI_WEIGHTS.playerState.staggered;
    }
    if (statusSystem.hasStatus(target, 'Riposte' as any)) {
      score *= AI_WEIGHTS.playerState.riposte;
    }

    return Math.max(0, score);
  }

  /** Score ranged attack behavior */
  private scoreAttackRanged(actor: Actor, target: Actor): number {
    let score = 0.8;

    // Prefer medium distance
    const distance = this.getDistance(actor, target);
    if (distance >= 2 && distance <= 4) {
      score *= AI_WEIGHTS.distance.optimal;
    } else if (distance < 1) {
      score *= AI_WEIGHTS.distance.tooClose;
    }

    return Math.max(0, score);
  }

  /** Score spell casting behavior */
  private scoreCastSpell(actor: Actor, target: Actor): number {
    let score = 0.9;

    // Check focus availability
    if (actor.focus < 20) {
      score *= 0.1;
    }

    // Maintain distance for casting
    const distance = this.getDistance(actor, target);
    if (distance < 2) {
      score *= AI_WEIGHTS.distance.tooClose;
    }

    // Interrupt if player is casting
    if (target.state === CombatState.Channeling) {
      score *= AI_WEIGHTS.playerState.casting;
    }

    return Math.max(0, score);
  }

  /** Score dodge behavior */
  private scoreDodge(actor: Actor): number {
    let score = 0.3;

    // Higher score if low health
    const healthRatio = actor.hp / actor.stats.maxHP;
    if (healthRatio < 0.3) {
      score *= 2.0;
    }

    // Check stamina
    if (actor.stamina < 15) {
      score *= 0.1;
    }

    return Math.max(0, score);
  }

  /** Score other behaviors (simplified) */
  private scoreCharge(actor: Actor, target: Actor): number {
    const distance = this.getDistance(actor, target);
    return distance > 2 ? 0.6 : 0.1;
  }

  private scoreGuard(actor: Actor): number {
    const healthRatio = actor.hp / actor.stats.maxHP;
    return healthRatio < 0.4 ? 0.5 : 0.1;
  }

  private scoreKite(actor: Actor, target: Actor): number {
    const distance = this.getDistance(actor, target);
    return distance < 2 ? 0.7 : 0.2;
  }

  private scoreMaintainDistance(actor: Actor, target: Actor): number {
    const distance = this.getDistance(actor, target);
    return distance < 3 ? 0.6 : 0.1;
  }

  private scoreInterrupt(target: Actor): number {
    return target.state === CombatState.Channeling ? 1.5 : 0.0;
  }

  /** Execute chosen behavior */
  private executeBehavior(behaviorScore: BehaviorScore, context: AIContext): void {
    const { actor } = context;
    const { behavior, target } = behaviorScore;

    switch (behavior) {
      case 'attack_melee':
        CombatSystem.getInstance().lightAttack(actor, target);
        break;
      case 'attack_ranged':
        // Would implement ranged attack
        CombatSystem.getInstance().lightAttack(actor, target);
        break;
      case 'cast_spell':
        // Would implement spell selection and casting
        // For now, just attack
        CombatSystem.getInstance().lightAttack(actor, target);
        break;
      case 'dodge':
        CombatSystem.getInstance().dodge(actor);
        break;
      case 'charge':
        CombatSystem.getInstance().heavyAttack(actor, target);
        break;
      case 'guard':
        CombatSystem.getInstance().parry(actor);
        break;
      case 'kite':
        // Would implement movement away + attack
        CombatSystem.getInstance().lightAttack(actor, target);
        break;
      case 'maintain_distance':
        // Would implement positioning
        break;
      case 'interrupt':
        CombatSystem.getInstance().lightAttack(actor, target);
        break;
    }
  }

  /** Calculate distance between actors */
  private getDistance(a: Actor, b: Actor): number {
    if (!a.position || !b.position) {
      return 1;
    } // Assume close if no position data

    return Math.sqrt(
      Math.pow(b.position.x - a.position.x, 2) + Math.pow(b.position.y - a.position.y, 2),
    );
  }
}

/** Global utility AI instance */
export const utilityAI = new UtilityAI();
