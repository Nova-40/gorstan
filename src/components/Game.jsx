// Gorstan v2.2.2 – All modules validated and standardized
// Game.jsx
// Main game interface for the Gorstan React application.
// Version 2.1.2
// MIT License
// Copyright (c) 2025 Geoff Webster
import React, { useState, useEffect, useRef } from "react";
import RoomGuard from "./RoomGuard";
import AylaButton from "../components/AylaButton";
import { rooms } from "../engine/rooms";
import GameEngine from "../engine/GameEngine";
import MovementPanel from "../components/MovementPanel";
import TeletypeConsole from "../components/TeletypeConsole";
import CreditsScreen from "../components/CreditsScreen";
/**
 * Main Game component for Gorstan.
 * Handles game state, engine integration, output, and UI panels.
 * All engine and DOM interactions are error-checked and reported.
 */
export default function Game({ startRoom = "controlnexus", playerName }) {
  const engineRef = useRef(null);
  const outputEndRef = useRef(null);
  // State variables
  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [stage, setStage] = useState("game");
  const [playerNameState, setPlayerNameState] = useState(playerName || "Player");
  const [inventory, setInventory] = useState([]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [creditsVisible, setCreditsVisible] = useState(false);

  /**
   * Adds a line to the output log.
   * @param {string} text
   */
  const addToOutput = (text) => setOutput((prev) => [...prev, text]);

  // Initialize engine and inventory on mount
  useEffect(() => {
    try {
      const startingInventory = ["coffee"];
      setInventory(startingInventory);
      // Defensive: Ensure GameEngine is available and rooms are loaded
      if (typeof GameEngine !== "function" || !rooms) {
        throw new Error("GameEngine or rooms module not available.");
      }
      engineRef.current = new GameEngine({
        startRoom,
        setCurrentRoom,
        addToOutput,
        getState: () => ({
          inventory,
          codex,
          score,
          playerName: playerNameState,
        }),
        updateScore: (points) => setScore((prev) => prev + points),
        setInventory,
      });
      // Start method not needed; engine initialized on creation
    } catch (err) {
      console.error("❌ Game: Failed to initialize engine.", err);
      addToOutput("An error occurred initializing the game engine.");
    }
    // eslint-disable-next-line
  }, []);

  // Listen for credits screen trigger
  useEffect(() => {
    const handler = () => setCreditsVisible(true);
    window.addEventListener("showCreditsScreen", handler);
    return () => window.removeEventListener("showCreditsScreen", handler);
  }, []);

  /**
   * Handles player command input.
   */
  const handleCommand = () => {
    try {
      if (engineRef.current && typeof engineRef.current.handleCommand === "function") {
        engineRef.current.handleCommand(command);
        setCommand("");
      } else {
        addToOutput("Game engine not ready.");
      }
    } catch (err) {
      console.error("❌ Game: Error handling command.", err);
      addToOutput("An error occurred processing your command.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      {/* Credits overlay */}
      {creditsVisible && (
        <CreditsScreen
          playerName={playerNameState}
          score={score}
          onReturn={() => {
            setCreditsVisible(false);
            try {
              if (engineRef.current && typeof engineRef.current.enterRoom === "function") {
                engineRef.current.enterRoom("controlnexus");
              }
            } catch (err) {
              console.error("❌ Game: Failed to return from credits.", err);
              addToOutput("Could not return from credits screen.");
            }
          }}
        />
      )}
      {/* Multiverse reset overlay */}
      {currentRoom === "introreset" && (
        <div className="fixed inset-0 bg-black text-red-500 flex items-center justify-center text-4xl font-bold z-50">
          MULTIVERSE RESETTING...
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-7xl mb-2 text-sm text-blue-400 italic font-handwriting">
        <div>
          <span>
            GOOD DAY, [{playerNameState}]! Enjoy your stay — and don’t forget to read The Gorstan Chronicles.
          </span>
          <a
            href="https://www.thegorstanchronicles.com/book-showcase"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            📘
          </a>
        </div>
        <div className="text-green-400 font-bold">Score: {score}</div>
      </div>
      {/* Main game layout */}
      <div className="w-full max-w-7xl space-y-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-2">
          {/* Room rendering */}
          {stage === "game" && currentRoom && (
            <RoomGuard roomId={currentRoom} playerName={playerNameState} devMode={devMode} />
          )}
          {/* Output console */}
          <div className="bg-gray-900 p-4 rounded shadow text-green-300 max-h-32 overflow-y-auto text-sm font-mono">
            <TeletypeConsole
              lines={output.slice(-4)}
              speed={30}
              delayBetween={200}
              className="text-green-300"
              cursor={true}
              instant={false}
              onComplete={() => {
                try {
                  outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
                } catch (err) {
                  // Non-fatal, just log
                  console.warn("❌ Game: Failed to scroll output into view.", err);
                }
              }}
            />
            <div ref={outputEndRef} />
          </div>
          {/* Command input */}
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCommand();
            }}
            className="w-full p-2 rounded bg-gray-800 text-white border border-green-500"
            placeholder="Enter a command..."
            aria-label="Game command input"
            autoComplete="off"
          />
        </div>
        {/* Side panel */}
        <div className="w-full lg:w-64 space-y-4">
          <AylaButton engineRef={engineRef} addToOutput={addToOutput} />
          <MovementPanel engineRef={engineRef} />
        </div>
      </div>
    </div>
  );
}
