// TeletypeIntro.jsx
// Enhanced intro sequence with teletype pacing, sound effects, and a visual timeline.
// MIT License © 2025 Geoff Webster
// Gorstan v2.4.2 – rich narrative moment-of-choice experience

import { useEffect, useRef, useState } from "react";
import TeletypeConsole from "./TeletypeConsole";
import teletypeSound from "/public/intro.mp3"; // must exist

const TIMEOUT_MS = 10000;
const WARNING_MS = 7000;

export default function TeletypeIntro({ playerName = "Player", onChoice }) {
  if (typeof onChoice !== "function") {
    console.error("TeletypeIntro: onChoice is not a function.");
    onChoice = () => {};
  }

  const [showChoices, setShowChoices] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState((TIMEOUT_MS - WARNING_MS) / 1000);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // Subtle countdown warning
    countdownRef.current = setTimeout(() => {
      setShowCountdown(true);
    }, WARNING_MS);

    // Final timeout triggers fallback
    timerRef.current = setTimeout(() => {
      onChoice("wait");
    }, TIMEOUT_MS);

    // Timeline progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newVal = Math.min(prev + 100 / (TIMEOUT_MS / 100), 100);
        return newVal;
      });
    }, 100);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(countdownRef.current);
      clearInterval(interval);
    };
  }, [onChoice]);

  useEffect(() => {
    if (!showCountdown) return;
    const int = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(int);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(int);
  }, [showCountdown]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  function handleClick(choice) {
    clearTimeout(timerRef.current);
    clearTimeout(countdownRef.current);
    onChoice(choice);
  }

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src={teletypeSound} preload="auto" />
      <TeletypeConsole
        textLines={[
          `Good day, ${playerName}.`,
          "You hear your own breath. It's too loud.",
          "The air tingles with static.",
          "You clutch your Gorstan coffee. It's warm. Familiar.",
          "You stand at the kerb.",
          "Something is wrong.",
          "A BIG YELLOW TRUCK hurtles toward you.",
          "Time stretches like rubber.",
          "You smell ozone. A bell chimes...",
          "Your instincts scream:",
          "⏳ Choose — now."
        ]}
        charDelay={50}
        onCompleteLastLine={() => setShowChoices(true)}
      />

      {showChoices && (
        <div className="flex flex-col items-start gap-3">
          <button onClick={() => handleClick("jump")} className="btn-primary">Jump</button>
          <button onClick={() => handleClick("wait")} className="btn-secondary">Wait</button>
          <button onClick={() => handleClick("sipcoffee")} className="btn-accent">Sip Coffee</button>
        </div>
      )}

      {showCountdown && (
        <p className="text-yellow-400 font-mono text-sm mt-4">
          ⏳ Make your choice... {secondsLeft}s
        </p>
      )}

      <div className="mt-4 w-full max-w-lg h-2 bg-gray-800 rounded overflow-hidden">
        <div
          className="h-full bg-yellow-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
