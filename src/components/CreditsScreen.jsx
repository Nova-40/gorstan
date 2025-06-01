// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// CreditsScreen.jsx — Module supporting Gorstan gameplay or UI.

import React from "react";

/**
 * CreditsScreen
 * Displays the credits for the Gorstan Game.
 * The onBack prop is a callback to return to the previous screen.
 */
export default function CreditsScreen({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-green-400 font-mono p-6">
      <h1 className="text-3xl mb-4">🎬 Credits</h1>
      <div className="max-w-xl text-center space-y-3">
        <p><strong>Created by:</strong> Geoff Webster</p>
        <p><strong>Engine Design &amp; Lore:</strong> Gorstan Chronicles v2.5</p>
        <p><strong>Artwork:</strong> AI-assisted + curated assets</p>
        <p><strong>Sound &amp; FX:</strong> Custom + public domain (where used)</p>
        <p><strong>Code Assist:</strong> ChatGPT &amp; Copilot</p>
        <p className="text-sm mt-4 italic text-green-300">
          Thank you for travelling through the Lattice.
        </p>
      </div>
      <button
        className="mt-6 px-4 py-2 border border-green-500 hover:bg-green-700 rounded"
        onClick={onBack}
      >
        ⬅ Return
      </button>
    </div>
  );
}
