
// Game.jsx
// Main game interface for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import React, { useState, useEffect, useRef } from "react";
import RoomRenderer from "../components/RoomRenderer";
import InventoryPanel from "../components/InventoryPanel";
import CodexPanel from "../components/CodexPanel";
import AylaButton from "../components/AylaButton";
import MovementPanel from "../components/MovementPanel";
import { rooms } from "../engine/rooms";
import GameEngine from "../engine/GameEngine";
import RoomGuard from "./RoomGuard";

export default function Game({ startRoom = "controlnexus" }) {
  const engineRef = useRef(null);
  const outputEndRef = useRef(null);

  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [stage, setStage] = useState("welcome");
  const [inventory, setInventory] = useState([]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    let splatTimer;

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

      if (engine.currentRoom === "introstreet2") {
        setQuickActions([
          { label: "Jump", action: () => handleCommand("jump") },
          { label: "Wait", action: () => handleCommand("wait") },
        ]);

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

    return () => {
      if (splatTimer) clearTimeout(splatTimer);
    };
  }, [startRoom]);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);

  const addToOutput = (lines) => {
    if (!Array.isArray(lines)) {
      console.error("❌ Invalid output format. Expected an array of strings.");
      return;
    }
    setOutput((prev) => [...prev.slice(-10), ...lines]);
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
    }
  };

  const handleCommand = (forcedCommand = null) => {
    const input = forcedCommand || command;
    if (!input.trim()) return;

    try {
      const normalizedCommand = normalizeCommand(input.trim());
      const result = engineRef.current.processCommand(normalizedCommand);
      addToOutput([`> ${input.trim()}`, result.message]);
      updateGameState();

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

    if (!forcedCommand) setCommand("");
  };

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
