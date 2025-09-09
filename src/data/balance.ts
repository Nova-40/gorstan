/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Balance configuration for combat and magic systems
*/

import { Element } from '../types/enums';

export const BALANCE = {
  /** Stamina costs for physical actions */
  staminaCosts: {
    light: 8,
    heavy: 20,
    dodge: 15,
    parry: 10,
    blink: 12,
  },

  /** Focus costs for magical actions */
  focusCosts: {
    FireBolt: 10,
    FrostNova: 18,
    ChainLightning: 22,
    Ward: 16,
    TimeDilation: 25,
    Blink: 15,
  },

  /** Base damage values */
  baseDamage: {
    light: 10,
    heavy: 22,
    FireBolt: 24,
    FrostNova: 16,
    ChainLightning: 18,
    riposte: 35,
  },

  /** Poise damage values */
  poiseDamage: {
    light: 8,
    heavy: 25,
    riposte: 40,
    parryBreaker: 60,
  },

  /** Status effect configuration */
  status: {
    burnPerTick: 3,
    burnMs: 4000,
    chillSlow: 0.12,
    freezeStacks: 3,
    freezeMs: 2000,
    shockArcTargets: 2,
    overloadBonus: 0.5,
    staggerMs: 1500,
    riposteWindowMs: 1000,
    wardAbsorb: 50,
  },

  /** Critical hit configuration */
  crit: {
    chance: 0.12,
    mult: 1.6,
  },

  /** Timing windows in milliseconds */
  timing: {
    parryWindow: 200,
    dodgeIFrames: 180,
    riposteWindow: 1000,
    comboWindow: 400,
  },

  /** Resource regeneration rates (per second) */
  regen: {
    stamina: 25,
    focus: 12,
    poise: 20,
    tensionDecay: 10,
  },

  /** Resistance calculations */
  resistance: {
    armorReduction: 0.02, // 2% per armor point
    maxReduction: 0.8, // 80% max damage reduction
    elementalBase: 0.1, // 10% base elemental resistance
  },

  /** Global tuning multiplier */
  global: {
    TUNING_MULTIPLIER: 1.0,
  },
};

/** Elemental interaction matrix */
export const ELEMENTAL_INTERACTIONS = {
  [Element.Fire]: {
    weakness: [Element.Frost],
    strength: [Element.Physical],
    synergy: {
      oil: 'Conflagration', // Ground DoT
      shock: 'Plasma', // Increased damage
    },
  },
  [Element.Frost]: {
    weakness: [Element.Fire],
    strength: [Element.Shock],
    synergy: {
      wet: 'Freeze', // Instant freeze
      shock: 'Brittle', // Increased crit
    },
  },
  [Element.Shock]: {
    weakness: [Element.Physical],
    strength: [Element.Frost],
    synergy: {
      wet: 'Overload', // AoE damage
      fire: 'Plasma', // Increased damage
    },
  },
};

/** AI behavior weights */
export const AI_WEIGHTS = {
  distance: {
    optimal: 2.0,
    tooClose: -1.0,
    tooFar: -0.5,
  },
  health: {
    critical: 2.0, // Below 25%
    low: 1.5, // Below 50%
    healthy: 1.0,
  },
  cooldown: {
    ready: 1.0,
    cooling: 0.1,
  },
  playerState: {
    staggered: 3.0,
    casting: 2.0,
    riposte: -2.0,
    warded: 0.5,
  },
};
