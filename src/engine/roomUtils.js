// File: src/engine/roomUtils.js
// Gorstan Game – v3.1.0
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
//
// Utility functions for room lookup and management

/**
 * Retrieves a room object by its ID from the provided rooms array.
 * @param {string} id - The room ID to search for.
 * @param {Array} rooms - Array of room objects.
 * @returns {Object|null} The matching room or null if not found.
 */
export default function getRoomById(id, rooms) {
  if (!id || !Array.isArray(rooms)) return null;
  return rooms.find(room => room.id === id) || null;
}
