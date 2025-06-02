// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// endings.js — Defines game endings based on traits, flags, score

/**
 * List of all possible game endings.
 * Each ending has:
 *  - id: Unique string identifier.
 *  - conditions: Function that takes game state and returns true if ending is met.
 *  - description: Human-readable ending description.
 * @type {Array<{id: string, conditions: function(Object): boolean, description: string}>}
 */
const endings = [
  {
    id: "ascend",
    conditions: (state) =>
      Array.isArray(state?.traits) &&
      state.traits.includes("Awakened") &&
      typeof state.score === "number" &&
      state.score >= 300,
    description: "You transcend the lattice, becoming a ripple in the quantum sea."
  },
  {
    id: "rebel",
    conditions: (state) =>
      Array.isArray(state?.traits) &&
      state.traits.includes("Defiant") &&
      Array.isArray(state?.flags) &&
      state.flags.includes("trapEvasionComplete"),
    description: "You defied the dome and lived to tell the tale."
  },
  {
    id: "lost",
    conditions: (state) =>
      typeof state.resetCount === "number" &&
      state.resetCount >= 7 &&
      typeof state.score === "number" &&
      state.score < 0,
    description: "You fell into the multiverse again and again... until nothing was left."
  }
];

/**
 * Checks the current game state for a matching ending.
 * Returns the first ending whose conditions are met, or null if none.
 * @param {Object} state - The current game state.
 * @returns {{id: string, description: string}|null} The ending object or null.
 */
export const checkEnding = (state) => {
  if (!state || typeof state !== "object") {
    // Defensive: Invalid or missing state
    // eslint-disable-next-line no-console
    console.warn("checkEnding: Invalid or missing state object.");
    return null;
  }
  const result = endings.find(end => {
    try {
      return typeof end.conditions === "function" && end.conditions(state);
    } catch (err) {
      // Defensive: log error but don't break UI
      // eslint-disable-next-line no-console
      console.error(`Ending "${end.id}" condition check failed:`, err);
      return false;
    }
  });
  return result || null;
};

/**
 * Returns all defined endings (for display or debugging).
 * @returns {Array<{id: string, description: string}>}
 */
export const getAllEndings = () =>
  endings.map(({ id, description }) => ({ id, description }));

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for all functions, parameters, and returns.
- ✅ Defensive error handling for invalid state and condition errors.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Add more endings or dynamic descriptions for richer narrative feedback.
*/
