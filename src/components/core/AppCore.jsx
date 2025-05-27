// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: AppCore.jsx – v2.7.2

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
    <div className="p-4">
      <input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Enter your name"
        className="border p-2 rounded mr-2"
      />
      <div className="space-x-4 mt-4">
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
    try {
      setPlayerName(name);
      localStorage.setItem("playerName", name);
    } catch {
      setPlayerName(name);
    }
    if (name === "__INSTRUCTIONS__") {
      setStep("instructions");
      try {
        localStorage.setItem("step", "instructions");
      } catch {}
    } else {
      setStep("teletype");
      try {
        localStorage.setItem("step", "teletype");
      } catch {}
    }
  };

  // Render the appropriate screen based on current step
  switch (step) {
    case "welcome":
      return <WelcomeScreen onContinue={() => setStep("name")} />;
    case "name":
      return <NameCaptureScreen onSubmit={handleNameSubmit} />;
    case "instructions":
      return <InstructionsScreen onReturn={() => setStep("name")} />;
    case "teletype":
      return <TeletypeIntro playerName={playerName} onChoice={() => setStep("controlnexus")} />;
    case "controlnexus":
      return <Game startRoom="controlnexus" />;
    case "starter":
      return <StarterFrame playerName={playerName} onBegin={() => setStep("game")} />;
    case "game":
      return <Game />;
    default:
      return <div className="text-red-500 p-4">Unknown step: {step}</div>;
  }
}

export default AppCore;