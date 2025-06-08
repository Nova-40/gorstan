// Gorstan Game Module — v2.9.2
// MIT License © 2025 Geoff Webster
// QuickActions.jsx — Handles directional movement and quick actions for Gorstan UI

import React from "react";
import PropTypes from "prop-types";
import {
  Eye,
  Backpack,
  Coffee,
  Undo2,
  RefreshCcwDot,
  MessageSquare,
  RedoDot,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoveUp,
  MoveDown,
  Armchair
} from "lucide-react";

/**
 * Directional movement button definitions.
 */
const directions = [
  { icon: ArrowUp, direction: "north", tooltip: "Go North" },
  { icon: ArrowDown, direction: "south", tooltip: "Go South" },
  { icon: ArrowLeft, direction: "west", tooltip: "Go West" },
  { icon: ArrowRight, direction: "east", tooltip: "Go East" },
  { icon: MoveUp, direction: "up", tooltip: "Go Up" },
  { icon: MoveDown, direction: "down", tooltip: "Go Down" }
];

/**
 * Quick action button definitions.
 */
const actions = [
  {
    id: "look",
    icon: <Eye size={20} />,
    tooltip: "Look Around",
    condition: () => true,
    handler: (dispatch) => dispatch?.({ type: "LOOK_AROUND" })
  },
  {
    id: "inventory",
    icon: <Backpack size={20} />,
    tooltip: "Check Inventory",
    condition: () => true,
    handler: (dispatch) => dispatch?.({ type: "SHOW_INVENTORY" })
  },
  {
    id: "throwCoffee",
    icon: <Coffee size={20} />,
    tooltip: "Throw Gorstan Coffee",
    condition: (state) => state?.inventory?.includes("coffee"),
    handler: (dispatch) => {
      dispatch?.({ type: "THROW_COFFEE" });
      dispatch?.({
        type: "LOG",
        payload: "You throw your Gorstan coffee with unexpected force."
      });
    }
  },
  {
    id: "stepback",
    icon: <Undo2 size={20} />,
    tooltip: "Step Back to Previous Room",
    condition: () => true,
    handler: (dispatch) => dispatch?.({ type: "STEP_BACK" })
  },
  {
    id: "reset",
    icon: <RefreshCcwDot size={20} />,
    tooltip: "Reset the Universe",
    condition: (state) => state?.room === "resetroom" && !state?.resetDisabled,
    handler: (dispatch) => dispatch?.({ type: "BEGIN_RESET_SEQUENCE" })
  },
  {
    id: "askAyla",
    icon: <MessageSquare size={20} />,
    tooltip: "Ask Ayla for Help",
    condition: () => true,
    handler: (dispatch) => dispatch?.({ type: "SUMMON_AYLA" })
  },
  {
    id: "jump",
    icon: <RedoDot size={20} />,
    tooltip: "Jump into the Unknown",
    condition: (state) => state?.canJump,
    handler: (dispatch) => dispatch?.({ type: "JUMP_PORTAL" })
  },
  {
    id: "sitChair",
    icon: <Armchair size={20} />,
    tooltip: "Sit in Chair",
    condition: (state) => state?.currentRoom === "resetroom",
    handler: (dispatch) => {
      dispatch?.({ type: "LOG", payload: "You sit in the chair. Reality shifts." });
      dispatch?.({ type: "SET_ROOM", payload: "trentpark" });
      dispatch?.({ type: "SCORE", payload: 10 });
    }
  }
];

const QuickActions = ({ currentRoom, state, dispatch }) => {
  if (!currentRoom) return null;

  return (
    <div className="flex flex-col items-center space-y-4 p-2">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {actions
          .filter(action => action.condition(state))
          .map(action => (
            <button
              key={action.id}
              onClick={() => action.handler(dispatch, state)}
              title={typeof action.tooltip === "function" ? action.tooltip(state) : action.tooltip}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-500 px-3 py-2 text-white text-xs"
            >
              {action.icon}
            </button>
          ))}
      </div>

      {/* Directional Movement Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {directions.map(({ icon: Icon, direction, tooltip }) => {
          const isActive = currentRoom.exits?.[direction];
          return (
            <button
              key={direction}
              onClick={() => isActive && dispatch?.({ type: "MOVE", payload: direction })}
              className={`rounded px-2 py-1 text-xs border ${
                isActive ? "bg-green-700 hover:bg-green-600 border-green-500" : "bg-gray-700 border-gray-500 opacity-40"
              }`}
              disabled={!isActive}
              title={tooltip}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

QuickActions.propTypes = {
  currentRoom: PropTypes.object,
  state: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default QuickActions;
