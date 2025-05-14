
// TeletypeIntro_Upgraded.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.1

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * TeletypeIntro Component
 * Displays an introductory sequence with a teletype-style animation (char-by-char) and presents choices to the player.
 *
 * Props:
 * - onChoice (function): Callback function to handle the player's choice.
 * - playerName (string): The name of the player to personalise the intro.
 */
export default function TeletypeIntro({ onChoice, playerName }) {
  const baseLines = [
    `GOOD DAY, ${playerName}!`,
    "You’re walking home from work, coffee in hand.",
    "The sun hangs low, casting long, golden shadows across the pavement.",
    "You’re tired — the kind of tired that settles in your bones — but home is close.",
    "You take a sip, savouring the coffee’s fading warmth.",
    "The world is quiet. Not silence, but that rare, comforting hush that feels like safety.",
    "Your thoughts drift: the day’s oddities, those small, strange moments you can’t quite explain.",
    "A lavender rabbit. White ghost-like eyes. Watching you as if it already knew the ending to your story.",
    "The crossing light flashes green. You step forward.",
    "WAIT — WHAT’S THAT?",
    "A BIG YELLOW TRUCK — barreling toward you like it’s got something to prove.",
    "Your instincts scream:"
  ];

  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    if (lineIndex < baseLines.length) {
      if (charIndex < baseLines[lineIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + baseLines[lineIndex][charIndex]);
          setCharIndex(charIndex + 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        // Full line typed, add to lines and move to next
        const timeout = setTimeout(() => {
          setLines((prev) => [...prev, baseLines[lineIndex]]);
          setCurrentLine("");
          setCharIndex(0);
          setLineIndex(lineIndex + 1);
        }, 500);
        return () => clearTimeout(timeout);
      }
    } else if (!showChoices) {
      const timeout = setTimeout(() => {
        setShowChoices(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex]);

  return (
    <div className="min-h-screen p-4 font-mono bg-black text-green-400 text-lg leading-relaxed">
      {lines.map((line, i) => (
        <p key={i} className="mb-2">{line}</p>
      ))}
      {currentLine && (
        <p className="mb-2">
          {currentLine}
          <span className="animate-pulse">▊</span>
        </p>
      )}

      {showChoices && (
        <div className="mt-6 space-x-4">
          <button
            className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded"
            onClick={() => onChoice("jump")}
          >
            Jump!
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-800 text-white py-2 px-4 rounded"
            onClick={() => onChoice("sip")}
          >
            Sip Coffee
          </button>
          <button
            className="bg-red-700 hover:bg-red-900 text-white py-2 px-4 rounded"
            onClick={() => onChoice("wait")}
          >
            Wait
          </button>
        </div>
      )}
    </div>
  );
}

TeletypeIntro.propTypes = {
  onChoice: PropTypes.func.isRequired,
  playerName: PropTypes.string.isRequired,
};
