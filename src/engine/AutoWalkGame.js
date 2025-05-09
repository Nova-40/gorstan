// /src/engine/AutoWalkGame.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Auto-Walk System
// This module automates the player's movement through the game world, exploring rooms in a preferred order.
// It ensures that all accessible rooms are visited without revisiting previously explored locations.

import { rooms } from './rooms';

/**
 * Automatically navigates through the game world, exploring rooms in a preferred order.
 * @param {object} game - The game state object.
 */
export function autoWalkGame(game = {}) {
  try {
    console.log('--- Auto-walk Starting ---');

    // Validate game state and set defaults
    const currentRoom = game.currentRoom || 'crossing'; // Start from the current room or default to 'crossing'
    const visited = new Set(); // Tracks visited rooms to avoid revisiting
    const preferredOrder = ['north', 'east', 'south', 'west', 'down', 'up']; // Preferred order of movement
    const maxIterations = 100; // Safeguard against infinite loops
    let iterationCount = 0;

    let roomToVisit = currentRoom;

    while (roomToVisit && !visited.has(roomToVisit)) {
      iterationCount++;
      if (iterationCount > maxIterations) {
        console.error('❌ Error: Maximum iteration limit reached. Terminating auto-walk.');
        break;
      }

      const room = rooms[roomToVisit];

      // Handle invalid room scenarios
      if (!room) {
        console.error(`❌ Error: Room "${roomToVisit}" does not exist.`);
        break;
      }

      console.log(`Currently in: ${roomToVisit}`);
      visited.add(roomToVisit); // Mark the current room as visited

      const exits = room.exits && typeof room.exits === 'object' ? Object.entries(room.exits) : [];
      if (exits.length === 0) {
        console.log(`No exits found in room "${roomToVisit}". End of auto-walk.`);
        break;
      }

      // Find the next move based on the preferred order
      const nextMove = preferredOrder
        .map((direction) => exits.find(([dir, nextRoom]) => dir === direction && !visited.has(nextRoom)))
        .find((exit) => exit);

      if (!nextMove) {
        console.log('No unvisited preferred exits. End of auto-walk.');
        break;
      }

      const [dir, nextRoom] = nextMove;
      console.log(`Moving ${dir.toUpperCase()} to ${nextRoom}`);
      roomToVisit = nextRoom;

      // Trigger room entry events
      const roomDescription = game.onEnterRoom
        ? game.onEnterRoom(roomToVisit, game.storyStage || 1)
        : `You enter ${roomToVisit}.`;
      console.log(roomDescription);
    }

    console.log('--- Auto-walk Finished ---');
  } catch (err) {
    console.error('❌ Error during auto-walk:', err.message);
    console.log('Auto-walk terminated due to an error.');
  }
}