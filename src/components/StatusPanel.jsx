// Gorstan v2.4.0 – StatusPanel: Traits, Stats, and Game Info
// MIT License © 2025 Geoff Webster
// StatusPanel.jsx
// Displays player traits, score, room, inventory, cycles, and debug info for Gorstan.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, destructuring).
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - PropTypes for all props.
  4. 🤝 INTEGRATION CHECK
     - Expects `traits`, `score`, `room`, `inventory`, `cycleCount`, `debugMode`, `traps` from parent.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract trait capitalization to a utility.
     - Could add unit tests for trait rendering and debug info.
     - Could memoize for large inventories, but not needed for typical use.
*/

import React from "react";
import PropTypes from "prop-types";

/**
 * StatusPanel Component
 * Displays player traits, score, room, inventory, cycles, and debug info.
 *
 * Props:
 * - traits (object): Player traits (key-value pairs).
 * - score (number): Player's score.
 * - room (string): Current room name or ID.
 * - inventory (array): Player's inventory items.
 * - cycleCount (number): Number of reset cycles.
 * - debugMode (boolean): Whether debug info is shown.
 * - traps (array): List of active traps (for debug).
 */
export default function StatusPanel({
  traits = {},
  score = 0,
  room = "",
  inventory = [],
  cycleCount = 0,
  debugMode = false,
  traps = [],
}) {
  return (
    <div className="fixed top-4 right-4 z-50 w-80 border-2 border-green-400 rounded-2xl p-4 font-mono bg-slate-900 text-green-100 shadow-xl slide-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-green-300">📊 Status</h3>
      </div>
      <hr className="border-green-700 my-2" />
      <div>
        <strong className="text-green-300">🧠 Traits:</strong>
        <ul className="pl-4 list-disc text-lime-300">
          {Object.keys(traits).length === 0 && (
            <li className="italic text-gray-400">No traits discovered yet.</li>
          )}
          {Object.keys(traits).map((t) => (
            <li key={t} title={traitDescriptions[t] || "No description"}>
              {capitalize(t)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong className="text-green-300">🎯 Score:</strong>{" "}
        <span className="text-yellow-300">{score}</span>
      </div>
      <div>
        <strong className="text-green-300">🗺️ Room:</strong>{" "}
        <span className="text-blue-300">{room}</span>
      </div>
      <div>
        <strong className="text-green-300">🎒 Items:</strong>
        <ul className="pl-4 list-disc text-yellow-200">
          {Array.isArray(inventory) && inventory.length > 0 ? (
            inventory.map((item, i) => <li key={i}>{item}</li>)
          ) : (
            <li className="italic text-gray-400">No items</li>
          )}
        </ul>
      </div>
      <div>
        <strong className="text-green-300">🔄 Reset Cycles:</strong>{" "}
        <span className="text-red-300">{cycleCount || 0} / 7</span>
      </div>
      {debugMode && (
        <div className="text-cyan-300 text-sm mt-2">
          DEBUG: Traps active in {Array.isArray(traps) ? traps.length : 0} room(s)
        </div>
      )}
    </div>
  );
}

// Utility: Capitalize first letter
function capitalize(str) {
  return typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str;
}

// Trait descriptions for tooltips
const traitDescriptions = {
  curious: "You inspect everything closely.",
  reckless: "You often act before thinking.",
  ambitious: "You seek high rewards.",
  diplomatic: "You avoid conflict where possible.",
  greedy: "You tend to take more than needed.",
  hesitated: "You froze in the face of danger.",
};

// PropTypes for documentation and runtime validation
StatusPanel.propTypes = {
  traits: PropTypes.object,
  score: PropTypes.number,
  room: PropTypes.string,
  inventory: PropTypes.array,
  cycleCount: PropTypes.number,
  debugMode: PropTypes.bool,
  traps: PropTypes.array,
};
