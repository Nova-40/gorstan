/**
 * File: src/engine/puzzleEngine.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Controls puzzle generation, validation, and rewards including Z-notation puzzles.
 */


// Gorstan Game Module — v3.0.0

// puzzleEngine.js — logic for evaluating puzzle steps and applying outcomes
import puzzles from "./puzzles";
import * as storyProgress from "./storyProgress";

export const checkPuzzle = (roomId, state) => {
  return puzzles.filter(p => p.room === roomId && !storyProgress.hasFlag(p.solvedFlag));
};

export const attemptPuzzleStep = (puzzleId, step, state, dispatch) => {
  const puzzle = puzzles.find(p => p.id === puzzleId);
  if (!puzzle || storyProgress.hasFlag(puzzle.solvedFlag)) return;

  if (!puzzle.solutionSteps.includes(step)) return;

  const itemsOK = puzzle.requiredItems?.every(item => state.inventory.includes(item)) ?? true;
  const traitsOK = puzzle.requiredTraits?.every(trait => state.traits.includes(trait)) ?? true;

  if (!itemsOK || !traitsOK) return dispatch({ type: "LOG", payload: "You lack the requirements for this action." });

  storyProgress.setFlag(puzzle.solvedFlag);

  switch (puzzle.reward.type) {
    case "unlockExit":
      dispatch({ type: "UNLOCK_EXIT", payload: { direction: puzzle.reward.direction, target: puzzle.reward.targetRoom } });
      break;
    case "gainTrait":
      dispatch({ type: "GAIN_TRAIT", payload: puzzle.reward.trait });
      break;
    default:
      break;
  }

  dispatch({ type: "LOG", payload: "Puzzle completed: " + puzzle.description });
};