// MIT License
// Gorstan Game v2.3.2
// © 2025 Geoff Webster
// AppCore.jsx – Core orchestrator for Gorstan game logic and state flow.

import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import TeletypeIntro from "./components/TeletypeIntro";
import PlayerNameCapture from "./components/PlayerNameCapture";
import StarterFrame from "./components/StarterFrame";
import Game from "./components/Game";
import SoundSystem from "./components/SoundSystem"; // NEW
import { ResetSystem } from "./engine/resetSystem";
import { handleIntroChoice, handleNameEntry } from "./engine/introLogic";
import { storyProgress } from "./engine/storyProgress";

export default function AppCore() {
  const [screen, setScreen] = useState("welcome");
  const [playerName, setPlayerName] = useState("");
  const [startRoom, setStartRoom] = useState("controlnexus");
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("muted") === "true";
    } catch (err) {
      return false;
    }
  });

  const playSound = (name) => {
    if (isMuted) return;
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play().catch((e) => console.warn("🔇 Sound play failed:", e));
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    try {
      localStorage.setItem("muted", String(next));
    } catch (_) {}
  };

  useEffect(() => {
    if (screen === "reset") ResetSystem();
  }, [screen]);

  return (
    <>
      <SoundSystem muted={isMuted} toggleMute={toggleMute} />
      {
        screen === "welcome" && <WelcomeScreen onBegin={() => setScreen("name")} />
      }
      {
        screen === "name" && (
          <PlayerNameCapture
            onNameEntered={(name) => handleNameEntry(name, setPlayerName, setScreen)}
          />
        )
      }
      {
        screen === "intro" && (
          <TeletypeIntro
            playerName={playerName}
            onChoice={(choice) => handleIntroChoice(choice, setScreen, setStartRoom)}
          />
        )
      }
      {
        screen === "starter" && <StarterFrame onContinue={() => setScreen("game")} />
      }
      {
        screen === "game" && (
          <Game startRoom={startRoom} playerName={playerName} playSound={playSound} />
        )
      }
    </>
  );
}
