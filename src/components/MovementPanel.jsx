// Gorstan Game Module — v3.1.1
// MIT License © 2025 Geoff Webster
// MovementPanel.jsx — Refactored to handle directional, jump, and use actions in unified layout

import React, { useState } from "react";
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
  const [usePromptVisible, setUsePromptVisible] = useState(false);
  const [useInput, setUseInput] = useState("");

  if (!currentRoom || typeof currentRoom !== "object") {
    return null;
  }

  const handleMove = (dir) => {
    dispatch({ type: "MOVE", payload: dir });
  };

  const handleUse = () => {
    if (useInput.trim()) {
      dispatch({ type: "USE_ITEM", payload: useInput.trim() });
      setUseInput("");
      setUsePromptVisible(false);
    }
  };

  const handleJump = () => {
    dispatch({ type: "COMMAND", payload: "jump" });
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 p-2">
      {directions.map(({ label, direction, tooltip }) => {
        const isActive = currentRoom.exits && currentRoom.exits[direction];
        return (
          <button
            key={direction}
            onClick={() => isActive && handleMove(direction)}
            className={`rounded px-3 py-1 text-white text-sm font-bold border transition-colors duration-200 ${
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

      <button
        onClick={handleJump}
        className="rounded px-3 py-1 text-white text-sm font-bold border bg-purple-700 hover:bg-purple-600 border-purple-500"
        title="Jump to linked room"
      >
        ⤴ Jump
      </button>

      <button
        onClick={() => setUsePromptVisible(true)}
        className="rounded px-3 py-1 text-white text-sm font-bold border bg-blue-700 hover:bg-blue-600 border-blue-500"
        title="Use an item or object"
      >
        🛠 Use
      </button>

      {usePromptVisible && (
        <div className="w-full mt-2">
          <input
            className="text-black p-1 rounded w-full"
            value={useInput}
            onChange={(e) => setUseInput(e.target.value)}
            placeholder="Enter what you'd like to use..."
            onKeyDown={(e) => e.key === 'Enter' && handleUse()}
          />
        </div>
      )}
    </div>
  );
};

MovementPanel.propTypes = {
  currentRoom: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default MovementPanel;

