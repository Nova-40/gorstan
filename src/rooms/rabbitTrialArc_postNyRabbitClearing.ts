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
// Rabbit Trial Arc: post-NY rabbit clearing cutscene room.

import { Room } from '../types/Room';
import { POST_NY_RABBIT_CLEARING_ID } from '../content/rabbitTrialArc';

const postNyRabbitClearing: Room = {
  id: POST_NY_RABBIT_CLEARING_ID,
  zone: 'rabbitTrialArc',
  title: 'A Clearing',
  description: [
    'The city noise is gone. Trees press in on all sides, and the air feels held—like a breath that refuses to leave.',
  ],
  // Reuse an existing glade image until bespoke art is added.
  image: 'elfhameZone_faeglade.png',

  exits: {
    // No meaningful exits while the cutscene is active; after completion we transition automatically.
    south: 'centralpark',
  },

  items: [],
  interactables: {},
  npcs: [],

  events: {
    onEnter: ['startRabbitCutscene'],
  },

  eventHandlers: {
    startRabbitCutscene: (gameState: any) => {
      if (gameState?.flags?.rabbit_cutscene_complete) {
        return null;
      }
      return {
        messages: [],
        updates: {
          flags: {
            rabbit_cutscene_active: true,
            cutscene_input_locked: true,
          },
        },
      };
    },
  },
};

export default postNyRabbitClearing;
