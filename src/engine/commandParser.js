// Gorstan Game Module — v3.0.0
import rooms from "./rooms";

import { listTrapRooms } from './trapSystem.js';

import { getItemDescription } from './inventory.js';

import { attemptPuzzleStep } from './puzzleEngine.js';

export function parseCommand(input, gameState, setModalContent) {
  const trimmed = input.trim().toLowerCase();

  if (trimmed === "/rooms") {
    if (!gameState.debugMode) {
      return "Access denied. Debug mode required.";
    }

    const roomList = Object.entries(rooms)
      .filter(([id]) => id !== "stantonharcourt")
      .map(([id, data]) => `• ${id} – ${data.name || "(Unnamed Room)"}`)
      .sort()
      .join("\n");

    setModalContent({
      title: "Accessible Rooms",
      content: `📜 Room List (excluding Stanton Harcourt):\n\n${roomList}`
    });

    return null;
  }

  // Add more commands as needed
  return `Unknown command: ${input}`;
}
