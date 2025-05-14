// AppCore.jsx
// Core component for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0 – updated intro flow

import { useEffect, useState } from "react";
import Game from "./components/Game";
import ErrorBoundary from "./components/ErrorBoundary";
import WelcomeScreen from "./components/WelcomeScreen";
import TeletypeIntro from "./components/TeletypeIntro";
import PlayerNameCapture from "./components/PlayerNameCapture";

/**
 * Transitional splash after the player gets hit by the truck.
 */
const SplatScreen = () => (
  <div className="min-h-screen flex flex-col items-centre justify-centre bg-black text-green-400 font-mono space-y-4">
    <p className="text-3xl">⚠️ SPLAT ⚠️</p>
    <p>Multiverse rebooting...</p>
  </div>
);

/**
 * Brief screen for the “Sip Coffee” branch before the inevitable truck.
 */
const SipScreen = () => (
  <div className="min-h-screen flex flex-col items-centre justify-centre bg-black text-green-400 font-mono space-y-4">
    <p>You take a sip. It's... different.</p>
    <p>Gorstan coffee.</p>
  </div>
);

export default function AppCore() {
  // --- State Management ---
  const [phase, setPhase] = useState("welcome"); // Current phase of the game
  const [startingRoom, setStartingRoom] = useState("controlnexus"); // Default starting room
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    window.gameState = null; // Reset global game state
  }, []);

  const handleBegin = () => {
    setPhase("nameCapture");
  };

  const handleNameEntered = (name) => {
    if (!name || name.trim().length === 0) {
      alert("Please enter a valid name.");
      return;
    }
    setPlayerName(name.trim());
    setPhase("intro");
  };

  const handleIntroChoice = (choice) => {
    switch (choice) {
      case "jump":
        setStartingRoom("controlnexus");
        setPhase("game");
        break;
      case "wait":
        setPhase("splat");
        setTimeout(() => {
          setStartingRoom("introreset");
          setPhase("game");
        }, 2500);
        break;
      case "sip":
        setPhase("sip");
        setTimeout(() => {
          setPhase("splat");
          setTimeout(() => {
            setStartingRoom("introreset");
            setPhase("game");
          }, 2500);
        }, 1500);
        break;
      case "skip":
        setStartingRoom("controlnexus");
        setPhase("game");
        break;
      default:
        console.warn(`Unhandled choice: ${choice}`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {phase === "welcome" && <WelcomeScreen onBegin={handleBegin} />}
      {phase === "nameCapture" && <PlayerNameCapture onNameEntered={handleNameEntered} />}
      {phase === "intro" && <TeletypeIntro playerName={playerName} onChoice={handleIntroChoice} />}
      {phase === "sip" && <SipScreen />}
      {phase === "splat" && <SplatScreen />}
      {phase === "game" && (
        <ErrorBoundary>
          <Game startRoom={startingRoom} playerName={playerName} />
        </ErrorBoundary>
      )}
    </div>
  );
}


