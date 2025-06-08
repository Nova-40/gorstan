// Gorstan Game Module — v2.8.4
// MIT License © 2025 Geoff Webster
// TeletypeConsole.jsx — Typing effect console with scrolling and CRT realism

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

/**
 * TeletypeConsole
 * Animates lines of text like a console. Includes scrolling and typing speed.
 * @component
 */
export default function TeletypeConsole({ lines = [], onCompleteLastLine }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const isUnmounted = useRef(false);
  const hasCompleted = useRef(false);
  const scrollRef = useRef(null);

  const typingSpeed = 1000; // ms per character (60 cpm)

  useEffect(() => {
    isUnmounted.current = false;
    return () => { isUnmounted.current = true; };
  }, []);

  useEffect(() => {
    if (!Array.isArray(lines) || lines.length === 0) return;

    if (lineIndex >= lines.length) {
      if (!hasCompleted.current && typeof onCompleteLastLine === "function") {
        hasCompleted.current = true;
        try {
          onCompleteLastLine();
        } catch (err) {
          console.error("TeletypeConsole onCompleteLastLine callback failed:", err);
        }
      }
      return;
    }

    if (charIndex < (lines[lineIndex]?.length || 0)) {
      const timeout = setTimeout(() => {
        if (isUnmounted.current) return;
        setCurrentLine((prev) => prev + lines[lineIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        if (isUnmounted.current) return;
        setDisplayedLines((prev) => [...prev, lines[lineIndex]]);
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
        setCurrentLine("");
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, lines, onCompleteLastLine]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLines, currentLine]);

  useEffect(() => {
    if (displayedLines.length > 0) return;
    setDisplayedLines([]);
    setCurrentLine("");
    setLineIndex(0);
    setCharIndex(0);
    hasCompleted.current = false;
  }, [lines]);

  if (!Array.isArray(lines)) {
    console.error("TeletypeConsole: lines prop must be an array.");
    return <div className="text-red-400 font-mono p-4 bg-black text-center">Error: Invalid lines array.</div>;
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto px-4 py-2 text-green-300 font-mono space-y-2"
      >
        {displayedLines.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">{line}</p>
        ))}
        {currentLine && (
          <p className="whitespace-pre-wrap">{currentLine}<span className="animate-pulse">█</span></p>
        )}
      </div>
    </div>
  );
}

TeletypeConsole.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.string),
  onCompleteLastLine: PropTypes.func,
};