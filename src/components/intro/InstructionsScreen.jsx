
// MIT License © 2025 Geoff Webster
// Gorstan v2.6 — InstructionsScreen

import React from "react";

export default function InstructionsScreen({ onReturn }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono px-6 py-8">
      <div className="w-full max-w-2xl border border-green-700 rounded-md p-8 shadow-[0_0_10px_#00ffcc] text-center space-y-6">
        <h1 className="text-4xl font-bold">📜 Instructions</h1>
        <p className="text-base leading-relaxed">
          Welcome to <span className="text-green-300 font-semibold">GORSTAN</span>.
          This is a reality fracture simulation. Choices matter. Puzzles abound.
          Inventory, NPCs, and logic gates govern your path.
        </p>
        <ul className="list-disc list-inside text-left mx-auto max-w-md space-y-2 text-sm">
          <li>Use simple commands like <code>look</code>, <code>talk to</code>, <code>use</code>, and <code>throw</code>.</li>
          <li>Type <code>help</code> or <code>ask Ayla</code> if you get stuck.</li>
          <li>Your score and traits evolve with your actions.</li>
          <li>Not everything is as it seems. Especially Polly.</li>
        </ul>
        <button
          onClick={onReturn}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md transition"
        >
          ⬅ Return to Simulation
        </button>
      </div>
    </div>
  );
}
