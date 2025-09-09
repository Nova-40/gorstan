/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Core enumerations for combat and magic systems
*/

export enum Element {
  Physical = 'Physical',
  Fire = 'Fire',
  Frost = 'Frost',
  Shock = 'Shock',
  Poison = 'Poison',
  Light = 'Light',
  Void = 'Void',
}

export enum ActionType {
  LightAttack = 'LightAttack',
  HeavyAttack = 'HeavyAttack',
  Dodge = 'Dodge',
  Parry = 'Parry',
  Cast = 'Cast',
  Blink = 'Blink',
  Riposte = 'Riposte',
}

export enum StatusType {
  Burn = 'Burn',
  Chill = 'Chill',
  Frozen = 'Frozen',
  Shock = 'Shock',
  Wet = 'Wet',
  Oil = 'Oil',
  Stagger = 'Stagger',
  Riposte = 'Riposte',
  Ward = 'Ward',
  IFrames = 'IFrames',
  ParryWindow = 'ParryWindow',
  Overdrive = 'Overdrive',
}

export enum CombatState {
  Idle = 'Idle',
  Windup = 'Windup',
  Active = 'Active',
  Recovery = 'Recovery',
  Staggered = 'Staggered',
  Channeling = 'Channeling',
}

export enum AIArchetype {
  Brute = 'Brute',
  Skirmisher = 'Skirmisher',
  Caster = 'Caster',
}

export enum Faction {
  Player = 'player',
  Enemy = 'enemy',
  Neutral = 'neutral',
}
