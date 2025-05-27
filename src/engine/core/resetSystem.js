// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: resetSystem.js – v2.4.1

// MIT License © 2025 Geoff Webster
// Gorstan Game v2.4.x
// resetSystem.js – Manages multiverse resets and cycle counts

let resetCount = 0;
let isGlitched = false;
let unlockedByGorstan = false;

export function pressResetButton() {
  resetCount++;
  if (resetCount >= 7) return "FULL_RESET";
  return "SOFT_RESET";
}

export function getResetCount() {
  return resetCount;
}

export function enterGorstanKeyword() {
  unlockedByGorstan = true;
  return true;
}

export function isResetUnlocked() {
  return unlockedByGorstan;
}

export function toggleGlitchEffect(state) {
  isGlitched = state;
}

export function glitchStatus() {
  return isGlitched;
}
