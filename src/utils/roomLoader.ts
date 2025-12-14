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
// Renders room descriptions and image logic.

import roomRegistry from '../rooms/roomRegistry';

import type { Room } from '../types/Room';
import type { RoomItem, RoomNPC } from '../types/Room';

type RoomId = string;

interface RoomDefinition {
  id: string;
  title: string;
  description: string | string[];
  image: string;
  exits?: Record<string, string>;
  items?: string[];
  npcs?: string[];
}

// Variable declaration
const roomMap = new Map<RoomId, RoomDefinition>();

// --- Function: isValidRoomId ---
function isValidRoomId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && /^[a-z0-9_-]+$/i.test(id);
}

// --- Function: validateRoomSchema ---
function validateRoomSchema(room: unknown): room is RoomDefinition {
  if (!room || typeof room !== 'object') return false;
  const r = room as Record<string, unknown>;
  if (typeof r.id !== 'string') return false;
  if (typeof r.title !== 'string') return false;
  if (!(typeof r.description === 'string' || Array.isArray(r.description))) return false;
  if (typeof r.image !== 'string') return false;
  return true;
}

// --- Function: isNonEmptyString ---
function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// --- Function: initializeRooms ---
function initializeRooms(): void {
  console.log('[roomLoader] Initializing rooms...');
  console.log('[roomLoader] roomRegistry keys:', Object.keys(roomRegistry));

  for (const [, roomEntry] of Object.entries(roomRegistry)) {
    const candidate = roomEntry as unknown;
    if (!validateRoomSchema(candidate)) {
      console.warn('[roomLoader] Skipping invalid room entry in registry:', candidate);
      continue;
    }

    const r = candidate as RoomDefinition;
    const roomId = r.id;

    if (!isValidRoomId(roomId)) {
      console.warn(`[roomLoader] Invalid room ID format: ${roomId}`);
      continue;
    }

    if (roomMap.has(roomId)) {
      console.warn(`[roomLoader] Duplicate room ID detected: ${roomId}. Overwriting.`);
    }

    roomMap.set(roomId, r);
  }

  console.log(`[roomLoader] Initialized ${roomMap.size} rooms`);
  if (roomMap.size === 0) {
    console.error('[roomLoader] No rooms were loaded! This is a critical error.');
  }
}

initializeRooms();

// --- Function: loadRoomById ---
export function loadRoomById(id: string): RoomDefinition | null {
  // Variable declaration
  const room = roomMap.get(id as RoomId) || null;
  if (!room) {
    console.warn(
      `[roomLoader] Room transition failed: Room '${id}' does not exist. Falling back to 'controlnexus'.`,
    );
  }
  return room;
}

// --- Function: validateRooms ---
export function validateRooms(): string[] {
  const warnings: string[] = [];

  for (const [id, room] of Object.entries(roomRegistry)) {
    if (!validateRoomSchema(room)) {
      warnings.push(`Room ${id} failed schema validation`);
    }
    if (!room.title || !isNonEmptyString(room.title)) {
      warnings.push(`Room ${id} is missing a valid title`);
    }
    if (!room.image || !isNonEmptyString(room.image)) {
      warnings.push(`Room ${id} is missing a valid image path`);
    }
  }

  return warnings;
}

// --- Function: getAllRoomsAsObject ---
export function getAllRoomsAsObject(): Record<string, Room> {
  console.log('[roomLoader] getAllRoomsAsObject called, roomMap size:', roomMap.size);

  if (roomMap.size === 0) {
    console.error('[roomLoader] roomMap is empty! Attempting to reinitialize...');
    initializeRooms();
  }

  const obj: Record<string, Room> = {};
  for (const [id, room] of roomMap.entries()) {
    const base = room as RoomDefinition & Record<string, unknown>;
    const zoneVal = typeof base.zone === 'string' ? (base.zone as string) : '';
    const flagsVal = base.flags && typeof base.flags === 'object' ? (base.flags as Record<string, unknown>) : {};
    const roomsVal = Array.isArray(base.rooms) ? (base.rooms as unknown[]) : [];

    const items: RoomItem[] = Array.isArray(base.items)
      ? (base.items as unknown[]).filter((it): it is RoomItem => typeof it === 'object' || typeof it === 'string') as RoomItem[]
      : [];

    const npcs: RoomNPC[] = Array.isArray(base.npcs)
      ? (base.npcs as unknown[]).map((npc) => {
          if (typeof npc === 'string') return { id: npc } as RoomNPC;
          if (npc && typeof npc === 'object' && typeof (npc as any).id === 'string') return npc as RoomNPC;
          return { id: 'unknown' } as RoomNPC;
        })
      : [];

    obj[id] = {
      ...room,
      description: Array.isArray(room.description) ? room.description.join('\n') : room.description,
      zone: zoneVal,
      flags: flagsVal,
      exits: room.exits ?? {},
      items,
      npcs,
      rooms: roomsVal,
    } as unknown as Room;
  }

  console.log('[roomLoader] Returning', Object.keys(obj).length, 'rooms');
  return obj;
}
