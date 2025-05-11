// TeletypeIntro.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Introductory lines displayed in a teletype effect.
 */
const introLines = [
  "GOOD DAY, traveller.",
  "You're on your way home.",
  "Coffee in hand. Light breeze. Brain ticking over today's weirdness...",
  "The traffic light is green. You step forward.",
  "WAIT — WHAT’S THAT?",
  "A BIG YELLOW TRUCK — barreling toward you like it’s got something to prove.",
  "Your instincts scream:"
];

/**
 * TeletypeIntro Component
 * Displays an introductory sequence with a teletype effect and presents choices to the player.
 *
 * Props:
 * - onChoice (function): Callback function to handle the player's choice.
 */
export default function TeletypeIntro({ onChoice }) {
  const [displayedLines, setDisplayedLines] = useState([]); // Lines currently displayed
  const [index, setIndex] = useState(0); // Current index of the line being displayed
  const [showChoices, setShowChoices] = useState(false); // Whether to show choice buttons

  /**
   * Handles the teletype effect by displaying one line at a time.
   * Once all lines are displayed, it shows the choice buttons.
   */
  useEffect(() => {
    if (index < introLines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, introLines[index]]);
        setIndex(index + 1);
      }, 1000); // Delay between lines
      return () => clearTimeout(timer); // Cleanup timer on unmount or index change
    } else {
      const buttonTimer = setTimeout(() => {
        setShowChoices(true); // Show choices after all lines are displayed
      }, 1000);
      return () => clearTimeout(buttonTimer); // Cleanup timer
    }
  }, [index]);

  /**
   * Handles the player's choice and passes it to the parent component.
   * @param {string} choice - The player's choice (e.g., "jump", "wait", "sip").
   */
  const handleChoice = (choice) => {
    if (typeof onChoice === "function") {
      onChoice(choice);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono p-6 space-y-4">
      {/* Display the teletype lines */}
      {displayedLines.map((line, i) => (
        <div key={i} className="animate-fade-in">
          {line}
        </div>
      ))}

      {/* Display choice buttons after the teletype effect */}
      {showChoices && (
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => handleChoice("jump")}
            className="bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
            aria-label="Choose to jump"
          >
            Jump
          </button>
          <button
            onClick={() => handleChoice("wait")}
            className="bg-yellow-600 hover:bg-yellow-800 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
            aria-label="Choose to wait"
          >
            Wait
          </button>
          <button
            onClick={() => handleChoice("sip")}
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
            aria-label="Choose to sip coffee"
          >
            Sip Coffee
          </button>
        </div>
      )}
    </div>
  );
}

TeletypeIntro.propTypes = {
  onChoice: PropTypes.func.isRequired // Callback function to handle the player's choice
};