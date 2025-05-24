// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// CreditsScreen.jsx — Display contributors, lore, and project gratitude

import React from "react";

export default function CreditsScreen({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-green-400 font-mono p-6">
      <h1 className="text-3xl mb-4">🎬 Credits</h1>
      <div className="max-w-xl text-center space-y-3">
        <p><strong>Created by:</strong> Geoff Webster</p>
        <p><strong>Engine Design & Lore:</strong> Gorstan Chronicles v2.5</p>
        <p><strong>Artwork:</strong> AI-assisted + curated assets</p>
        <p><strong>Sound & FX:</strong> Custom + public domain (where used)</p>
        <p><strong>Code Assist:</strong> ChatGPT & Copilot</p>
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
