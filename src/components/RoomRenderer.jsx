// Gorstan v2.2.2 – All modules validated and standardized
// RoomRenderer.jsx – Enhanced with NPC rendering
// Version 2.2.0
// MIT License (c) 2025 Geoff Webster
import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";
import { NPCs } from "../engine/npcs";
/**
 * RoomRenderer Component
 * Renders the current room's description, image, and visible NPCs.
 * Handles missing/invalid roomId and room data defensively.
 *
 * Props:
 * - roomId (string, required): The ID of the room to render.
 * - playerName (string, optional): The player's name (reserved for future personalization).
 */
export default function RoomRenderer({ roomId, playerName }) {
  // Defensive: Handle missing or invalid roomId
  if (!roomId || typeof roomId !== "string") {
    console.error("❌ RoomRenderer: Invalid or missing roomId prop.", roomId);
    return (
      <div className="text-yellow-400 p-4">
        <h2 className="text-xl font-bold mb-2">⚠️ No Room Selected</h2>
        <p>Please select a valid room to continue.</p>
      </div>
    );
  }
  // Defensive: Retrieve the room object
  const room = rooms[roomId];
  if (!room) {
    console.error(`❌ RoomRenderer: Unknown room: ${roomId}`);
    return (
      <div className="text-red-500 p-4">
        <h2 className="text-xl font-bold mb-2">❌ Unknown Room</h2>
        <p>The room with ID "{roomId}" could not be found.</p>
      </div>
    );
  }
  // Get visible NPCs for this room
  const visibleNpcs = Object.entries(NPCs)
    .filter(([_, npc]) => typeof npc.isVisible === "function" && npc.isVisible(roomId))
    .map(([name]) => name);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{roomId}</h2>
      <p className="mb-4">{room.description || <span className="text-gray-400 italic">No description available.</span>}</p>
      {visibleNpcs.length > 0 && (
        <div className="mt-3 text-green-300">
          <strong>Characters here:</strong> {visibleNpcs.join(", ")}
        </div>
      )}
      {room.image && (
        <img
          src={room.image}
          alt={room.description ? `Scene of ${roomId}: ${room.description}` : `Scene of ${roomId}`}
          className="mt-4 w-full rounded shadow-lg border border-green-700"
          onError={e => {
            e.target.style.display = "none";
            console.warn(`⚠️ RoomRenderer: Failed to load image for room "${roomId}".`);
          }}
        />
      )}
    </div>
  );
}
RoomRenderer.propTypes = {
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string,
};
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Defensive error handling for missing/invalid roomId and room object.
  - Handles missing room description and image gracefully.
  - Ensures NPCs are only shown if their isVisible method exists and returns true.
  - All syntax validated and ready for use in the Gorstan game.
  - Comments improved for maintainability and clarity.
*/
