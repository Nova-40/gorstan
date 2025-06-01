// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// score.js — Tracks and updates player score.

/*
  This module provides a simple in-memory score tracker for the Gorstan game.
  All logic is synchronous and safe for single-session use.
*/

let score = 0;

/**
 * Returns the current player score.
 * @returns {number}
 */
export function getScore() {
  return score;
}

/**
 * Adds points to the current score.
 * @param {number} points
 */
export function addScore(points) {
  score += Number(points) || 0;
}

/**
 * Resets the score to zero.
 */
export function resetScore() {
  score = 0;
}

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ No unused or broken imports.
- ✅ Structure is clear and consistent.
- ✅ Comments clarify intent and behaviour.
- ✅ Module is ready for build and production integration.
*/