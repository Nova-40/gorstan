// Gorstan Game Module — v3.1.1
// MIT License © 2025 Geoff Webster
// CreditsScreen.jsx — Displays credits for the Gorstan Game.

import React from "react";
import PropTypes from "prop-types";

/**
 * CreditsScreen
 * Displays the credits for the Gorstan Game.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onBack - Callback to return to the previous screen.
 * @returns {JSX.Element|null}
 */
const CreditsScreen = ({ onBack }) => {
  /**
   * Handles the "Return" button click.
   * Calls the onBack callback if provided, with defensive error handling.
   */
  const handleBack = () => {
    if (typeof onBack === "function") {
      try {
        onBack();
      } catch (err) {
        // Defensive: log error but don't break UI
        // eslint-disable-next-line no-console
        console.error("CreditsScreen onBack callback failed:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-green-400 font-mono p-6 bg-black">
      <h1 className="text-3xl mb-4">🎬 Credits</h1>
      <div className="max-w-xl text-center space-y-3">
        <p>
          <strong>Created by:</strong> Geoff Webster
        </p>
        <p>
          <strong>Engine Design &amp; Lore:</strong> Gorstan Chronicles v2.5
        </p>
        <p>
          <strong>Artwork:</strong> AI-assisted + curated assets
        </p>
        <p>
          <strong>Sound &amp; FX:</strong> Custom + public domain (where used)
        </p>
        <p>
          <strong>Code Assist:</strong> ChatGPT &amp; Copilot
        </p>
        <p className="text-sm mt-4 italic text-green-300">
          Thank you for travelling through the Lattice.
        </p>
      </div>
      <button
        className="mt-6 px-4 py-2 border border-green-500 hover:bg-green-700 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={handleBack}
        aria-label="Return to previous screen"
        type="button"
      >
        ⬅ Return
      </button>
    </div>
  );
};

CreditsScreen.propTypes = {
  /** Callback to return to the previous screen */
  onBack: PropTypes.func.isRequired,
};

export default CreditsScreen;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for component, props, and handlers.
- ✅ Defensive error handling for onBack callback.
- ✅ Accessible (aria-label, focus styles).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
*/