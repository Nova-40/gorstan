// RoomRenderer.jsx
// Renders a room in the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";

/**
 * RoomRenderer Component
 * Renders a room based on the provided room ID.
 *
 * Props:
 * - roomId: The ID of the room to render.
 */
export default function RoomRenderer({ roomId }) {
  // Fetch the room data
  const room = rooms[roomId];

  // Handle missing room
  if (!room) {
    console.warn("🚨 Room not found:", roomId);
    return <div className="text-red-400 p-4">🚨 Room "{roomId}" not found.</div>;
  }

  console.log("🧩 Rendering room:", roomId, room);

  /**
   * Helper function to get exits as a string.
   * @returns {string} A comma-separated list of exits.
   */
  const getExits = () => {
    if (!room.exits) return "None";
    const exits = typeof room.exits === "function" ? room.exits({}) : room.exits;
    return Object.keys(exits).join(", ");
  };

  return (
    <div className="p-4">
      {/* Room Image */}
      {room.image ? (
        <div className="mb-2 border border-green-700 p-3 rounded shadow-md bg-gray-900">
          <img
            src={room.image}
            alt={`Room: ${roomId}`}
            className="max-w-[640px] w-full mx-auto rounded"
            onError={(e) => {
              console.warn("⚠️ Failed to load room image:", room.image);
              e.target.src = "/placeholder.png"; // Fallback image
            }}
          />
        </div>
      ) : (
        <div className="text-gray-500 italic mb-2">(No image available for this room)</div>
      )}

      {/* Room Exits */}
      <div className="text-sm text-green-400 mt-2">
        <strong>Exits:</strong> {getExits()}
      </div>
    </div>
  );
}

// PropTypes for type-checking
RoomRenderer.propTypes = {
  roomId: PropTypes.string.isRequired, // The ID of the room to render
};