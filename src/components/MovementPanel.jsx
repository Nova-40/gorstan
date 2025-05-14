// MovementPanel.jsx
// Displays movement and quick action buttons for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import React from "react";
import PropTypes from "prop-types";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  Timer,
  ArrowBigUpDash,
} from "lucide-react";

import { rooms } from "../engine/rooms";

/**
 * MovementPanel Component
 * Displays movement buttons for navigating the game world and quick action buttons for common commands.
 *
 * Props:
 * - engineRef: A reference to the GameEngine instance.
 * - iconSize: The size of the icons used in the buttons (default: 18).
 * - buttonClassName: Additional CSS classes for the buttons (default: "p-2").
 */
export default function MovementPanel({
  engineRef,
  iconSize = 18,
  buttonClassName = "p-1 w-8 h-8 flex items-center justify-center text-green-100 text-xs",
}) {
  /**
   * Handles movement and action commands.
   * @param {string} command - The command to process.
   */
  const handleMove = (command) => {
    if (engineRef?.current?.processCommand) {
      try {
        engineRef.current.processCommand(command);
      } catch (err) {
        console.error(`❌ Error processing command "${command}":`, err);
      }
    } else {
      console.warn("⚠️ GameEngine reference is not available.");
    }
  };

  /**
   * Toggles fullscreen mode for the application.
   */
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("❌ Error toggling fullscreen mode:", err);
    }
  };

  // Get the current room and its exits
  const currentRoom = engineRef?.current?.currentRoom;
  const room = rooms[currentRoom];
  const exits = room?.exits
    ? typeof room.exits === "function"
      ? room.exits(engineRef.current)
      : room.exits
    : {};

  // Define movement directions
  const directions = [
    { cmd: "north", icon: <ArrowUp size={iconSize} />, label: "⬆️", active: !!exits?.north },
    { cmd: "south", icon: <ArrowDown size={iconSize} />, label: "⬇️", active: !!exits?.south },
    { cmd: "west", icon: <ArrowLeft size={iconSize} />, label: "⬅️", active: !!exits?.west },
    { cmd: "east", icon: <ArrowRight size={iconSize} />, label: "➡️", active: !!exits?.east },
  ];

  // Define quick actions
  const actions = [
    { cmd: "throw coffee", icon: <span className="text-lg">☕</span>, label: "Throw Coffee" },
    { cmd: "look", icon: <Eye size={iconSize} />, label: "Look" },
    { cmd: "wait", icon: <Timer size={iconSize} />, label: "Wait" },
    { cmd: "jump", icon: <ArrowBigUpDash size={iconSize} />, label: "Jump" },
  ];

  return (
    <div className="bg-gray-800 p-2 rounded-xl border border-green-500 shadow-md">
      {/* Panel Title */}
      <div className="border border-green-500 rounded-lg p-2">
        <h2 className="text-white text-md font-semibold mb-3 font-sans">Quick Actions</h2>

        {/* Movement and Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2 items-center">
          {/* Direction Buttons */}
          {directions.map(({ cmd, icon, label, active }) => (
            <button
              key={cmd}
              onClick={() => active && handleMove(cmd)}
              className={`rounded ${
                active
                  ? "bg-gray-700 hover:bg-green-600"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              } ${buttonClassName}`}
              title={label}
              aria-label={label}
              disabled={!active}
            >
              {icon}
            </button>
          ))}

          {/* Quick Action Buttons */}
          {actions.map(({ cmd, icon, label }) => (
            <button
              key={cmd}
              onClick={() => handleMove(cmd)}
              className={`rounded bg-gray-700 hover:bg-blue-600 ${buttonClassName}`}
              title={label}
              aria-label={label}
            >
              {icon}
            </button>
          ))}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`rounded bg-gray-700 hover:bg-yellow-600 ${buttonClassName}`}
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}

// PropTypes for type-checking
MovementPanel.propTypes = {
  engineRef: PropTypes.object.isRequired, // Reference to the GameEngine instance
  iconSize: PropTypes.number, // Size of the icons used in the buttons
  buttonClassName: PropTypes.string, // Additional CSS classes for the buttons
};




