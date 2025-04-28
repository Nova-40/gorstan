// /src/engine/puzzles.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0
// src/engine/puzzles.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { hasItem, addItem, removeItem } from './inventory';

let briefcaseAttemptsLeft = 2;

export const puzzles = {
  briefcasePuzzle: {
    description: 'You find a briefcase with an intricate lock. Three figures are etched on it: Al, Polly, and Morthos. Solve who tells the truth and who lies.',
    options: [
      'Al: Truth, Polly: Lie, Morthos: Truth',
      'Al: Lie, Polly: Truth, Morthos: Lie',
      'Al: Truth, Polly: Truth, Morthos: Lie',
      'Al: Lie, Polly: Lie, Morthos: Truth'
    ],
    solve: (selectedOption) => {
      const correctAnswer = 'Al: Truth, Polly: Lie, Morthos: Truth';

      if (selectedOption === correctAnswer) {
        removeItem('briefcase');
        addItem('medallion', { description: 'An ancient medallion, humming with power.' });
        briefcaseAttemptsLeft = 2; // Reset for future safety
        return 'The lock clicks open! The briefcase dissolves into a glowing medallion.';
      } else {
        briefcaseAttemptsLeft--;
        if (briefcaseAttemptsLeft <= 0) {
          briefcaseAttemptsLeft = 2; // Reset for future replays
          return 'You have failed to unlock the briefcase. A trapdoor opens and you fall back to the Crossing.';
        }
        return `That combination seems wrong. You have ${briefcaseAttemptsLeft} attempt(s) left.`;
      }
    }
  },

  hiddenLibraryAccess: {
    description: 'A secret librarian watches you closely.',
    solve: () => {
      if (hasItem('greasyNapkin')) {
        return 'The librarian nods solemnly and allows you to enter.';
      }
      return 'The librarian eyes you suspiciously. You seem unworthy.';
    },
  },

  truthTellerPuzzle: {
    description: 'You face two guardians: one always tells the truth, one always lies. Choose wisely.',
    solve: (choice) => {
      if (choice.toLowerCase() === 'left') {
        return 'You chose correctly and the path opens!';
      }
      return 'A trapdoor opens beneath you. Perhaps the other one was truthful?';
    },
  },

  liarPuzzle: {
    description: 'A lone guard who always lies blocks your way. What is the correct password?',
    solve: (password) => {
      if (password.toLowerCase() === 'wrongpassword') {
        return 'Because the guard always lies, you gave the "wrong" password — and he lets you pass!';
      }
      return 'The guard sneers and blocks your way. Think like a liar!';
    },
  },

  mixedPuzzle: {
    description: 'Three figures: one tells truth, one lies, and one alternates. Ask wisely.',
    solve: (chosenOne) => {
      if (chosenOne.toLowerCase() === 'middle') {
        return 'The middle figure smirks but steps aside. You must have deduced their game!';
      }
      return 'Confusion reigns — the figure misleads you into a maze of mirrors.';
    },
  },

  paradoxPuzzle: {
    description: 'A strange voice asks: "If I say I am lying, am I telling the truth?"',
    solve: (response) => {
      if (response.toLowerCase() === 'paradox') {
        return 'The voice chuckles: "You understand." A secret path appears!';
      }
      return 'The voice sighs: "You are not ready." The path remains hidden.';
    },
  },
};

