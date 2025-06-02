// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// StarterFrame.jsx — Part of the Gorstan Interactive Narrative

import React from "react";
import PropTypes from "prop-types";

/**
 * useIntroLogic
 * Returns a handler for intro choices that sets up the game state.
 * @param {function} setStartGame - Callback to start the game.
 * @param {function} setStartingRoom - Callback to set the starting room.
 * @returns {function} Handler for intro choices.
 */
function useIntroLogic(setStartGame, setStartingRoom) {
  /**
   * Handles the player's intro choice.
   * @param {"jump"|"wait"|"sip"} choice - The intro action chosen.
   */
  return (choice) => {
    // Example logic: customize as needed for your game engine
    switch (choice) {
      case "jump":
        setStartingRoom("controlnexus");
        setStartGame(true);
        break;
      case "wait":
        setStartingRoom("introreset");
        setStartGame(true);
        break;
      case "sip":
        setStartingRoom("quantumlattice");
        setStartGame(true);
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown intro choice:", choice);
    }
  };
}

/**
 * StarterFrame
 * Presents the player with initial choices to start the Gorstan narrative.
 * @component
 * @param {Object} props
 * @param {function} props.setStartGame - Callback to start the game.
 * @param {function} props.setStartingRoom - Callback to set the starting room.
 * @returns {JSX.Element|null}
 */
export default function StarterFrame({ setStartGame, setStartingRoom }) {
  const handleIntroChoice = useIntroLogic(setStartGame, setStartingRoom);

  // Defensive: Ensure required props are functions
  if (typeof setStartGame !== "function" || typeof setStartingRoom !== "function") {
    // eslint-disable-next-line no-console
    console.error("StarterFrame: setStartGame and setStartingRoom must be functions.");
    return (
      <div className="text-center mt-10 text-red-400 font-mono">
        <p>Error: Game cannot start. Please reload or contact support.</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-10 space-y-4">
      <p className="text-green-300 font-mono text-lg mb-4">Choose your path:</p>
      <button
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
        onClick={() => handleIntroChoice("jump")}
        aria-label="Jump into the unknown"
        type="button"
      >
        🌀 Jump
      </button>
      <button
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
        onClick={() => handleIntroChoice("wait")}
        aria-label="Wait and see"
        type="button"
      >
        ⏳ Wait
      </button>
      <button
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black font-semibold transition"
        onClick={() => handleIntroChoice("sip")}
        aria-label="Sip coffee"
        type="button"
      >
        ☕ Sip Coffee
      </button>
    </div>
  );
}

StarterFrame.propTypes = {
  /** Callback to start the game */
  setStartGame: PropTypes.func.isRequired,
  /** Callback to set the starting room */
  setStartingRoom: PropTypes.func.isRequired
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for component, props, and logic.
- ✅ Defensive error handling for missing/invalid props.
- ✅ Accessible (aria-labels, readable contrast).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Integrate with main game state logic for score/inventory if needed.
*/