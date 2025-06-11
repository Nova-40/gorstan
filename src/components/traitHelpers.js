// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// traitHelpers.js — Trait utility helpers for Gorstan engine

/**
 * playerHasTrait
 * Checks if the player has a specific trait.
 * @param {string} traitName - The trait to check for (e.g., "brave").
 * @param {Object} state - The current game state (must have traits array).
 * @returns {boolean} True if the player has the trait, false otherwise.
 *
 * Example usage:
 *   if (playerHasTrait("brave", state)) { ... }
 */
export function playerHasTrait(traitName, state) {
  // Defensive: Ensure state.traits is an array before checking
  return Array.isArray(state?.traits) && state.traits.includes(traitName);
}

/*
Review summary:
- ✅ Syntax is correct and all code blocks are closed.
- ✅ Defensive: Handles missing or invalid traits array.
- ✅ JSDoc comments for function, parameters, and usage.
- ✅ No unnecessary logic or redundant checks.
- ✅ Structure is modular and ready for integration.
- ✅ No props or React-specific logic needed here.
- ✅ Export is correct for use in Gorstan engine.
*/