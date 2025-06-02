// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// StatusPanel.jsx — Player status panel with trait tooltips and animation

import React from "react";
import PropTypes from "prop-types";

/**
 * Returns a tooltip description for a given trait.
 * @param {string} trait - The trait name.
 * @returns {string} Tooltip text for the trait.
 */
function getTraitTooltip(trait) {
  switch (trait) {
    case "Curious":
      return "See hidden clues";
    case "Ambitious":
      return "Score boosts";
    case "Seeker":
      return "Unlock metaphysical paths";
    case "Defiant":
      return "Breaks the rules of the simulation";
    default:
      return "";
  }
}

/**
 * StatusPanel
 * Displays the player's score, inventory count, and unlocked traits with tooltips.
 * @component
 * @param {Object} props
 * @param {Object} props.state - The current game state (must have score, inventory, traits).
 * @returns {JSX.Element|null}
 */
const StatusPanel = ({ state }) => {
  // Defensive: Ensure state is valid before rendering
  if (
    !state ||
    typeof state !== "object" ||
    typeof state.score !== "number" ||
    !Array.isArray(state.inventory) ||
    !Array.isArray(state.traits)
  ) {
    // eslint-disable-next-line no-console
    console.error("StatusPanel: Invalid or missing state prop.");
    return (
      <div className="bg-gray-900 text-red-400 p-4 rounded-xl shadow-lg text-center font-mono">
        Error: Unable to display status. Game state is missing or invalid.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-green-300 p-4 rounded-xl shadow-lg space-y-2 animate-fade-in">
      <h2 className="text-lg font-bold border-b border-green-500 pb-1">Status</h2>
      <div>
        Score: <span className="font-mono text-green-200">{state.score}</span>
      </div>
      <div>
        Inventory: <span className="font-mono">{state.inventory.length}</span>/12
      </div>
      <div>
        Traits:
        <ul className="list-disc ml-5 space-y-1">
          {state.traits.length === 0 && (
            <li className="italic text-green-500">None yet</li>
          )}
          {state.traits.map((trait, idx) => (
            <li key={trait + idx} className="tooltip relative group">
              {trait}
              {getTraitTooltip(trait) && (
                <span
                  className="absolute bg-black text-white text-xs p-1 rounded shadow-lg left-full ml-2 hidden group-hover:block z-10"
                  role="tooltip"
                >
                  {getTraitTooltip(trait)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

StatusPanel.propTypes = {
  /** The current game state (must have score, inventory, traits) */
  state: PropTypes.shape({
    score: PropTypes.number.isRequired,
    inventory: PropTypes.array.isRequired,
    traits: PropTypes.array.isRequired
  }).isRequired
};

export default StatusPanel;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for component, props, and helpers.
- ✅ Defensive error handling for missing/invalid state.
- ✅ Accessible (role="tooltip" for trait tooltips).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Add animation for tooltip appearance for extra polish.
*/
