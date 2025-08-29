/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Talent and progression system definitions
*/

import { Stats } from '../types/combat';

/** Talent node definition */
export interface Talent {
  /** Unique talent identifier */
  id: string;
  /** Display name */
  name: string;
  /** Talent description */
  description: string;
  /** Required talents to unlock */
  prerequisites: string[];
  /** Cost to unlock */
  cost: number;
  /** Stat bonuses granted */
  statBonuses?: Partial<Stats>;
  /** Special effects granted */
  effects?: string[];
  /** Spell unlocks */
  spellUnlocks?: string[];
}

/** Talent tree configuration */
export const TALENT_TREE: Record<string, Talent> = {
  // Combat talents
  'combat_basics': {
    id: 'combat_basics',
    name: 'Combat Training',
    description: 'Basic combat proficiency. +10% damage, +5 stamina.',
    prerequisites: [],
    cost: 1,
    statBonuses: {
      power: 0.1,
      stamina: 5
    }
  },

  'parry_mastery': {
    id: 'parry_mastery',
    name: 'Parry Mastery',
    description: 'Extended parry window and reduced stamina cost.',
    prerequisites: ['combat_basics'],
    cost: 2,
    effects: ['extended_parry', 'efficient_parry']
  },

  'riposte_expert': {
    id: 'riposte_expert',
    name: 'Riposte Expert',
    description: 'Riposte attacks deal +50% damage and have extended window.',
    prerequisites: ['parry_mastery'],
    cost: 3,
    effects: ['enhanced_riposte']
  },

  // Magic talents
  'arcane_initiate': {
    id: 'arcane_initiate',
    name: 'Arcane Initiate',
    description: 'Basic magical training. +20 focus, +10% spell damage.',
    prerequisites: [],
    cost: 1,
    statBonuses: {
      focus: 20,
      power: 0.1
    }
  },

  'elemental_affinity': {
    id: 'elemental_affinity',
    name: 'Elemental Affinity',
    description: 'Reduced focus costs and improved elemental effects.',
    prerequisites: ['arcane_initiate'],
    cost: 2,
    effects: ['efficient_casting', 'enhanced_elements']
  },

  'chain_lightning_unlock': {
    id: 'chain_lightning_unlock',
    name: 'Chain Lightning',
    description: 'Unlock the devastating Chain Lightning spell.',
    prerequisites: ['elemental_affinity'],
    cost: 3,
    spellUnlocks: ['ChainLightning']
  },

  'blink_unlock': {
    id: 'blink_unlock',
    name: 'Spatial Magic',
    description: 'Unlock Blink teleportation spell.',
    prerequisites: ['arcane_initiate'],
    cost: 2,
    spellUnlocks: ['Blink']
  },

  'ward_unlock': {
    id: 'ward_unlock',
    name: 'Protective Magic',
    description: 'Unlock Ward defensive spell.',
    prerequisites: ['arcane_initiate'],
    cost: 2,
    spellUnlocks: ['Ward']
  },

  'time_dilation_unlock': {
    id: 'time_dilation_unlock',
    name: 'Temporal Magic',
    description: 'Unlock Time Dilation spell for slow-motion effects.',
    prerequisites: ['elemental_affinity'],
    cost: 4,
    spellUnlocks: ['TimeDilation']
  },

  // Hybrid talents
  'battle_mage': {
    id: 'battle_mage',
    name: 'Battle Mage',
    description: 'Melee attacks restore focus. Spells reduce in-combat stamina costs.',
    prerequisites: ['combat_basics', 'arcane_initiate'],
    cost: 3,
    effects: ['melee_focus_restore', 'combat_casting']
  },

  'elemental_weapon': {
    id: 'elemental_weapon',
    name: 'Elemental Weapon',
    description: 'Weapon attacks apply elemental effects based on last spell cast.',
    prerequisites: ['battle_mage'],
    cost: 4,
    effects: ['weapon_enchant']
  }
};

/** Character progression state */
export interface ProgressionState {
  /** Total experience earned */
  experience: number;
  /** Available talent points */
  talentPoints: number;
  /** Unlocked talents */
  unlockedTalents: Set<string>;
  /** Known spells */
  knownSpells: Set<string>;
  /** Active effects from talents */
  activeEffects: Set<string>;
}

/** Experience thresholds for level progression */
export const EXP_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250
];

/** Calculate current level from experience */
export function getLevel(experience: number): number {
  for (let i = EXP_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = EXP_THRESHOLDS[i];
    if (threshold !== undefined && experience >= threshold) {
      return i;
    }
  }
  return 0;
}

/** Calculate talent points available at given level */
export function getTalentPoints(level: number): number {
  return Math.max(0, level - 1);
}

/** Check if talent can be unlocked */
export function canUnlockTalent(
  talentId: string,
  progression: ProgressionState
): boolean {
  const talent = TALENT_TREE[talentId];
  if (!talent) return false;
  
  // Already unlocked
  if (progression.unlockedTalents.has(talentId)) return false;
  
  // Not enough talent points
  if (progression.talentPoints < talent.cost) return false;
  
  // Prerequisites not met
  for (const prereq of talent.prerequisites) {
    if (!progression.unlockedTalents.has(prereq)) return false;
  }
  
  return true;
}
