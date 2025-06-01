// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// PortalFall.jsx — Module supporting Gorstan gameplay or UI.

import React, { useEffect } from "react";

/**
 * PortalFall
 * Displays a brief animated transition after the player jumps through the portal.
 * Calls onComplete after a short delay to advance the game flow.
 */
const PortalFall = ({ onComplete }) => {
  useEffect(() => {
    // Set a timer to trigger onComplete after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    // Clean up the timer if the component unmounts early
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-blue-400 font-mono px-4">
      <div className="border border-blue-500 rounded-2xl p-6 w-full max-w-xl text-center shadow-lg bg-black/90">
        <h2 className="text-2xl font-bold mb-4">🌀 You jumped...</h2>
        <p className="mb-2">The air splits around you. Gravity twists.</p>
        <p className="mb-2">Your coffee floats beside you for a moment—</p>
        <p className="text-sm text-blue-300">—and then everything goes dark.</p>
        <p className="text-xs text-blue-200 mt-4">You're falling through... the Gorstan breach.</p>
      </div>
    </div>
  );
};

export default PortalFall;
