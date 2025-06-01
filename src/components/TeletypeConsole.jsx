// File: src/components/TeletypeConsole.jsx
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Module supporting Gorstan gameplay or UI.


// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// TeletypeConsole.jsx — Animates lines of text as if typed on a console, with keystroke sound.

import React, { useEffect, useState, useRef } from "react";

/**
 * TeletypeConsole
 * Animates lines of text as if typed on a console, with keystroke sound.
 * Calls onCompleteLastLine when all lines are finished.
 * Robust error handling and efficient state management.
 */
export default function TeletypeConsole({ lines = [], onCompleteLastLine }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const isUnmounted = useRef(false);
  const hasCompleted = useRef(false);

  // Play keystroke sound, with error handling
  const playClick = () => {
    try {
      const audio = new Audio("/keystroke.mp3"); // Fixed path (removed space)
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

    // All lines have been displayed
    if (lineIndex >= lines.length) {
      if (!hasCompleted.current && typeof onCompleteLastLine === "function") {
        hasCompleted.current = true;
        onCompleteLastLine();
      }
      return;
    }

    // Animate typing the current line character by character
    if (charIndex < (lines[lineIndex]?.length || 0)) {
      const timeout = setTimeout(() => {
        if (isUnmounted.current) return;
        setCurrentLine((prev) => prev + lines[lineIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
        playClick();
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      // After a line is finished, pause before starting the next
      const timeout = setTimeout(() => {
        if (isUnmounted.current) return;
        setDisplayedLines((prev) => [...prev, lines[lineIndex]]);
        setLineIndex((prev) => prev + 1);
        setCharIndex(0); // Reset char index for next line
        setCurrentLine(""); // Reset current line
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, lines, onCompleteLastLine]);

  // Reset state if lines prop changes (only if not already displaying lines)
  useEffect(() => {
    if (displayedLines.length > 0) return;
    setDisplayedLines([]);
    setCurrentLine("");
    setLineIndex(0);
    setCharIndex(0);
    hasCompleted.current = false;
  }, [lines]);

  return (
    <div className="space-y-2">
      {displayedLines.map((line, i) => (
        <p key={i} className="whitespace-pre-wrap">{line}</p>
      ))}
      {currentLine && (
        <p className="whitespace-pre-wrap">{currentLine}</p>
      )}
    </div>
  );
}
