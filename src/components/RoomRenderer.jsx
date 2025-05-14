// RoomRenderer.jsx
// Renders a room in the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.4 – Improved error handling, optimized rendering, and added detailed comments.

import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";

/**
 * RoomRenderer Component
 * Renders a room based on the provided room ID and displays its details.
 *
 * Props:
 * - roomId (string): The ID of the room to render. (Required)
 * - playerName (string): The name of the player for personalized greetings. (Optional)
 */
export default function RoomRenderer({ roomId, playerName }) {
  // Retrieve the room object based on the roomId
  const room = rooms[roomId];

  // Handle missing room gracefully
  if (!room) {
    console.error(`🚨 Room not found: "${roomId}". Ensure the room ID is valid and exists in rooms.js.`);
    return (
      <div className="text-red-400 p-4">
        <h2 className="text-xl font-bold mb-2">🚨 Room Not Found</h2>
        <p>The room with ID "{roomId}" could not be found. Please check the game configuration.</p>
      </div>
    );
  }

  console.log("🧩 Rendering room:", roomId, "-", room.description || "No description available");

  // Determine exits (supports both static and dynamic exits)
  let exits = {};
  try {
    exits = typeof room.exits === "function" ? room.exits({}) : room.exits || {};
  } catch (err) {
    console.error(`❌ Error retrieving exits for room "${roomId}":`, err);
    exits = {}; // Fallback to no exits
  }

  return (
    <div className="p-4 text-white">
      {/* Render room image if available */}
      {room.image ? (
        <img
          src={room.image}
          alt={room.description || `Room ${roomId}`}
          className="w-full max-w-3xl mx-auto mb-4 rounded shadow-md"
        />
      ) : (
        <div className="text-gray-500 italic mb-4">No image available for this room.</div>
      )}

      {/* Render personalized greeting if playerName is provided */}
      {playerName && (
        <p className="text-lg font-semibold mb-2">Good day, {playerName}.</p>
      )}

      {/* Render room description */}
      <h2 className="text-xl font-bold mb-2">{room.description || "No description available"}</h2>

      {/* Render room ID */}
      <p className="text-sm italic text-gray-400 mb-4">Room ID: {roomId}</p>

      {/* Render exits */}
      <div>
        <strong>Exits:</strong> {Object.keys(exits).length > 0 ? Object.keys(exits).join(", ") : "None"}
      </div>
    </div>
  );
}

// Define prop types for the component
RoomRenderer.propTypes = {
  roomId: PropTypes.string.isRequired, // roomId is required and must be a string
  playerName: PropTypes.string, // playerName is optional and must be a string
};

