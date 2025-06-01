// Gorstan Game Module — v2.8.0
import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import PlayerNameCapture from "./PlayerNameCapture";
import TeletypeIntro from "./TeletypeIntro";
import StarterFrame from "./StarterFrame";
import GameEngine from "../engine/GameEngine";
import rooms from "../engine/rooms";

export default function AppCore() {
  const [playerName, setPlayerName] = useState("");
  const [startGame, setStartGame] = useState(false);
  const [startingRoom, setStartingRoom] = useState(null);
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState(["coffee"]);
  const [phase, setPhase] = useState("welcome");

  const handleNameSubmit = (name) => {
    setPlayerName(name);
    setPhase("intro");
  };

  const handleIntroComplete = () => {
    setPhase("starter");
  };

  if (startGame && startingRoom) {
    return (
      <GameEngine
        playerName={playerName}
        startingRoom={startingRoom}
        score={score}
        inventory={inventory}
      />
    );
  }

  switch (phase) {
    case "welcome":
      return <WelcomeScreen onProceed={() => setPhase("name")} />;
    case "name":
      return <PlayerNameCapture onSubmit={handleNameSubmit} />;
    case "intro":
      return <TeletypeIntro onFinish={handleIntroComplete} playerName={playerName} />;
    case "starter":
      return (
        <StarterFrame
          setStartGame={setStartGame}
          setStartingRoom={setStartingRoom}
          setScore={setScore}
          setInventory={setInventory}
        />
      );
    default:
      return null;
  }
}