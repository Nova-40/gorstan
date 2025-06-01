// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// StarterFrame.jsx — Part of the Gorstan Interactive Narrative

import React from "react";


export default function StarterFrame({ setStartGame, setStartingRoom }) {
  const handleIntroChoice = useIntroLogic(setStartGame, setStartingRoom);
  return (
    <div className="text-center mt-10 space-y-4">
      <p>Choose your path:</p>
      <button
        className="px-4 py-2 bg-green-600 rounded"
        onClick={() => handleIntroChoice("jump", setStartGame, setStartingRoom, setScore, setInventory)}
      >
        Jump
      </button>
      <button
        className="px-4 py-2 bg-red-600 rounded"
        onClick={() => handleIntroChoice("wait", setStartGame, setStartingRoom, setScore, setInventory)}
      >
        Wait
      </button>
      <button
        className="px-4 py-2 bg-yellow-500 rounded"
        onClick={() => handleIntroChoice("sip", setStartGame, setStartingRoom, setScore, setInventory)}
      >
        Sip Coffee
      </button>
    </div>
  );
}