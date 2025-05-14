// TeletypeIntro_Upgraded.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.4 – now with TeletypeConsole for main console support

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TeletypeConsole from "./TeletypeConsole"; // Add this line if you're using TeletypeConsole in shared UI

/**
 * TeletypeIntro Component
 * Displays a splash screen image for 3 seconds, then runs the teletype intro.
 * Supports intro skip and fade-out transition for returning players.
 */
export default function TeletypeIntro({ onChoice, playerName }) {
  const hasPlayedBefore = localStorage.getItem("gorstanIntroPlayed") === "true";

  const baseLines = [
    `GOOD DAY, ${playerName}! Enjoy your stay — and don’t forget to read The Gorstan Chronicles.`,
    "You’re walking home from work, coffee in hand.",
    "The sun hangs low, casting long, golden shadows across the pavement.",
    "You’re tired — the kind of tired that settles in your bones — but home is close.",
    "You take a sip, savouring the coffee’s fading warmth.",
    "The world is quiet. Not silence, but that rare, comforting hush that feels like safety.",
    "Your thoughts drift: the day’s oddities, those small, strange moments you can’t quite explain.",
    "A lavender rabbit. White ghost-like eyes. Watching you as if it already knew the ending to your story.",
    "The crossing light flashes green. You step forward.",
    "WAIT — WHAT’S THAT?",
    "A BIG YELLOW TRUCK — barreling toward you like it’s got something to prove.",
    "Your instincts scream:"
  ];

  const [showStarter, setShowStarter] = useState(true);
  const [lines, setLines] = useState([]);
  const [currentLine, setCur] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showChoices, setChoices] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowStarter(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (!showStarter && hasPlayedBefore) {
      const timer = setTimeout(() => setShowSkip(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasPlayedBefore, showStarter]);

  useEffect(() => {
    if (!isSkipping) return;
    const skipMsg = "You’ve heard this story before. You know how it starts. Let’s skip to where it matters.";
    if (charIdx < skipMsg.length) {
      const t = setTimeout(() => {
        setCur((p) => p + skipMsg[charIdx]);
        setCharIdx(charIdx + 1);
      }, 40);
      return () => clearTimeout(t);
    }
    if (!fadingOut) {
      setFadingOut(true);
      setTimeout(() => {
        localStorage.setItem("gorstanIntroPlayed", "true");
        onChoice("skip");
      }, 1200);
    }
  }, [isSkipping, charIdx, fadingOut, onChoice]);

  useEffect(() => {
    if (isSkipping || showStarter) return;
    if (lineIdx < baseLines.length) {
      if (charIdx < baseLines[lineIdx].length) {
        const t = setTimeout(() => {
          setCur((p) => p + baseLines[lineIdx][charIdx]);
          setCharIdx(charIdx + 1);
        }, 40);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setLines((p) => [...p, baseLines[lineIdx]]);
        setCur("");
        setCharIdx(0);
        setLineIdx(lineIdx + 1);
      }, 500);
      return () => clearTimeout(t);
    }
    if (!showChoices) {
      const t = setTimeout(() => {
        setChoices(true);
        localStorage.setItem("gorstanIntroPlayed", "true");
      }, 800);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, isSkipping, showStarter, showChoices]);

  return (
    <div className="min-h-screen p-4 font-mono bg-black text-green-400 text-lg leading-relaxed relative overflow-hidden">
      {showStarter ? (
        <img
          src="/images/starterframe.png"
          alt="Gorstan Title"
          className="absolute inset-0 object-cover w-full h-full z-40"
        />
      ) : (
        <>
          <TeletypeConsole
            lines={[...lines, currentLine]}
            speed={40}
            delayBetween={500}
            className="mb-2"
            cursor={!showChoices}
            instant={false}
          />
          {showChoices && !isSkipping && (
            <div className="mt-6 space-x-4">
              <button className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded" onClick={() => onChoice("jump")}>Jump!</button>
              <button className="bg-yellow-600 hover:bg-yellow-800 text-white py-2 px-4 rounded" onClick={() => onChoice("sip")}>Sip Coffee</button>
              <button className="bg-red-700 hover:bg-red-900 text-white py-2 px-4 rounded" onClick={() => onChoice("wait")}>Wait</button>
            </div>
          )}
          {showSkip && !showChoices && !isSkipping && (
            <button
              onClick={() => {
                setLines([]);
                setCur("");
                setCharIdx(0);
                setIsSkipping(true);
              }}
              className="absolute bottom-4 right-4 px-3 py-1 border border-yellow-300 text-yellow-300 text-sm rounded hover:bg-yellow-500 hover:text-black transition-colors"
            >
              Skip Intro
            </button>
          )}
        </>
      )}
      {fadingOut && <div className="absolute inset-0 bg-black animate-fadeOut pointer-events-none z-50"></div>}
    </div>
  );
}

TeletypeIntro.propTypes = {
  onChoice: PropTypes.func.isRequired,
  playerName: PropTypes.string.isRequired,
};
