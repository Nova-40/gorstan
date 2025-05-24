
// Game.jsx
// Main game interface for the Gorstan React application.
// MIT License © 2025 Geoff Webster

import React, { useState, useEffect, useRef } from "react";
import RoomGuard from "./RoomGuard";
import AylaButton from "../components/AylaButton";
import { rooms } from "../engine/rooms";
import GameEngine from "../engine/GameEngine";
import MovementPanel from "../components/MovementPanel";
import TeletypeConsole from "../components/TeletypeConsole";
import CreditsScreen from "../components/CreditsScreen";
import CommandInput from "../components/CommandInput";

export default function Game({ startRoom = "controlnexus", playerName }) {
  const outputEndRef = useRef(null);

  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [currentRoom, setCurrentRoom] = useState(startRoom);
  const [stage, setStage] = useState("game");
  const [playerNameState, setPlayerNameState] = useState(playerName || "Player");
  const [inventory, setInventory] = useState(["coffee"]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [creditsVisible, setCreditsVisible] = useState(false);

  const addToOutput = (text) => setOutput((prev) => [...prev, text]);

  useEffect(() => {
    const handler = () => setCreditsVisible(true);
    window.addEventListener("showCredits", handler);
    return () => window.removeEventListener("showCredits", handler);
  }, []);

  if (!rooms[startRoom]) {
    return <div className="text-red-500 p-4">❌ Invalid starting room: {startRoom}</div>;
  }

  return (
    <div className="game-container p-4">
      <RoomGuard currentRoom={currentRoom} />
      {creditsVisible && <CreditsScreen onClose={() => setCreditsVisible(false)} />}
      <GameEngine
        playerName={playerNameState}
        startingRoom={startRoom}
        setCurrentRoom={setCurrentRoom}
        addToOutput={addToOutput}
        inventory={inventory}
        codex={codex}
        score={score}
        updateScore={(points) => setScore((prev) => prev + points)}
        setInventory={setInventory}
      />
      <AylaButton />
      <MovementPanel currentRoom={currentRoom} />
      <CommandInput
        command={command}
        setCommand={setCommand}
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        addToOutput={addToOutput}
        inventory={inventory}
        codex={codex}
        score={score}
        setScore={setScore}
        playerName={playerNameState}
      />
    </div>
  );
}
