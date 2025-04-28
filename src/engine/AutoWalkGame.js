// /src/engine/AutoWalkGame.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { rooms } from './rooms';

export function autoWalkGame(game) {
  console.log('--- Auto-walk Starting ---');

  let currentRoom = 'crossing';
  const visited = new Set();
  const preferredOrder = ['north', 'east', 'south', 'west', 'down', 'up'];

  while (currentRoom && !visited.has(currentRoom)) {
    const room = rooms[currentRoom];

    if (!room) {
      console.error(`Error: Room "${currentRoom}" does not exist.`);
      break;
    }

    console.log(`Currently in: ${currentRoom}`);
    visited.add(currentRoom);

    const exits = Object.entries(room.exits);
    if (exits.length === 0) {
      console.log(`No exits found in room "${currentRoom}". End of auto-walk.`);
      break;
    }

    // Find the next move based on the preferred order
    const nextMove = preferredOrder
      .map((direction) => exits.find(([dir]) => dir === direction && !visited.has(exits.find(([d]) => d === dir)?.[1])))
      .find((exit) => exit);

    if (!nextMove) {
      console.log('No unvisited preferred exits. End of auto-walk.');
      break;
    }

    const [dir, nextRoom] = nextMove;
    console.log(`Moving ${dir.toUpperCase()} to ${nextRoom}`);
    currentRoom = nextRoom;
  }

  console.log('--- Auto-walk Finished ---');
}
