// File: src/components/RoomGuard.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: RoomGuard.jsx – v2.7.2


import React from "react";
import PropTypes from "prop-types";
import rooms from "../engine/rooms"; // Fixed import path

export default function RoomGuard({ currentRoom, playerName = "Player", devMode = false }) {
  const room = rooms?.[currentRoom];

  if (!room) {
    console.warn("⚠️ RoomGuard: No room found for ID", currentRoom);
    return (
      <div className="text-yellow-400 p-6 text-center">
        ⚠️ No Room Selected
        <br />
        <span className="text-sm text-green-300">Please select a valid room to continue.</span>
      </div>
    );
  }

  return (
    <div className="mb-6 border-b border-green-800 pb-4">
      <h2 className="text-xl text-green-300 mb-2">{room.title}</h2>
      {room.image && (
        <img
          src={room.image}
          alt={room.title}
          className="w-full max-h-96 object-cover rounded border border-green-700 mb-3"
        />
      )}
      <p className="mb-2">{room.description}</p>

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

      {devMode && (
        <div className="text-xs text-green-500 mt-4 border-t pt-2 border-green-800">
          <strong>Room ID:</strong> {room.id}
          <br />
          <strong>Zone:</strong> {room.zone} (#{room.zoneNumber})
          <br />
          <strong>Exits:</strong>{" "}
          {Object.entries(room.exits || {}).map(([dir, id]) => (
            <span key={dir}>{dir} → {id}{"  "}</span>
          ))}
        </div>
      )}
    </div>
  );
}

RoomGuard.propTypes = {
  currentRoom: PropTypes.string.isRequired,
  playerName: PropTypes.string,
  devMode: PropTypes.bool,
};

