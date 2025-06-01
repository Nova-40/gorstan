// File: src/components/CommandInput.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: CommandInput.jsx – v2.7.1


// CommandInput.jsx – Cleaned, single input version
// MIT License © 2025 Geoff Webster

import React from "react";
import PropTypes from "prop-types";

export default function CommandInput({ command, setCommand, onSubmit }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && command.trim()) {
      onSubmit(command.trim());
      setCommand("");
    }
  };

  return (
    <div className="mt-4 px-4">
      <input
        className="w-full px-4 py-2 rounded bg-black text-green-400 border border-green-700 placeholder-green-600"
        type="text"
        placeholder="Type a command..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </ div>
  );
}

CommandInput.propTypes = {
  command: PropTypes.string.isRequired,
  setCommand: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
