// AppCore.jsx
// Core component for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0 – updated intro flow

import { useEffect, useState } from "react";
import Game from "./components/Game";
import ErrorBoundary from "./components/ErrorBoundary";
import WelcomeScreen from "./components/WelcomeScreen";
import TeletypeIntro from "./components/TeletypeIntro";

/**
 * Transitional splash after the player gets hit by the truck.
 */
const SplatScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono space-y-4">
    <p className="text-3xl">⚠️ SPLAT ⚠️</p>
    <p>Multiverse rebooting...</p>
  </div>
);

/**
 * Brief screen for the “Sip Coffee” branch before the inevitable truck.
 */
const SipScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono space-y-4">
    <p>You take a sip. It's... different.</p>
    <p>Gorstan coffee.</p>
  </div>
);

export default function AppCore() {
  // --- State Management ---
  const [phase, setPhase] = useState("welcome"); // Current phase of the game
  const [startingRoom, setStartingRoom] = useState("controlnexus"); // Default starting room

  /**
   * Initializes the global game state when the component mounts.
   * This ensures the game state is reset when the application starts.
   */
  useEffect(() => {
    window.gameState = null; // Reset global game state
  }, []);

  /**
   * Handles transitioning from the welcome screen to the intro screen.
   */
  const handleBegin = () => {
    setPhase("intro");
  };

  /**
   * Handles the player's choice in the intro sequence and transitions to the appropriate phase.
   * @param {string} choice - The player's choice (e.g., "jump", "wait", "sip").
   */
  const handleIntroChoice = (choice) => {
    switch (choice) {
      case "jump":
        setStartingRoom("controlnexus");
        setPhase("game");
        break;

      case "wait":
        setPhase("splat");
        // Brief SPLAT screen then send to introreset room
        setTimeout(() => {
          setStartingRoom("introreset");
          setPhase("game");
        }, 2500);
        break;

      case "sip":
        setPhase("sip");
        // Show sip text, then SPLAT, then introreset
        setTimeout(() => {
          setPhase("splat");
          setTimeout(() => {
            setStartingRoom("introreset");
            setPhase("game");
          }, 2500);
        }, 1500);
        break;

      default:
        console.warn(`Unhandled choice: ${choice}`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Render the Welcome Screen */}
      {phase === "welcome" && <WelcomeScreen onBegin={handleBegin} />}

      {/* Render the Intro Screen */}
      {phase === "intro" && <TeletypeIntro onChoice={handleIntroChoice} />}

      {/* Render the Sip Screen */}
      {phase === "sip" && <SipScreen />}

      {/* Render the Splat Screen */}
      {phase === "splat" && <SplatScreen />}

      {/* Render the Game Screen */}
      {phase === "game" && (
        <ErrorBoundary>
          <Game startRoom={startingRoom} />
        </ErrorBoundary>
      )}
    </div>
  );
}





