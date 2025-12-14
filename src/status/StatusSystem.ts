/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Status effect system for combat
*/

import { Status, Actor } from '../types/combat';
import { StatusType } from '../types/enums';
import { BALANCE } from '../data/balance';
import { showCombatCue, COMBAT_CUES } from '../vfx/cues';
import { combatAudio } from '../audio/sfx';

/** Status effect factory functions */
export const StatusEffects = {
  /** Create a Burn status effect */
  burn(stacks: number = 1): Status {
    return {
      id: StatusType.Burn,
      stacks,
      durationMs: BALANCE.status.burnMs,
      onTick: (actor: Actor) => {
        const damage = BALANCE.status.burnPerTick * (stacks || 1);
        actor.hp = Math.max(0, actor.hp - damage);
        showCombatCue(COMBAT_CUES.burn);
        combatAudio.statusEffect('burn');
      },
    };
  },

  /** Create a Chill status effect */
  chill(stacks: number = 1): Status {
    return {
      id: StatusType.Chill,
      stacks,
      durationMs: 3000,
      onApply: (actor: Actor) => {
        // Apply movement/action speed reduction
        if (!actor.statuses.find((s) => s.id === StatusType.Frozen)) {
          // Only apply slow if not frozen
          const slowAmount = BALANCE.status.chillSlow * (stacks || 1);
          actor.data = actor.data || {};
          actor.data.speedMultiplier = (actor.data.speedMultiplier || 1.0) * (1 - slowAmount);
        }
      },
      onRemove: (actor: Actor) => {
        // Remove speed reduction if no other chill stacks
        const remainingChill = actor.statuses.filter((s) => s.id === StatusType.Chill);
        if (remainingChill.length === 0) {
          actor.data = actor.data || {};
          actor.data.speedMultiplier = 1.0;
        }
      },
    };
  },

  /** Create a Frozen status effect */
  frozen(): Status {
    return {
      id: StatusType.Frozen,
      durationMs: BALANCE.status.freezeMs,
      onApply: (actor: Actor) => {
        actor.data = actor.data || {};
        actor.data.speedMultiplier = 0; // Completely immobilized
        actor.data.canAct = false;
        showCombatCue(COMBAT_CUES.freeze);
        combatAudio.statusEffect('freeze');
      },
      onRemove: (actor: Actor) => {
        actor.data = actor.data || {};
        actor.data.speedMultiplier = 1.0;
        actor.data.canAct = true;
      },
    };
  },

  /** Create a Shock status effect */
  shock(): Status {
    return {
      id: StatusType.Shock,
      durationMs: 2000,
      data: { canArc: true },
      onApply: () => {
        showCombatCue(COMBAT_CUES.shock);
        combatAudio.statusEffect('shock');
      },
    };
  },

  /** Create a Wet status effect */
  wet(): Status {
    return {
      id: StatusType.Wet,
      durationMs: 5000,
      data: { conductivity: 2.0 }, // Doubles shock effects
    };
  },

  /** Create a Stagger status effect */
  stagger(): Status {
    return {
      id: StatusType.Stagger,
      durationMs: BALANCE.status.staggerMs,
      onApply: (actor: Actor) => {
        actor.data = actor.data || {};
        actor.data.canAct = false;
        actor.data = actor.data || {};
        actor.data.canParry = false;
        actor.data.canDodge = false;
        showCombatCue(COMBAT_CUES.stagger);
        combatAudio.stagger();
      },
      onRemove: (actor: Actor) => {
        actor.data = actor.data || {};
        actor.data.canAct = true;
        actor.data = actor.data || {};
        actor.data.canParry = true;
        actor.data.canDodge = true;
      },
    };
  },

  /** Create a Riposte window status effect */
  riposte(): Status {
    return {
      id: StatusType.Riposte,
      durationMs: BALANCE.status.riposteWindowMs,
      onApply: () => {
        showCombatCue(COMBAT_CUES.riposteReady);
      },
    };
  },

  /** Create a Ward protective status effect */
  ward(absorption: number = BALANCE.status.wardAbsorb): Status {
    return {
      id: StatusType.Ward,
      durationMs: 10000,
      data: { absorption },
    };
  },

  /** Create invincibility frames status effect */
  iframes(durationMs: number = BALANCE.timing.dodgeIFrames): Status {
    return {
      id: StatusType.IFrames,
      durationMs,
      data: { invulnerable: true },
    };
  },

  /** Create parry window status effect */
  parryWindow(): Status {
    return {
      id: StatusType.ParryWindow,
      durationMs: BALANCE.timing.parryWindow,
      data: { canParry: true },
    };
  },
};

/** Status system manager */
export class StatusSystem {
  private tickInterval: number = 1000; // 1 second ticks
  private lastTick: number = 0;

  /** Apply a status effect to an actor */
  applyStatus(actor: Actor, statusFactory: () => Status): void {
    const newStatus = statusFactory();

    // Handle stackable statuses
    const existingIndex = actor.statuses.findIndex((s) => s.id === newStatus.id);

    if (existingIndex >= 0) {
      const existing = actor.statuses[existingIndex];

      // Defensive: if the slot unexpectedly doesn't contain a status, fall back to adding
      if (!existing) {
        actor.statuses.push(newStatus);
        newStatus.onApply?.(actor);
      } else if (newStatus.stacks !== undefined && existing.stacks !== undefined) {
        // Stack the effect (use numeric defaults to avoid undefined arithmetic)
        existing.stacks = (existing.stacks || 0) + (newStatus.stacks || 0);
        existing.durationMs = Math.max(existing.durationMs ?? 0, newStatus.durationMs ?? 0);

        // Check for special stack thresholds
        this.checkStackThresholds(actor, existing);
      } else {
        // Refresh duration for non-stackable effects
        existing.durationMs = newStatus.durationMs ?? existing.durationMs;
      }
    } else {
      // Add new status
      actor.statuses.push(newStatus);
      newStatus.onApply?.(actor);
    }

    // Check for elemental synergies
    this.checkSynergies(actor);
  }

  /** Remove a status effect from an actor */
  removeStatus(actor: Actor, statusId: StatusType): void {
    const index = actor.statuses.findIndex((s) => s.id === statusId);
    if (index >= 0) {
      const status = actor.statuses[index];
      if (status) {
        status.onRemove?.(actor);
      }
      actor.statuses.splice(index, 1);
    }
  }

  /** Update status effects for an actor */
  updateStatuses(actor: Actor, deltaTime: number): void {
    const currentTime = Date.now();

    // Update durations
    for (let i = actor.statuses.length - 1; i >= 0; i--) {
      const status = actor.statuses[i];
      if (!status) {
        // Defensive: skip holes if any
        continue;
      }

      status.durationMs = (status.durationMs ?? 0) - deltaTime;

      if (status.durationMs <= 0) {
        const maybeStatus = actor.statuses[i];
        if (maybeStatus) {
          maybeStatus.onRemove?.(actor);
        }
        actor.statuses.splice(i, 1);
      }
    }

    // Handle ticking effects
    if (currentTime - this.lastTick >= this.tickInterval) {
      this.lastTick = currentTime;

      for (const status of actor.statuses) {
        if (!status) continue;
        status.onTick?.(actor);
      }
    }
  }

  /** Check if actor has a specific status */
  hasStatus(actor: Actor, statusId: StatusType): boolean {
    return actor.statuses.some((s) => s.id === statusId);
  }

  /** Get status stacks for stackable effects */
  getStatusStacks(actor: Actor, statusId: StatusType): number {
    const status = actor.statuses.find((s) => s.id === statusId);
    return status?.stacks || 0;
  }

  /** Check for special stack thresholds */
  private checkStackThresholds(actor: Actor, status: Status): void {
    if (status.id === StatusType.Chill && (status.stacks || 0) >= BALANCE.status.freezeStacks) {
      // Convert chill stacks to frozen
      this.removeStatus(actor, StatusType.Chill);
      this.applyStatus(actor, StatusEffects.frozen);
    }
  }

  /** Check for elemental synergies */
  private checkSynergies(actor: Actor): void {
    const hasWet = this.hasStatus(actor, StatusType.Wet);
    const hasShock = this.hasStatus(actor, StatusType.Shock);
    const hasOil = this.hasStatus(actor, StatusType.Oil);
    const hasBurn = this.hasStatus(actor, StatusType.Burn);

    // Wet + Shock = Overload
    if (hasWet && hasShock) {
      this.triggerOverload(actor);
    }

    // Oil + Fire = Conflagration
    if (hasOil && hasBurn) {
      this.triggerConflagration(actor);
    }
  }

  /** Trigger Overload synergy effect */
  private triggerOverload(actor: Actor): void {
    // Remove consumed statuses
    this.removeStatus(actor, StatusType.Wet);
    this.removeStatus(actor, StatusType.Shock);

    // Apply AoE shock damage to nearby enemies
    const overloadDamage = 30 * (1 + BALANCE.status.overloadBonus);
    actor.hp = Math.max(0, actor.hp - overloadDamage);

    showCombatCue(COMBAT_CUES.overload);
    combatAudio.statusEffect('shock');
  }

  /** Trigger Conflagration synergy effect */
  private triggerConflagration(actor: Actor): void {
    // Enhance existing burn effect
    const burnStatus = actor.statuses.find((s) => s.id === StatusType.Burn);
    if (burnStatus) {
      burnStatus.durationMs += 2000; // Extend duration
      burnStatus.data = { enhanced: true }; // Mark as enhanced
    }
  }

  /** Clear all status effects from an actor */
  clearAllStatuses(actor: Actor): void {
    for (const status of [...actor.statuses]) {
      if (!status) continue;
      status.onRemove?.(actor);
    }
    actor.statuses.length = 0;
  }
}

/** Global status system instance */
export const statusSystem = new StatusSystem();
