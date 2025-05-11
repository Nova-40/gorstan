// MultiverseReset.jsx
// This component simulates the resetting of the multiverse with a series of animated lines.
// It provides a visual effect and triggers a callback when the reset is complete.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function MultiverseReset({ onComplete }) {
  // State to track the lines being displayed
  const [lines, setLines] = useState([]);

  // State to track whether the falling animation is active
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    let count = 0; // Counter to track the number of lines added
    const interval = setInterval(() => {
      try {
        if (count < 10) {
          // Add a new line to the display
          setLines((prev) => [...prev, `Multiverse resetting... ${count + 1}/10`]);
          count++;
        } else {
          // Stop the interval and trigger the falling animation
          clearInterval(interval);
          setFalling(true);

          // Trigger the onComplete callback after the falling animation
          setTimeout(() => {
            try {
              onComplete();
            } catch (err) {
              console.error("❌ Error in onComplete callback:", err);
            }
          }, 2000); // Wait for the falling animation to complete
        }
      } catch (err) {
        console.error("❌ Error during multiverse reset animation:", err);
        clearInterval(interval); // Ensure the interval is cleared on error
      }
    }, count < 6 ? 100 : 300); // Faster interval for the first 6 lines, slower for the rest

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-end h-full overflow-hidden text-green-400 font-mono">
      {/* Render each line with optional falling animation */}
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`transition-transform duration-500 ${
            falling ? "animate-fall text-transparent" : ""
          }`}
        >
          {line}
        </div>
      ))}

      {/* Add a visual indicator for the reset process */}
      {falling && (
        <div className="mt-4 text-center text-yellow-400">
          <p>🌌 Multiverse Reset Complete 🌌</p>
        </div>
      )}
    </div>
  );
}

// PropTypes for type-checking
MultiverseReset.propTypes = {
  onComplete: PropTypes.func.isRequired, // Callback function triggered when the reset is complete
};
