// Gorstan Game Module — v2.9.1
// MIT License © 2025 Geoff Webster
// GameEngine.jsx — Main gameplay engine after intro sequence

import React, { useEffect, useContext, useRef, useState } from "react";
import RoomRenderer from "../components/RoomRenderer";
import QuickActions from "../components/QuickActions.jsx";
import CommandInput from "../components/CommandInput";
import LogHistory from "../components/LogHistory";
import { GameContext } from "./GameContext";
import rooms from "./rooms";
import { parseCommand } from "./commandParser";

/**
 * GameEngine
 * Main interactive engine for Gorstan after intro sequence.
 * Handles room rendering, command parsing, and game state.
 *
 * @component
 * @param {Object} props
 * @param {string} props.playerName - The player's name.
 * @param {string} [props.introChoice="jump"] - The intro choice ("jump", "wait", "sip").
 * @param {Function} props.onError - Error handler callback.
 * @returns {JSX.Element}
 */
const GameEngine = ({ playerName, introChoice = "jump", onError }) => {
  // === State and Context ===
  const { state, dispatch } = useContext(GameContext);
  const [command, setCommand] = useState("");
  const engineRef = useRef();

  /**
   * Setup engineRef with imperative game actions for parser or external calls.
   * (Not currently used outside, but ready for future extensibility.)
   */
  useEffect(() => {
    engineRef.current = {
      move: (direction) => {
        const exits = rooms[state.currentRoom]?.exits || {};
        const targetRoom = exits[direction];
        if (targetRoom && rooms[targetRoom]) {
          dispatch({ type: "SET_ROOM", payload: targetRoom });
          dispatch({ type: "LOG", payload: `You move ${direction}.` });
        } else {
          dispatch({ type: "LOG", payload: "You can't go that way." });
        }
      },
      say: (text) => {
        dispatch({ type: "LOG", payload: `You say: "${text}"` });
      },
      log: (text) => {
        dispatch({ type: "LOG", payload: text });
      },
      getState: () => state,
      dispatch,
    };
  }, []);

  /**
   * Game start logic.
   * On first mount, sets up player name and marks game as started.
   * Relies on AppCore to set the initial room.
   */
  useEffect(() => {
    if (!state.started) {
      try {
        dispatch({ type: "SET_PLAYER_NAME", payload: playerName });
        dispatch({ type: "LOG", payload: `Welcome, ${playerName}` });
        dispatch({ type: "MARK_GAME_STARTED" });
      } catch (err) {
        console.error("[GameEngine] Error in game start logic:", err);
        if (typeof onError === "function") onError(err);
      }
    }
  }, [state.started, playerName, dispatch, onError]);

  /**
   * Handles player command submission.
   * Logs the command, parses it, and clears the input.
   * @param {string} cmd - The command entered by the player.
   */
  const handleCommandSubmit = (cmd) => {
    if (!cmd || typeof cmd !== "string") return;
    dispatch({ type: "LOG", payload: `> ${cmd}` });
    try {
      parseCommand(cmd, state, dispatch);
    } catch (err) {
      dispatch({ type: "LOG", payload: "An error occurred while processing your command." });
      console.error("[GameEngine] Command parse error:", err);
      if (typeof onError === "function") onError(err);
    }
    setCommand("");
  };

  // Defensive: fallback to a safe room if state is broken
  const currentRoom = rooms[state.currentRoom];

  if (!currentRoom) {
    // Defensive fallback UI for missing room
    console.warn("[GameEngine] currentRoom not found:", state.currentRoom);
    return (
      <div className="text-red-400 bg-black p-6" role="alert">
        ⚠️ Room "{state.currentRoom}" not found. Please check rooms.js or room ID.
      </div>
    );
  }

  // === Render ===
  return (
    <div className="p-4 text-green-200 font-mono bg-black min-h-screen">
      {/* Room display */}
      
        <QuickActions currentRoom={rooms[state.currentRoom]} state={state} dispatch={dispatch} />
<RoomRenderer room={currentRoom} state={state} />

      <div className="mt-4 flex flex-col gap-3 items-center">
        {/* Optional: MovementPanel can be added here if needed */}
        {/* <MovementPanel exits={currentRoom.exits} onMove={...} /> */}


        {/* Command input */}
        <CommandInput
          command={command}
          setCommand={setCommand}
          onSubmit={handleCommandSubmit}
        />

        {/* Log/history display */}
        <LogHistory log={state.log || []} />
      </div>
    </div>
  );
};

export default GameEngine;