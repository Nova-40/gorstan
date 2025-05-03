import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";

/**
 * RoomRenderer Component
 * Renders the current room's image, description, and available exits.
 */
export default function RoomRenderer({ roomId }) {
  try {
    if (!roomId || typeof roomId !== "string") {
      throw new Error("Invalid room ID. Please provide a valid room identifier.");
    }

    const room = rooms[roomId];
    if (!room) {
      throw new Error(`Room with ID "${roomId}" not found.`);
    }

    return (
      <div className="mb-4 border border-green-700 p-4 rounded shadow-md bg-gray-900">
        {/* Room Image */}
        {room.image && (
          <div className="mb-4">
            <img
              src={room.image}
              alt={`Visual for ${room.name || roomId}`}
              className="w-full max-h-60 object-cover border border-green-700 rounded"
            />
          </div>
        )}

        {/* Room Description */}
        <div className="text-green-300 text-sm mb-4">
          {typeof room.description === "function"
            ? room.description({})
            : room.description || "This room has no description yet."}
        </div>

        {/* Room Exits */}
        {room.exits && (
  <div className="mt-4">
    <div className="text-green-500 font-semibold mb-1 text-xs uppercase tracking-wide">
      Exits:
    </div>
    <ul className="pl-4 text-green-300 text-xs space-y-1 list-none">
      {Object.keys(room.exits).map((direction, index) => (
        <li key={index}>{direction.toUpperCase()}</li>
      ))}
    </ul>
  </div>
)}
      </div>
    );
  } catch (err) {
    console.error(`❌ Error rendering RoomRenderer for roomId "${roomId}":`, err);
    return (
      <div className="border border-red-700 p-4 rounded shadow-md bg-gray-900">
        <div className="font-bold text-red-500">Error</div>
        <p className="text-gray-400 text-sm">Failed to load the room. Please try again later.</p>
      </div>
    );
  }
}

RoomRenderer.propTypes = {
  roomId: PropTypes.string.isRequired,
};