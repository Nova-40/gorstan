// /src/engine/puzzles.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// This module defines the puzzles in the Gorstan game world.
// Each puzzle includes a description, logic for solving it, and consequences for success or failure.

import { hasItem, addItem, removeItem } from './inventory';

let briefcaseAttemptsLeft = 2; // Tracks remaining attempts for the briefcase puzzle

export const puzzles = {
  /**
   * Briefcase Puzzle
   * A logic puzzle involving three figures: Al, Polly, and Morthos.
   * The player must deduce who tells the truth and who lies.
   */
  briefcasePuzzle: {
    description: 'You find a briefcase with an intricate lock. Three figures are etched on it: Al, Polly, and Morthos. Solve who tells the truth and who lies.',
    options: [
      'Al: Truth, Polly: Lie, Morthos: Truth',
      'Al: Lie, Polly: Truth, Morthos: Lie',
      'Al: Truth, Polly: Truth, Morthos: Lie',
      'Al: Lie, Polly: Lie, Morthos: Truth',
    ],
    solve: (selectedOption) => {
      try {
        const correctAnswer = 'Al: Truth, Polly: Lie, Morthos: Truth';

        if (selectedOption === correctAnswer) {
          removeItem('briefcase');
          addItem('medallion', { description: 'An ancient medallion, humming with power.' });
          briefcaseAttemptsLeft = 2; // Reset attempts for future replays
          return 'The lock clicks open! The briefcase dissolves into a glowing medallion.';
        } else {
          briefcaseAttemptsLeft--;
          if (briefcaseAttemptsLeft <= 0) {
            briefcaseAttemptsLeft = 2; // Reset attempts for future replays
            return 'You have failed to unlock the briefcase. A trapdoor opens and you fall back to the Crossing.';
          }
          return `That combination seems wrong. You have ${briefcaseAttemptsLeft} attempt(s) left.`;
        }
      } catch (err) {
        console.error('❌ Error solving briefcase puzzle:', err);
        return 'An error occurred while solving the briefcase puzzle.';
      }
    },
  },

  /**
   * Hidden Library Access Puzzle
   * The player must present the correct item to gain access to the hidden library.
   */
  hiddenLibraryAccess: {
    description: 'A secret librarian watches you closely.',
    solve: () => {
      try {
        if (hasItem('greasyNapkin')) {
          return 'The librarian nods solemnly and allows you to enter.';
        }
        return 'The librarian eyes you suspiciously. You seem unworthy.';
      } catch (err) {
        console.error('❌ Error solving hidden library access puzzle:', err);
        return 'An error occurred while interacting with the librarian.';
      }
    },
  },

  /**
   * Truth Teller Puzzle
   * The player must choose between two guardians: one always tells the truth, the other always lies.
   */
  truthTellerPuzzle: {
    description: 'You face two guardians: one always tells the truth, one always lies. Choose wisely.',
    solve: (choice) => {
      try {
        if (choice.toLowerCase() === 'left') {
          return 'You chose correctly and the path opens!';
        }
        return 'A trapdoor opens beneath you. Perhaps the other one was truthful?';
      } catch (err) {
        console.error('❌ Error solving truth teller puzzle:', err);
        return 'An error occurred while solving the truth teller puzzle.';
      }
    },
  },

  /**
   * Liar Puzzle
   * The player must deduce the correct password by thinking like a liar.
   */
  liarPuzzle: {
    description: 'A lone guard who always lies blocks your way. What is the correct password?',
    solve: (password) => {
      try {
        if (password.toLowerCase() === 'wrongpassword') {
          return 'Because the guard always lies, you gave the "wrong" password — and he lets you pass!';
        }
        return 'The guard sneers and blocks your way. Think like a liar!';
      } catch (err) {
        console.error('❌ Error solving liar puzzle:', err);
        return 'An error occurred while solving the liar puzzle.';
      }
    },
  },

  /**
   * Mixed Puzzle
   * The player must deduce which of three figures (truth-teller, liar, alternator) to trust.
   */
  mixedPuzzle: {
    description: 'Three figures: one tells truth, one lies, and one alternates. Ask wisely.',
    solve: (chosenOne) => {
      try {
        if (chosenOne.toLowerCase() === 'middle') {
          return 'The middle figure smirks but steps aside. You must have deduced their game!';
        }
        return 'Confusion reigns — the figure misleads you into a maze of mirrors.';
      } catch (err) {
        console.error('❌ Error solving mixed puzzle:', err);
        return 'An error occurred while solving the mixed puzzle.';
      }
    },
  },

  /**
   * Paradox Puzzle
   * The player must respond to a paradoxical question to unlock a secret path.
   */
  paradoxPuzzle: {
    description: 'A strange voice asks: "If I say I am lying, am I telling the truth?"',
    solve: (response) => {
      try {
        if (response.toLowerCase() === 'paradox') {
          return 'The voice chuckles: "You understand." A secret path appears!';
        }
        return 'The voice sighs: "You are not ready." The path remains hidden.';
      } catch (err) {
        console.error('❌ Error solving paradox puzzle:', err);
        return 'An error occurred while solving the paradox puzzle.';
      }
    },
  },
};

