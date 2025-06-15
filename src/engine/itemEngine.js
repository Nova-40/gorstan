/**
 * File: src/engine/itemEngine.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */



// itemEngine.js – Manages item usage
import { getRoomById } from './rooms';

export function useItem(itemId, roomId) {
  const room = getRoomById(roomId);
  if (room.events?.onItemUse) {
    console.log("Triggering:", room.events.onItemUse);
  }
}
