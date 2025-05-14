// Game.jsx
// Main game interface for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster

import React, { useState, useEffect, useRef } from "react";
import RoomGuard from "./RoomGuard";
import AylaButton from "../components/AylaButton";
import { rooms } from "../engine/rooms";
import GameEngine from "../engine/GameEngine";
import MovementPanel from "../components/MovementPanel";

export default function Game({ startRoom = "controlnexus", playerName }) {
  const engineRef = useRef(null);
  const outputEndRef = useRef(null);

  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [stage, setStage] = useState("game");
  const [playerNameState, setPlayerNameState] = useState(playerName || "Player");
  const [inventory, setInventory] = useState([]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);
  const [devMode, setDevMode] = useState(false);

  const addToOutput = (text) => setOutput((prev) => [...prev, text]);

  useEffect(() => {
    const startingInventory = ["coffee"];
    setInventory(startingInventory);

    engineRef.current = new GameEngine({
      startRoom,
      setCurrentRoom,
      addToOutput,
      getState: () => ({ inventory, codex, score }),
      updateScore: (points) => setScore((prev) => prev + points),
      setInventory,
    });

    engineRef.current.start();
  }, []);

  const handleCommand = () => {
    if (engineRef.current) {
      engineRef.current.handleCommand(command);
      setCommand("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="flex justify-between items-center w-full max-w-7xl mb-2 text-sm text-blue-400 italic font-handwriting">
        <div>
          <span>Good day, {playerNameState}. Enjoy the game — Read The Gorstan Chronicles</span>
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

      <div className="w-full max-w-7xl space-y-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-2">
          {stage === "game" && currentRoom && (
            <RoomGuard roomId={currentRoom} playerName={playerNameState} devMode={devMode} />
          )}

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
          
          
          <AylaButton engineRef={engineRef} addToOutput={addToOutput} />
          <MovementPanel engineRef={engineRef} />
        </div>
      </div>
    </div>
  );
}