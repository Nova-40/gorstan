// Game Component
// This component serves as the main interface for the game. It initializes the GameEngine, processes player commands, and displays game output.
// It also manages the player's inventory, codex, score, and interactions with Ayla.

import React, { useState, useEffect, useRef } from "react";
import RoomRenderer from "../components/RoomRenderer";
import InventoryPanel from "../components/InventoryPanel";
import CodexPanel from "../components/CodexPanel";
import AylaButton from "../components/AylaButton";
import { rooms } from "./rooms";

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
    try {
      const engine = window.gameState || new GameEngine();
      engineRef.current = engine;

      if (!engine.currentRoom) engine.currentRoom = startRoom;
      if (!engine.inventory.includes("coffee")) engine.addItem("coffee");

      setOutput([engine.describeCurrentRoom?.() || "⚠️ No room description available."]);
      setCurrentRoom(engine.currentRoom);
      setInventory(engine.inventory);
      setCodex(engine.codex || []);
      setScore(engine.score || 0);

      console.log("🧠 Starting room:", engine.currentRoom);
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
      <div className="w-full max-w-4xl space-y-2">
        <RoomRenderer roomId={currentRoom} />
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
        <AylaButton engineRef={engineRef} addToOutput={addToOutput} />
        <InventoryPanel inventory={inventory} />
        <CodexPanel codex={codex} />
      </div>
    </div>
  );
}
