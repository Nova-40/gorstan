/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Combat encounter definitions
*/

import { Encounter } from '../types/combat';
import { AIArchetype, Element } from '../types/enums';

/** Tutorial encounter: Parry basics */
export function tutorialParry(): Encounter {
  return {
    id: 'tutorial_parry',
    name: 'Parry Training',
    description: 'Learn the timing of perfect parries against a practice dummy.',
    enemies: [
      {
        id: 'training_dummy',
        name: 'Training Dummy',
        stats: {
          maxHP: 50,
          armor: 2,
          power: 0.5,
          crit: 0,
          critMult: 1.0,
          poise: 30,
          poiseRegen: 10,
          stamina: 100,
          focus: 0,
          resists: {},
        },
        archetype: AIArchetype.Brute.toString(),
        position: { x: 0, y: 0 },
      },
    ],
    victory: (actors) => {
      const enemies = actors.filter((a) => a.faction === 'enemy');
      return enemies.every((e) => e.hp <= 0);
    },
    defeat: (actors) => {
      const player = actors.find((a) => a.faction === 'player');
      return !player || player.hp <= 0;
    },
  };
}

/** Tutorial encounter: Elemental synergies */
export function tutorialSynergy(): Encounter {
  return {
    id: 'tutorial_synergy',
    name: 'Elemental Mastery',
    description: 'Practice combining elements for devastating effects.',
    enemies: [
      {
        id: 'water_elemental',
        name: 'Water Elemental',
        stats: {
          maxHP: 40,
          armor: 1,
          power: 0.7,
          crit: 0.05,
          critMult: 1.2,
          poise: 40,
          poiseRegen: 15,
          stamina: 80,
          focus: 40,
          resists: {
            [Element.Frost]: 0.5,
            [Element.Fire]: -0.3,
          },
        },
        archetype: AIArchetype.Skirmisher.toString(),
        position: { x: -1, y: 0 },
      },
      {
        id: 'fire_sprite',
        name: 'Fire Sprite',
        stats: {
          maxHP: 30,
          armor: 0,
          power: 0.8,
          crit: 0.1,
          critMult: 1.4,
          poise: 25,
          poiseRegen: 20,
          stamina: 60,
          focus: 50,
          resists: {
            [Element.Fire]: 0.8,
            [Element.Frost]: -0.5,
          },
        },
        archetype: AIArchetype.Caster.toString(),
        position: { x: 1, y: 0 },
      },
    ],
    victory: (actors) => {
      const enemies = actors.filter((a) => a.faction === 'enemy');
      return enemies.every((e) => e.hp <= 0);
    },
    defeat: (actors) => {
      const player = actors.find((a) => a.faction === 'player');
      return !player || player.hp <= 0;
    },
  };
}

/** Mini-boss encounter: Aevira Warden */
export function miniBossWarden(): Encounter {
  return {
    id: 'aevira_warden',
    name: 'Aevira Warden',
    description: 'A powerful guardian with Ward magic that drains fastest under Shock.',
    enemies: [
      {
        id: 'aevira_warden',
        name: 'Aevira Warden',
        stats: {
          maxHP: 150,
          armor: 8,
          power: 1.2,
          crit: 0.08,
          critMult: 1.8,
          poise: 120,
          poiseRegen: 25,
          stamina: 120,
          focus: 80,
          resists: {
            [Element.Physical]: 0.2,
            [Element.Fire]: 0.1,
            [Element.Frost]: 0.1,
            [Element.Shock]: -0.2, // Vulnerable to shock
          },
        },
        archetype: AIArchetype.Caster.toString(),
        position: { x: 0, y: 0 },
      },
    ],
    victory: (actors) => {
      const warden = actors.find((a) => a.id === 'aevira_warden');
      return !warden || warden.hp <= 0;
    },
    defeat: (actors) => {
      const player = actors.find((a) => a.faction === 'player');
      return !player || player.hp <= 0;
    },
  };
}

/** Get encounter by ID */
export function getEncounter(id: string): Encounter | null {
  switch (id) {
    case 'tutorial_parry':
      return tutorialParry();
    case 'tutorial_synergy':
      return tutorialSynergy();
    case 'aevira_warden':
      return miniBossWarden();
    default:
      return null;
  }
}

/** List all available encounters */
export function listEncounters(): string[] {
  return ['tutorial_parry', 'tutorial_synergy', 'aevira_warden'];
}
