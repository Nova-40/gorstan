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
// Handles NPC logic, memory, or rendering.

import { npcRegistry } from '../npcs/npcMemory';
import { pickRandom } from '../utils/random';
import type { Room } from '../types/Room';
import type { NPC } from '../types/NPCTypes';
import type { GameAction } from '../types/GameTypes';
import type { LocalGameState } from '../state/gameState';
import type { Dispatch } from 'react';


// --- Function: handleRoomEntryForWanderingNPCs ---
// Simple log throttle to avoid flooding devtools & slowing browser
let lastRoomEntryLog = 0;
let suppressedRoomEntryLogs = 0;
const LOG_INTERVAL = 4000; // ms
const MAX_WANDER_LOGS = 150; // rolling buffer cap
const wanderLogBuffer: string[] = [];
let wanderLoggingEnabled = true;

function throttledLog(tag: string, ...args: any[]) {
  const now = Date.now();
  if (!wanderLoggingEnabled) return;
  if (now - lastRoomEntryLog > LOG_INTERVAL) {
    if (suppressedRoomEntryLogs > 0) {
      // Emit one summary line for suppressed logs
      console.log(`[WANDER-THROTTLE] Suppressed ${suppressedRoomEntryLogs} verbose NPC logs`);
      suppressedRoomEntryLogs = 0;
    }
    const line = `[${tag}] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
    wanderLogBuffer.push(line);
    if (wanderLogBuffer.length > MAX_WANDER_LOGS) wanderLogBuffer.splice(0, wanderLogBuffer.length - MAX_WANDER_LOGS);
    console.log(line);
    lastRoomEntryLog = now;
  } else {
    suppressedRoomEntryLogs++;
  }
}

// Debug helpers (not part of public game API)
// eslint-disable-next-line @typescript-eslint/naming-convention
export function __getWanderLogBuffer() { return [...wanderLogBuffer]; }
// eslint-disable-next-line @typescript-eslint/naming-convention
export function __setWanderLoggingEnabled(v: boolean) { wanderLoggingEnabled = v; }

export function handleRoomEntryForWanderingNPCs(
  room: Room,
  state: LocalGameState,
  dispatch: Dispatch<GameAction>
) {
  throttledLog('handleRoomEntryForWanderingNPCs', 'room', room.id, 'registry', npcRegistry.size);
  
  const visibleNPCs: NPC[] = [];

  for (const [npcId, npc] of npcRegistry.entries()) {
    const isHere = npc.currentRoom === room.id;
    const isVisible = typeof npc.shouldBeVisible === 'function'
      ? npc.shouldBeVisible(state, room)
      : true;

    // Extremely verbose per-NPC detail removed; emit only when NPC present & visible occasionally
    if (isHere && isVisible) {
      throttledLog('NPC-PRESENCE', `${npcId} in ${room.id}`);
    }

    if (isHere && isVisible) {
      visibleNPCs.push(npc);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: `${npc.name} is here.`,
          type: 'system',
          timestamp: Date.now()
        }
      });
    }
  }

  throttledLog('handleRoomEntryForWanderingNPCs', 'visible', visibleNPCs.map(n => n.id).join(','));

  dispatch({
    type: 'SET_NPCS_IN_ROOM',
    payload: visibleNPCs
  });
}


// --- Function: wanderNPC ---
export function wanderNPC(npcId: string, state: LocalGameState) {
  const npc = npcRegistry.get(npcId) as NPC | undefined;
  const flags = state.flags;
  const roomMap = state.roomMap || {};

  if (!npc || !npc.canWander || npc.questOnly) return;

  const now = Date.now();
  if (npc.lastMoved && now - npc.lastMoved < 15000) return; // 15 second cooldown

  // Enhanced room filtering with adjacency logic
  const currentRoom = npc.currentRoom ? roomMap[npc.currentRoom] : null;
  if (!currentRoom) return;

  // Get adjacent rooms from current room's exits for realistic movement
  const adjacentRoomIds = Object.values(currentRoom.exits || {}).filter(Boolean) as string[];
  
  // Start with adjacent rooms, then expand if none available
  let validRooms = adjacentRoomIds
    .map(id => roomMap[id])
    .filter((room): room is Room => {
      if (!room || typeof room !== 'object') return false;
      return !!(
        room.id !== npc.currentRoom &&
        !room.id.includes('trap') &&
        !room.id.includes('cutscene') &&
        !room.id.includes('puzzle') &&
        !room.id.includes('boss') &&
        room.zone !== 'private'
      );
    });

  // If no adjacent rooms, fall back to zone-based movement
  if (validRooms.length === 0) {
    const biasZones: string[] = npc.biasZones || [];
    validRooms = Object.values(roomMap).filter((room): room is Room => {
      if (!room || typeof room !== 'object') return false;
      return !!(
        room.id !== npc.currentRoom &&
        !room.id.includes('trap') &&
        !room.id.includes('cutscene') &&
        !room.id.includes('puzzle') &&
        !room.id.includes('boss') &&
        room.zone !== 'private' &&
        (biasZones.length === 0 || (room.zone && biasZones.includes(room.zone)))
      );
    });
  }

  // Zone bias logic for adjacent rooms
  const biasZones: string[] = npc.biasZones || [];
  if (flags.waited && biasZones.length > 0 && validRooms.length > 1) {
    const biasRooms = validRooms.filter(r => r.zone && biasZones.includes(r.zone));
    const neutralRooms = validRooms.filter(r => r.zone && !biasZones.includes(r.zone));
    const roll = Math.random();
    validRooms = (roll < 0.7 && biasRooms.length > 0) ? biasRooms : neutralRooms;
  }

  if (!validRooms.length) return;

  // Enhanced room selection with collision detection
  let attemptCount = 0;
  const maxAttempts = 5;
  
  while (attemptCount < maxAttempts) {
    const newRoom: Room = pickRandom(validRooms);
    
    if (newRoom && newRoom.id !== npc.currentRoom) {
      // Check for room capacity (max 3 NPCs per room)
      const npcsInTargetRoom = state.npcsInRoom?.filter(n => n.currentRoom === newRoom.id) || [];
      
      if (npcsInTargetRoom.length >= 3) {
        console.log(`[WANDER] ${npc.name} cannot move to ${newRoom.id} - room at capacity (${npcsInTargetRoom.length} NPCs)`);
        
        // Remove this room from valid rooms and try again
        validRooms = validRooms.filter(r => r.id !== newRoom.id);
        attemptCount++;
        
        if (validRooms.length === 0) break;
        continue;
      }
      
      // Movement successful
      const previousRoom = npc.currentRoom;
      npc.currentRoom = newRoom.id;
      npc.lastMoved = now;
      
  throttledLog('WANDER', `${npc.name} ${previousRoom}->${newRoom.id}`);
      
      // Trigger room update if player is in the room the NPC left or entered
      if (state.currentRoomId === previousRoom || state.currentRoomId === newRoom.id) {
        // The NPC controller will handle this via evaluateWanderingNPCs flag
      }
      
      break; // Movement successful, exit loop
    }
    
    attemptCount++;
  }
  
  if (attemptCount >= maxAttempts) {
  throttledLog('WANDER', `${npc.name} no-move after ${maxAttempts}`);
  }
}


// --- Function: initializeWanderingNPCs ---
export function initializeWanderingNPCs(
  state: LocalGameState,
  dispatch: Dispatch<GameAction>
) {
  for (const [npcId, npc] of npcRegistry.entries()) {
    if ((npc as NPC).shouldWander) {
      dispatch({
        type: 'ADD_NPC',
        payload: { ...npc }
      });
    }
  }
}
