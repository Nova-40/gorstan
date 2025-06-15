// Gorstan Game Module — v3.1.3
// MIT License © 2025 Geoff Webster
// QuickActions.jsx — UI buttons for commands and movement

import React from "react";
import PropTypes from "prop-types";

const QuickActions = ({
  inventory = [],
  onAskAyla = () => {},
  onThrowCoffee = () => {},
  onStepBack = () => {},
  hasPreviousRoom = false,
}) => {
  
  const hasCoffee = inventory.includes("coffee");

  const triggerCommand = (command) => {
    window.dispatchEvent(new CustomEvent("command", { detail: command }));
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end text-sm">
      <button
        className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded"
        title="Look around the current room"
        onClick={() => triggerCommand("look")}
      >
        Look
      </button>
      <button
        className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded"
        title="Open your inventory"
        onClick={() => triggerCommand("inventory")}
      >
        Inv
      </button>
      {hasCoffee && (
        <button
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded"
          title="Throw your Gorstan coffee"
          onClick={onThrowCoffee}
        >
          Throw Coffee
        </button>
      )}
      <button
        className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded"
        title="Go back to previous room if possible"
        onClick={onStepBack}
      >
        {hasPreviousRoom ? "Step Back" : "No Way Back"}
      </button>
      <button
        className="bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 rounded"
        title="Ask Ayla for help or hints"
        onClick={onAskAyla}
      >
        Ask Ayla
      </button>
    </div>
  );
};

QuickActions.propTypes = {
  inventory: PropTypes.array.isRequired,
  onAskAyla: PropTypes.func.isRequired,
  onThrowCoffee: PropTypes.func.isRequired,
  onStepBack: PropTypes.func.isRequired,
  hasPreviousRoom: PropTypes.bool.isRequired,
};
QuickActions.defaultProps = {
  inventory: [],
  onAskAyla: () => {},
  onThrowCoffee: () => {},
  onStepBack: () => {},
  hasPreviousRoom: false,
};
export default QuickActions;

