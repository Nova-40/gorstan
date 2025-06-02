// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// achievements.js — Tracks earned feats for replayability

/**
 * List of all possible achievements in Gorstan.
 * Each achievement has:
 *  - id: Unique string identifier.
 *  - description: Human-readable description.
 *  - condition: Function that takes game state and returns true if earned.
 * @type {Array<{id: string, description: string, condition: function(Object): boolean}>}
 */
const achievements = [
  {
    id: "no_ayla",
    description: "Complete the game without asking Ayla once.",
    condition: (state) => !state.aylaUsed
  },
  {
    id: "puzzle_master",
    description: "Solve 5 or more puzzles in one run.",
    condition: (state) => state.puzzlesSolved >= 5
  },
  {
    id: "trait_collector",
    description: "Unlock 5 traits in a single playthrough.",
    condition: (state) => Array.isArray(state.traits) && state.traits.length >= 5
  }
];

/**
 * Returns an array of achievements earned in the current game state.
 * @param {Object} state - The current game state.
 * @returns {Array<{id: string, description: string}>} Array of earned achievements.
 */
export const getEarnedAchievements = (state) => {
  if (!state || typeof state !== "object") {
    // Defensive: If state is missing or invalid, return empty array and warn.
    // eslint-disable-next-line no-console
    console.warn("getEarnedAchievements: Invalid or missing state object.");
    return [];
  }
  return achievements.filter(a => {
    try {
      return typeof a.condition === "function" && a.condition(state);
    } catch (err) {
      // Defensive: log error but don't break UI
      // eslint-disable-next-line no-console
      console.error(`Achievement "${a.id}" condition check failed:`, err);
      return false;
    }
  });
};

/**
 * Returns all defined achievements (for display or debugging).
 * @returns {Array<{id: string, description: string}>}
 */
export const getAllAchievements = () =>
  achievements.map(({ id, description }) => ({ id, description }));

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for all functions, parameters, and returns.
- ✅ Defensive error handling for invalid state and condition errors.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Add achievement unlock sound or animation in UI for feedback.
*/
