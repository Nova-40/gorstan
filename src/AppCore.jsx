// AppCore.jsx
// Core component for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useEffect, useRef, useState } from "react";
import GameEngineWrapper from "./components/GameEngineWrapper";
import IntroSequence from "./components/IntroSequence"; // Intro sequence component
import WelcomeScreen from "./components/WelcomeScreen"; // Welcome screen component

/**
 * Handles quitting the game by resetting the game state and returning to the welcome screen.
 * @param {object} gameState - The current game state object.
 * @param {function} setScreen - Function to update the current screen state.
 */
export function quitGame(gameState, setScreen) {
  try {
    gameState.resetGame(); // Reset the game state
    gameState.hasStarted = false; // Mark the game as not started
    gameState.currentRoom = null; // Clear the current room
    setScreen("welcome"); // Navigate back to the welcome screen
  } catch (err) {
    console.error("❌ Error while quitting the game:", err);
  }
}

/**
 * AppCore Component
 * Manages the main screens of the Gorstan application: Welcome, Intro, and Game.
 * Handles transitions between screens and integrates with the game engine.
 */
export default function AppCore() {
  const [screen, setScreen] = useState("welcome"); // Tracks the current screen
  const engineRef = useRef(null); // Reference to the GameEngine component

  /**
   * Handles the completion of the intro sequence and transitions to the game screen.
   */
  const handleIntroComplete = () => {
    setScreen("game");
  };

  /**
   * Starts the intro sequence by transitioning to the intro screen.
   */
  const startIntro = () => {
    setScreen("intro");
  };

  /**
   * Resets any stale game state to ensure intro screens run as expected.
   */
  useEffect(() => {
    window.gameState = null;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Render the Welcome Screen */}
      {screen === "welcome" && <WelcomeScreen onStartIntro={startIntro} />}

      {/* Render the Intro Sequence */}
      {screen === "intro" && <IntroSequence onComplete={handleIntroComplete} />}

      {/* Render the Game Engine */}
      {screen === "game" && <GameEngineWrapper ref={engineRef} />}
    </div>
  );
}
