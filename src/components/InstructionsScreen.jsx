// Gorstan Game Module — v3.2.1
// MIT License © 2025 Geoff Webster
// InstructionsScreen.jsx — Instructions overlay screen for Gorstan Game with debug-aware enhancements

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useGameContext } from "../engine/GameContext";

export default function InstructionsScreen({ onReturn }) {
  const { state } = useGameContext();
  const isDebugHelp = state?.debugMode && state?.showDebugHelp;

  useEffect(() => {
    console.log("GORSTAN GAME v3.2.1 – InstructionsScreen mounted");
  }, []);

  const handleReturn = () => {
    if (typeof onReturn === "function") {
      try {
        onReturn();
      } catch (err) {
        console.error("InstructionsScreen onReturn callback failed:", err);
      }
    }
  };

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
        {isDebugHelp && (
          <div className="mt-6 text-left border-t border-green-700 pt-4">
            <h2 className="text-xl text-green-300 font-bold mb-2">🛠️ Debug & Godmode Commands</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><code>/doors</code> — Reveal hidden exits</li>
              <li><code>/doorsoff</code> — Disable door reveal</li>
              <li><code>/traps</code> — List active traps (debug only)</li>
              <li><code>godmode</code> — Enable godlike powers</li>
              <li><code>reset</code> — Trigger multiverse reset</li>
              <li><code>throw coffee</code> — Unlocks hidden paths in some rooms</li>
              <li><code>stepback</code> — Return to previous room (if available)</li>
            </ul>
          </div>
        )}
        <button
          onClick={handleReturn}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md transition"
          aria-label="Return to simulation"
          type="button"
        >
          ⬅ Return to Simulation
        </button>
      </div>
    </div>
  );
}

InstructionsScreen.propTypes = {
  onReturn: PropTypes.func.isRequired,
};
