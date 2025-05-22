// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// Event Triggers System
// Handles room-specific events and interactions when the player enters a room.
// Dynamically generates descriptions and hints based on the room and the player's story progression.

import { dialogueMemory } from './dialogueMemory';

/**
 * ROOM_EVENTS maps room names to functions that return a description string.
 * Functions can use the storyStage argument for dynamic descriptions.
 */
const ROOM_EVENTS = {
  'Reset Room': (storyStage) => {
    if (storyStage >= 2) {
      return 'A sign in your handwriting reads: "Do not push this button." The dome pulses faintly.';
    }
    return 'The dome hums quietly. A blue button pulses at the centre.';
  },
  'Library of the Nine': () => 'Rows of books whisper as if they remember your name.',
  'storagechamber': () => 'Dust swirls. Copies of Gorstan and weathered books line the walls. Something about this place feels watched.',
  'Hidden Aevira Lab': () => 'You feel static cling to your skin. Something was left unfinished here.',
  'Burger Joint': () => 'The smell of fried oil hangs in the air. The chef eyes you from the back.',
  'greasystoreroom': () => 'Stacks of old packaging and a suspicious napkin sit beside a leaking fridge.',
  'Findlaters Café Office': () => 'A quiet hum of refrigeration and stale coffee. Someone left in a hurry.',
  'Pollysbay': () => 'You step onto cracked tiles. The walls flicker with projection static. This is not a seaside bay, no matter what the appearance is. This place is too clean.',
  'Control Room': () => 'Panels blink erratically. Something behind the console feels... aware.',
  'Crossing': () => 'This place doesn’t belong to any one timeline. It watches you pass.',
  'Trent Park London': () => 'Crows circle overhead. The gatehouse feels more guarded than usual.',
  'Observation Deck': () => 'You peer through reinforced glass. The stars are wrong.',
  "Rhiannon's Chamber": () => 'Glyphs pulse across the walls. A mirror in the centre shows not your reflection, but possibilities.',
  "The Arbiter's Core": () => 'A silence here cuts deep. Something dormant... judges.',
};

/**
 * Handles events triggered when the player enters a room.
 * Returns a combined description and hint for the room.
 * Defensive: All errors are trapped and reported.
 *
 * @param {string} roomName - The name of the room the player has entered.
 * @param {number} storyStage - The current stage of the story (default is 1).
 * @returns {string} - A combined description and hint for the room.
 */
export function onEnterRoom(roomName, storyStage = 1) {
  try {
    if (typeof roomName !== "string" || !roomName.trim()) {
      throw new Error("Invalid or missing roomName.");
    }
    if (typeof storyStage !== "number" || isNaN(storyStage)) {
      storyStage = 1;
    }
    // Retrieve the base description for the room
    const baseDescription = ROOM_EVENTS[roomName]?.(storyStage) || 'You see nothing remarkable here.';
    // Retrieve an unprompted hint for the room based on the story stage
    let hint = null;
    if (dialogueMemory && typeof dialogueMemory.triggerUnpromptedHint === "function") {
      hint = dialogueMemory.triggerUnpromptedHint(roomName, storyStage);
    }
    // Combine the base description and hint, filtering out any null or empty values
    return [baseDescription, hint].filter(Boolean).join(' ');
  } catch (err) {
    console.error(`❌ eventTriggers: Error handling room entry event for "${roomName}":`, err);
    return 'An error occurred while processing the room event.';
  }
}

/**
 * Retrieves a list of all rooms with custom events.
 * Defensive: All errors are trapped and reported.
 * @returns {Array<string>} - An array of room names with custom events.
 */
export function getEventRooms() {
  try {
    return Object.keys(ROOM_EVENTS);
  } catch (err) {
    console.error('❌ eventTriggers: Error retrieving event rooms:', err);
    return [];
  }
}

/**
 * Checks if a room has a custom event.
 * Defensive: All errors are trapped and reported.
 * @param {string} roomName - The name of the room to check.
 * @returns {boolean} - Whether the room has a custom event.
 */
export function hasEvent(roomName) {
  try {
    if (typeof roomName !== "string" || !roomName.trim()) return false;
    return Object.prototype.hasOwnProperty.call(ROOM_EVENTS, roomName);
  } catch (err) {
    console.error(`❌ eventTriggers: Error checking for room event for "${roomName}":`, err);
    return false;
  }
}

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Version updated to 2.4.0 and MIT license header standardized.
     - Removed unused export of baseDescription (not defined in this scope).
     - Improved comments and structure.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports are safe for use in engine and UI.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for event/hint logic.
     - Could allow dynamic registration of room events for modding.
*/

// No default export; only named exports for clarity and tree-shaking.
