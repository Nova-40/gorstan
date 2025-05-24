// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// AppCore.jsx — Entry point and screen flow controller

import React, { useState } from "react";
import Game from "./Game.jsx";
import WelcomeScreen from "../intro/WelcomeScreen.jsx";
import PlayerNameCapture from "../intro/PlayerNameCapture.jsx";
import TeletypeIntro from "../intro/TeletypeIntro.jsx";
import { handleIntroChoice } from "../../engine/core/introLogic.js";

export default function AppCore() {
  const [screen, setScreen] = useState("welcome");
  const [playerName, setPlayerName] = useState(null);
  const [startRoom, setStartRoom] = useState(null);

  const handleNameEntry = (name) => {
    setPlayerName(name);
    setScreen("intro");
  };

  const handleIntroDecision = (choice) => {
    handleIntroChoice(choice, setScreen, setStartRoom);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      {screen === "welcome" && <WelcomeScreen onBegin={() => setScreen("name")} />}
      {screen === "name" && <PlayerNameCapture onNameEntered={handleNameEntry} />}
      {screen === "intro" && <TeletypeIntro playerName={playerName} onChoice={handleIntroDecision} />}
      {screen === "game" && <Game startRoom={startRoom} playerName={playerName} />}
      {screen === "introreset" && (
        <div className="text-center text-red-400">
          <p>🌀 You wake up in a different timeline.</p>
          <button onClick={() => setScreen("game")} className="mt-4 underline">
            Proceed
          </button>
        </div>
      )}
      {screen === "introjump" && (
        <div className="text-center text-yellow-300">
          <p>⚠️ You leapt without hesitation. What now?</p>
          <button onClick={() => setScreen("game")} className="mt-4 underline">
            Begin Game
          </button>
        </div>
      )}
      {screen === "splat" && (
        <div className="text-center text-red-500">
          <p>☠️ SPLAT! You were warned.</p>
          <button onClick={() => setScreen("intro")} className="mt-4 underline">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
