import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import PlayerNameCapture from "./PlayerNameCapture";
import TeletypeIntro from "./TeletypeIntro";
import GameEngine from "../engine/GameEngine";
import { handleJump, handleWait, handleSip } from "../engine/introLogic";

export default function Game() {
  const [stage, setStage] = useState("welcome");
  const [playerName, setPlayerName] = useState("");
  const [skipIntro, setSkipIntro] = useState(false);
  const [gameState, setGameState] = useState({
    room: null,
    score: 0,
    inventory: [],
    flags: {},
    log: ""
  });

  const handleEnterSimulation = () => setStage("name");

  const handleNameSubmit = (name, skip = false) => {
    setPlayerName(name);
    setSkipIntro(skip);
    setStage("teletype");
  };

  const launchGame = (newState) => {
    setGameState(prev => ({ ...prev, ...newState }));
    setStage("game");
  };

  const handleIntroChoice = (choice) => {
    const handlers = {
      jump: handleJump,
      wait: handleWait,
      sip: handleSip
    };
    const updated = handlers[choice](gameState);
    launchGame(updated);
  };

  if (stage === "welcome") {
    return <WelcomeScreen onEnterSimulation={handleEnterSimulation} />;
  }

  if (stage === "name") {
    return (
      <PlayerNameCapture
        onNameSubmit={handleNameSubmit}
        onShowInstructions={() => alert("Instructions would show here")}
      />
    );
  }

  if (stage === "teletype") {
    return (
      <TeletypeIntro
        skipIntro={skipIntro}
        onJump={() => handleIntroChoice("jump")}
        onWait={() => handleIntroChoice("wait")}
        onSip={() => handleIntroChoice("sip")}
      />
    );
  }

  if (stage === "game") {
    return (
      <GameEngine
        playerName={playerName}
        currentRoom={gameState.room}
        inventory={gameState.inventory}
        score={gameState.score}
        flags={gameState.flags}
      />
    );
  }

  return null;
}