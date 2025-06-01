// Gorstan Game — v2.8.0
// eventTriggers.js
// Handles room-based, item-based, and input-based triggers

import storyProgress from "./storyProgress";
import { getRoomById } from "./rooms";

/**
 * Runs when the player enters a room.
 * Applies context-specific updates.
 *
 * @param {string} roomId - Room ID entered
 * @param {object} gameState - Player's current state
 * @returns {object} - Partial game state update
 */
export function onEnterRoom(roomId, gameState = {}) {
  const updates = {};

  const traits = new Set(gameState.traits || []);
  let score = gameState.score || 0;

  switch (roomId) {
    case "resetroom":
      traits.add("defiant");
      break;
    case "interrogationbay":
      if (storyProgress.morthosDebt) {
        traits.add("deceiver");
        score += 10;
      }
      break;
    case "hiddenlab":
      if (!traits.has("observer")) {
        traits.add("observer");
        score += 5;
      }
      break;
    default:
      break;
  }

  updates.traits = Array.from(traits);
  updates.score = score;
  return updates;
}

/**
 * Runs when an item is used.
 * Determines dynamic outcomes.
 *
 * @param {string} itemId - ID of the item used
 * @param {string} roomId - Current room
 * @param {object} gameState
 * @returns {object} updates - Modifications to game state
 */
export function onItemUse(itemId, roomId, gameState = {}) {
  const updates = {};
  const traits = new Set(gameState.traits || []);
  let score = gameState.score || 0;

  if (itemId === "briefcase" && roomId === "quantumlattice") {
    traits.add("keyholder");
    score += 25;
  }

  if (itemId === "napkin" && roomId === "hiddenlibrary") {
    traits.add("architect");
    score += 10;
  }

  updates.traits = Array.from(traits);
  updates.score = score;
  return updates;
}

/**
 * Triggered when the player says something.
 * Phrase-based Easter egg or narrative logic.
 *
 * @param {string} phrase
 * @param {string} roomId
 * @returns {object|null} update or narrative response
 */
export function onSay(phrase, roomId) {
  const lowered = phrase.toLowerCase();

  if (roomId === "resetroom" && lowered.includes("gorstan")) {
    return {
      narrative: "⚡ The dome flickers. A soft voice echoes: 'Your defiance is noted.'",
      traits: ["awakened"],
      score: 50,
    };
  }

  if (roomId === "controlroom" && lowered.includes("ayla")) {
    return {
      narrative: "A soft ping. Ayla's avatar lights up on a nearby screen.",
    };
  }

  return null;
}
