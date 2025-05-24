// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// GameEngine.jsx — Core game loop and command processor

import React, { useState, useEffect } from "react";
import { rooms } from "./rooms.js";
import { parseCommand } from "./commandParser.js";
import StatusPanel from "../../components/core/StatusPanel.jsx";

export default function GameEngine({ playerName, startingRoom }) {
  const [currentRoom, setCurrentRoom] = useState(startingRoom);
  const [command, setCommand] = useState("");
  const [commandLog, setCommandLog] = useState([]);
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState(["coffee"]);
  const [godMode, setGodMode] = useState(false);

  const godModeEligible = playerName?.toLowerCase() === "geoff";

  const addToOutput = (msg) => {
    setCommandLog((prev) => [...prev, msg]);
  };

  const handleCommand = () => {
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "horan" && godModeEligible) {
      const status = !godMode;
      setGodMode(status);
      addToOutput(`🛡️ God Mode ${status ? "ENABLED" : "DISABLED"}`);
      setCommand("");
      return;
    }

    parseCommand(cmd, {
      playerName,
      currentRoom,
      setCurrentRoom,
      inventory,
      setInventory,
      addToOutput,
      score,
      setScore,
      godMode
    });

    setCommand("");
  };

  const room = rooms[currentRoom];

  if (!room) {
    return (
      <div className="p-4 text-red-500 text-center font-mono">
        ⚠️ No Room Selected<br />
        Please select a valid room to continue.
      </div>
    );
  }

  return (
    <div>
      <StatusPanel score={score} inventory={inventory} />
      {room.image && (
        <img
          src={room.image}
          alt="Room visual"
          className="w-full max-w-3xl mx-auto border border-green-600 rounded mb-2"
        />
      )}
      <div className="bg-black border border-green-500 p-3 rounded mb-4 text-sm text-green-200 max-h-64 overflow-y-auto">
        {commandLog.map((msg, index) => (
          <div key={index} className="mb-1">&gt; {msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-black border border-green-500 text-green-200 px-3 py-2 rounded"
          value={command}
          placeholder="Type a command..."
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommand()}
        />
        <button
          onClick={handleCommand}
          className="border border-green-500 px-4 rounded hover:bg-green-700"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
