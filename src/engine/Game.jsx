// Game Component
// This component serves as the main interface for the game. It initializes the GameEngine, processes player commands, and displays game output.
// It also manages the player's inventory, codex, score, and interactions with Ayla.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { useState, useEffect, useRef } from "react";
import { GameEngine } from "./GameEngine";
import RoomRenderer from "../components/RoomRenderer";
import MovementPanel from "../components/MovementPanel";
import InventoryPanel from "../components/InventoryPanel";
import CodexPanel from "../components/CodexPanel";
import AylaButton from "../components/AylaButton";

export default function Game({ startRoom = "controlnexus" }) {
  // Reference to the GameEngine instance
  const engineRef = useRef(null);

  // State variables to manage game data
  const [output, setOutput] = useState([]); // Game output log
  const [command, setCommand] = useState(""); // Player's current command input
  const [currentRoom, setCurrentRoom] = useState(startRoom); // Current room ID
  const [inventory, setInventory] = useState([]); // Player's inventory
  const [codex, setCodex] = useState([]); // Player's codex entries
  const [score, setScore] = useState(0); // Player's score

  // Initialize the GameEngine and set the starting room
  useEffect(() => {
    try {
      const engine = new GameEngine(); // Create a new GameEngine instance
      engine.currentRoom = startRoom; // Set the starting room
      engineRef.current = engine; // Store the engine instance in a ref

      console.log("✅ GameEngine initialized, starting in:", startRoom);

      // Get the initial room description and set initial states
      const introText = engine.describeCurrentRoom?.() || "⚠️ No room description available.";
      setOutput([introText]);
      setCurrentRoom(startRoom);
      setInventory(engine.inventory || []);
      setCodex(engine.codex || []);
      setScore(engine.score || 0);
    } catch (err) {
      // Handle errors during GameEngine initialization
      console.error("❌ GameEngine failed to start:", err);
      setOutput(["❌ GameEngine failed to start.", err.message]);
    }
  }, [startRoom]);

  // Handle player commands
  const handleCommand = () => {
    if (!command.trim()) return; // Ignore empty commands

    try {
      // Process the command using the GameEngine
      const result = engineRef.current.processCommand(command);

      // Update the output log with the command and the result
      setOutput((prev) => [...prev, `> ${command}`, result]);

      // Update game state after processing the command
      updateGameState();
    } catch (err) {
      // Handle errors during command processing
      console.error("❌ Error processing command:", err);
      setOutput((prev) => [...prev, `> ${command}`, `❌ ${err.message}`]);
    }

    // Clear the command input field
    setCommand("");
  };

  // Update game state (room, inventory, codex, score) after a command
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

  // Handle movement commands
  const handleMove = (direction) => {
    try {
      const result = engineRef.current.processCommand(direction);
      setOutput((prev) => [...prev, `> move ${direction}`, result]);
      updateGameState();
    } catch (err) {
      console.error("❌ Error processing movement:", err);
      setOutput((prev) => [...prev, `> move ${direction}`, `❌ ${err.message}`]);
    }
  };

  // Handle Ayla interactions
  const handleAskAyla = (query) => {
    try {
      const result = engineRef.current.askAyla(query);
      setOutput((prev) => [...prev, `> ask Ayla about ${query}`, result]);
    } catch (err) {
      console.error("❌ Error asking Ayla:", err);
      setOutput((prev) => [...prev, `> ask Ayla about ${query}`, `❌ ${err.message}`]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      {/* Main layout: Room renderer, output log, and side panels */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left panel: Room renderer and output log */}
        <div className="flex-1">
          {/* Render the current room */}
          <RoomRenderer roomId={currentRoom} />

          {/* Output log */}
          <div className="my-4 max-h-80 overflow-y-auto border border-green-700 p-2">
            {output.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">{line}</div>
            ))}
          </div>

          {/* Command input */}
          <div className="flex gap-2 mb-2">
            <input
              className="bg-gray-800 text-green-400 p-2 flex-grow"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommand()}
              placeholder="Type a command..."
            />
            <button className="bg-green-700 px-4 py-2" onClick={handleCommand}>
              Go
            </button>
          </div>

          {/* Movement panel */}
          <MovementPanel
            roomId={currentRoom}
            onMove={handleMove}
          />
        </div>

        {/* Right panel: Inventory, codex, score, and Ayla interactions */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          {/* Inventory panel */}
          <InventoryPanel inventory={inventory} />

          {/* Codex panel */}
          <CodexPanel codex={codex} />

          {/* Score display */}
          <div className="border-t border-green-700 pt-2">Score: {score}</div>

          {/* Ayla interaction button */}
          <AylaButton onAsk={handleAskAyla} />
        </div>
      </div>
    </div>
  );
}
