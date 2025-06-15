/**
 * File: src/components/items.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */


// Gorstan Game Module — v3.0.0
export const firstAidKit = {
  id: "firstAidKit",
  name: "First Aid Kit",
  description: "A small red case with gauze, tape, and antiseptic. Limited uses.",
  uses: 3,
  heal: { health: 25, mood: 5 },
};

export const morthosCrown = {
  id: "morthosCrown",
  name: "Morthos' Crown",
  description: "A mysterious crown that absorbs part of incoming harm.",
  passiveEffect: { absorb: 0.25 },
};

// Ensure syntax correctness — close all JSX blocks properly and avoid misplaced tokens (e.g., unmatched braces or unclosed return blocks).

// Improve effectiveness and efficiency — simplify conditional logic and avoid redundant checks where possible.

// Check and enhance commentary — ensure JSDoc or inline comments clearly explain logic for hasCoffee, roomHasItem, and dispatch actions.

// Wire this module properly into the Gorstan game engine:

// Ensure props like state, currentRoom, and dispatch are passed and validated

// Add QuickActions.propTypes after function closure

// Export the component correctly