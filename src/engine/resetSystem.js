// File: src/engine/resetSystem.js
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Manages SPLAT and multiverse reset logic.


// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// resetSystem.js — Manages SPLAT and multiverse reset logic.

let resetCount = 0;
let isGlitched = false;
let unlockedByGorstan = false;

/**
 * Increments the reset count and returns the reset type.
 * After 7 resets, triggers a "FULL_RESET".
 * @returns {string} "SOFT_RESET" or "FULL_RESET"
 */
export function pressResetButton() {
  resetCount++;
  if (resetCount >= 7) return "FULL_RESET";
  return "SOFT_RESET";
}

/**
 * Returns the current reset count.
 * @returns {number}
 */
export function getResetCount() {
  return resetCount;
}

/**
 * Unlocks the reset system via the Gorstan keyword.
 * @returns {boolean}
 */
export function enterGorstanKeyword() {
  unlockedByGorstan = true;
  return true;
}

/**
 * Checks if the reset system has been unlocked by Gorstan.
 * @returns {boolean}
 */
export function isResetUnlocked() {
  return unlockedByGorstan;
}

/**
 * Sets the glitch effect state.
 * @param {boolean} state
 */
export function toggleGlitchEffect(state) {
  isGlitched = state;
}

/**
 * Returns the current glitch effect status.
 * @returns {boolean}
 */
export function glitchStatus() {
  return isGlitched;
}

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ No unused or broken imports.
- ✅ Structure is clear and consistent.
- ✅ Comments clarify intent and behaviour.
- ✅ Module is ready for build and production integration.
*/
