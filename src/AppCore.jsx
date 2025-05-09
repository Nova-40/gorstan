// AppCore.jsx
// Core component for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useEffect, useState } from "react";
import Game from "./components/Game";
import ErrorBoundary from "./components/ErrorBoundary";
import WelcomeScreen from "./components/WelcomeScreen";

/**
 * AppCore Component
 * The root component for the Gorstan application.
 * Manages the application's main screens (welcome and game) and initializes global state.
 */
export default function AppCore() {
  // --- State Management ---
  const [screen, setScreen] = useState("welcome"); // Current screen ("welcome" or "game")
  const [startingRoom, setStartingRoom] = useState("introstreet1"); // Default starting room for the game

  /**
   * Initializes the global game state when the component mounts.
   * This ensures the game state is reset when the application starts.
   */
  useEffect(() => {
    window.gameState = null; // Reset global game state
  }, []);

  /**
   * Handles transitioning from the welcome screen to the game screen.
   */
  const beginGame = () => {
    setScreen("game");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Render the Welcome Screen */}
      {screen === "welcome" && (
        <WelcomeScreen onStartIntro={beginGame} />
      )}

      {/* Render the Game Screen */}
      {screen === "game" && (
        <ErrorBoundary>
          <Game startRoom={startingRoom} />
        </ErrorBoundary>
      )}
    </div>
  );
}







