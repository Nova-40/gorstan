// MovementPanel.jsx
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

export default function MovementPanel({
  engineRef,
  iconSize = 18,
  buttonClassName = "p-2",
}) {
  const handleMove = (command) => {
    if (engineRef.current?.processCommand) {
      try {
        engineRef.current.processCommand(command);
      } catch (err) {
        console.error(`❌ Error processing command "${command}":`, err);
      }
    } else {
      console.warn("⚠️ GameEngine reference is not available.");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const currentRoom = engineRef.current?.currentRoom;
  const room = rooms[currentRoom];
  const exits = currentRoom
    ? typeof room?.exits === 'function'
      ? room.exits(engineRef.current)
      : room?.exits || {}
    : {};

  const directions = [
    { cmd: "north", icon: <ArrowUp size={iconSize} />, label: "North", active: !!exits.north },
    { cmd: "south", icon: <ArrowDown size={iconSize} />, label: "South", active: !!exits.south },
    { cmd: "west", icon: <ArrowLeft size={iconSize} />, label: "West", active: !!exits.west },
    { cmd: "east", icon: <ArrowRight size={iconSize} />, label: "East", active: !!exits.east },
  ];

  const actions = [
    { cmd: "look", icon: <Eye size={iconSize} />, label: "Look" },
    { cmd: "wait", icon: <Timer size={iconSize} />, label: "Wait" },
    { cmd: "jump", icon: <ArrowBigUpDash size={iconSize} />, label: "Jump" },
  ];

  return (
    <div className="bg-gray-800 p-3 rounded-xl border border-green-500 shadow-lg">
      <h2 className="text-white text-md font-semibold mb-3 font-sans">Quick Actions</h2>
      <div className="flex flex-wrap justify-center gap-2 items-center">
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
            disabled={!active}
          >
            {icon}
          </button>
        ))}

        {actions.map(({ cmd, icon, label }) => (
          <button
            key={cmd}
            onClick={() => handleMove(cmd)}
            className={`rounded bg-gray-700 hover:bg-blue-600 ${buttonClassName}`}
            title={label}
          >
            {icon}
          </button>
        ))}

        <button
          onClick={toggleFullscreen}
          className={`rounded bg-gray-700 hover:bg-yellow-600 ml-2 ${buttonClassName}`}
          title="Toggle Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}

MovementPanel.propTypes = {
  engineRef: PropTypes.object.isRequired,
  iconSize: PropTypes.number,
  buttonClassName: PropTypes.string,
};




