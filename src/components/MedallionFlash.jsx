// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// MedallionFlash.jsx
// Animated overlay for when the player unlocks the Medallion in Gorstan.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component).
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Can be conditionally rendered by parent (e.g., Game) when medallion is unlocked.
     - No props required; pure presentational overlay.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could accept a `message` or `icon` prop for reuse.
     - Could add a callback prop for animation end if needed.
     - Could add unit tests for rendering.
*/

import React from "react";

/**
 * MedallionFlash Component
 * Animated overlay for when the player unlocks the Medallion.
 * Pure presentational; no props required.
 */
export default function MedallionFlash() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-ping rounded-full border-4 border-yellow-400 bg-yellow-200/10 w-40 h-40 shadow-lg" />
      <div className="absolute text-yellow-300 text-xl font-bold glow">🧿 Medallion Unlocked!</div>
    </div>
  );
}
