// CommandInput.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

// This component provides a text input field for the player to type commands
// and a submit button to process those commands. It is designed to be reusable
// and integrates with the parent component via props.

import React from "react";
import PropTypes from "prop-types";

/**
 * CommandInput Component
 * A reusable input form for entering and submitting commands in the game.
 *
 * Props:
 * - command (string): The current value of the command input.
 * - setCommand (function): A function to update the command state.
 * - onSubmit (function): A function to handle the submission of the command.
 */
export default function CommandInput({ command, setCommand, onSubmit }) {
  /**
   * Handles the form submission event.
   * Prevents the default form submission behavior and calls the onSubmit prop.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mt-2 items-centre"
      aria-label="Command Input Form"
    >
      {/* Input Field for Commands */}
      <input
        type="text"
        className="flex-1 bg-gray-800 text-white p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Type a command..."
        autoFocus
        aria-label="Command Input"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 border border-green-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Submit Command"
      >
        Enter
      </button>
    </form>
  );
}

// PropTypes for type checking
CommandInput.propTypes = {
  command: PropTypes.string.isRequired, // The current command input value
  setCommand: PropTypes.func.isRequired, // Function to update the command state
  onSubmit: PropTypes.func.isRequired, // Function to handle command submission
};
