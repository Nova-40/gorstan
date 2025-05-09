// IntroSequence.jsx
// Intro sequence for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
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
    "Brace for impact...",
  ];

  const [index, setIndex] = useState(0); // Tracks the current message index
  const [showSkip, setShowSkip] = useState(false); // Controls visibility of the "Skip Intro" button
  const [isCompleted, setIsCompleted] = useState(false); // Prevents multiple calls to onComplete

  // Validate the onComplete prop
  if (typeof onComplete !== "function") {
    throw new Error("❌ Invalid prop: 'onComplete' must be a function.");
  }

  useEffect(() => {
    let msgTimer; // Timer for updating the message index
    let completeTimer; // Timer for completing the intro sequence
    let skipTimer; // Timer for showing the "Skip Intro" button

    // Function to handle the completion of the intro sequence
    const handleComplete = () => {
      if (!isCompleted) {
        setIsCompleted(true);
        onComplete();
      }
    };

    // Timer to update the message index
    msgTimer = setInterval(() => {
      setIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(msgTimer); // Stop the timer when the last message is reached
          return prev;
        }
      });
    }, 1000); // Change message every 1 second

    // Timer to automatically complete the intro sequence
    completeTimer = setTimeout(() => {
      handleComplete();
    }, messages.length * 1000); // Complete after all messages are displayed

    // Timer to show the "Skip Intro" button after 1.5 seconds
    skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 1500);

    // Cleanup timers on component unmount
    return () => {
      clearInterval(msgTimer);
      clearTimeout(completeTimer);
      clearTimeout(skipTimer);
    };
  }, [messages.length, onComplete, isCompleted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-lg relative">
      {/* Display the current message */}
      <p>{messages[index]}</p>

      {/* Skip Intro Button */}
      {showSkip && (
        <button
          onClick={() => {
            setIsCompleted(true); // Prevent multiple calls to onComplete
            onComplete();
          }}
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