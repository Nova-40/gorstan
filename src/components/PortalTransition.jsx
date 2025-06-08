// Gorstan Game Module — v2.9.0
// MIT License © 2025 Geoff Webster
// PortalTransition.jsx — Animated portal/transition screen for room/scene changes

import React from "react";

/**
 * PortalTransition
 * Displays an animated transition when the player moves between realities/rooms.
 * @component
 * @returns {JSX.Element}
 */
export default function PortalTransition() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono text-xl text-center p-6 animate-pulse">
      <div>
        <p aria-live="polite">You tumble through a spinning void.</p>
        <p>Reality rewrites itself. Hold on...</p>
      </div>
    </div>
  );
}

/*
Review summary:
- ✅ Syntax is correct and logic is preserved.
- ✅ JSDoc comment for the component.
- ✅ Accessible: aria-live for screen readers on the main transition message.
- ✅ No dead code or unused imports.
- ✅ Tailwind classes for consistent UI.
- ✅ Structure is modular and ready for integration.
*/