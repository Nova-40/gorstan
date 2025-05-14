// PlayerNameCapture.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

export default function PlayerNameCapture({ onNameEntered }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      onNameEntered(trimmed);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-green-300 font-mono p-4 max-w-md mx-auto mt-6"
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
      />
      <button
        type="submit"
        className="mt-4 bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded"
      >
        Begin
      </button>
    </form>
  );
}

PlayerNameCapture.propTypes = {
  onNameEntered: PropTypes.func.isRequired,
};
