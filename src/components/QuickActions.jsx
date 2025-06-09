// Gorstan Game Module — v3.1.0
// MIT License © 2025 Geoff Webster
// QuickActions.jsx — Consolidated quick action buttons including movement, item use, and helper triggers

import React from "react";
import PropTypes from "prop-types";
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight, Coffee, Heart, KeyRound, BookOpenText, RefreshCcwDot } from "lucide-react";

const directionIcons = {
  north: <ArrowBigUp size={18} />, south: <ArrowBigDown size={18} />,
  west: <ArrowBigLeft size={18} />, east: <ArrowBigRight size={18} />,
  up: <ArrowBigUp size={18} />, down: <ArrowBigDown size={18} />
};

const QuickActions = ({ currentRoom, state, dispatch }) => {
  if (!currentRoom || typeof currentRoom !== "object") return null;

  const handleMove = (dir) => dispatch({ type: "MOVE", payload: dir });
  const handleThrowCoffee = () => dispatch({ type: "THROW_COFFEE" });
  const handleStatus = () => dispatch({ type: "TOGGLE_STATUS_PANEL" });
  const handleHelp = () => dispatch({ type: "ASK_NPC", payload: { npc: "ayla", topic: "help" } });

  const exits = currentRoom.exits || {};
  const hasCoffee = state?.inventory?.includes("coffee");
  const hasKey = state?.inventory?.includes("briefcase") || state?.inventory?.includes("key");

  return (
    <div className="grid grid-cols-3 gap-2 text-xs text-white p-2 w-52">
      {Object.keys(exits).map((dir) => (
        <button
          key={dir}
          onClick={() => handleMove(dir)}
          className={`flex items-center justify-center p-2 border rounded ${exits[dir] ? "bg-green-600" : "bg-gray-700 cursor-not-allowed"}`}
          disabled={!exits[dir]}
          title={`Go ${dir}`}
        >
          {directionIcons[dir] || dir.toUpperCase()}
        </button>
      ))}

      {hasCoffee && (
        <button
          onClick={handleThrowCoffee}
          className="col-span-3 flex items-center justify-center p-2 bg-yellow-800 hover:bg-yellow-700 border rounded"
          title="Throw Gorstan Coffee"
        >
          <Coffee size={16} className="mr-1" /> Throw Coffee
        </button>
      )}

      <button
        onClick={handleStatus}
        className="col-span-3 flex items-center justify-center p-2 bg-blue-700 hover:bg-blue-600 border rounded"
        title="Status Panel"
      >
        <Heart size={16} className="mr-1" /> Stats
      </button>

      <button
        onClick={handleHelp}
        className="col-span-3 flex items-center justify-center p-2 bg-purple-700 hover:bg-purple-600 border rounded"
        title="Ask Ayla for help"
      >
        <BookOpenText size={16} className="mr-1" /> Ask Ayla
      </button>

      {hasKey && (
        <button
          onClick={() => dispatch({ type: "USE_ITEM", payload: "briefcase" })}
          className="col-span-3 flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 border rounded"
          title="Use Key Item"
        >
          <KeyRound size={16} className="mr-1" /> Use Key
        </button>
      )}
    </div>
  );
};

QuickActions.propTypes = {
  currentRoom: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default QuickActions;

