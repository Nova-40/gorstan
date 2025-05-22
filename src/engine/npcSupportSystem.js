// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// npcSupportSystem.js – Gorstan NPC Memory & Dialogue Engine
// Handles NPC mood, memory, and dialogue cycling for dynamic interactions.

import { storyProgress } from './storyProgress';
import { inventory } from './inventory';

/**
 * NPCMemoryEngine
 * Tracks NPC mood, memory, and dialogue cycling.
 * Provides methods for updating mood, remembering facts, and retrieving dialogue.
 */
class NPCMemoryEngine {
  constructor() {
    this.npcStates = {};
  }

  /**
   * Initializes an NPC's memory state if not already present.
   * @param {string} id - NPC identifier.
   * @param {object} config - NPC configuration (dialogues, etc).
   */
  initNPC(id, config = {}) {
    if (!this.npcStates[id]) {
      this.npcStates[id] = {
        mood: "neutral",
        memory: new Set(),
        config,
        visits: 0
      };
    }
  }

  /**
   * Updates the mood of an NPC.
   * @param {string} id - NPC identifier.
   * @param {number} delta - Mood change (+ for friendly, - for annoyed, 0 for neutral).
   */
  updateMood(id, delta) {
    if (!this.npcStates[id]) return;
    const npc = this.npcStates[id];
    if (delta > 0) npc.mood = "friendly";
    else if (delta < 0) npc.mood = "annoyed";
    else npc.mood = "neutral";
  }

  /**
   * Records a fact or topic the NPC has heard.
   * @param {string} id - NPC identifier.
   * @param {string} fact - Fact or topic.
   */
  remember(id, fact) {
    if (!this.npcStates[id]) return;
    this.npcStates[id].memory.add(fact);
  }

  /**
   * Checks if the NPC has heard a specific fact.
   * @param {string} id - NPC identifier.
   * @param {string} fact - Fact or topic.
   * @returns {boolean}
   */
  hasHeard(id, fact) {
    return this.npcStates[id]?.memory?.has(fact) || false;
  }

  /**
   * Increments the visit count for an NPC.
   * @param {string} id - NPC identifier.
   */
  visit(id) {
    if (!this.npcStates[id]) return;
    this.npcStates[id].visits += 1;
  }

  /**
   * Gets the current mood of an NPC.
   * @param {string} id - NPC identifier.
   * @returns {string}
   */
  getMood(id) {
    return this.npcStates[id]?.mood || "unknown";
  }

  /**
   * Retrieves the current dialogue line for an NPC based on mood and visit count.
   * @param {string} id - NPC identifier.
   * @param {object} context - Optional context for dialogue.
   * @returns {string}
   */
  getDialogue(id, context = {}) {
    const npc = this.npcStates[id];
    if (!npc) return `❌ ${id} has no memory profile.`;
    const lines = npc.config.dialogues || [];
    if (lines.length === 0) return `${id} is silent.`;
    const mood = npc.mood;
    const index = npc.visits % lines.length;
    if (mood === "annoyed") return `😠 ${id} grumbles: ${lines[index]}`;
    if (mood === "friendly") return `😊 ${id} smiles: ${lines[index]}`;
    return `${id}: ${lines[index]}`;
  }

  /**
   * Retrieves summary info about an NPC's memory state.
   * @param {string} id - NPC identifier.
   * @returns {object|string}
   */
  getNPCInfo(id) {
    const npc = this.npcStates[id];
    if (!npc) return "❌ No data.";
    return {
      mood: npc.mood,
      facts: Array.from(npc.memory),
      visits: npc.visits
    };
  }

  /**
   * Resets all NPC memory states (for debugging, testing, or new game).
   */
  resetAll() {
    for (const id in this.npcStates) {
      this.npcStates[id].mood = "neutral";
      this.npcStates[id].memory.clear();
      this.npcStates[id].visits = 0;
    }
  }
}

// Export a singleton instance for use throughout the game
export const npcMemoryEngine = new NPCMemoryEngine();

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Removed unused/invalid default export at the end.
     - Ensured only named export of npcMemoryEngine.
     - Improved comments and structure.
     - Updated version to 2.4.0 and MIT license header.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports singleton for use in engine and UI.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for memory and dialogue cycling.
     - Could add persistence to localStorage if needed.
     - Could allow dynamic NPC registration.
*/

// No default export; only named exports for clarity and tree-shaking.
