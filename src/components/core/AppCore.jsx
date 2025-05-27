// MIT License © 2025 Geoff Webster
// Gorstan v2.6
// AppCore.jsx — Orchestrates full intro and game flow

import React, { useState, useEffect } from "react";
import WelcomeScreen from "../intro/WelcomeScreen.jsx";
import InstructionsScreen from "../intro/InstructionsScreen.jsx";
import TeletypeIntro from "../intro/TeletypeIntro.jsx";
import StarterFrame from "./StarterFrame.jsx";
import Game from "./Game.jsx";

/**
 * NameCaptureScreen
 * Handles player name input and instructions navigation.
 */
function NameCaptureScreen({ onSubmit }) {
  const [nameInput, setNameInput] = useState("");

  // Handles the Instructions button click
  const handleInstructions = () => {
    try {
      localStorage.setItem("playerName", "__INSTRUCTIONS__");
    } catch (err) {
      // Ignore localStorage errors, still proceed
    }
    onSubmit("__INSTRUCTIONS__");
  };

  // Handles the Continue button click
  const handleContinue = () => {
    const cleanName = nameInput.trim();
    if (cleanName && cleanName !== "__INSTRUCTIONS__") {
      try {
        localStorage.setItem("playerName", cleanName);
      } catch (err) {
        // Ignore localStorage errors, still proceed
      }
      onSubmit(cleanName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 p-6 font-mono space-y-4">
      <h2 className="text-2xl">What is your name?</h2>
      <input
        type="text"
        className="bg-gray-800 text-green-400 border border-green-400 rounded p-2"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Enter your name"
        onKeyDown={e => { if (e.key === "Enter") handleContinue(); }}
        autoFocus
      />
      <div className="space-x-4">
        <button
          onClick={handleContinue}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>
        <button
          onClick={handleInstructions}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Instructions
        </button>
      </div>
    </div>
  );
}

/**
 * AppCore
 * Main orchestrator for intro/game flow.
 */
function AppCore() {
  // Load player name from localStorage or default to empty string
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    try {
      const storedName = localStorage.getItem("playerName");
      if (storedName) setPlayerName(storedName);
    } catch {}
  }, []);

  // Load step from localStorage or default to "welcome"
  const [step, setStep] = useState("welcome");

  useEffect(() => {
    try {
      const storedStep = localStorage.getItem("step");
      if (storedStep) setStep(storedStep);
    } catch {}
  }, []);

  // Handles name submission and step transitions
  const handleNameSubmit = (name) => {
    console.log("[handleNameSubmit] name submitted:", name);
    try { debugger; } catch (e) {}
    setPlayerName(name);
    try {
      localStorage.setItem("playerName", name);
    } catch {
      // Ignore localStorage errors
    }
    if (name === "__INSTRUCTIONS__") {
      console.log("[handleNameSubmit] setting step: instructions");
    setStep("instructions");
      try {
        localStorage.setItem("step", "instructions");
      } catch {}
    } else {
      console.log("[handleNameSubmit] setting step: teletype");
    setStep("teletype");
      try {
        localStorage.setItem("step", "teletype");
      } catch {}
    }
  };

  // Render the appropriate screen based on current step
  return (
    <>
      {step === "welcome" && (
        <WelcomeScreen
          onContinue={() => setStep("name")}
        />
      )}
      {step === "name" && <NameCaptureScreen onSubmit={handleNameSubmit} />}
      {step === "teletype" && (
        <TeletypeIntro
          playerName={playerName}
          onChoice={() => setStep("starter")}
        />
      )}
      {step === "starter" && (
        <StarterFrame
          playerName={playerName}
          onBegin={() => setStep("game")}
        />
      )}
      {step === "game" && <Game />}
      {step === "instructions" && (
        <InstructionsScreen onReturn={() => setStep("welcome")} />
      )}
    </>
  );
}

export default AppCore;