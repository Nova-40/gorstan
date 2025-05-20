// Gorstan v2.2.2 – All modules validated and standardized
// StarterFrame.jsx
// Displays the Gorstan initiation splash screen and auto-continues after a delay.
// Version 2.2.0
// MIT License Copyright (c) 2025 Geoff Webster
import React, { useEffect } from "react";
import PropTypes from "prop-types";
/**
 * StarterFrame Component
 * Shows a splash image and automatically calls onContinue after 5 seconds.
 * Handles errors in callback and image loading.
 *
 * Props:
 * - onContinue (function): Callback to proceed to the next stage (required).
 */
export default function StarterFrame({ onContinue }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof onContinue === "function") {
          onContinue();
        } else {
          throw new Error("onContinue prop is not a function.");
        }
      } catch (err) {
        // Defensive: log error if callback fails
        console.error("❌ StarterFrame: Error in onContinue callback.", err);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [onContinue]);
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <img
        src="/images/starterframe.png"
        alt="Gorstan Initiation Protocol"
        className="max-w-full max-h-screen object-contain"
        onError={(e) => {
          e.target.style.display = "none";
          console.error("❌ StarterFrame: Failed to load starter image.");
        }}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
StarterFrame.propTypes = {
  onContinue: PropTypes.func.isRequired,
};
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Added loading="lazy" and draggable={false} for image efficiency and UX.
  - Defensive error handling for callback and image loading.
  - All syntax validated and ready for use in the Gorstan game.
  - Component is fully wired for game integration.
  - Comments improved for maintainability and clarity.
*/
