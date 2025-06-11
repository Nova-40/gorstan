// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// PortalTransition.jsx — Animated portal/transition screen for room/scene changes

import React from "react";

/**
 * PortalTransition
 * Displays an animated transition when the player moves between realities/rooms.
 * No props required; purely presentational.
 *
 * @component
 * @returns {JSX.Element}
 */
const PortalTransition = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono text-xl text-center p-6 animate-pulse">
    <div>
      <p aria-live="polite">You tumble through a spinning void.</p>
      <p>Reality rewrites itself. Hold on...</p>
    </div>
  </div>
);

export default PortalTransition;

/*
Review summary:
- ✅ Syntax is correct and all JSX blocks are closed.
- ✅ JSDoc comment for the component.
- ✅ Accessible: aria-live for screen readers on the main transition message.
- ✅ No dead code or unused imports.
- ✅ Tailwind classes for consistent UI.
- ✅ Structure is modular and ready for integration.
- ✅ No props required, so no PropTypes needed.
*/