// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: TeletypeIntro.jsx – v2.7.2

import React, { useState, useEffect, useRef, useMemo } from 'react';
import TeletypeConsole from './TeletypeConsole';

export default function TeletypeIntro({ playerName, onChoice }) {
  const [showChoices, setShowChoices] = useState(false);
  const [lastLineComplete, setLastLineComplete] = useState(false);
  const playerLabel = playerName || localStorage.getItem("playerName") || "traveller";
  const audioRef = useRef(null);

  const lines = useMemo(() => [
    `Good day, ${playerLabel}.`,
    "You stand at the kerb. The city hums as reality pretends to behave.",
    "The air is thick with the smell of rain and diesel.",
    "You reflect on the strange events of the day.",
    "A lavender rabbit with white eyes that seemed to look into your soul.",
    "Steam rises. You sip your coffee. It tastes like the end of something.",
    "The crossing is green and you step off the kerb.",
    "Suddenly—",
    "A BIG YELLOW TRUCK comes out of nowhere heading for you at a rate of knots.",
    "The world slows down.",
    "You have a choice to make.",
    "Your instincts scream:"
  ], [playerLabel]);

  useEffect(() => {
    audioRef.current = new Audio("/keystroke.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (!showChoices && lastLineComplete) {
      setShowChoices(true);
    }
  }, [lastLineComplete, showChoices]);

  const playTypeSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="bg-black text-green-400 min-h-screen flex items-center justify-center p-6 font-mono">
      <TeletypeConsole
        lines={lines}
        onChar={playTypeSound}
        onCompleteLastLine={() => setLastLineComplete(true)}
      />
      {showChoices && (
        <div className="absolute bottom-10 space-x-4">
          <button onClick={() => onChoice("jump")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Jump
          </button>
          <button onClick={() => onChoice("wait")} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Wait
          </button>
          <button onClick={() => onChoice("sip")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Sip Coffee
          </button>
        </div>
      )}
    </div>
  );
}