// Gorstan Game Module — v3.0.0

// Gorstan Game Module — v2.0.1
// MIT License © 2025 Geoff Webster
// TeletypeIntro.jsx — Animated teletype intro for Gorstan

import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../engine/GameContext';

const TeletypeIntro = ({ onJump, onWait, onSip }) => {
  const { state } = useContext(GameContext);
  const playerName = state?.playerName || "traveller";

  const introLines = [
    `Welcome, ${playerName}!`,
    "You are walking home from work.",
    "The air hums strangely — it's one of those evenings where reality seems... thinner.",
    "In one hand, you're holding a cup of coffee.",
    "Ahead, the crossing beeps softly. You step out—",
    "A YELLOW TRUCK comes barrelling toward you at speed.",
    "You have a split second to react.",
    "What do you do?",
  ];

  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [skip, setSkip] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (lineIndex >= introLines.length) {
      setFinished(true);
      return;
    }

    if (skip) {
      setDisplayedLines(introLines);
      setFinished(true);
      return;
    }

    const current = introLines[lineIndex];
    if (charIndex <= current.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(current.slice(0, charIndex));
        setCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      setDisplayedLines((prev) => [...prev, current]);
      setCurrentLine('');
      setCharIndex(0);
      setLineIndex((prev) => prev + 1);
    }
  }, [charIndex, lineIndex, skip]);

  return (
    <div className="relative min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4 crt">
      <div className="text-left whitespace-pre-wrap w-full max-w-2xl mb-6 px-2">
        {displayedLines.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
        {currentLine && <p>{currentLine}</p>}
      </div>
      {finished && (
        <div className="flex flex-row gap-4">
          <button onClick={onJump} className="bg-green-700 px-4 py-2 rounded-xl hover:bg-green-600 shadow">
            Jump
          </button>
          <button onClick={onSip} className="bg-green-700 px-4 py-2 rounded-xl hover:bg-green-600 shadow">
            Sip Coffee
          </button>
          <button onClick={onWait} className="bg-green-700 px-4 py-2 rounded-xl hover:bg-green-600 shadow">
            Wait
          </button>
        </div>
      )}
      {!finished && (
        <button
          onClick={() => setSkip(true)}
          className="absolute bottom-4 right-4 text-xs px-3 py-1 border border-green-400 text-green-300 rounded hover:bg-green-700"
        >
          Skip &gt;&gt;
        </button>
      )}
    </div>
  );
};

export default TeletypeIntro;