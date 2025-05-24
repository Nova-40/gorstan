// MIT License © 2025 Geoff Webster
// Gorstan v2.5

import React, { useState } from 'react';

export default function PlayerNameCapture({ onNameEntered }) {
  const [name, setName] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      onNameEntered(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-300 font-mono flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl mb-4">Please enter your name to proceed:</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-800 text-green-200 border border-green-500 px-4 py-2 mb-4 rounded w-full max-w-xs"
        autoFocus
      />
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-purple-700 hover:bg-purple-500 text-white px-6 py-2 rounded shadow-lg"
        >
          Begin
        </button>
        <button
          onClick={() => setShowInstructions(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Instructions
        </button>
      </div>

      {showInstructions && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-6">
          <div className="bg-gray-900 border border-green-500 p-6 rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-green-300 font-bold">How to Play</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-green-400 hover:text-red-400 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="mb-2">🧭 Use commands like:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 text-green-200">
              <li><code>look</code> – examine your surroundings</li>
              <li><code>go north</code>, <code>go south</code> – move between locations</li>
              <li><code>take [item]</code>, <code>use [item]</code> – interact with the world</li>
              <li><code>ask [NPC] about [topic]</code> – engage with characters</li>
              <li><code>inventory</code> – view your items</li>
              <li><code>recycle [item]</code> – interact with BIN-9000 (but think first)</li>
            </ul>
            <p className="mb-2">🎯 Objective:</p>
            <p className="mb-4 text-green-200">Uncover the truth of the multiverse, survive Polly, unlock the Codex, and reshape Gorstan's fate.</p>
            <p className="italic text-green-400">☕ Hint: Coffee is more powerful than it looks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
