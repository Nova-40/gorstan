import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";

/**
 * RoomRenderer Component
 * This component renders the details of a room, including its name, description, and visual representation.
 * It handles missing or invalid room data gracefully and ensures proper rendering of room details.
 *
 * Props:
 * - roomId: The identifier of the room to render.
 */
export default function RoomRenderer({ roomId }) {
  try {
    // Validate the roomId and retrieve room data
    if (!roomId || typeof roomId !== "string") {
      throw new Error("Invalid room ID. Please provide a valid room identifier.");
    }

    const room = rooms[roomId];

    // Handle missing room data
    if (!room) {
      throw new Error(`Room with ID "${roomId}" not found.`);
    }

    return (
      <div className="mb-4 border border-green-700 p-4 rounded shadow-md bg-gray-900">
        {/* Room Title */}
        <div className="text-yellow-400 text-lg mb-2 font-bold">Room: {room.name || roomId}</div>

        {/* Room Description */}
        <div className="text-green-300 text-sm mb-4">{room.description || "No description available."}</div>

        {/* Room Visual Representation */}
        <div className="h-40 bg-gray-800 flex items-center justify-center text-green-400 rounded">
          [Image or visual for {room.name || roomId} here]
        </div>

        {/* Room Exits */}
        {room.exits && (
          <div className="mt-4">
            <div className="text-green-400 font-semibold mb-2">Exits:</div>
            <ul className="list-disc list-inside text-green-300 text-sm">
              {Object.entries(room.exits).map(([direction, targetRoom], index) => (
                <li key={index}>
                  {direction.toUpperCase()}: {targetRoom}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error("❌ Error rendering RoomRenderer:", err);
    return (
      <div className="border border-red-700 p-4 rounded shadow-md bg-gray-900">
        <div className="font-bold text-red-500">Error</div>
        <p className="text-gray-400 text-sm">Failed to load the room. Please try again later.</p>
      </div>
    );
  }
}

// PropTypes for type-checking
RoomRenderer.propTypes = {
  roomId: PropTypes.string.isRequired, // The identifier of the room to render
};
