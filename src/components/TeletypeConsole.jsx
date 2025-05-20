// Gorstan v2.2.2 – All modules validated and standardized
// TeletypeConsole.jsx
// Animated console-style teletype output with line-by-line display
// Version 2.2.0
// MIT License Copyright (c) 2025 Geoff Webster
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
/**
 * TeletypeConsole Component
 * Displays lines of text with a teletype animation, one character at a time.
 * Handles instant mode, completion callback, and robust error trapping.
 *
 * Props:
 * - lines: Array of strings to display.
 * - speed: Milliseconds per character.
 * - delayBetween: Delay between lines.
 * - cursor: Whether to show the blinking cursor.
 * - instant: If true, display all lines instantly.
 * - onCompleteLastLine: Callback after the last line is fully displayed.
 */
export default function TeletypeConsole({
  lines = [],
  speed = 40,
  delayBetween = 800,
  cursor = true,
  instant = false,
  onCompleteLastLine,
}) {
  const [output, setOutput] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  // Reset state if lines prop changes
  useEffect(() => {
    setOutput([]);
    setCurrentLine("");
    setLineIndex(0);
    setCharIndex(0);
    setCompleted(false);
  }, [lines]);
  useEffect(() => {
    if (!Array.isArray(lines)) {
      console.error("❌ TeletypeConsole: 'lines' prop must be an array of strings.", lines);
      return;
    }
    if (completed || lineIndex >= lines.length) return;
    // Instant mode: show all lines at once
    if (instant) {
      setOutput(lines);
      setCurrentLine("");
      setLineIndex(lines.length);
      setCompleted(true);
      if (typeof onCompleteLastLine === "function") onCompleteLastLine();
      return;
    }
    const currentText = lines[lineIndex] || "";
    if (charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setCurrentLine((prev) => prev + currentText[charIndex]);
        setCharIndex((i) => i + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
    // Move to next line after delay
    const nextLineTimer = setTimeout(() => {
      setOutput((prev) => [...prev, currentText]);
      setCurrentLine("");
      setCharIndex(0);
      setLineIndex((i) => i + 1);
      // Call onCompleteLastLine after the last line
      if (lineIndex + 1 === lines.length && typeof onCompleteLastLine === "function") {
        setCompleted(true);
        try {
          onCompleteLastLine();
        } catch (err) {
          console.error("❌ TeletypeConsole: Error in onCompleteLastLine callback.", err);
        }
      }
    }, delayBetween);
    return () => clearTimeout(nextLineTimer);
  }, [charIndex, lineIndex, lines, completed, instant, speed, delayBetween, onCompleteLastLine]);
  return (
    <div className="w-full max-w-3xl text-left space-y-2">
      {output.map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
      {currentLine && (
        <p>
          {currentLine}
          {cursor && <span className="animate-pulse">▌</span>}
        </p>
      )}
    </div>
  );
}
TeletypeConsole.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.string),
  speed: PropTypes.number,
  delayBetween: PropTypes.number,
  cursor: PropTypes.bool,
  instant: PropTypes.bool,
  onCompleteLastLine: PropTypes.func,
};
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Defensive error handling for lines prop and callback.
  - All syntax validated and ready for use in the Gorstan game.
  - Component is fully wired for game integration.
  - Comments improved for maintainability and clarity.
*/
