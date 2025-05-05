// IntroSequence.jsx
// Intro sequence for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * IntroSequence Component
 * Displays a sequence of introductory messages to the user.
 * Automatically transitions to the next message and completes after the sequence ends.
 * Includes a "Skip Intro" button for users to bypass the sequence.
 *
 * Props:
 * - onComplete: Function to handle the completion of the intro sequence.
 */
export default function IntroSequence({ onComplete }) {
  // Array of messages to display during the intro sequence
  const messages = [
    "Reality is a construct...",
    "Calibrating your consciousness...",
    "Deploying the Gorstan protocol...",
    "Warning: truck detected.",
    "Brace for impact..."
  ];

  const [index, setIndex] = useState(0); // Tracks the current message index
  const [showSkip, setShowSkip] = useState(false); // Controls visibility of the "Skip Intro" button

  useEffect(() => {
    if (typeof onComplete !== "function") {
      console.error("❌ Invalid prop: 'onComplete' must be a function.");
      return;
    }

    // Timer to update the message index
    const msgTimer = setInterval(() => {
      setIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        clearInterval(msgTimer); // Stop the timer when the last message is reached
        return prev;
      });
    }, 1000); // Change message every 1 second

    // Timer to automatically complete the intro sequence
    const completeTimer = setTimeout(() => {
      onComplete();
    }, messages.length * 1000); // Complete after all messages are displayed

    // Timer to show the "Skip Intro" button after 1.5 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 1500);

    // Cleanup timers on component unmount
    return () => {
      clearInterval(msgTimer);
      clearTimeout(completeTimer);
      clearTimeout(skipTimer);
    };
  }, [onComplete, messages.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-lg relative">
      {/* Display the current message */}
      <p>{messages[index]}</p>

      {/* Skip Intro Button */}
      {showSkip && (
        <button
          onClick={onComplete}
          className="absolute bottom-4 right-4 text-sm underline text-yellow-300"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
}

// PropTypes for type-checking
IntroSequence.propTypes = {
  onComplete: PropTypes.func.isRequired, // Function to handle the completion of the intro sequence
};