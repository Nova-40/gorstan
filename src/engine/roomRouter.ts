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
// Room navigation and teleportation utilities


import { teleportManager } from '../services/teleportManager';
import { getRoom } from '../core/rooms/roomsLoader';
import type { TeleportOptions, TeleportOverlay } from '../domain/types';
import { getGameDispatch } from '../utils/dispatchAccess';
import { pushConsoleMessage } from '../utils/consoleTools';

/**
 * Teleport player to a specified room
 * @param roomId - The ID of the room to teleport to
 */

export async function teleportToRoom(roomId: string): Promise<void> {
  const room = getRoom(roomId as any) as any;
  const overlay: TeleportOverlay = room?.zone === 'glitch' ? 'fractal' : 'trek';
  const ok = await teleportManager.go(roomId, { overlay } as TeleportOptions);
  const dispatch = getGameDispatch?.();
  if (ok && dispatch) dispatch({ type: 'MOVE_TO_ROOM', payload: roomId });
  else pushConsoleMessage('Teleport failed. Try again.', 'error');
}


/**
 * Navigate to a room with transition effects
 * @param roomId - The ID of the room to navigate to
 * @param transitionType - Type of transition effect
 */
export function navigateToRoom(roomId: string, _transitionType: 'instant' | 'fade' | 'slide' = 'instant'): void {
  teleportToRoom(roomId);
}

/**
 * Check if a room ID is valid
 * @param roomId - The room ID to validate
 * @returns Whether the room ID is valid
 */
export function isValidRoom(roomId: string): boolean {
  // Basic validation - room IDs should be non-empty strings
  return typeof roomId === 'string' && roomId.length > 0;
}