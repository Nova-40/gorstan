// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: TeletypeConsole.jsx – v2.7.1


import React, { useMemo, useEffect, useState, useRef } from 'react';

/**
 * TeletypeConsole
 * Animates lines of text as if typed on a console, with keystroke sound.
 * Calls onCompleteLastLine when all lines are finished.
 * Robust error handling and efficient state management.
 */
export default function TeletypeConsole({ lines = [], onCompleteLastLine }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const isUnmounted = useRef(false);
  const hasCompleted = useRef(false);

  // Play keystroke sound, with error handling
  const playClick = () => {
    try {
      const audio = new Audio('/ keystroke.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (err) {
      // Ignore sound errors
    }
  };

  // Cleanup on unmount to avoid state updates on unmounted component
  useEffect(() => {
    isUnmounted.current = false;
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (!Array.isArray(lines) || lines.length === 0) return;

    if (lineIndex >= lines.length) {
      if (!hasCompleted.current && typeof onCompleteLastLine === "function") {
        hasCompleted.current = true;
        onCompleteLastLine();
      }
      return;
    }

    if (charIndex < (lines[lineIndex]?.length || 0)) {
      const timeout = setTimeout(() => {
        if (isUnmounted.current) return;
        setCurrentLine((prev) => prev + lines[lineIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
        playClick();
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        if (isUnmounted.current) return;
        setDisplayedLines((prev) => [...prev, lines[lineIndex]]);
        setLineIndex((prev) => prev + 1);
        // safeguard: setCharIndex(0);
        // safeguard: setCurrentLine('');
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, lines, onCompleteLastLine]);

  // Reset state if lines prop changes
  useEffect(() => {
    if (displayedLines.length > 0) return;
    // safeguard: setDisplayedLines([]);
    // safeguard: setCurrentLine('');
    // safeguard: setLineIndex(0);
    // safeguard: setCharIndex(0);
  }, [lines]);

  return (
    <div className="space-y-2">
      {displayedLines.map((line, i) => (
        <p key={i} className="whitespace-pre-wrap">{line}</ p>
      ))}
      {currentLine && (
        <p className="whitespace-pre-wrap">{currentLine}</ p>
      )}
    </ div>
  );
}
