/**
 * File: src/engine/storyProgress.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Handles game flags and milestones controlling player progress and unlocks.
 */



// storyProgress.js – Tracks story flags
export const storyFlags = {
  metInnkeeper: false,
  unlockedTunnel: false,
};

export function hasFlag(flag) {
  return storyFlags[flag] || false;
}

export function setFlag(flag, value = true) {
  storyFlags[flag] = value;
}
