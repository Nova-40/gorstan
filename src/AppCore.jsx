// AppCore.jsx
// Core component for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useEffect, useState } from "react";
import Game from "./components/Game";
import WelcomeScreen from "./components/WelcomeScreen";

export default function AppCore() {
  const [screen, setScreen] = useState("welcome");
  const [startingRoom, setStartingRoom] = useState("introstreet");

  useEffect(() => {
    window.gameState = null;
  }, []);

  const beginGame = () => {
    setScreen("game");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {screen === "welcome" && (
        <WelcomeScreen onStartIntro={beginGame} />
      )}
      {screen === "game" && (
        <Game startRoom={startingRoom} />
      )}
    </div>
  );
}







