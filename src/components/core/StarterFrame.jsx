// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: StarterFrame.jsx – v2.7.2


import React from "react";
import { handleIntroChoice } from "../../engine/core/introLogic";

export default function StarterFrame({ setStartGame, setStartingRoom, addToOutput }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-mono space-y-4">
      <h1 className="text-2xl mb-4">🌀 Choose your path</h1>
      <button
        className="px-6 py-2 border border-green-500 hover:bg-green-800 rounded"
        onClick={() => handleIntroChoice("jump", setStartGame, setStartingRoom, addToOutput)}
      >
        🪂 Jump
      </button>
      <button
        className="px-6 py-2 border border-green-500 hover:bg-green-800 rounded"
        onClick={() => handleIntroChoice("wait", setStartGame, setStartingRoom, addToOutput)}
      >
        ⏳ Wait
      </button>
      <button
        className="px-6 py-2 border border-green-500 hover:bg-green-800 rounded"
        onClick={() => handleIntroChoice("sip", setStartGame, setStartingRoom, addToOutput)}
      >
        ☕ Sip Coffee
      </button>
    </div>
  );
}
