// MIT License
// Gorstan Game v2.3.2
// © 2025 Geoff Webster
// MovementPanel.jsx – Includes mute toggle inside Quick Actions

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
import SoundSystem from "./SoundSystem";

export default function MovementPanel({
  engineRef,
  iconSize = 18,
  buttonClassName = "p-1 w-8 h-8 flex items-center justify-center text-xs",
  isMuted,
  toggleMute,
}) {
  const currentRoom = engineRef?.current?.room;
  const exits = rooms[currentRoom]?.exits || {};

  const directions = [
    { dir: "north", icon: ArrowUp },
    { dir: "south", icon: ArrowDown },
    { dir: "east", icon: ArrowRight },
    { dir: "west", icon: ArrowLeft },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4 items-center">
      {directions.map(({ dir, icon: Icon }) => {
        const isActive = Boolean(exits[dir]);
        return (
          <button
            key={dir}
            onClick={() => isActive && engineRef.current?.move(dir)}
            className={`rounded border ${
              isActive ? "border-green-400 text-green-300" : "border-gray-700 text-gray-600"
            } ${buttonClassName}`}
            title={dir}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}

      <button
        onClick={() => engineRef.current?.handleCommand("look")}
        className={`rounded border border-green-400 text-green-300 ${buttonClassName}`}
        title="Look around"
      >
        <Eye size={iconSize} />
      </button>

      <button
        onClick={() => engineRef.current?.handleCommand("jump")}
        className={`rounded border border-green-400 text-green-300 ${buttonClassName}`}
        title="Jump"
      >
        <ArrowBigUpDash size={iconSize} />
      </button>

      <SoundSystem muted={isMuted} toggleMute={toggleMute} />
    </div>
  );
}

MovementPanel.propTypes = {
  engineRef: PropTypes.object.isRequired,
  iconSize: PropTypes.number,
  buttonClassName: PropTypes.string,
  isMuted: PropTypes.bool,
  toggleMute: PropTypes.func,
};
