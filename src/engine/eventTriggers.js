// /src/engine/eventTriggers.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Event Triggers System
// This module handles room-specific events and interactions when the player enters a room.
// It dynamically generates descriptions and hints based on the room and the player's story progression.

import { dialogueMemory } from './dialogueMemory';

// Room-specific events and descriptions
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
 * @param {string} roomName - The name of the room the player has entered.
 * @param {number} storyStage - The current stage of the story (default is 1).
 * @returns {string} - A combined description and hint for the room.
 */
export function onEnterRoom(roomName, storyStage = 1) {
  try {
    // Retrieve the base description for the room
    const baseDescription = ROOM_EVENTS[roomName]?.(storyStage) || 'You see nothing remarkable here.';

    // Retrieve an unprompted hint for the room based on the story stage
    const hint = dialogueMemory.triggerUnpromptedHint(roomName, storyStage);

    // Combine the base description and hint, filtering out any null or empty values
    return [baseDescription, hint].filter(Boolean).join(' ');
  } catch (err) {
    console.error(`❌ Error handling room entry event for "${roomName}":`, err);
    return 'An error occurred while processing the room event.';
  }
}

/**
 * Retrieves a list of all rooms with custom events.
 * @returns {Array<string>} - An array of room names with custom events.
 */
export function getEventRooms() {
  try {
    return Object.keys(ROOM_EVENTS);
  } catch (err) {
    console.error('❌ Error retrieving event rooms:', err);
    return [];
  }
}

/**
 * Checks if a room has a custom event.
 * @param {string} roomName - The name of the room to check.
 * @returns {boolean} - Whether the room has a custom event.
 */
export function hasEvent(roomName) {
  try {
    return ROOM_EVENTS.hasOwnProperty(roomName);
  } catch (err) {
    console.error(`❌ Error checking for room event for "${roomName}":`, err);
    return false;
  }
}