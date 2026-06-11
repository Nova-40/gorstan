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
// Core game engine module.

import MiniquestEngine from './miniquestEngine';

import roomMiniquests from '../data/roomMiniquests';

// --- Function: initializeMiniquests ---
export function initializeMiniquests(): void {
  // Variable declaration
  const engine = MiniquestEngine.getInstance();

  roomMiniquests.forEach(({ roomId, miniquests }) => {
    engine.registerRoomQuests(roomId, miniquests);
    console.log(`🎯 Registered ${miniquests.length} miniquests for room: ${roomId}`);
  });

  console.log(
    `✅ Miniquest system initialized with ${roomMiniquests.length} rooms and ${roomMiniquests.reduce(
      (total, room) => total + room.miniquests.length,
      0,
    )} total miniquests.`,
  );
}

export { MiniquestEngine };
