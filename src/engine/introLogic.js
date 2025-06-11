// Gorstan Game Module — v3.0.0
// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// introLogic.js — Handles transitions from intro choices: Jump, Wait, Sip Coffee

/**
 * Handles the "jump" intro action.
 * @param {object} currentState - The current game state.
 * @returns {object} The updated state after jumping.
 */
export const handleJump = (currentState) => {
  return {
    ...currentState,
    room: "room9",
    score: (currentState.score || 0) + 10,
    inventory: [...(currentState.inventory || []), "coffee"],
    log: "Player jumped into the portal. Score +10. Coffee added."
  };
};

/**
 * Handles the "wait" intro action.
 * Removes coffee from inventory and penalizes score.
 * @param {object} currentState - The current game state.
 * @returns {object} The updated state after waiting.
 */
export const handleWait = (currentState) => {
  const updatedInventory = (currentState.inventory || []).filter(item => item !== "coffee");
  return {
    ...currentState,
    room: "introReset",
    score: (currentState.score || 0) - 10,
    inventory: updatedInventory,
    log: "Player waited and got SPLAT. Score -10. Coffee lost."
  };
};

/**
 * Handles the "sip" intro action.
 * Only applies once per session (idempotent via flags.hasSipped).
 * @param {object} currentState - The current game state.
 * @returns {object} The updated state after sipping coffee.
 */
export const handleSip = (currentState) => {
  // Prevents multiple sips from stacking effects
  if (currentState.flags?.hasSipped) {
    return {
      ...currentState,
      log: "Sip Coffee already used — no changes applied."
    };
  }

  return {
    ...currentState,
    room: "room21", // quantumlattice room
    score: (currentState.score || 0) + 40,
    inventory: [...(currentState.inventory || []), "coffee"],
    flags: { ...currentState.flags, hasSipped: true },
    log: "Player sipped coffee and glimpsed quantum truth. Score +40. Room set to quantumlattice."
  };
};

/**
 * Returns the result of an intro action, delegating to the correct handler.
 * @param {string} action - The intro action ("jump", "wait", "sip").
 * @param {object} currentState - The current game state.
 * @returns {object} The updated state after the action.
 */
export const getIntroResult = (action, currentState) => {
  switch (action) {
    case "jump":
      return handleJump(currentState);
    case "wait":
      return handleWait(currentState);
    case "sip":
      return handleSip(currentState);
    default:
      // Defensive: fallback for unknown actions
      return {
        ...currentState,
        log: "Unknown intro action. No changes made."
      };
  }
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ No unused imports or dead code.
- ✅ JSDoc comments for all functions and parameters.
- ✅ Defensive handling for repeated "sip" and unknown actions.
- ✅ Structure is modular and ready for integration.
- ✅ No UI code in this module (logic only).
*/