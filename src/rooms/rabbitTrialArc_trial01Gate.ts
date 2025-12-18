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
// Rabbit Trial Arc: placeholder first trial gate.

import { Room } from '../types/Room';
import { RABBIT_TRIAL_01_GATE_ID } from '../content/rabbitTrialArc';

const trial01Gate: Room = {
  id: RABBIT_TRIAL_01_GATE_ID,
  zone: 'rabbitTrialArc',
  title: 'The First Gate',
  description: [
    'The clearing gives way to a narrow path. Ahead: a simple gate that looks too old to matter—and too exact to ignore.',
  ],
  image: 'elfhameZone_faeglade.png',

  exits: {
    // For now, allow the player to back out.
    south: 'POST_NY_RABBIT_CLEARING',
  },

  items: [],
  interactables: {},
  npcs: [],
};

export default trial01Gate;
