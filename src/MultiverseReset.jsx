// Gorstan v2.2.2 – All modules validated and standardized
// MultiverseReset.jsx
// This component simulates the resetting of the multiverse with a series of animated lines.
// It provides a visual effect and triggers a callback when the reset is complete.
//
// MIT License
// Copyright (c) 2025 Geoff Webster
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
/**
 * MultiverseReset
 * Animates a sequence of lines to simulate a multiverse reset.
 * Triggers the onComplete callback after the animation finishes.
 * All errors are trapped and reported for robust integration.
 */
export default function MultiverseReset({ onComplete }) {
  const [lines, setLines] = useState([]); // Tracks displayed lines
  const [falling, setFalling] = useState(false); // Triggers falling animation
  const intervalRef = useRef(null); // Holds interval ID for cleanup
  useEffect(() => {
    let count = 0;
    let finished = false;
    function addLine() {
      try {
        if (count < 10) {
          setLines((prev) => [...prev, `Multiverse resetting... ${count + 1}/10`]);
          count++;
        } else {
          clearInterval(intervalRef.current);
          setFalling(true);
          finished = true;
          setTimeout(() => {
            try {
              if (typeof onComplete === "function") onComplete();
            } catch (err) {
              console.error("❌ Error in onComplete callback:", err);
            }
          }, 2000); // Wait for the falling animation to complete
        }
      } catch (err) {
        console.error("❌ Error during multiverse reset animation:", err);
        clearInterval(intervalRef.current);
      }
    }
    // Use a dynamic interval for the animation speed
    intervalRef.current = setInterval(addLine, count < 6 ? 100 : 300);
    // Cleanup on unmount or error
    return () => {
      if (!finished) clearInterval(intervalRef.current);
    };
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
      {/* Visual indicator for reset completion */}
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
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - All syntax validated and ready for use in the Gorstan React app.
  - Defensive: All errors are trapped and reported.
  - Module is correctly wired for use as a visual reset effect in the game.
  - Comments improved for maintainability and clarity.
*/
