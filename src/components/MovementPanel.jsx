// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// MovementPanel.jsx
// Quick movement and action panel for Gorstan, includes mute toggle and direction buttons.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, destructuring).
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - PropTypes for all props.
  4. 🤝 INTEGRATION CHECK
     - Expects `engineRef` (required), `isMuted`, `toggleMute` from parent (Game).
     - Integrates with SoundSystem and rooms.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract repeated button logic to a subcomponent.
     - Could memoize for large room sets, but not needed for typical use.
     - Could add unit tests for movement and mute toggling.
*/

import React from "react";
import PropTypes from "prop-types";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  ArrowBigUpDash,
} from "lucide-react";
import { rooms } from "../engine/rooms";
import SoundSystem from "./SoundSystem";

/**
 * MovementPanel Component
 * Renders movement and quick action buttons for the player.
 *
 * @param {Object} props
 * @param {Object} props.engineRef - Ref to the game engine instance.
 * @param {number} [props.iconSize=18] - Icon size for buttons.
 * @param {string} [props.buttonClassName] - Additional class names for buttons.
 * @param {boolean} [props.isMuted] - Whether sound is muted.
 * @param {function} [props.toggleMute] - Function to toggle mute.
 */
export default function MovementPanel({
  engineRef,
  iconSize = 18,
  buttonClassName = "p-1 w-8 h-8 flex items-center justify-center text-xs",
  isMuted,
  toggleMute,
}) {
  // Defensive: Ensure engineRef and current room are valid
  const currentRoom = engineRef?.current?.room;
  const exits = rooms[currentRoom]?.exits || {};

  const directions = [
    { dir: "north", icon: ArrowUp },
    { dir: "south", icon: ArrowDown },
    { dir: "east", icon: ArrowRight },
    { dir: "west", icon: ArrowLeft },
  ];

  // TODO: Extract repeated button logic to a subcomponent if this grows.

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
            title={dir.charAt(0).toUpperCase() + dir.slice(1)}
            aria-label={`Move ${dir}`}
            disabled={!isActive}
            tabIndex={isActive ? 0 : -1}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}

      <button
        onClick={() => engineRef.current?.handleCommand("look")}
        className={`rounded border border-green-400 text-green-300 ${buttonClassName}`}
        title="Look around"
        aria-label="Look around"
      >
        <Eye size={iconSize} />
      </button>

      <button
        onClick={() => engineRef.current?.handleCommand("jump")}
        className={`rounded border border-green-400 text-green-300 ${buttonClassName}`}
        title="Jump"
        aria-label="Jump"
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
