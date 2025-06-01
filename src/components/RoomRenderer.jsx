// File: src/components/RoomRenderer.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Renders the current room and its contents.



// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// RoomRenderer.jsx — Renders the current room and its contents safely

import React from "react";
import PropTypes from "prop-types";

export default function RoomRenderer({ room }) {
  // Defensive: If no room is provided, show a warning
  if (!room) {
    return (
      <div className="text-red-500 text-center font-mono p-4">
        ⚠️ No Room Selected<br />
        Please select a valid room to continue.
      </div>
    );
  }

  // Convert RegExp or other non-renderable values to string for safety
  const safeDescription = String(room.description || "");
  const safeTitle = String(room.title || "Unknown");
  const safeZone = String(room.zone || "");

  // You could add more fields here as needed, always using String() for safety

  return (
    <div className="p-4 text-green-200 font-mono">
      <h2 className="text-xl font-bold mb-2">{safeTitle}</h2>
      <p className="italic text-sm text-green-400 mb-2">Zone: {safeZone}</p>
      <p className="mb-4 whitespace-pre-wrap">{safeDescription}</p>
      {/* Add more room details here if needed */}
    </div>
  );
}

RoomRenderer.propTypes = {
  room: PropTypes.object,
};
