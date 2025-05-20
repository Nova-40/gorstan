// Gorstan v2.2.2 – All modules validated and standardized
// /src/engine/dialogueMemory.js
// MIT License Copyright (c) 2025 Geoff Webster
// Dialogue Memory System
// Tracks NPC interactions and provides dynamic responses based on interaction history.
// Ensures NPC dialogue evolves as the player progresses through the game.
import { npcs } from './npcs';
// Constants for special responses
const SPECIAL_RESPONSES = {
  polly: {
    threshold: 3,
    response: 'Polly sighs. "Fine. Maybe I do know a shortcut... or maybe I don\'t."',
  },
  ayla: {
    threshold: 5,
    response: 'Ayla grins. "You\'re really determined. I like that."',
  },
};
// Constants for unprompted hints
const UNPROMPTED_HINTS = {
  'Control Room': {
    2: 'A faint hum grows louder. Something here is waiting for you.',
  },
  'Library of the Nine': {
    3: 'The books seem to whisper secrets. Perhaps you should listen.',
  },
};
class DialogueMemory {
  constructor() {
    this.npcMemory = {}; // Tracks the number of interactions with each NPC
    this.hintMemory = {}; // Tracks unprompted hints for specific rooms
  }
  /**
   * Records an interaction with an NPC.
   * @param {string} npcName - The name of the NPC.
   */
  recordInteraction(npcName) {
    try {
      if (typeof npcName !== "string" || !npcName.trim()) {
        throw new Error("Invalid NPC name for interaction.");
      }
      if (!this.npcMemory[npcName]) {
        this.npcMemory[npcName] = 0;
      }
      this.npcMemory[npcName]++;
      // Optionally, integrate with NPC module for analytics or achievements
      if (npcs && typeof npcs.onInteraction === "function") {
        try {
          npcs.onInteraction(npcName, this.npcMemory[npcName]);
        } catch (err) {
          // Defensive: don't let analytics break the game
          console.warn(`[DialogueMemory] npcs.onInteraction failed for ${npcName}:`, err);
        }
      }
    } catch (err) {
      console.error('❌ Error recording interaction with NPC:', err);
    }
  }
  /**
   * Retrieves the number of interactions with an NPC.
   * @param {string} npcName - The name of the NPC.
   * @returns {number} - The number of interactions with the NPC.
   */
  getInteractionCount(npcName) {
    try {
      if (typeof npcName !== "string" || !npcName.trim()) return 0;
      return this.npcMemory[npcName] || 0;
    } catch (err) {
      console.error('❌ Error retrieving interaction count for NPC:', err);
      return 0;
    }
  }
  /**
   * Provides a special response based on the interaction count with an NPC.
   * @param {string} npcName - The name of the NPC.
   * @returns {string|null} - A special response or null if no special response is available.
   */
  specialResponse(npcName) {
    try {
      if (typeof npcName !== "string" || !npcName.trim()) return null;
      const count = this.getInteractionCount(npcName);
      const npcResponse = SPECIAL_RESPONSES[npcName];
      if (npcResponse && count >= npcResponse.threshold) {
        return npcResponse.response;
      }
      return null;
    } catch (err) {
      console.error('❌ Error generating special response for NPC:', err);
      return null;
    }
  }
  /**
   * Records an unprompted hint for a specific room.
   * @param {string} roomName - The name of the room.
   * @param {number} storyStage - The current stage of the story.
   */
  recordUnpromptedHint(roomName, storyStage) {
    try {
      if (typeof roomName !== "string" || !roomName.trim()) {
        throw new Error("Invalid room name for hint.");
      }
      if (typeof storyStage !== "number" || isNaN(storyStage)) {
        throw new Error("Invalid story stage for hint.");
      }
      if (!this.hintMemory[roomName]) {
        this.hintMemory[roomName] = [];
      }
      if (!this.hintMemory[roomName].includes(storyStage)) {
        this.hintMemory[roomName].push(storyStage);
      }
    } catch (err) {
      console.error('❌ Error recording unprompted hint:', err);
    }
  }
  /**
   * Retrieves an unprompted hint for a specific room based on the story stage.
   * @param {string} roomName - The name of the room.
   * @param {number} storyStage - The current stage of the story.
   * @returns {string|null} - A hint or null if no hint is available.
   */
  triggerUnpromptedHint(roomName, storyStage) {
    try {
      if (typeof roomName !== "string" || !roomName.trim()) return null;
      if (typeof storyStage !== "number" || isNaN(storyStage)) return null;
      const roomHints = UNPROMPTED_HINTS[roomName];
      if (roomHints && roomHints[storyStage]) {
        this.recordUnpromptedHint(roomName, storyStage);
        return roomHints[storyStage];
      }
      return null;
    } catch (err) {
      console.error('❌ Error triggering unprompted hint:', err);
      return null;
    }
  }
  /**
   * Retrieves all recorded interactions for debugging or analytics.
   * @returns {object} - A summary of all NPC interactions and room hints.
   */
  getMemorySummary() {
    try {
      return {
        npcMemory: { ...this.npcMemory },
        hintMemory: { ...this.hintMemory },
      };
    } catch (err) {
      console.error('❌ Error retrieving memory summary:', err);
      return {};
    }
  }
  /**
   * Resets all memory (for debugging, testing, or new game).
   */
  resetMemory() {
    try {
      this.npcMemory = {};
      this.hintMemory = {};
    } catch (err) {
      console.error('❌ Error resetting dialogue memory:', err);
    }
  }
}
// Export a singleton instance for use throughout the game
export const dialogueMemory = new DialogueMemory();
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Defensive: Added type checks for all input parameters.
  - All syntax validated and ready for use in the Gorstan game.
  - Comments improved for maintainability and clarity.
  - Module is correctly wired for import and use in the game engine and UI.
*/
