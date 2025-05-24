
// RoomRenderer.jsx – Updated for numeric room keys and rich room detail
// MIT License © 2025 Geoff Webster

import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";
import { NPCs } from "../engine/npcManager";

export default function RoomRenderer({ roomId, playerName = "Player" }) {
  if (!roomId || typeof roomId !== "string") {
    console.error("❌ RoomRenderer: Invalid or missing roomId prop.", roomId);
    return (
      <div className="text-yellow-400 p-4">
        <h2 className="text-xl font-bold mb-2">⚠️ No Room Selected</h2>
        <p>Please select a valid room to continue.</p>
      </div>
    );
  }

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

  const visibleNpcs = Object.entries(NPCs || {})
    .filter(([_, npc]) => typeof npc.isVisible === "function" && npc.isVisible(roomId))
    .map(([name]) => name);

  return (
    <div className="p-4 border-b border-green-800">
      <h2 className="text-2xl font-bold text-green-300 mb-2">{room.title}</h2>

      {room.image && (
        <img
          src={room.image}
          alt={room.title}
          className="w-full max-h-96 object-cover rounded border border-green-700 mb-3"
        />
      )}

      <p className="mb-2 text-green-200">{room.description || <span className="text-gray-400 italic">No description available.</span>}</p>

      {room.npc && (
        <div className="text-green-400 italic mt-2">
          Someone is here: <strong>{room.npc}</strong>
        </div>
      )}

      {room.trap && (
        <div className="text-red-500 mt-2">
          ⚠️ This room may contain a trap ({room.trapLevel || "unknown danger"})
        </div>
      )}

      {visibleNpcs.length > 0 && (
        <div className="text-sm text-green-300 mt-2">
          <strong>Other visible figures:</strong> {visibleNpcs.join(", ")}
        </div>
      )}
    </div>
  );
}

RoomRenderer.propTypes = {
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string
};
