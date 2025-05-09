// /src/engine/dialogueMemory.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Dialogue Memory System
// This module tracks NPC interactions and provides dynamic responses based on interaction history.
// It ensures NPC dialogue evolves as the player progresses through the game.

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
      if (!this.npcMemory[npcName]) {
        this.npcMemory[npcName] = 0;
      }
      this.npcMemory[npcName]++;
      console.log(`[DialogueMemory] Interaction recorded for NPC: ${npcName}. Total interactions: ${this.npcMemory[npcName]}`);
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
      if (!this.hintMemory[roomName]) {
        this.hintMemory[roomName] = [];
      }
      if (!this.hintMemory[roomName].includes(storyStage)) {
        this.hintMemory[roomName].push(storyStage);
        console.log(`[DialogueMemory] Hint recorded for room: ${roomName} at story stage: ${storyStage}`);
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
}

export const dialogueMemory = new DialogueMemory();