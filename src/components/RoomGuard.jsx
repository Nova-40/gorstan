// RoomGuard.jsx
import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";

export default function RoomGuard({ roomId, playerName, devMode }) {
  if (!roomId) {
    return <div className="text-yellow-400">⚠️ No room selected</div>;
  }

  const room = rooms[roomId];
  let exits = {};
  try {
    exits = typeof room.exits === "function" ? room.exits({}) : room.exits || {};
  } catch (err) {
    console.error(`❌ Error retrieving exits for room "${roomId}":`, err);
    exits = {};
  }

  return (
    <div className="p-4 text-white">
      {room.image && (
        <img
          src={room.image}
          alt={room.description || `Room ${roomId}`}
          className="w-full max-w-3xl mx-auto mb-4 rounded shadow-md"
        />
      )}
      {devMode && (
        <>
          <p className="text-sm italic text-gray-400 mb-1">Room ID: {roomId}</p>
          <p className="text-green-300 mb-2">{room.description}</p>
        </>
      )}
      <div className="text-green-300">
        <strong>Exits:</strong> {Object.keys(exits).length > 0 ? Object.keys(exits).join(", ") : "None"}
      </div>
    </div>
  );
}

RoomGuard.propTypes = {
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string,
  devMode: PropTypes.bool,
};




