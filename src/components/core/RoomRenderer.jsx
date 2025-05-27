// MIT License © 2025 Geoff Webster
// Gorstan Game v2.4.x
// RoomRenderer.jsx — Displays current room content and navigation

import React from "react";

export default function RoomRenderer({ room, onMove }) {
  if (!room) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>No Room Selected</p>
        <p>Please select a valid room to continue.</p>
      </div>
    );
  }

  const { title, image, description, exits } = room;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-black text-green-400 font-mono rounded-lg border border-green-600 shadow-lg space-y-4">
      <h2 className="text-2xl underline">{title}</h2>
      {image && (
        <div className="flex justify-center">
          <img src={image} alt={title} className="rounded-xl max-h-80 object-contain" />
        </div>
      )}
      <p className="text-base leading-relaxed">{description}</p>
      {exits && Object.keys(exits).length > 0 && (
        <div className="pt-4 space-y-2">
          <p className="text-green-300">Available directions:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(exits).map(([direction, target]) => (
              <button
                key={direction}
                onClick={() => onMove(direction)}
                className="bg-green-800 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
              >
                {direction}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
