// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// MovementPanel.jsx — Renders directional movement buttons based on room exits

import React from "react";
import PropTypes from "prop-types";

/**
 * Maps canonical direction keys to display labels.
 * @type {Object.<string, string>}
 */
const directionLabels = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  up: "Up",
  down: "Down"
};

/**
 * MovementPanel
 * Renders a panel of movement buttons for each available exit in the current room.
 * @component
 * @param {Object} props
 * @param {Object} props.currentRoom - The current room object (must have an `exits` property).
 * @param {function} props.dispatch - Dispatch function for movement actions.
 * @returns {JSX.Element|null}
 */
const MovementPanel = ({ currentRoom, dispatch }) => {
  /**
   * Handles movement button clicks.
   * Dispatches a MOVE action if the direction is valid.
   * @param {string} direction - The direction to move.
   */
  const handleMove = (direction) => {
    const targetRoom = currentRoom?.exits?.[direction];
    if (targetRoom) {
      try {
        dispatch({ type: "MOVE", payload: { room: targetRoom } });
      } catch (err) {
        // Defensive: log error but don't break UI
        // eslint-disable-next-line no-console
        console.error("MovementPanel dispatch failed:", err);
      }
    }
  };

  // Defensive: If no exits or dispatch, render nothing
  if (!currentRoom?.exits || typeof dispatch !== "function") return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {Object.keys(currentRoom.exits).map((direction) => (
        <button
          key={direction}
          onClick={() => handleMove(direction)}
          className="bg-green-800 hover:bg-green-600 text-white px-4 py-1 rounded shadow-md text-sm"
          aria-label={`Go ${directionLabels[direction] || direction}`}
          type="button"
        >
          {directionLabels[direction] || direction}
        </button>
      ))}
    </div>
  );
};

MovementPanel.propTypes = {
  /** The current room object (must have an `exits` property) */
  currentRoom: PropTypes.shape({
    exits: PropTypes.objectOf(PropTypes.string)
  }).isRequired,
  /** Dispatch function for movement actions */
  dispatch: PropTypes.func.isRequired
};

export default MovementPanel;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for component, props, and handlers.
- ✅ Defensive error handling for dispatch and missing exits.
- ✅ Accessible (aria-label, button semantics).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
*/
