
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PlayerNameCapture from './components/PlayerNameCapture';
import TeletypeIntro from './components/TeletypeIntro';
import Game from './components/Game';
import { handleIntroChoice } from './engine/handleIntroChoice';
import { storyProgress } from './engine/storyProgress';

export default function AppCore() {
  const [screen, setScreen] = useState("welcome");
  const [playerName, setPlayerName] = useState("");
  const [startRoom, setStartRoom] = useState("");

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {screen === "welcome" && (
        <WelcomeScreen onBegin={() => setScreen("name")} />
      )}

      {screen === "name" && (
        <PlayerNameCapture onNameEntered={(name) => {
          setPlayerName(name);
          setScreen("intro");
        }} />
      )}

      {screen === "intro" && (
        <TeletypeIntro
          playerName={playerName}
          onChoice={(choice) => handleIntroChoice(choice, setScreen, setStartRoom)}
        />
      )}

      {screen === "introjump" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center text-green-300">
          <p>You try to jump out of the way but that truck is just too close...</p>
          <p>Fortunately, a portal opens up and engulfs you.</p>
          <p>You're falling...</p>
        </div>
      )}

      {screen === "splat" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center text-red-500">
          <p>⚠️ SPLAT ⚠️</p>
          <p>You hesitated. The truck did not.</p>
          <p>The universe resets...</p>
        </div>
      )}

      {screen === "game" && (
        <Game playerName={playerName} startingRoom={startRoom} />
      )}
    </div>
  );
}
