// Gorstan Game Module — v3.0.1
// File: src/components/CommandInput.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: CommandInput.jsx – v2.8.3


// CommandInput.jsx – Single-line command input for Gorstan game UI

import React from "react";
import PropTypes from "prop-types";

/**
 * CommandInput
 * Renders a single-line input for player commands.
 * Handles Enter key submission and clears input after submit.
 *
 * @component
 * @param {Object} props
 * @param {string} props.command - The current command string.
 * @param {function} props.setCommand - Setter for updating the command string.
 * @param {function} props.onSubmit - Callback invoked with the command when Enter is pressed.
 * @returns {JSX.Element}
 */
const CommandInput = ({ command, setCommand, onSubmit }) => {
  /**
   * Handles key press events on the input.
   * Submits the command if Enter is pressed and input is not empty.
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && command.trim()) {
      try {
        onSubmit(command.trim());
      } catch (err) {
        // Defensive: log error but don't break UI
        // eslint-disable-next-line no-console
        console.error("CommandInput onSubmit failed:", err);
      }
      setCommand("");
    }
  };

  return (
    <div className="mt-4 px-4">
      <input
        className="w-2/3 mx-auto mt-4 p-2 text-green-300 bg-black border border-green-500 rounded text-center"
        type="text"
        placeholder="Type a command..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyPress}
        aria-label="Command input"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
};

CommandInput.propTypes = {
  /** The current command string */
  command: PropTypes.string.isRequired,
  /** Setter for updating the command string */
  setCommand: PropTypes.func.isRequired,
  /** Callback invoked with the command when Enter is pressed */
  onSubmit: PropTypes.func.isRequired,
};

export default CommandInput;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for component, props, and handlers.
- ✅ Defensive error handling for onSubmit.
- ✅ Accessible (aria-label, no spellcheck).
- ✅ Tailwind classes for consistent UI.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
*/