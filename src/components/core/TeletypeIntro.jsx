// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// TeletypeIntro.jsx — Animated text intro and decision prompt

import React, { useEffect, useState } from "react";

export default function TeletypeIntro({ playerName, onChoice }) {
  const lines = [
    `Good day, ${playerName}.`,
    "You stand at the kerb.",
    "A BIG YELLOW TRUCK hurtles toward you.",
    "Your instincts scream:",
    "JUMP • WAIT • SIP COFFEE"
  ];

  const [displayedLines, setDisplayedLines] = useState([]);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedLines((prev) => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) {
        clearInterval(interval);
        setShowChoices(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 p-4 max-w-xl mx-auto">
      {displayedLines.map((line, i) => (
        <p key={i} className="mb-2 text-green-400 font-mono">{line}</p>
      ))}
      {showChoices && (
        <div className="flex gap-4 mt-4 justify-center">
          <button className="border px-4 py-2 hover:bg-green-700" onClick={() => onChoice("jump")}>
            JUMP
          </button>
          <button className="border px-4 py-2 hover:bg-yellow-700" onClick={() => onChoice("wait")}>
            WAIT
          </button>
          <button className="border px-4 py-2 hover:bg-red-700" onClick={() => onChoice("sip")}>
            SIP COFFEE
          </button>
        </div>
      )}
    </div>
  );
}
