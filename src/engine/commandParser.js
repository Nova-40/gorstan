/**
 * File: src/engine/commandParser.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */



// commandParser.js – Parses player commands
import { getRoomById } from './rooms';

export function parseCommand(command, playerState) {
  const currentRoom = getRoomById(playerState.currentRoomId);

  if (command === "look") {
    return currentRoom.description.join(" ");
  }

  if (command === "north" && currentRoom.exits.north) {
    return { moveTo: currentRoom.exits.north };
  }

  return "Nothing happens.";
}
