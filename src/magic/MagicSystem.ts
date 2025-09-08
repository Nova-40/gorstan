/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Magic system for spells and casting
*/

import { Actor, Spell } from '../types/combat';
import { CombatState } from '../types/enums';
import { showCombatCue, COMBAT_CUES } from '../vfx/cues';
import { combatAudio } from '../audio/sfx';

/** Spell cooldown tracking */
interface SpellCooldown {
  spellId: string;
  remainingMs: number;
}

/** Cast state for channeled spells */
interface CastState {
  actor: Actor;
  spell: Spell;
  startTime: number;
  target?: Actor;
}

/** Magic system managing spell casting and cooldowns */
export class MagicSystem {
  private static instance: MagicSystem;
  private cooldowns: Map<string, SpellCooldown[]> = new Map();
  private activeCasts: CastState[] = [];

  private constructor() {}

  /** Get singleton instance */
  static getInstance(): MagicSystem {
    if (!MagicSystem.instance) {
      MagicSystem.instance = new MagicSystem();
    }
    return MagicSystem.instance;
  }

  /** Check if actor can cast spell */
  canCastSpell(caster: Actor, spell: Spell): boolean {
    // Check combat state
    if (caster.state !== CombatState.Idle) {
      return false;
    }

    // Check if actor can act
    if (caster.data?.canAct === false) {
      return false;
    }

    // Check focus cost
    if (caster.focus < spell.focusCost) {
      return false;
    }

    // Check cooldown
    if (this.isSpellOnCooldown(caster.id, spell.id)) {
      return false;
    }

    return true;
  }

  /** Start casting a spell */
  castSpell(caster: Actor, spell: Spell, target?: Actor): boolean {
    if (!this.canCastSpell(caster, spell)) {
      return false;
    }

    // Consume focus
    caster.focus = Math.max(0, caster.focus - spell.focusCost);

    // Set casting state
    caster.state = CombatState.Channeling;

    // Create cast state
    const castState: CastState = {
      actor: caster,
      spell,
      startTime: Date.now(),
      // Only include target if provided to satisfy exactOptionalPropertyTypes
      ...(target ? { target } : {})
    } as CastState;

    this.activeCasts.push(castState);

    // Show casting feedback
    showCombatCue(() => COMBAT_CUES.spellCast(spell.name));
    combatAudio.spellCast(spell.id);

    return true;
  }

  /** Update magic system */
  update(deltaTime: number): void {
    this.updateCooldowns(deltaTime);
    this.updateActiveCasts();
  }

  /** Check if spell is on cooldown */
  isSpellOnCooldown(actorId: string, spellId: string): boolean {
    const actorCooldowns = this.cooldowns.get(actorId) || [];
    return actorCooldowns.some(cd => cd.spellId === spellId && cd.remainingMs > 0);
  }

  /** Get remaining cooldown for spell */
  getSpellCooldown(actorId: string, spellId: string): number {
    const actorCooldowns = this.cooldowns.get(actorId) || [];
    const cooldown = actorCooldowns.find(cd => cd.spellId === spellId);
    return cooldown ? cooldown.remainingMs : 0;
  }

  /** Start cooldown for spell */
  private startCooldown(actorId: string, spellId: string, durationMs: number): void {
    const actorCooldowns = this.cooldowns.get(actorId) || [];
    
    // Update existing or add new cooldown
    const existingIndex = actorCooldowns.findIndex(cd => cd.spellId === spellId);
    if (existingIndex >= 0) {
      const existing = actorCooldowns[existingIndex];
      if (existing) {existing.remainingMs = durationMs;}
    } else {
      actorCooldowns.push({ spellId, remainingMs: durationMs });
    }

    this.cooldowns.set(actorId, actorCooldowns);
  }

  /** Update spell cooldowns */
  private updateCooldowns(deltaTime: number): void {
    for (const [, actorCooldowns] of this.cooldowns) {
      for (let i = actorCooldowns.length - 1; i >= 0; i--) {
        const cooldown = actorCooldowns[i];
        if (!cooldown) {continue;}
        cooldown.remainingMs -= deltaTime;
        if (cooldown.remainingMs <= 0) {
          actorCooldowns.splice(i, 1);
        }
      }
    }
  }

  /** Update active spell casts */
  private updateActiveCasts(): void {
    const currentTime = Date.now();

    for (let i = this.activeCasts.length - 1; i >= 0; i--) {
      const castState = this.activeCasts[i];
      if (!castState) {continue;}
      const channelMs = castState.spell.cast?.channelMs ?? 1000;
      const elapsed = currentTime - castState.startTime;
      if (elapsed >= channelMs) {
        this.completeCast(castState);
        this.activeCasts.splice(i, 1);
      }
    }
  }

  /** Complete a spell cast */
  private completeCast(castState: CastState): void {
    const { actor, spell, target } = castState;

    // Execute spell effects
    spell.execute(actor, target);

    // Start cooldown
    this.startCooldown(actor.id, spell.id, spell.cooldownMs);

    // Return actor to idle state
    actor.state = CombatState.Idle;

    // Show completion feedback
    showCombatCue(() => COMBAT_CUES.spellCast(spell.name));
    combatAudio.spellCast(spell.id);
  }

  /** Cancel active cast for actor */
  cancelCast(actorId: string): boolean {
    const castIndex = this.activeCasts.findIndex(cs => cs.actor.id === actorId);
    if (castIndex >= 0) {
      const castState = this.activeCasts[castIndex];
      if (castState) {
        castState.actor.state = CombatState.Idle;
      }
      this.activeCasts.splice(castIndex, 1);
      return true;
    }
    return false;
  }

  /** Get active cast for actor */
  getActiveCast(actorId: string): CastState | undefined {
    return this.activeCasts.find(cs => cs.actor.id === actorId);
  }

  /** Check if actor is casting */
  isCasting(actorId: string): boolean {
    return this.activeCasts.some(cs => cs.actor.id === actorId);
  }

  /** Cast a spell by name with result */
  castSpellByName(actor: Actor, spellName: string, options?: any): { success: boolean; message: string } {
    try {
      // Import individual spell implementations
      switch (spellName.toLowerCase()) {
        case 'firebolt':
          const { FireBolt } = require('./spells/FireBolt');
          return { success: this.castSpell(actor, FireBolt, options?.target), message: `Cast ${spellName}` };
        case 'frostnova':
          const { FrostNova } = require('./spells/FrostNova');
          return { success: this.castSpell(actor, FrostNova, options?.target), message: `Cast ${spellName}` };
        case 'chainlightning':
          const { ChainLightning } = require('./spells/ChainLightning');
          return { success: this.castSpell(actor, ChainLightning, options?.target), message: `Cast ${spellName}` };
        case 'blink':
          const { Blink } = require('./spells/Blink');
          return { success: this.castSpell(actor, Blink, options?.target), message: `Cast ${spellName}` };
        case 'ward':
          const { Ward } = require('./spells/Ward');
          return { success: this.castSpell(actor, Ward, options?.target), message: `Cast ${spellName}` };
        case 'timedilation':
          const { TimeDilation } = require('./spells/TimeDilation');
          return { success: this.castSpell(actor, TimeDilation, options?.target), message: `Cast ${spellName}` };
        default:
          return { success: false, message: `Unknown spell: ${spellName}` };
      }
    } catch (error) {
      return { success: false, message: `Spell casting failed: ${error}` };
    }
  }
}
