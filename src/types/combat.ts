/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Core combat type definitions
*/

import { Element, StatusType, CombatState, Faction } from './enums';

/** Resistance mapping for damage calculation */
export type ResistMap = Partial<Record<Element, number>>;

/** Core entity statistics */
export interface Stats {
  /** Maximum health points */
  maxHP: number;
  /** Damage reduction from armor */
  armor: number;
  /** Base damage multiplier */
  power: number;
  /** Critical hit chance (0-1) */
  crit: number;
  /** Critical hit damage multiplier */
  critMult: number;
  /** Posture/poise stability */
  poise: number;
  /** Poise regeneration per second */
  poiseRegen: number;
  /** Maximum stamina for physical actions */
  stamina: number;
  /** Maximum focus for magical actions */
  focus: number;
  /** Elemental resistances */
  resists: ResistMap;
}

/** Damage calculation input */
export interface DamagePacket {
  /** Base damage amount */
  base: number;
  /** Damage element type */
  element: Element;
  /** Whether this is a critical hit */
  crit?: boolean;
  /** Source entity identifier */
  sourceId: string;
  /** Additional damage tags for special calculations */
  tags?: string[];
}

/** Status effect definition */
export interface Status {
  /** Unique status identifier */
  id: StatusType;
  /** Number of stacks (for stackable effects) */
  stacks?: number;
  /** Duration in milliseconds */
  durationMs: number;
  /** Tick callback for DoT effects */
  onTick?: (actor: Actor) => void;
  /** Applied callback */
  onApply?: (actor: Actor) => void;
  /** Removal callback */
  onRemove?: (actor: Actor) => void;
  /** Custom data for status-specific logic */
  data?: Record<string, any>;
}

/** Combat entity */
export interface Actor {
  /** Unique actor identifier */
  id: string;
  /** Display name */
  name: string;
  /** Base statistics */
  stats: Stats;
  /** Current health */
  hp: number;
  /** Current stamina */
  stamina: number;
  /** Current focus */
  focus: number;
  /** Tension for special abilities */
  tension: number;
  /** Current poise/posture */
  poise: number;
  /** Active status effects */
  statuses: Status[];
  /** Combat allegiance */
  faction: Faction;
  /** Current combat state */
  state: CombatState;
  /** Position for targeting */
  position?: { x: number; y: number };
  /** Additional runtime data */
  data?: Record<string, any>;
}

/** Combat action definition */
export interface CombatAction {
  /** Action identifier */
  id: string;
  /** Resource costs */
  costs: {
    stamina?: number;
    focus?: number;
    tension?: number;
  };
  /** Timing windows in milliseconds */
  timing: {
    windup: number;
    active: number;
    recovery: number;
  };
  /** Damage configuration */
  damage?: DamagePacket;
  /** Effects to apply */
  effects?: Partial<Status>[];
  /** Cancel windows for combos */
  cancelWindows?: number[];
}

/** Spell definition */
export interface Spell {
  /** Spell identifier */
  id: string;
  /** Display name */
  name: string;
  /** Focus cost */
  focusCost: number;
  /** Cooldown in milliseconds */
  cooldownMs: number;
  /** Casting configuration */
  cast: {
    windupMs: number;
    channelMs?: number;
    recoveryMs: number;
  };
  /** Spell effect callback */
  execute: (caster: Actor, target?: Actor) => void;
  /** Whether spell requires a target */
  requiresTarget: boolean;
  /** Spell description */
  description: string;
}

/** AI behavior configuration */
export interface AIBehavior {
  /** Behavior identifier */
  id: string;
  /** Utility scoring function */
  score: (actor: Actor, target?: Actor) => number;
  /** Action execution */
  execute: (actor: Actor, target?: Actor) => void;
  /** Cooldown tracking */
  lastUsed: number;
  /** Minimum cooldown between uses */
  cooldownMs: number;
}

/** Combat encounter configuration */
export interface Encounter {
  /** Encounter identifier */
  id: string;
  /** Display name */
  name: string;
  /** Enemy spawn configuration */
  enemies: Array<{
    id: string;
    name: string;
    stats: Stats;
    archetype: string;
    position?: { x: number; y: number };
  }>;
  /** Victory conditions */
  victory: (actors: Actor[]) => boolean;
  /** Defeat conditions */
  defeat: (actors: Actor[]) => boolean;
  /** Encounter description */
  description: string;
}

/** Global combat system state */
export interface CombatSystemState {
  /** Whether combat is currently active */
  inCombat: boolean;
  /** Player actor data */
  player: Actor | null;
  /** Array of enemy actors */
  enemies: Actor[];
  /** Current combat round */
  round: number;
  /** Action queue for turn resolution */
  actionQueue: Array<{
    actor: Actor;
    action: CombatAction;
    targetId?: string;
    queueTime: number;
  }>;
  /** Current encounter name */
  encounterName?: string;
  /** Combat victory/defeat state */
  combatResult?: 'victory' | 'defeat' | null;
}
