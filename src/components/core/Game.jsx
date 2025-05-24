// MIT License © 2025 Geoff Webster
// Gorstan v2.5

// Game.jsx – Corrected start room handling with fallback protection
import React, { useState, useEffect, useRef } from "react";
import RoomGuard from "./RoomGuard";
import AylaButton from "./AylaButton";
import { rooms } from "../../engine/core/rooms.js";
import GameEngine from "../../engine/core/GameEngine.jsx";
import MovementPanel from "./MovementPanel";
import TeletypeConsole from "../intro/TeletypeConsole.jsx";
import CreditsScreen from "../CreditsScreen.jsx";
import CommandInput from "./CommandInput";
import StatusPanel from "./StatusPanel";

const roomIdByTitle = (title) => {
  const aliasMap = {
    controlnexus: "Another Control Room",
  };
  const resolvedTitle = aliasMap[title] || title;
  const match = Object.keys(rooms).find((id) => rooms[id].title === resolvedTitle);
  if (!match) {
    console.warn("⚠️ No room matched title:", resolvedTitle);
  }
  return match;
};

export default function Game({ startRoom = "Another Control Room", playerName }) {
  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [stage, setStage] = useState("game");
  const [playerNameState, setPlayerNameState] = useState(playerName || "Player");
  const [inventory, setInventory] = useState(["coffee"]);
  const [codex, setCodex] = useState([]);
  const [score, setScore] = useState(0);
  const [creditsVisible, setCreditsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const resolvedRoomId = roomIdByTitle(startRoom);
  const [currentRoom, setCurrentRoom] = useState(resolvedRoomId || null);

  
  const addToOutput = (text) => setOutput((prev) => [...prev, text]);

  const handleThrowCoffee = () => {
    if (inventory.includes("coffee")) {
      addToOutput("☕ You hurl your Gorstan coffee into the abyss. It vanishes with a hiss.");
      setInventory(inventory.filter((item) => item !== "coffee"));
      // Add any game effects here (e.g., unlocking a secret tunnel)
    } else {
      addToOutput("❌ You have no coffee left to throw.");
    }
  };

  const handleSitDown = () => {
    const room = rooms[currentRoom];
    if (room?.exits?.Chair) {
      addToOutput("🪑 You sit down and feel the room shift beneath you...");
      setCurrentRoom(room.exits.Chair.toString());
    } else {
      addToOutput("🪑 You look around for a chair... but none seem inviting.");
    }
  };


  useEffect(() => {
    const handler = () => setCreditsVisible(true);
    window.addEventListener("showCredits", handler);
    return () => window.removeEventListener("showCredits", handler);
  }, []);

  if (!resolvedRoomId || !rooms[resolvedRoomId]) {
    return (
      <div className="text-yellow-400 p-6 text-center">
        ⚠️ No Room Selected
        <br />
        <span className="text-sm text-green-300">Please select a valid room to continue.</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-green-400 font-mono">
      <div className="flex-1 p-4 overflow-y-auto">
        {currentRoom && <RoomGuard currentRoom={currentRoom} />}
        {creditsVisible && <CreditsScreen onClose={() => setCreditsVisible(false)} />}
        <GameEngine
          playerName={playerNameState}
          startingRoom={resolvedRoomId}
          setCurrentRoom={setCurrentRoom}
          addToOutput={addToOutput}
          inventory={inventory}
          codex={codex}
          score={score}
          updateScore={(points) => setScore((prev) => prev + points)}
          setInventory={setInventory}
        />
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

      <div className="w-72 bg-gray-900 text-green-300 p-4 border-l border-green-800 flex flex-col space-y-4">
        <StatusPanel score={score} />
        <div className="space-y-2">
          <button className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded w-full" title="View your collected items">Inventory</button>
          <button className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded w-full" title="Review known lore and knowledge">Codex</button>
        </div>
        <div className="space-y-2 pt-2 border-t border-green-800">
          <button onClick={handleThrowCoffee} className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded w-full" title="Throw your Gorstan coffee">☕ Throw Coffee</button>
          <button onClick={handleSitDown} className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded w-full" title="Sit down if a chair is present">🪑 Sit Down</button>
        </div>
        <MovementPanel currentRoom={currentRoom} onThrowCoffee={handleThrowCoffee} onSitDown={handleSitDown} isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />
        <AylaButton />
      </div>
    </div>
  );
}
