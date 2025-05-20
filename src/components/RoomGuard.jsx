// Gorstan v2.2.2 – All modules validated and standardized
// RoomGuard.jsx
// MIT License – 2025 Geoff Webster
// Ensures a valid room ID is provided and renders the room details.
// Supports developer mode for additional debugging information.
import React from "react";
import PropTypes from "prop-types";
import { rooms } from "../engine/rooms";
/**
 * RoomGuard Component
 * Ensures a valid room ID is provided and renders the room details.
 * If the room ID is invalid, it displays a warning message.
 *
 * Props:
 * - roomId (string): The ID of the room to render. (Required)
 * - playerName (string): The name of the player for personalized greetings. (Optional)
 * - devMode (boolean): Enables developer mode to show additional debugging information. (Optional)
 */
export default function RoomGuard({ roomId, playerName, devMode }) {
  // Defensive: Handle missing roomId
  if (!roomId) {
    console.error("⚠️ RoomGuard: No room ID provided. Ensure a valid room ID is passed as a prop.");
    if (devMode) console.log(`🛡️ DevMode: Rendering room ${roomId}`);
    return (
      <div className="text-yellow-400 p-4">
        <h2 className="text-xl font-bold mb-2">⚠️ No Room Selected</h2>
        <p>Please select a valid room to continue.</p>
      </div>
    );
  }
  // Defensive: Retrieve the room object based on the roomId
  const room = rooms[roomId];
  if (!room) {
    console.error(`⚠️ RoomGuard: Room with ID "${roomId}" not found in rooms.js.`);
    if (devMode) console.log(`🛡️ DevMode: Rendering room ${roomId}`);
    return (
      <div className="text-red-400 p-4">
        <h2 className="text-xl font-bold mb-2">❌ Room Not Found</h2>
        <p>The room with ID "{roomId}" could not be found. Please check the game configuration.</p>
      </div>
    );
  }
  // Defensive: Determine exits (supports both static and dynamic exits)
  let exits = {};
  try {
    exits = typeof room.exits === "function"
      ? room.exits({ playerName }) // Pass playerName for dynamic exits if needed
      : room.exits || {};
  } catch (err) {
    console.error(`❌ RoomGuard: Error retrieving exits for room "${roomId}":`, err);
    exits = {}; // Fallback to no exits
  }
  if (devMode) console.log(`🛡️ DevMode: Rendering room ${roomId}`);
  return (
    <div className="p-4 text-white">
      {/* Render room image if available */}
      {room.image ? (
        <img
          src={room.image}
          alt={room.description || `Room ${roomId}`}
          className="w-full max-w-3xl mx-auto mb-4 rounded shadow-md"
          onError={(e) => {
            e.target.style.display = "none";
            console.warn(`⚠️ RoomGuard: Failed to load image for room "${roomId}".`);
          }}
        />
      ) : (
        <div className="text-gray-500 italic mb-4">No image available for this room.</div>
      )}
      {/* Room description */}
      <div className="mb-2">
        <span className="text-green-300">{room.description || "No description available."}</span>
      </div>
      {/* Personalized greeting if playerName is provided */}
      {playerName && (
        <div className="text-blue-300 text-sm mb-2">
          Welcome, {playerName}!
        </div>
      )}
      {/* Developer mode: Show additional debugging information */}
      {devMode && (
        <div className="text-xs text-yellow-200 mb-2">
          <div>Room ID: <span className="font-mono">{roomId}</span></div>
          <div>Raw exits: <span className="font-mono">{JSON.stringify(room.exits)}</span></div>
        </div>
      )}
      {/* Render exits */}
      <div>
        <strong>Exits:</strong> {Object.keys(exits).length > 0 ? Object.keys(exits).join(", ") : "None"}
      </div>
    </div>
  );
}
// Define prop types for the component
RoomGuard.propTypes = {
  roomId: PropTypes.string.isRequired, // roomId is required and must be a string
  playerName: PropTypes.string, // playerName is optional and must be a string
  devMode: PropTypes.bool, // devMode is optional and must be a boolean
};
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Defensive error handling for missing/invalid roomId and room object.
  - All syntax validated and ready for use in the Gorstan game.
  - Component is fully wired for game integration.
  - Comments improved for maintainability and clarity.
*/
