// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// eventTriggers.js — Sample trigger system for Gorstan engine

/**
 * Triggers a named event, dispatching appropriate actions.
 * Extend this function to handle more in-game events.
 * @param {string} eventName - The event identifier to trigger.
 * @param {Object} state - The current game state.
 * @param {function} dispatch - Dispatch function for game state updates.
 */
export const triggerEvent = (eventName, state, dispatch) => {
  if (typeof eventName !== "string" || typeof dispatch !== "function") {
    // Defensive: Invalid arguments
    // eslint-disable-next-line no-console
    console.error("triggerEvent: Invalid eventName or dispatch function.");
    return;
  }

  switch (eventName) {
    case "secretUnlocked":
      dispatch({ type: "GAIN_TRAIT", payload: "Seeker" });
      dispatch({ type: "LOG", payload: "A whisper tells you a new path has opened." });
      break;
    // TODO: Add more event cases as Gorstan expands
    default:
      dispatch({ type: "LOG", payload: "Nothing seems to happen..." });
  }
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for function, parameters, and logic.
- ✅ Defensive error handling for invalid arguments.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Add more event triggers and richer feedback for gameplay.
*/