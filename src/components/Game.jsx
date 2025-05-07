// Game.jsx
// Main game interface for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React, { useState, useEffect, useRef } from "react";
import RoomRenderer from "../components/RoomRenderer";
import InventoryPanel from "../components/InventoryPanel";
import CodexPanel from "../components/CodexPanel";
import AylaButton from "../components/AylaButton";
import MovementPanel from "../components/MovementPanel";
import { rooms } from "../engine/rooms";
import { GameEngine } from "../engine/GameEngine";

export default function Game({ startRoom = "controlnexus" }) {
  const engineRef = useRef(null);
  const outputEndRef = useRef(null);

  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);

  
useEffect(() => {
  const room = rooms[engine.currentRoom];
  if (room?.onEnter) {
    room.onEnter(engine);
  }
}, [engine.currentRoom]);

useEffect(() => {
    try {
      const engine = window.gameState || new GameEngine();
      engineRef.current = engine;
      if (!engine.currentRoom) engine.currentRoom = startRoom;
      if (rooms[engine.currentRoom]?.onEnter) {
        rooms[engine.currentRoom].onEnter(engine);
      }
      if (!engine.inventory.includes("coffee")) engine.addItem("coffee");
      setOutput([engine.describeCurrentRoom?.() || "⚠️ No room description available."]);
      setCurrentRoom(engine.currentRoom);
      setInventory(engine.inventory);
      setCodex(engine.codex || []);
      setScore(engine.score || 0);
      const start = rooms[engine.currentRoom];
      if (start?.onEnter) start.onEnter(engine);
    } catch (err) {
      console.error("❌ GameEngine failed to start:", err);
      setOutput(["❌ GameEngine failed to start.", err.message]);
    }
  }, [startRoom]);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  const addToOutput = (lines) => {
    setOutput((prev) => [...prev.slice(-4), ...lines]);
  };

  const updateGameState = () => {
    const engine = engineRef.current;
    setCurrentRoom(engine.currentRoom);
    setInventory(engine.inventory);
    setCodex(engine.codex);
    setScore(engine.score);
  };

  const handleCommand = (forcedCommand = null) => {
    const input = forcedCommand || command;
    if (!input.trim()) return;
    try {
      const trimmed = input.trim().toLowerCase();
      const directions = ["north", "south", "east", "west", "up", "down"];
      const synonyms = ["pickup", "grab"];
      const parts = trimmed.split(" ");
      let normalisedCommand = trimmed;
      if (directions.includes(trimmed)) {
        normalisedCommand = `go ${trimmed}`;
      } else if (synonyms.includes(parts[0])) {
        normalisedCommand = `take ${parts.slice(1).join(" ")}`;
      }
      const result = engineRef.current.processCommand(normalisedCommand);
      addToOutput([`> ${input.trim()}`, result.message]);
      updateGameState();
    } catch (err) {
      console.error("❌ Error processing command:", err);
      addToOutput([`> ${input.trim()}`, `❌ ${err.message}`]);
    }
    if (!forcedCommand) setCommand("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      {/* Motivational Message with Link */}
      <div className="flex justify-center items-center text-xs text-blue-400 italic mb-2 font-handwriting">
        <span>Enjoy the game — Read The Gorstan Chronicles</span>
        <a
          href="https://www.thegorstanchronicles.com/book-showcase"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2"
        >
          📘
        </a>
      </div>

      <div className="w-full max-w-7xl space-y-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <AnimatePresence mode="wait">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RoomRenderer roomId={currentRoom} />
        </motion.div>
      </AnimatePresence>
          <div className="bg-gray-900 p-4 rounded shadow text-green-300 min-h-[120px]">
            {output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div ref={outputEndRef} />
          </div>
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            className="w-full p-2 rounded bg-gray-800 text-white border border-green-500"
            placeholder="Enter a command..."
          />
        </div>
        <div className="w-full lg:w-64 space-y-4">
          <InventoryPanel inventory={inventory} initiallyCollapsed />
          <CodexPanel codex={codex} initiallyCollapsed />
          <AylaButton engineRef={engineRef} addToOutput={addToOutput} />
          <MovementPanel engineRef={engineRef} iconSize={14} buttonClassName="p-1 text-xs" initiallyCollapsed={false} />
        </div>
      </div>
    </div>
  );
}