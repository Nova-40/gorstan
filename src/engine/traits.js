// Gorstan Game Module — v3.0.0
// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// traits.js — Defines all traits, their effects, and unlock logic

/**
 * Gorstan trait definitions.
 * Each trait includes:
 *  - name: Display name of the trait.
 *  - description: What the trait does for the player.
 *  - unlockCondition: Function that returns true if the trait should be unlocked for the given state.
 *  - hidden: (optional) If true, trait is not shown until unlocked.
 */
const traits = [
  {
    name: "Curious",
    description: "You see more than others. Hints occasionally reveal themselves.",
    /**
     * Unlocks after visiting 10 or more rooms.
     * @param {object} state - The current player/game state.
     * @returns {boolean}
     */
    unlockCondition: (state) => state.roomsVisited >= 10
  },
  {
    name: "Ambitious",
    description: "You're driven. You score bonus points for key actions.",
    /**
     * Unlocks after reaching a score of 100 or more.
     * @param {object} state
     * @returns {boolean}
     */
    unlockCondition: (state) => state.score >= 100
  },
  {
    name: "Seeker",
    description: "You seek deeper truths. You can access hidden dimensions.",
    /**
     * Unlocks if both Curious and Ambitious traits are present.
     * @param {object} state
     * @returns {boolean}
     */
    unlockCondition: (state) =>
      Array.isArray(state.traits) &&
      state.traits.includes("Curious") &&
      state.traits.includes("Ambitious")
  },
  {
    name: "Defiant",
    description: "You resist the rules. Some paths now reveal themselves.",
    hidden: true,
    /**
     * Unlocks after 3+ resets and if player has not followed instructions.
     * @param {object} state
     * @returns {boolean}
     */
    unlockCondition: (state) =>
      state.resetCount >= 3 && !state.followedInstructions
  }
];

/**
 * Returns all defined traits.
 * @returns {Array}
 */
export function getAllTraits() {
  return traits;
}

/**
 * Returns all unlocked trait names for a given state.
 * @param {object} state - The current player/game state.
 * @returns {Array<string>}
 */
export function getUnlockedTraits(state) {
  if (!state) return [];
  return traits
    .filter(trait => typeof trait.unlockCondition === "function" && trait.unlockCondition(state))
    .map(trait => trait.name);
}

/**
 * Returns the trait object by name.
 * @param {string} name
 * @returns {object|undefined}
 */
export function getTraitByName(name) {
  return traits.find(trait => trait.name === name);
}

export default traits;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ No unused imports or dead code.
- ✅ JSDoc comments for all functions, parameters, and trait logic.
- ✅ Defensive handling for state and trait lookups.
- ✅ Structure is modular and ready for integration.
- ✅ No UI code in this module (logic only).
*/