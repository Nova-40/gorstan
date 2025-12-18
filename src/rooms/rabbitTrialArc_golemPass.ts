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
// Rabbit Trial Arc: Golem Pass (scripted boss tutorial for magic).

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

const golemPass: Room = {
  id: TRIAL_GOLEM_PASS_ID,
  zone: 'rabbitTrialArc',
  title: 'Golem Pass',
  description: [
    'The path tightens here, as if it has been measured against you and found you an acceptable width.',
  ],
  image: 'elfhameZone_faeglade.png',

  // Locked until the golem is defeated.
  exits: {
    up: TRIAL_MOUNTAIN_DESCENT_ID,
  },

  items: [],
  interactables: {},
  npcs: [],

  events: {
    onEnter: ['startGolemEncounter'],
  },

  eventHandlers: {
    startGolemEncounter: (gameState: any) => {
      // If already beaten, keep it inert.
      if (gameState?.flags?.trialGolemDefeated) {
        return null;
      }

      const updatesFlags = {
        ...gameState.flags,
        golemEncounterActive: true,
        golemBoundTurns: 0,
        golemWardActive: false,
        golemCracks: 0,
      };

      if (gameState?.flags?.golemIntroShown) {
        return {
          messages: [],
          updates: {
            flags: updatesFlags,
          },
        };
      }

      const introLines: string[] = [
        'Stone rises from stone…',
        '',
        'The golem does not roar.',
        'It does not threaten.',
        '',
        'It simply occupies the path, like a fact you were hoping to ignore.',
      ];

      return {
        messages: narrativeLines(introLines, 'trial-golem-pass'),
        updates: {
          flags: {
            ...updatesFlags,
            golemIntroShown: true,
          },
        },
      };
    },
  },
};

export default golemPass;
