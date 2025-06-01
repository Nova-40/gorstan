// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// SplatScreen.jsx — Module supporting Gorstan gameplay or UI.

import React, { useEffect } from "react";

/**
 * SplatScreen
 * Shows a "SPLAT" animation and message after a fatal event.
 * Calls onComplete after a short delay to advance the game flow.
 */
const SplatScreen = ({ onComplete }) => {
  useEffect(() => {
    // Set a timer to trigger onComplete after 3.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // SPLAT pause before transitioning
    // Clean up the timer if the component unmounts early
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-red-500 font-mono px-4">
      <div className="border border-red-700 rounded-2xl p-6 w-full max-w-xl text-center shadow-xl bg-black/90">
        <h2 className="text-3xl font-bold mb-4 animate-pulse">💥 SPLAT!</h2>
        <p className="mb-4">The truck didn't stop.</p>
        <p className="text-sm text-red-400">You feel yourself detaching... like falling through layers of static.</p>
        <p className="text-xs text-red-300 mt-4">Reality is... recalibrating.</p>
      </div>
    </div>
  );
};

export default SplatScreen;
