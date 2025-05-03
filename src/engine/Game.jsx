// Game Component
// This component serves as the main interface for the game. It initializes the GameEngine, processes player commands, and displays game output.
// It also manages the player's inventory, codex, score, and interactions with Ayla.

import React, { useState, useEffect, useRef } from "react";
import { GameEngine } from "./GameEngine";
import RoomRenderer from "../components/RoomRenderer";
import InventoryPanel from "../components/InventoryPanel";
import CodexPanel from "../components/CodexPanel";
import AylaButton from "../components/AylaButton";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft, Eye, Clipboard } from "lucide-react";

export default function Game({ startRoom = "controlnexus" }) {
  useEffect(() => {
    console.log("🎮 Game component mounted");
  }, []);

  const engineRef = useRef(null);
  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [currentRoom, setCurrentRoom] = useState(startRoom);
  const [inventory, setInventory] = useState([]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    try {
      const engine = new GameEngine();
      engine.currentRoom = startRoom;
      engineRef.current = engine;

      if (!engine.inventory.includes("coffee")) {
        engine.addItem("coffee");
      }

      setOutput([]);
      setCurrentRoom(startRoom);
      setInventory(engine.inventory);
      setCodex(engine.codex || []);
      setScore(engine.score || 0);
    } catch (err) {
      console.error("❌ GameEngine failed to start:", err);
      setOutput(["❌ GameEngine failed to start.", err.message]);
    }
  }, [startRoom]);

  const handleCommand = () => {
    if (!command.trim()) return;
    try {
      const trimmed = command.trim().toLowerCase();
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

      setOutput((prev) => [...prev, `> ${command.trim()}`, result.message]);
      updateGameState();
    } catch (err) {
      console.error("❌ Error processing command:", err);
      setOutput((prev) => [...prev, `> ${command.trim()}`, `❌ ${err.message}`]);
    }
    setCommand("");
  };

  const updateGameState = () => {
    try {
      const engine = engineRef.current;
      setCurrentRoom(engine.currentRoom);
      setInventory(engine.inventory);
      setCodex(engine.codex);
      setScore(engine.score);
    } catch (err) {
      console.error("❌ Error updating game state:", err);
      setOutput((prev) => [...prev, "❌ Error updating game state."]);
    }
  };

  const handleMove = (dir) => {
    try {
      const result = engineRef.current.processCommand(`go ${dir}`);
      setOutput((prev) => [...prev, `> go ${dir}`, result.message]);
      updateGameState();
    } catch (err) {
      console.error("❌ Error processing movement:", err);
      setOutput((prev) => [...prev, `> go ${dir}`, `❌ ${err.message}`]);
    }
  };

  const handleAskAyla = (query) => {
    try {
      if (typeof engineRef.current.askAyla !== "function") {
        throw new Error("Ayla is not available.");
      }
      const result = engineRef.current.askAyla(query);
      setOutput((prev) => [...prev, `> ask Ayla about ${query}`, result]);
    } catch (err) {
      console.error("❌ Error asking Ayla:", err);
      setOutput((prev) => [...prev, `> ask Ayla about ${query}`, `❌ ${err.message}`]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <RoomRenderer roomId={currentRoom} />
          <div className="flex gap-2 mb-2 mt-4">
            <input
              className="bg-gray-800 text-green-400 p-2 flex-grow"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommand()}
              placeholder="Type a command..."
            />
            <button className="bg-green-700 px-4 py-2" onClick={handleCommand}>Go</button>
          </div>

          {/* Movement Panel with Icons */}
          <div className="grid grid-cols-3 gap-2 text-white text-sm w-full max-w-xs mx-auto mt-4">
            <button title="Up" onClick={() => handleMove("up")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><ArrowUp /></button>
            <button title="North" onClick={() => handleMove("north")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><ArrowUp /></button>
            <button title="Jump" onClick={() => handleMove("jump")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><CornerDownLeft /></button>
            <button title="West" onClick={() => handleMove("west")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><ArrowLeft /></button>
            <div></div>
            <button title="East" onClick={() => handleMove("east")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><ArrowRight /></button>
            <div></div>
            <button title="South" onClick={() => handleMove("south")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><ArrowDown /></button>
            <button title="Down" onClick={() => handleMove("down")} className="bg-gray-700 p-2 rounded flex justify-center hover:scale-105 transition-transform"><ArrowDown /></button>
            <button title="Look" onClick={() => handleCommand("look") } className="col-span-1 bg-purple-700 p-2 rounded flex justify-center mt-2 hover:scale-105 transition-transform"><Eye size={16} /></button>
            <button title="Inventory" onClick={() => setCommand("inventory")} className="col-span-1 bg-purple-700 p-2 rounded flex justify-center mt-2 hover:scale-105 transition-transform"><Clipboard size={16} /></button>
          </div>
        </div>

        <div className="w-full md:w-64 flex flex-col gap-4">
          <InventoryPanel inventory={inventory} />
          <CodexPanel codex={codex} />
          <div className="border-t border-green-700 pt-2">Score: {score}</div>
          <AylaButton onAsk={handleAskAyla} />
        </div>
      </div>
    </div>
  );
}


