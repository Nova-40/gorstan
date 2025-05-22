// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// SoundSystem.jsx
// Provides mute toggle and optional future sound handling for Gorstan.

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
     - Expects `muted` (boolean) and `toggleMute` (function) from parent.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for mute toggle.
     - Could accept a `className` prop for more flexible styling.
     - Could support future sound events or volume control.
*/

import React from "react";
import PropTypes from "prop-types";

/**
 * SoundSystem Component
 * A floating mute toggle component for use in Quick Actions or global overlay.
 *
 * Props:
 * - muted (boolean): Whether sound is muted.
 * - toggleMute (function): Callback to toggle mute state.
 */
export default function SoundSystem({ muted, toggleMute }) {
  return (
    <button
      onClick={toggleMute}
      className="text-green-400 border border-green-400 px-2 py-1 text-xs rounded hover:bg-green-900 transition"
      title={muted ? "Unmute sounds" : "Mute sounds"}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      type="button"
    >
      {muted ? "🔇" : "🎵"}
    </button>
  );
}

SoundSystem.propTypes = {
  muted: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
};
