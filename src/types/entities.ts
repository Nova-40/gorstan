/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Entity type definitions for combat system
*/

import { Actor, Stats } from './combat';
import { AIArchetype, Faction } from './enums';

/** Player entity extension */
export interface Player extends Actor {
  /** Learned spells */
  knownSpells: string[];
  /** Experience and progression */
  experience: number;
  /** Equipment modifiers */
  equipment: {
    weapon?: WeaponStats;
    armor?: ArmorStats;
    accessories?: AccessoryStats[];
  };
}

/** Enemy entity extension */
export interface Enemy extends Actor {
  /** AI behavior pattern */
  archetype: AIArchetype;
  /** Loot table on defeat */
  loot?: LootEntry[];
  /** Experience granted on defeat */
  expReward: number;
}

/** Weapon statistics */
export interface WeaponStats {
  /** Base damage bonus */
  damage: number;
  /** Critical hit bonus */
  critBonus: number;
  /** Attack speed modifier */
  speedMod: number;
  /** Special effects */
  effects?: string[];
}

/** Armor statistics */
export interface ArmorStats {
  /** Armor value */
  armor: number;
  /** Resistance bonuses */
  resistances: Partial<Record<string, number>>;
  /** Health bonus */
  healthBonus: number;
  /** Movement penalty */
  movePenalty: number;
}

/** Accessory statistics */
export interface AccessoryStats {
  /** Stat bonuses */
  bonuses: Partial<Stats>;
  /** Special effects */
  effects?: string[];
}

/** Loot drop definition */
export interface LootEntry {
  /** Item identifier */
  itemId: string;
  /** Drop chance (0-1) */
  chance: number;
  /** Quantity range */
  quantity: { min: number; max: number };
}

/** Factory function for creating base player */
export function createPlayer(name: string): Player {
  const baseStats: Stats = {
    maxHP: 100,
    armor: 5,
    power: 1.0,
    crit: 0.12,
    critMult: 1.6,
    poise: 100,
    poiseRegen: 20,
    stamina: 100,
    focus: 50,
    resists: {},
  };

  return {
    id: 'player',
    name,
    stats: baseStats,
    hp: baseStats.maxHP,
    stamina: baseStats.stamina,
    focus: baseStats.focus,
    tension: 0,
    poise: baseStats.poise,
    statuses: [],
    faction: Faction.Player,
    state: 'Idle' as any,
    knownSpells: ['FireBolt', 'FrostNova'],
    experience: 0,
    equipment: {},
  };
}

/** Factory function for creating base enemy */
export function createEnemy(
  id: string,
  name: string,
  archetype: AIArchetype,
  statsOverride?: Partial<Stats>,
): Enemy {
  const baseStats: Stats = {
    maxHP: 80,
    armor: 3,
    power: 0.9,
    crit: 0.05,
    critMult: 1.4,
    poise: 60,
    poiseRegen: 15,
    stamina: 80,
    focus: 30,
    resists: {},
    ...statsOverride,
  };

  return {
    id,
    name,
    stats: baseStats,
    hp: baseStats.maxHP,
    stamina: baseStats.stamina,
    focus: baseStats.focus,
    tension: 0,
    poise: baseStats.poise,
    statuses: [],
    faction: Faction.Enemy,
    state: 'Idle' as any,
    archetype,
    expReward: 25,
  };
}
