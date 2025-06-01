// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// StarterFrame.jsx — Handles intro mode transitions and buttons.

import React, { useState } from "react";

/**
 * StarterFrame
 * Prompts for the player's name and triggers the simulation start.
 * Calls onNameCaptured with the trimmed name when submitted.
 */
const StarterFrame = ({ onNameCaptured }) => {
  const [name, setName] = useState("");

  // Handles the name submission
  const handleSubmit = () => {
    if (name.trim()) {
      onNameCaptured(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-green-400 font-mono px-6">
      <div className="border border-green-500 rounded-2xl p-6 w-full max-w-md shadow-lg bg-black/90 text-center">
        <h2 className="text-2xl font-bold mb-4">🧠 Enter Simulation</h2>
        <p className="mb-4">Please enter your name to begin:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 rounded bg-black text-green-300 border border-green-500 focus:outline-none mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
        >
          Begin Simulation
        </button>
      </div>
    </div>
  );
};

export default StarterFrame;
