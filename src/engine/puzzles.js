/**
 * File: src/engine/puzzles.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */


// Gorstan Game Module — v3.0.0

// puzzles.js — defines all puzzles in the game

const puzzles = [
  {
    id: "unlockSecretLab",
    room: "controlroom",
    description: "A hidden panel with a biometric lock. There's a faint humming behind it.",
    requiredItems: ["foldedNote", "faeCrownShard"],
    requiredTraits: ["Curious"],
    solutionSteps: ["scan note", "insert shard"],
    solvedFlag: "secretLabUnlocked",
    reward: {
      type: "unlockExit",
      direction: "east",
      targetRoom: "secretlab"
    }
  },
  {
    id: "quantumAlignment",
    room: "quantumlattice",
    description: "A glowing lattice with rotating sigils. Something about it resonates.",
    requiredTraits: ["Seeker"],
    solutionSteps: ["align sigils", "whisper passphrase"],
    solvedFlag: "latticeAligned",
    reward: {
      type: "gainTrait",
      trait: "Awakened"
    }
  }
];

export default puzzles;