// Gorstan Game Module — v2.9.1
// MIT License © 2025 Geoff Webster
// MovementPanel.jsx — Refactored to only handle directional movement buttons

import React from "react";
import PropTypes from "prop-types";

const directions = [
  { label: "↑", direction: "north", tooltip: "Go North" },
  { label: "↓", direction: "south", tooltip: "Go South" },
  { label: "←", direction: "west", tooltip: "Go West" },
  { label: "→", direction: "east", tooltip: "Go East" },
  { label: "⤴", direction: "up", tooltip: "Go Up" },
  { label: "⤵", direction: "down", tooltip: "Go Down" }
];

const MovementPanel = ({ currentRoom, dispatch }) => {
  if (!currentRoom || typeof currentRoom !== "object") {
    return null;
  }

  const handleMove = (dir) => {
    dispatch({ type: "MOVE", payload: dir });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 p-2">
      {directions.map(({ label, direction, tooltip }) => {
        const isActive = currentRoom.exits && currentRoom.exits[direction];
        return (
          <button
            key={direction}
            onClick={() => isActive && handleMove(direction)}
            className={`rounded-lg px-4 py-2 text-white text-sm font-bold border transition-colors duration-200 ${
              isActive
                ? "bg-green-700 hover:bg-green-600 border-green-500"
                : "bg-gray-700 border-gray-500 cursor-not-allowed opacity-50"
            }`}
            disabled={!isActive}
            title={tooltip}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

MovementPanel.propTypes = {
  currentRoom: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default MovementPanel;

