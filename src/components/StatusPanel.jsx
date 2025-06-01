// File: src/components/StatusPanel.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// StatusPanel.jsx — Module supporting Gorstan gameplay or UI.

import React from "react";

/**
 * StatusPanel
 * Displays the player's current score in a fixed position.
 * Extend this component to show more status info if needed.
 */
export default function StatusPanel({ score }) {
  return (
    <div className="fixed top-2 right-2 bg-black bg-opacity-70 px-4 py-2 rounded text-green-300 text-sm z-50">
      Score: {score}
    </div>
  );
}
