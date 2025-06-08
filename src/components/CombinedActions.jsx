// Gorstan Game Module — v2.9.1
// MIT License © 2025 Geoff Webster
// CombinedActions.jsx — Movement + QA buttons in one module
// UI: Quick commands (look, inventory, throw, etc.) with Lucide icons
// CombinedActions.jsx — Icon Quick Actions for Gorstan Game
// MIT License © 2025 Geoff Webster

import React, { useContext } from "react";
import { Eye, Backpack, Coffee, ArrowUp, ArrowDown, RotateCcw, UndoDot } from "lucide-react";
import { GameContext } from "../engine/GameContext";

const iconClass = "w-6 h-6 text-green-300 hover:text-green-500 transition-all";

const CombinedActions = () => {
  const { state, dispatch } = useContext(GameContext);

  const handleClick = (action) => {
    dispatch({ type: "LOG", payload: `> ${action}` });
    switch (action) {
      case "look":
        dispatch({ type: "LOOK_AROUND" });
        break;
      case "inventory":
        dispatch({ type: "SHOW_INVENTORY" });
        break;
      case "throw coffee":
        if (state.inventory?.includes("coffee")) {
          dispatch({ type: "THROW_COFFEE" });
          dispatch({ type: "LOG", payload: "You throw your Gorstan coffee with unexpected force." });
        } else {
          dispatch({ type: "LOG", payload: "You reach for coffee, but you're empty-handed." });
        }
        break;
      case "go up":
        dispatch({ type: "MOVE", payload: "up" });
        break;
      case "go down":
        dispatch({ type: "MOVE", payload: "down" });
        break;
      case "reset":
        dispatch({ type: "LOG", payload: "You press the reset device. The multiverse trembles..." });
        dispatch({ type: "ENGAGE_RESET" }); // Ensure this action exists in your reducer!
        break;
      case "stepback":
        dispatch({ type: "STEP_BACK" });
        break;
      default:
        dispatch({ type: "LOG", payload: `Unknown action: ${action}` });
    }
  };

  return (
    <div className="flex gap-5 mt-4 justify-center items-center flex-wrap">
      <button title="Look around" onClick={() => handleClick("look")}>
        <Eye className={iconClass} />
      </button>
      <button title="Check inventory" onClick={() => handleClick("inventory")}>
        <Backpack className={iconClass} />
      </button>
      <button title="Throw your coffee" onClick={() => handleClick("throw coffee")}>
        <Coffee className={iconClass} />
      </button>
      <button title="Go up" onClick={() => handleClick("go up")}>
        <ArrowUp className={iconClass} />
      </button>
      <button title="Go down" onClick={() => handleClick("go down")}>
        <ArrowDown className={iconClass} />
      </button>
      {state.currentRoom === "resetroom" && (
        <button title="Reset the multiverse" onClick={() => handleClick("reset")}>
          <RotateCcw className={iconClass} />
        </button>
      )}
      <button title="Step back to the previous room" onClick={() => handleClick("stepback")}>
        <UndoDot className={iconClass} />
      </button>
    </div>
  );
};

export default CombinedActions;

