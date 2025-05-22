// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// NPCs System – Dialogue, triggers, mood, memory, and room visibility for Gorstan NPCs.

import { characterLore } from './characters';

/**
 * Utility: Returns a trait-based response if the player has a matching trait.
 * @param {object} engine - The game engine instance.
 * @param {object} traitMap - Map of trait keys to responses.
 * @returns {string|null}
 */
function traitResponse(engine, traitMap) {
  const traits = engine?.getTraits?.() || {};
  for (const trait of Object.keys(traitMap)) {
    if (traits[trait]) {
      return traitMap[trait];
    }
  }
  return null;
}

/**
 * NPC class for Gorstan.
 * Handles dialogue, triggers, mood, memory, and room visibility.
 */
class NPC {
  constructor(name, config) {
    this.name = name;
    this.dialogues = config.dialogues || [];
    this.triggers = config.triggers || {};
    this.visibleInRooms = config.rooms || [];
    this.lore = characterLore?.[name];
    this.mood = "neutral";
    this.memory = new Set();
    this.index = 0;
    this.engine = null; // To be set by the engine if needed
  }

  setEngine(engine) {
    this.engine = engine;
  }

  /**
   * Returns a dialogue line, optionally trait-based.
   * @returns {string}
   */
  talk() {
    const traitTalk = traitResponse(this.engine, {
      hesitated: "Still thinking? That’s so you.",
      ambitious: "You have that fire in your eyes.",
      reckless: "Charging headlong into disaster again, I see."
    });
    const line = this.dialogues[this.index % this.dialogues.length];
    this.index++;
    return traitTalk ? `${this.name}: ${traitTalk}` : `${this.name}: ${line}`;
  }

  /**
   * Returns a response to a topic, optionally trait-based.
   * @param {string} topic
   * @returns {string}
   */
  ask(topic) {
    const traitHints = {
      hesitated: "You're always cautious. Asking won't make it easier.",
      ambitious: "You want more answers than I usually give.",
      reckless: "Sure, but you're probably going to ignore the warning."
    };
    const traitReply = traitResponse(this.engine, traitHints);
    if (traitReply && topic === "self") return `${this.name}: ${traitReply}`;
    if (this.name === "Polly" && this.engine?.getTraits?.().hesitated) {
      return `${this.name}: That’s classified... or maybe it isn’t. Who can say?`;
    }
    if (this.triggers[topic]) {
      return `${this.name}: ${this.triggers[topic]()}`;
    }
    return `${this.name} doesn’t want to talk about "${topic}".`;
  }

  /**
   * Scrambles a string (for glitch effects).
   * @param {string} text
   * @returns {string}
   */
  scramble(text) {
    return text
      .split(" ")
      .map(word => (Math.random() > 0.5 ? word.split("").reverse().join("") : word))
      .join(" ");
  }

  /**
   * Adjusts mood by delta.
   * @param {number} delta
   */
  affectMood(delta) {
    if (delta > 0) this.mood = "friendly";
    else if (delta < 0) this.mood = "annoyed";
  }

  /**
   * Resets dialogue index, memory, and mood.
   */
  reset() {
    this.index = 0;
    this.memory.clear();
    this.mood = "neutral";
  }

  /**
   * Checks if NPC is visible in a given room.
   * @param {string} roomId
   * @returns {boolean}
   */
  isVisible(roomId) {
    return this.visibleInRooms.includes(roomId);
  }

  /**
   * Exports memory for save/load.
   * @returns {object}
   */
  exportMemory() {
    return {
      name: this.name,
      mood: this.mood,
      memory: Array.from(this.memory),
      index: this.index
    };
  }

  /**
   * Loads memory from save.
   * @param {object} data
   */
  loadMemory(data) {
    if (!data || data.name !== this.name) return;
    this.mood = data.mood || "neutral";
    this.memory = new Set(data.memory || []);
    this.index = data.index || 0;
  }

  /**
   * Returns lore string for this NPC.
   * @returns {string}
   */
  getLore() {
    return this.lore
      ? `${this.name} appears in ${this.lore.book}: ${this.lore.description}`
      : `${this.name} has no recorded lore.`;
  }

  /**
   * Advances mood state (for time-based changes).
   */
  tick() {
    if (this.mood === "friendly") this.mood = "neutral";
    else if (this.mood === "neutral") this.mood = "annoyed";
  }
}

// Export all NPCs as a single object for easy import/use
export const NPCs = {
  Ayla: new NPC("Ayla", {
    rooms: ["controlnexus", "resetroom", "introreset"],
    dialogues: [
      "Let me guess: you’re stuck again.",
      "Still not thrown the coffee? I’m not mad. Just disappointed."
    ],
    triggers: {
      help: () => "Throw the coffee. Push the button. Don’t do both. Or do.",
      dale: () => "Dale is important. More than you know."
    }
  }),
  Morthos: new NPC("Morthos", {
    rooms: ["mazeentry", "latticeroom"],
    dialogues: [
      "There is a crack in the weave.",
      "You're following echoes, not paths."
    ],
    triggers: {
      lattice: () => "It breathes. It listens. It waits."
    }
  }),
  Al: new NPC("Al", {
    rooms: ["controlroom", "engineering"],
    dialogues: [
      "I didn’t sign up for this.",
      "It was supposed to be stable!"
    ],
    triggers: {
      dome: () => "Push once. Then forget you ever saw it."
    }
  }),
  Polly: new NPC("Polly", {
    rooms: ["mazeend", "storagechamber"],
    dialogues: [
      "You found me. Big whoop.",
      "Solving things is what you do, right?"
    ],
    triggers: {
      chef: () => "Oh yes, the chef. Totally useful, that one."
    }
  }),
  Librarian: new NPC("Librarian", {
    rooms: ["hiddenlibrary"],
    dialogues: [
      "Few know the truth. Fewer survive it.",
      "Welcome, sketch-holder."
    ],
    triggers: {
      sketch: () => "Ah. Dale’s lines run deep in you."
    }
  })
};

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Version updated to 2.4.0 and MIT license header standardized.
     - Removed unused/erroneous default export at end.
     - Improved comments and structure.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports are safe for use in engine and UI.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for traitResponse and dialogue logic.
     - Could add dynamic NPC registration for modding.
     - Could add persistence for NPC memory.
*/

// No default export; only named exports for clarity and tree-shaking.
