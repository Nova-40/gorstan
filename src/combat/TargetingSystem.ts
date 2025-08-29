/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Targeting system for combat actions
*/

import { Actor } from '../types/combat';
import { Faction } from '../types/enums';

/** Targeting options */
export interface TargetingOptions {
  /** Include allies in targeting */
  includeAllies?: boolean;
  /** Include enemies in targeting */
  includeEnemies?: boolean;
  /** Include self in targeting */
  includeSelf?: boolean;
  /** Maximum range for targeting */
  maxRange?: number;
  /** Filter function for custom targeting */
  filter?: (actor: Actor) => boolean;
}

/** Targeting system for selecting combat targets */
export class TargetingSystem {
  private currentTarget: string | null = null;
  private availableTargets: Actor[] = [];

  /** Set available actors for targeting */
  setAvailableActors(actors: Actor[]): void {
    this.availableTargets = [...actors];
  }

  /** Get current target */
  getCurrentTarget(): Actor | null {
    if (!this.currentTarget) return null;
    return this.availableTargets.find(a => a.id === this.currentTarget) || null;
  }

  /** Set current target by ID */
  setTarget(targetId: string | null): boolean {
    if (!targetId) {
      this.currentTarget = null;
      return true;
    }

    const target = this.availableTargets.find(a => a.id === targetId);
    if (target) {
      this.currentTarget = targetId;
      return true;
    }
    return false;
  }

  /** Find nearest valid target */
  findNearestTarget(
    from: Actor,
    options: TargetingOptions = {}
  ): Actor | null {
    const validTargets = this.getValidTargets(from, options);
    if (validTargets.length === 0) return null;

    // If no position data, return first valid target
    if (!from.position) {
  return validTargets[0] ?? null;
    }

    // Find closest by distance
    let nearest: Actor | null = null;
    let nearestDistance = Infinity;

    for (const target of validTargets) {
      if (!target.position) continue;

      const distance = Math.sqrt(
        Math.pow(target.position.x - from.position.x, 2) +
        Math.pow(target.position.y - from.position.y, 2)
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = target;
      }
    }

  return nearest || validTargets[0] || null;
  }

  /** Cycle to next valid target */
  cycleTarget(from: Actor, options: TargetingOptions = {}): Actor | null {
    const validTargets = this.getValidTargets(from, options);
    if (validTargets.length === 0) {
      this.currentTarget = null;
      return null;
    }

    const currentIndex = this.currentTarget 
      ? validTargets.findIndex(t => t.id === this.currentTarget)
      : -1;

    const nextIndex = (currentIndex + 1) % validTargets.length;
    const nextTarget = validTargets[nextIndex];
    if (!nextTarget) {
      this.currentTarget = null;
      return null;
    }
    this.currentTarget = nextTarget.id;
    return nextTarget;
  }

  /** Get target by name (fuzzy matching) */
  getTargetByName(name: string): Actor | null {
    const normalizedName = name.toLowerCase().trim();
    
    // Exact match first
    let target = this.availableTargets.find(a => 
      a.name.toLowerCase() === normalizedName
    );

    if (target) return target;

    // Partial match
    target = this.availableTargets.find(a => 
      a.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(a.name.toLowerCase())
    );

    return target || null;
  }

  /** Get all valid targets */
  getValidTargets(from: Actor, options: TargetingOptions = {}): Actor[] {
    const {
      includeAllies = false,
      includeEnemies = true,
      includeSelf = false,
      maxRange,
      filter
    } = options;

    let targets = this.availableTargets.filter(actor => {
      // Skip self unless explicitly included
      if (actor.id === from.id && !includeSelf) {
        return false;
      }

      // Check faction alignment
      const isAlly = actor.faction === from.faction;
      const isEnemy = actor.faction !== from.faction && actor.faction !== Faction.Neutral;

      if (isAlly && !includeAllies) return false;
      if (isEnemy && !includeEnemies) return false;

      // Check if actor is alive
      if (actor.hp <= 0) return false;

      // Check range if specified
      if (maxRange && from.position && actor.position) {
        const distance = Math.sqrt(
          Math.pow(actor.position.x - from.position.x, 2) +
          Math.pow(actor.position.y - from.position.y, 2)
        );
        if (distance > maxRange) return false;
      }

      // Apply custom filter
      if (filter && !filter(actor)) return false;

      return true;
    });

    return targets;
  }

  /** Get enemies within range */
  getEnemiesInRange(from: Actor, range: number): Actor[] {
    return this.getValidTargets(from, {
      includeEnemies: true,
      includeAllies: false,
      maxRange: range
    });
  }

  /** Get allies within range */
  getAlliesInRange(from: Actor, range: number): Actor[] {
    return this.getValidTargets(from, {
      includeEnemies: false,
      includeAllies: true,
      maxRange: range
    });
  }

  /** Clear current target */
  clearTarget(): void {
    this.currentTarget = null;
  }

  /** Get all available targets */
  getAllTargets(): Actor[] {
    return [...this.availableTargets];
  }

  /** Check if target is valid for action */
  isValidTarget(from: Actor, target: Actor, options: TargetingOptions = {}): boolean {
    const validTargets = this.getValidTargets(from, options);
    return validTargets.some(t => t.id === target.id);
  }

  /** Get targeting suggestions for auto-complete */
  getTargetingSuggestions(query: string): string[] {
    const normalizedQuery = query.toLowerCase();
    return this.availableTargets
      .filter(a => a.name.toLowerCase().includes(normalizedQuery))
      .map(a => a.name)
      .slice(0, 5); // Limit to 5 suggestions
  }
}

/** Global targeting system instance */
export const targetingSystem = new TargetingSystem();
