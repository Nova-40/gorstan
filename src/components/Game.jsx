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
import RoomGuard from "./RoomGuard";

/**
 * Game Component
 * This component serves as the main interface for the Gorstan game.
 * It initializes the game engine, manages game state, and renders the UI for the player.
 *
 * Props:
 * - startRoom (string): The starting room for the game. Defaults to "controlnexus".
 */
export default function Game({ startRoom = "controlnexus" }) {
  const engineRef = useRef(null); // Reference to the GameEngine instance
  const outputEndRef = useRef(null); // Reference to the output container for auto-scrolling

  // --- Game State ---
  const [output, setOutput] = useState([]); // Game output messages
  const [command, setCommand] = useState(""); // Player's current command
  const [currentRoom, setCurrentRoom] = useState(null); // Current room ID
  const [stage, setStage] = useState("intro"); // intro → name → game
  const [inventory, setInventory] = useState([]); // Player's inventory
  const [codex, setCodex] = useState([]); // Player's codex entries
  const [score, setScore] = useState(0); // Player's score
  const [quickActions, setQuickActions] = useState([]); // Room-specific quick action buttons

  // --- Intro Lines ---
  const introLines = [
    "Reality is a construct…",
    "Calibrating your consciousness…",
    "Deploying the Gorstan protocol…",
    "Warning: truck detected.",
    "Brace for impact…",
  ];

  /**
   * Initializes the game engine and sets up the initial game state.
   */
  useEffect(() => {
    let splatTimer; // Timeout ID for the splat timer

    try {
      const engine = window.gameState || new GameEngine();
      engineRef.current = engine;

      if (!engine.currentRoom) engine.currentRoom = startRoom;

      engine.setOutputHandler(setOutput);
      engine.setSceneHandler(setCurrentRoom);

      const room = rooms[engine.currentRoom];
      if (room?.onEnter) {
        console.log("📦 Triggering onEnter for", engine.currentRoom);
        room.onEnter(engine);
      }

      if (!engine.inventory.includes("coffee")) engine.addItem("coffee");

      setOutput([engine.describeCurrentRoom?.() || "⚠️ No room description available."]);
      setCurrentRoom(engine.currentRoom);
      setInventory(engine.inventory);
      setCodex(engine.codex || []);
      setScore(engine.score || 0);

      // Set quick actions for specific rooms
      if (engine.currentRoom === "introstreet2") {
        setQuickActions([
          { label: "Jump", action: () => handleCommand("jump") },
          { label: "Wait", action: () => handleCommand("wait") },
        ]);

        // Splat timer for inaction
        splatTimer = setTimeout(() => {
          if (!engine.storyFlags.has("jumped") && !engine.storyFlags.has("splatted")) {
            handleCommand("wait");
          }
        }, 15000);
      }
    } catch (err) {
      console.error("❌ GameEngine failed to start:", err);
      setOutput(["❌ GameEngine failed to start.", err.message]);
    }

    // Cleanup function to clear the splat timer
    return () => {
      if (splatTimer) clearTimeout(splatTimer);
    };
  }, [startRoom]);

  /**
   * Automatically scrolls the output container to the bottom when new output is added.
   */
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  /**
   * Adds new lines to the game output.
   * @param {string[]} lines - Array of lines to add to the output.
   */
  const addToOutput = (lines) => {
    if (!Array.isArray(lines)) {
      console.error("❌ Invalid output format. Expected an array of strings.");
      return;
    }
    setOutput((prev) => [...prev.slice(-10), ...lines]); // Keep the last 10 lines for better context
  };

  /**
   * Updates the game state (current room, inventory, codex, score) from the GameEngine.
   */
  const updateGameState = () => {
    try {
      const engine = engineRef.current;
      setCurrentRoom(engine.currentRoom);
      setInventory(engine.inventory);
      setCodex(engine.codex);
      setScore(engine.score);
    } catch (err) {
      console.error("❌ Error updating game state:", err);
    }
  };

  /**
   * Handles player commands and processes them through the GameEngine.
   * @param {string|null} forcedCommand - Optional forced command to process.
   */
  const handleCommand = (forcedCommand = null) => {
    const input = forcedCommand || command;
    if (!input.trim()) return;

    try {
      const normalizedCommand = normalizeCommand(input.trim());

      // Process the command through the GameEngine
      const result = engineRef.current.processCommand(normalizedCommand);
      addToOutput([`> ${input.trim()}`, result.message]);
      updateGameState();

      // Disable quick action buttons after certain commands
      if (["jump", "wait"].includes(normalizedCommand)) {
        setQuickActions((prev) =>
          prev.map((action) => ({
            ...action,
            disabled: true,
          }))
        );
      }
    } catch (err) {
      console.error("❌ Error processing command:", err);
      addToOutput([`> ${input.trim()}`, `❌ ${err.message}`]);
    }

    if (!forcedCommand) setCommand(""); // Clear the command input if not forced
  };

  /**
   * Normalizes player commands for consistency.
   * @param {string} input - The raw player command.
   * @returns {string} - The normalized command.
   */
  const normalizeCommand = (input) => {
    const directions = ["north", "south", "east", "west", "up", "down"];
    const synonyms = ["pickup", "grab"];
    const parts = input.split(" ");

    if (directions.includes(input)) {
      return `go ${input}`;
    } else if (synonyms.includes(parts[0])) {
      return `take ${parts.slice(1).join(" ")}`;
    }
    return input;
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
        {/* Left Panel: Room Renderer and Output */}
        <div className="flex-1 space-y-2">
          {stage === "intro" && (
            <div className="bg-gray-900 p-4 rounded shadow text-green-300 min-h-[240px] flex flex-col justify-center items-center">
              {introLines.map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
              <button
                className="mt-4 px-4 py-2 bg-green-700 hover:bg-green-600 rounded"
                onClick={() => setStage("name")}
              >
                Continue
              </button>
            </div>
          )}

          {stage === "name" && (
            <div className="bg-gray-900 p-4 rounded shadow text-green-300 min-h-[240px] flex flex-col justify-center items-center">
              <p className="mb-4">What’s your name, traveller?</p>
              <input
                className="p-2 rounded bg-gray-800 border border-green-500 text-white"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && command.trim()) {
                    engineRef.current.playerName = command.trim();
                    setCommand("");
                    setStage("game");
                    engineRef.current.enterRoom("introstreet1");
                  }
                }}
                placeholder="Type your name..."
                autoFocus
              />
            </div>
          )}

          {stage === "game" && <RoomGuard roomId={currentRoom} />}
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
          <div className="flex gap-2 mt-2">
            {quickActions.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                disabled={btn.disabled}
                className={`py-1 px-3 rounded text-sm text-white ${
                  btn.disabled ? "bg-gray-600" : "bg-green-700 hover:bg-green-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Inventory, Codex, and Movement */}
        <div className="w-full lg:w-64 space-y-4">
          <InventoryPanel inventory={inventory} initiallyCollapsed />
          <CodexPanel codex={codex} initiallyCollapsed />
          <AylaButton engineRef={engineRef} addToOutput={addToOutput} />
          <MovementPanel
            engineRef={engineRef}
            iconSize={14}
            buttonClassName="p-1 text-xs"
            initiallyCollapsed={false}
          />
        </div>
      </div>
    </div>
  );
}