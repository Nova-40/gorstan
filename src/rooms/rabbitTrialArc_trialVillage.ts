/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Rabbit Trial Arc: Trial Village (reward through relief, not spectacle).

import type { Room } from '../types/Room';
import { TRIAL_GOLEM_PASS_ID, TRIAL_VILLAGE_ID } from '../content/rabbitTrialArc';

function narrativeLines(lines: readonly string[], baseId: string) {
  const now = Date.now();
  return lines.map((text, idx) => ({
    id: `${baseId}-${now}-${idx}`,
    text,
    type: 'narrative' as const,
    timestamp: now + idx,
  }));
}

const trialVillage: Room = {
  id: TRIAL_VILLAGE_ID,
  zone: 'rabbitTrialArc',
  title: 'Village',
  description: [
    'The air here is lived-in. It does not demand performance.',
    '',
    'Someone sits against a stone wall.',
    '',
    'Their sleeve is burned.',
    'Badly.',
    '',
    'They are very still,',
    'in the way people get when moving hurts.',
  ],
  image: 'elfhameZone_faeglade.png',

  exits: {
    up: TRIAL_GOLEM_PASS_ID,
  },

  items: [],
  interactables: {
    door: {
      description: ['A sealed door at the edge of the village.'],
      actions: ['approach', 'open', 'enter', 'examine'],
      requires: [],
    },
    injured_person: {
      description: ['Someone sitting very still against a stone wall.'],
      actions: ['look', 'help', 'leave'],
      requires: [],
    },
  },
  npcs: [],

  events: {
    onEnter: ['showTrialVillageArrival'],
  },

  eventHandlers: {
    showTrialVillageArrival: (gameState: any) => {
      if (gameState?.flags?.trialVillageArrivalShown) {
        return null;
      }

      const lines: string[] = [
        'The slope softens.',
        '',
        'Lights appear below.',
        'Small ones.',
        'Human ones.',
        '',
        'You reach the village.',
        '',
        'For the first time in a long while,',
        'the world does not try to test you.',
        '',
        'It simply… continues.',
      ];

      return {
        messages: narrativeLines(lines, 'trial-village-arrival'),
        updates: {
          flags: {
            ...gameState.flags,
            trialVillageArrivalShown: true,
            trialComplete: true,
            magicUnlocked: true,
            checkpointRoomId: TRIAL_VILLAGE_ID,
            checkpointSet: true,
            checkpointAt: Date.now(),
          },
        },
      };
    },
  },
};

export default trialVillage;
