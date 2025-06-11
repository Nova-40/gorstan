// Gorstan Game Module — v3.1.1
// MIT License © 2025 Geoff Webster
// AylaButton.jsx — Interactive button for summoning Ayla's contextual help/mood

import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Mood levels for Ayla's responses.
 * Each index represents a more exasperated or sarcastic mood.
 * @type {string[]}
 */
const moodLevels = [
  "How can I help?",
  "Again? Okay...",
  "Really?",
  "You do know I lie sometimes, right?",
  "Maybe try thinking for once."
];

/**
 * AylaButton
 * Renders a button that, when clicked, displays Ayla's mood-based response.
 * Optionally triggers a callback for contextual help.
 *
 * @component
 * @param {Object} props
 * @param {function} [props.onAsk] - Optional callback triggered when Ayla is asked for help.
 * @returns {JSX.Element}
 */
const AylaButton = ({ onAsk }) => {
  // Tracks how many times the player has asked Ayla for help.
  const [askCount, setAskCount] = useState(0);
  // Stores the current mood response to display.
  const [response, setResponse] = useState("");

  /**
   * Handles the Ask Ayla button click.
   * Increments ask count, sets mood response, triggers callback, and auto-hides response.
   */
  const handleAsk = () => {
    const newCount = askCount + 1;
    setAskCount(newCount);

    // Clamp mood index to the last mood if askCount exceeds moodLevels length
    const moodIndex = Math.min(moodLevels.length - 1, newCount - 1);
    const moodMessage = moodLevels[moodIndex];

    setResponse(moodMessage);

    // Trigger contextual help if provided
    if (typeof onAsk === "function") {
      try {
        onAsk();
      } catch (err) {
        // Defensive: log error but don't break UI
        // eslint-disable-next-line no-console
        console.error("AylaButton onAsk callback failed:", err);
      }
    }

    // Hide message after 4 seconds
    setTimeout(() => setResponse(""), 4000);
  };

  return (
    <div className="text-center">
      <button
        onClick={handleAsk}
        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-shadow duration-200 shadow-md hover:shadow-green-400"
        aria-label="Ask Ayla"
        type="button"
      >
        Ask Ayla
      </button>
      {response && (
        <div
          className="mt-2 text-green-300 italic text-sm animate-pulse"
          aria-live="polite"
        >
          {response}
        </div>
      )}
    </div>
  );
};

AylaButton.propTypes = {
  /** Optional callback triggered when Ayla is asked for help. */
  onAsk: PropTypes.func,
};

export default AylaButton;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for all functions, parameters, and key logic.
- ✅ Defensive error handling for onAsk callback.
- ✅ Accessible (aria-label, aria-live).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
*/