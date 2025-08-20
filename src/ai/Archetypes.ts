/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  AI archetype definitions and behaviors
*/

import { Enemy } from '../types/entities';
import { AIArchetype, Element } from '../types/enums';

/** AI archetype configuration */
export interface ArchetypeConfig {
  /** Display name */
  name: string;
  /** Base stats modifier */
  statsModifier: {
    health: number;
    armor: number;
    power: number;
    speed: number;
  };
  /** Preferred behaviors */
  behaviors: string[];
  /** Special abilities */
  abilities?: string[];
  /** AI decision weights */
  weights: Record<string, number>;
}

/** Predefined AI archetypes */
export const ARCHETYPES: Record<AIArchetype, ArchetypeConfig> = {
  [AIArchetype.Brute]: {
    name: 'Brute',
    statsModifier: {
      health: 1.3,
      armor: 1.5,
      power: 1.2,
      speed: 0.7
    },
    behaviors: ['attack_melee', 'charge', 'guard', 'intimidate'],
    abilities: ['shield_bash', 'ground_slam'],
    weights: {
      aggression: 0.8,
      defense: 0.6,
      mobility: 0.2,
      magic: 0.1
    }
  },

  [AIArchetype.Skirmisher]: {
    name: 'Skirmisher',
    statsModifier: {
      health: 0.8,
      armor: 0.6,
      power: 1.0,
      speed: 1.4
    },
    behaviors: ['attack_ranged', 'dodge', 'kite', 'flank'],
    abilities: ['quick_shot', 'smoke_bomb', 'caltrops'],
    weights: {
      aggression: 0.6,
      defense: 0.3,
      mobility: 0.9,
      magic: 0.2
    }
  },

  [AIArchetype.Caster]: {
    name: 'Caster',
    statsModifier: {
      health: 0.7,
      armor: 0.4,
      power: 1.3,
      speed: 0.9
    },
    behaviors: ['cast_spell', 'maintain_distance', 'interrupt', 'teleport'],
    abilities: ['fireball', 'lightning_bolt', 'shield', 'teleport'],
    weights: {
      aggression: 0.4,
      defense: 0.5,
      mobility: 0.3,
      magic: 1.0
    }
  }
};

/** Create enemy with archetype */
export function createArchetypeEnemy(
  id: string,
  name: string,
  archetype: AIArchetype,
  level: number = 1
): Enemy {
  const config = ARCHETYPES[archetype];
  const baseStats = {
    maxHP: Math.floor(60 + (level * 15)) * config.statsModifier.health,
    armor: Math.floor(2 + (level * 1)) * config.statsModifier.armor,
    power: (0.8 + (level * 0.1)) * config.statsModifier.power,
    crit: 0.05 + (level * 0.01),
    critMult: 1.3 + (level * 0.05),
    poise: Math.floor(40 + (level * 10)) * config.statsModifier.health,
    poiseRegen: 15,
    stamina: Math.floor(70 + (level * 10)) * config.statsModifier.speed,
    focus: Math.floor(30 + (level * 8)),
    resists: {}
  };

  const enemy: Enemy = {
    id,
    name,
    stats: baseStats,
    hp: baseStats.maxHP,
    stamina: baseStats.stamina,
    focus: baseStats.focus,
    tension: 0,
    poise: baseStats.poise,
    statuses: [],
    faction: 'enemy' as any,
    state: 'Idle' as any,
    archetype,
    expReward: 20 + (level * 5)
  };

  return enemy;
}

/** Brute archetype factory */
export function createBrute(id: string, name: string, level: number = 1): Enemy {
  const enemy = createArchetypeEnemy(id, name, AIArchetype.Brute, level);
  
  // Brute-specific resistances
  enemy.stats.resists = {
    [Element.Physical]: 0.1,
    [Element.Fire]: -0.1 // Weak to fire
  };

  return enemy;
}

/** Skirmisher archetype factory */
export function createSkirmisher(id: string, name: string, level: number = 1): Enemy {
  const enemy = createArchetypeEnemy(id, name, AIArchetype.Skirmisher, level);
  
  // Skirmisher-specific resistances
  enemy.stats.resists = {
    [Element.Physical]: -0.1, // Weak to physical
    [Element.Shock]: 0.1
  };

  return enemy;
}

/** Caster archetype factory */
export function createCaster(id: string, name: string, level: number = 1): Enemy {
  const enemy = createArchetypeEnemy(id, name, AIArchetype.Caster, level);
  
  // Caster-specific resistances
  enemy.stats.resists = {
    [Element.Fire]: 0.2,
    [Element.Frost]: 0.2,
    [Element.Shock]: 0.2,
    [Element.Physical]: -0.2 // Very weak to physical
  };

  return enemy;
}

/** Get archetype configuration */
export function getArchetypeConfig(archetype: AIArchetype): ArchetypeConfig {
  return ARCHETYPES[archetype];
}

/** Calculate AI decision weight for archetype */
export function getArchetypeWeight(
  archetype: AIArchetype,
  behaviorType: string
): number {
  const config = ARCHETYPES[archetype];
  return config.weights[behaviorType] || 0.5;
}
