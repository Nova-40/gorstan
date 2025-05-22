// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// PlayerNameCapture.jsx
// Prompts the player to enter their name before starting the game.

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
     - Expects `onNameEntered` prop (function) from parent (AppCore).
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract error logging to a utility if used elsewhere.
     - Could add unit tests for input validation and error handling.
*/

import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * PlayerNameCapture Component
 * Prompts the player to enter their name before starting the game.
 * Handles empty or invalid input and reports errors.
 *
 * Props:
 * - onNameEntered: Function to call with the entered name (required).
 */
export default function PlayerNameCapture({ onNameEntered }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  /**
   * Handles form submission.
   * Validates the name and calls onNameEntered if valid.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (typeof onNameEntered !== "function") {
        throw new Error("onNameEntered prop is not a function.");
      }
      const trimmed = name.trim();
      if (!trimmed) {
        setError("Please enter a valid name.");
        return;
      }
      setError(null);
      onNameEntered(trimmed);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("❌ PlayerNameCapture: Error handling name entry.", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-green-300 font-mono p-4 max-w-md mx-auto mt-6"
      autoComplete="off"
      aria-label="Player Name Capture Form"
    >
      <label htmlFor="playerName" className="block mb-2">
        Please enter your name to proceed:
      </label>
      <input
        id="playerName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded bg-black text-green-200 border border-green-500 focus:outline-none"
        placeholder="Type your name…"
        autoFocus
        aria-label="Player Name"
        spellCheck={false}
        maxLength={32}
      />
      {error && (
        <div className="text-red-400 mt-2 text-sm" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="mt-4 bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded"
        aria-label="Begin Game"
        disabled={!name.trim()}
      >
        Begin
      </button>
    </form>
  );
}

PlayerNameCapture.propTypes = {
  onNameEntered: PropTypes.func.isRequired,
};
