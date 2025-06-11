// Gorstan Game Module — v3.1.1
// MIT License © 2025 Geoff Webster
// CombinedActions.jsx — Icon Quick Actions for Gorstan Game

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Eye, Backpack, Coffee, ArrowUp, ArrowDown, RotateCcw, UndoDot } from "lucide-react";
import { GameContext } from "../engine/GameContext";

const iconClass = "w-6 h-6 text-green-300 hover:text-green-500 transition-all";

/**
 * CombinedActions
 * Renders a row of quick action buttons (look, inventory, throw coffee, movement, reset, stepback).
 * Uses Lucide icons and dispatches actions to the Gorstan game engine.
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.state] - Game state (from context if not provided).
 * @param {Function} [props.dispatch] - Dispatch function (from context if not provided).
 * @returns {JSX.Element}
 */
const CombinedActions = ({ state: propState, dispatch: propDispatch }) => {
  // Use context if props not provided
  const context = useContext(GameContext);
  const state = propState || context.state;
  const dispatch = propDispatch || context.dispatch;

  /**
   * Handles all quick action button clicks.
   * @param {string} action - The action string (e.g., "look", "throw coffee").
   */
  const handleClick = (action) => {
    dispatch({ type: "LOG", payload: `> ${action}` });

    // --- Action handlers ---
    switch (action) {
      case "look":
        dispatch({ type: "LOOK_AROUND" });
        break;
      case "inventory":
        dispatch({ type: "SHOW_INVENTORY" });
        break;
      case "throw coffee": {
        // 💬 hasCoffee: true if player has "coffee" in inventory
        const hasCoffee = state.inventory?.includes("coffee");
        if (hasCoffee) {
          dispatch({ type: "THROW_COFFEE" });
          dispatch({ type: "LOG", payload: "You throw your Gorstan coffee with unexpected force." });
        } else {
          dispatch({ type: "LOG", payload: "You reach for coffee, but you're empty-handed." });
        }
        break;
      }
      case "go up":
        dispatch({ type: "MOVE", payload: "up" });
        break;
      case "go down":
        dispatch({ type: "MOVE", payload: "down" });
        break;
      case "reset":
        // 💬 Only available in "resetroom"
        dispatch({ type: "LOG", payload: "You press the reset device. The multiverse trembles..." });
        dispatch({ type: "ENGAGE_RESET" }); // Ensure this action exists in your reducer!
        break;
      case "stepback":
        dispatch({ type: "STEP_BACK" });
        break;
      default:
        dispatch({ type: "LOG", payload: `Unknown action: ${action}` });
    }
  };

  // Defensive: Ensure state and dispatch are available
  if (!state || typeof dispatch !== "function") {
    // eslint-disable-next-line no-console
    console.error("CombinedActions: state and dispatch are required.");
    return null;
  }

  return (
    <div className="flex gap-5 mt-4 justify-center items-center flex-wrap">
      <button title="Look around" onClick={() => handleClick("look")} type="button" aria-label="Look around">
        <Eye className={iconClass} />
      </button>
      <button title="Check inventory" onClick={() => handleClick("inventory")} type="button" aria-label="Check inventory">
        <Backpack className={iconClass} />
      </button>
      <button title="Throw your coffee" onClick={() => handleClick("throw coffee")} type="button" aria-label="Throw your coffee">
        <Coffee className={iconClass} />
      </button>
      <button title="Go up" onClick={() => handleClick("go up")} type="button" aria-label="Go up">
        <ArrowUp className={iconClass} />
      </button>
      <button title="Go down" onClick={() => handleClick("go down")} type="button" aria-label="Go down">
        <ArrowDown className={iconClass} />
      </button>
      {state.currentRoom === "resetroom" && (
        <button title="Reset the multiverse" onClick={() => handleClick("reset")} type="button" aria-label="Reset the multiverse">
          <RotateCcw className={iconClass} />
        </button>
      )}
      <button title="Step back to the previous room" onClick={() => handleClick("stepback")} type="button" aria-label="Step back to the previous room">
        <UndoDot className={iconClass} />
      </button>
    </div>
  );
};

CombinedActions.propTypes = {
  /** Optional: Game state object (if not using context) */
  state: PropTypes.object,
  /** Optional: Dispatch function (if not using context) */
  dispatch: PropTypes.func,
};

export default CombinedActions;

