/**
 * File: src/engine/eventHandlers.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */



// eventHandlers.js – Functions that map to event strings
import { setFlag } from './storyProgress';

export function checkForCrownShard() {
  console.log("Looking for crown shard...");
  setFlag("foundShard");
}

export function showInnkeeper() {
  console.log("Innkeeper emerges from the shadows.");
}
