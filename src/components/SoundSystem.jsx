// MIT License
// Gorstan Game v2.3.2
// © 2025 Geoff Webster
// SoundSystem.js – Provides mute toggle and optional future sound handling.

import React from "react";

/**
 * A floating mute toggle component for use in Quick Actions or global overlay.
 */
export default function SoundSystem({ muted, toggleMute }) {
  return (
    <button
      onClick={toggleMute}
      className="text-green-400 border border-green-400 px-2 py-1 text-xs rounded hover:bg-green-900 transition"
      title={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? "🔇" : "🎵"}
    </button>
  );
}
