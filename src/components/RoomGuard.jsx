// RoomGuard.jsx
// Guards against invalid or missing room IDs and renders the appropriate room.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import React from "react";
import { rooms } from "../engine/rooms";
import RoomRenderer from "./RoomRenderer";
import PropTypes from 'prop-types';

/**
 * RoomGuard Component
 * Ensures that a valid room ID is provided and renders the appropriate room.
 * Displays loading or error messages when necessary.
 *
 * Props:
 * - roomId: The ID of the room to render.
 */
export default function RoomGuard({ roomId }) {
  // Handle loading state when roomId is null or undefined
  if (!roomId) {
    console.warn("⏳ RoomGuard received null or undefined roomId.");
    return (
      <div className="text-yellow-400 p-4 animate-pulse">
        ⏳ Loading room...
      </div>
    );
  }

  // Fetch the room data
  const room = rooms[roomId];

  // Handle error state when the room is not found
  if (!room) {
    console.error(`🚨 Room "${roomId}" not found.`);
    console.log("🔍 Available room IDs:", Object.keys(rooms));
    return (
      <div className="text-red-400 p-4">
        🚨 Room "{roomId}" not found.<br />
        Please check your game configuration or contact support.
      </div>
    );
  }

  // Render the room using RoomRenderer
  try {
    return <RoomRenderer roomId={roomId} />;
  } catch (err) {
    console.error("❌ Error rendering room:", err);
    return (
      <div className="text-red-400 p-4">
        ❌ An error occurred while rendering the room. Please try again later.
      </div>
    );
  }
}

// PropTypes for type-checking
RoomGuard.propTypes = {
  roomId: PropTypes.string.isRequired, // The ID of the room to render
};