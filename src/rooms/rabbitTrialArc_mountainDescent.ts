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
// Rabbit Trial Arc: Mountain Descent setup.

import type { Room } from '../types/Room';
import { TRIAL_GOLEM_PASS_ID, TRIAL_MOUNTAIN_DESCENT_ID } from '../content/rabbitTrialArc';

function narrativeLines(lines: readonly string[], baseId: string) {
  const now = Date.now();
  return lines.map((text, idx) => ({
    id: `${baseId}-${now}-${idx}`,
    text,
    type: 'narrative' as const,
    timestamp: now + idx,
  }));
}

const mountainDescent: Room = {
  id: TRIAL_MOUNTAIN_DESCENT_ID,
  zone: 'rabbitTrialArc',
  title: 'Mountain Descent',
  description: [
    'The air thins as you descend. The path is narrow, but it insists on being taken.',
  ],
  image: 'elfhameZone_faeglade.png',

  exits: {
    down: TRIAL_GOLEM_PASS_ID,
    up: 'RABBIT_TRIAL_01_GATE',
  },

  items: [],
  interactables: {},
  npcs: [],

  events: {
    onEnter: ['showDescentSetup'],
  },

  eventHandlers: {
    showDescentSetup: (gameState: any) => {
      if (gameState?.flags?.trialMountainDescentIntroShown) {
        return null;
      }

      const lines: string[] = [
        'The mountain path narrows.',
        'Stone underfoot. Stone overhead.',
        'The artefact is quiet.',
        'That feels… temporary.',
      ];

      if (gameState?.flags?.magicCommandSeen !== true) {
        lines.push('Your hands feel capable of something you haven’t named.');
      }

      return {
        messages: narrativeLines(lines, 'trial-mountain-descent'),
        updates: {
          flags: {
            ...gameState.flags,
            trialMountainDescentIntroShown: true,
          },
        },
      };
    },
  },
};

export default mountainDescent;
