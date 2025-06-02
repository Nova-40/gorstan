// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// dialogueEngine.js — Handles NPC dialogue with memory, mood, and topic parsing

/**
 * Central state for all NPCs' dialogue, mood, trust, and history.
 * @type {Object.<string, {mood: number, trust: number, history: Array, responses: Array}>}
 */
const npcState = {};

/**
 * Gets or initializes the state object for a given NPC.
 * @param {string} npcId - The NPC's unique identifier.
 * @returns {Object} The NPC's state object.
 */
export const getNPCState = (npcId) => {
  if (!npcId || typeof npcId !== "string") {
    // eslint-disable-next-line no-console
    console.warn("getNPCState: Invalid npcId provided.");
    return null;
  }
  if (!npcState[npcId]) {
    npcState[npcId] = {
      mood: 0,
      trust: 0,
      history: [],
      responses: []
    };
  }
  return npcState[npcId];
};

/**
 * Handles dialogue input for an NPC, updating mood, trust, and history.
 * Returns a reply and updated mood/trust.
 * @param {string} npcId - The NPC's unique identifier.
 * @param {string} input - The player's input/question.
 * @param {Object} playerState - The current player state (flags, etc).
 * @returns {{reply: string, mood: number, trust: number}}
 */
export const handleDialogue = (npcId, input, playerState) => {
  const state = getNPCState(npcId);
  if (!state || typeof input !== "string") {
    // Defensive: fallback for invalid state or input
    return {
      reply: "The NPC stares blankly, unable to respond.",
      mood: 0,
      trust: 0
    };
  }

  // Clean and parse input for topic extraction
  const cleanInput = input.trim().toLowerCase();
  const keywords = cleanInput.split(" ");
  // Extract topic: after "about" or last word
  const topic = keywords.includes("about")
    ? keywords[keywords.indexOf("about") + 1] || ""
    : keywords[keywords.length - 1];

  let reply = "I don't have much to say about that.";

  // === NPC-specific dialogue logic ===
  if (npcId === "morthos") {
    if (topic === "coffee") {
      reply = state.trust > 1
        ? "Ah, the sacred brew. You're learning."
        : "You may not be ready for what the coffee reveals.";
    } else if (topic === "dale") {
      reply = playerState?.flags?.daleSeen
        ? "He's been through here. But not unchanged."
        : "Dale? The name stirs something, but I can't place it.";
    }
  }
  // TODO: Add more NPCs and topic logic here as Gorstan expands

  // Mood increases if player is persistent (history > 5)
  if (state.history.length > 5) {
    state.mood++;
  }

  // If mood is high, append annoyance
  if (state.mood >= 3) {
    reply += " (Morthos looks annoyed by your persistence.)";
  }

  // Record interaction in history and responses
  state.history.push({ input, reply });
  state.responses.push(reply);

  return {
    reply,
    mood: state.mood,
    trust: state.trust
  };
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for all functions, parameters, and returns.
- ✅ Defensive error handling for invalid input/state.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Expand NPC/topic logic and add more nuanced mood/trust systems.
*/
