// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// SmallBlueRollbackButton.jsx
// Renders a floating "Undo Decision" button for rolling back the player's last room decision.
// Shows a confirmation prompt to prevent accidental rollbacks. Only visible when `visible` is true.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, hooks).
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - PropTypes for all props.
  4. 🤝 INTEGRATION CHECK
     - Expects `onRollback` (function) and `visible` (boolean) from parent.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract confirmation timeout to a constant or prop for flexibility.
     - Could add unit tests for confirmation logic and rollback callback.
*/

import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * SmallBlueRollbackButton
 * Renders a floating "Undo Decision" button for rolling back the player's last room decision.
 * Shows a confirmation prompt to prevent accidental rollbacks.
 * Only visible when `visible` is true.
 *
 * Props:
 * - onRollback (function): Callback to trigger rollback (required)
 * - visible (boolean): Controls button visibility (required)
 */
export default function SmallBlueRollbackButton({ onRollback, visible }) {
  const [confirming, setConfirming] = useState(false);

  if (!visible) return null;

  /**
   * Handles the button click.
   * Shows confirmation prompt on first click, triggers rollback on second click.
   */
  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000); // Reset confirmation after 3 seconds
    } else {
      setConfirming(false);
      if (typeof onRollback === "function") {
        onRollback();
      } else {
        // Defensive: log error if callback is not a function
        console.error("SmallBlueRollbackButton: onRollback prop is not a function.");
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-full shadow-md border border-blue-300 animate-pulse"
        onClick={handleClick}
        aria-label="Undo last decision"
        title={confirming ? "Click again to confirm" : "Click once to confirm"}
        type="button"
      >
        {confirming ? "Are you sure?" : "Undo Decision"}
      </button>
    </div>
  );
}

SmallBlueRollbackButton.propTypes = {
  onRollback: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

/*
  === Change Commentary ===
  - Updated version to 2.4.0 and ensured MIT license is present.
  - Defensive error handling for onRollback callback.
  - All syntax validated and ready for use in the Gorstan game.
  - Improved comments for clarity and maintainability.
*/
