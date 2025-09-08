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

import type { Room } from '../types/Room';
import { roomRegistry } from '../roomRegistry';
// Import authored room data (JSON). tsconfig should have resolveJsonModule enabled.
// If not, enable it in tsconfig. We defensively type as any then normalise.
// rooms.json uses "enterText" – we map that to "description" expected elsewhere.
// This ensures curated content overrides placeholder proxy rooms.
 
// @ts-ignore - allow json import typing fallback
import roomsData from '../data/rooms.json';

let mergedCache: Record<string, Room> | null = null;

function normaliseRoom(raw: any): Room {
  if (!raw) {return raw;}
  const room: any = { ...raw };
  if (!room.description && room.enterText) {
    room.description = room.enterText; // Preserve authored text for history display
  }
  return room as Room;
}

// Utility function to get all rooms as an object (authored rooms override placeholders)
export function getAllRoomsAsObject(): Record<string, Room> {
  if (mergedCache) {return mergedCache;}

  const authored: Record<string, any> = roomsData as Record<string, any>;
  const merged: Record<string, Room> = { ...roomRegistry } as Record<string, Room>;

  for (const [id, raw] of Object.entries(authored)) {
    const room = normaliseRoom(raw);
    merged[id] = room;
    // Populate proxy backing store so direct property access returns authored content
    (roomRegistry as any)[id] = room;
  }

  mergedCache = merged;
  return merged;
}
