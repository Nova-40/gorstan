// Gorstan Game Module — v3.1.6
// MIT License © 2025 Geoff Webster
// GameEngine.jsx — Main engine for gameplay logic and UI

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import QuickActions from "./QuickActions";
import RoomRenderer from "./RoomRenderer";


const GameEngine = ({ playerName, currentRoom, inventory = [], score = 0, flags = {} }) => {  const consoleRef = useRef(null);
  const inputRef = useRef(null);

  const [log, setLog] = React.useState([
    `Welcome, ${playerName}. Your journey begins.`
  ]);

  const [previousRoom, setPreviousRoom] = React.useState(null);

  useEffect(() => {
    const handler = (e) => {
      const command = e.detail;
      setLog((prev) => [...prev, `> ${command}`]);
      if (command === "look") {
        setLog((prev) => [...prev, `You look around...`]);
      }
    };
    window.addEventListener("command", handler);
    return () => window.removeEventListener("command", handler);
  }, []);

  const handleAskAyla = () => {
    setLog((prev) => [...prev, "\u{1F4DD} What would you like to ask?"]);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleThrowCoffee = () => {
    setLog((prev) => [...prev, "\u2615 You throw the coffee. It sizzles ominously."]);
    // TODO: Add actual game logic for this action
  };

  const handleStepBack = () => {
    if (!previousRoom) {
      setLog((prev) => [...prev, "There is nowhere to step back to."]);
    } else {
      setLog((prev) => [...prev, `You step back to ${previousRoom.name}.`]);
      // TODO: Transition logic for step back
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const value = e.target.command.value.trim();
    if (!value) return;
    window.dispatchEvent(new CustomEvent("command", { detail: value }));
    e.target.reset();
  };

  if (!Array.isArray(inventory)) {
  return (
    <div className="text-red-400 font-mono p-4">
      ⚠️ Inventory not initialised. Please restart the game.
    </div>
  );
}


  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="w-2/3">
          <RoomRenderer room={currentRoom} state={{ inventory, flags }} />
        </div>

        <div className="w-1/3 flex flex-col items-end">
          <QuickActions
            inventory={inventory || []}
            onAskAyla={handleAskAyla}
            onThrowCoffee={handleThrowCoffee}
            onStepBack={handleStepBack}
            hasPreviousRoom={!!previousRoom}
          />
        </div>
      </div>

      <form onSubmit={handleCommandSubmit} className="mt-4 flex justify-center">
        <input
          type="text"
          name="command"
          placeholder="Type a command..."
          ref={inputRef}
          className="w-2/3 p-2 rounded bg-black/80 border border-white text-white text-center"
        />
      </form>

      <div
        ref={consoleRef}
        className="mt-3 p-3 bg-black/70 text-green-400 font-mono h-40 overflow-y-auto rounded shadow-inner"
      >
        {log.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

GameEngine.propTypes = {
  playerName: PropTypes.string.isRequired,
  currentRoom: PropTypes.object.isRequired,
  inventory: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
  flags: PropTypes.object.isRequired,
};

export default GameEngine;
