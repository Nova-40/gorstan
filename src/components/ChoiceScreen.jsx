// File: src/components/ChoiceScreen.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.



// Gorstan - ChoiceScreen.jsx (c) Geoff Webster 2025 – MIT License
// Version: v2.7.2

import React from "react";

const ChoiceScreen = ({ onChoose }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-green-400 font-mono px-4">
      <div className="border border-green-500 rounded-2xl p-6 w-full max-w-xl text-center shadow-lg bg-black/90">
        <h2 className="text-xl mb-4">The truck is almost upon you.</h2>
        <p className="mb-6">Your instincts scream—</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onChoose("jump")}
            className="border border-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-black transition"
          >
            🌀 Jump into the unknown
          </button>
          <button
            onClick={() => onChoose("wait")}
            className="border border-yellow-400 px-4 py-2 rounded hover:bg-yellow-400 hover:text-black transition"
          >
            ⏳ Wait — maybe it’ll stop?
          </button>
          <button
            onClick={() => onChoose("sip")}
            className="border border-blue-400 px-4 py-2 rounded hover:bg-blue-400 hover:text-black transition"
          >
            ☕ Take a final sip of Gorstan coffee
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoiceScreen;
