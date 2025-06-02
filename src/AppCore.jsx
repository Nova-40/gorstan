// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// AppCore.jsx — Main controller for Gorstan game flow.

import React, { useState, useCallback } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import PlayerNameCapture from "./components/PlayerNameCapture";
import InstructionsScreen from "./components/InstructionsScreen";
import GameEngine from "./engine/GameEngine";
import * as storyProgress from "./engine/storyProgress";

/**
 * AppCore is the main controller for the Gorstan game.
 * It manages stage transitions, player name, and error handling.
 */
const AppCore = () => {
  // State for controlling which screen/stage is shown
  const [stage, setStage] = useState("welcome");
  // State for storing the player's name
  const [playerName, setPlayerName] = useState("");
  // State for error messages
  const [error, setError] = useState(null);

  /**
   * Centralized error handler for all transitions and actions.
   * Accepts Error objects or strings, logs to console, and updates UI.
   */
  const handleError = useCallback((err) => {
    let message = "An unexpected error occurred.";
    if (err instanceof Error) {
      message = err.message;
      // Optionally log stack trace for debugging
      // eslint-disable-next-line no-console
      console.error(err);
    } else if (typeof err === "string") {
      message = err;
      // eslint-disable-next-line no-console
      console.error("Error:", err);
    }
    setError(message);
    // Optionally send error to an external service here
  }, []);

  // Handler for entering the simulation from the welcome screen
  const handleEnterSimulation = useCallback(() => {
    try {
      setStage("nameInput");
      console.log("stage:", "nameInput");
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  // Handler for when the player name is captured
  const handleNameCaptured = useCallback(
    (name) => {
      try {
        if (!name || !name.trim()) {
          throw new Error("Player name is required.");
        }
        setPlayerName(name.trim());
        setStage("instructions");
        console.log("stage:", "instructions");
      } catch (err) {
        handleError(err);
      }
    },
    [handleError]
  );

  // Handler for completing the instructions screen
  const handleInstructionsComplete = useCallback(() => {
    try {
      storyProgress.reset(); // or load previous session
      setStage("game");
      console.log("stage:", "game");
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  // Handler for errors that occur in the game engine
  const handleGameError = useCallback(
    (err) => {
      handleError(err);
      setStage("welcome");
      console.log("stage:", "welcome");
    },
    [handleError]
  );

  // Dismiss error handler
  const handleDismissError = useCallback(() => setError(null), []);

  return (
    <>
      {/* Error display banner */}
      {error && (
        <div className="bg-red-900 text-red-200 p-4 mb-4 rounded text-center" role="alert">
          <strong>Error:</strong> {error}
          <button
            className="ml-4 underline"
            onClick={handleDismissError}
            aria-label="Dismiss error"
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Welcome screen */}
      {stage === "welcome" && (
        <WelcomeScreen onEnterSimulation={handleEnterSimulation} />
      )}

      {/* Player name input screen */}
      {stage === "nameInput" && (
        <PlayerNameCapture onNameEntered={handleNameCaptured} />
      )}

      {/* Instructions screen */}
      {stage === "instructions" && (
        <InstructionsScreen onComplete={handleInstructionsComplete} />
      )}

      {/* Main game engine */}
      {stage === "game" && (
        <GameEngine playerName={playerName} onError={handleGameError} />
      )}
    </>
  );
};

export default AppCore;
