// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// TeletypeConsole.jsx
// Animated console-style teletype output with line-by-line display

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
 * - onComplete: Callback after the last line is fully displayed.
 */
export default function TeletypeConsole({
  lines = [],
  speed = 40,
  delayBetween = 800,
  cursor = true,
  instant = false,
  onComplete,
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
      if (typeof onComplete === "function") onComplete();
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
      // Call onComplete after the last line
      if (lineIndex + 1 === lines.length && typeof onComplete === "function") {
        setCompleted(true);
        try {
          onComplete();
        } catch (err) {
          console.error("❌ TeletypeConsole: Error in onComplete callback.", err);
        }
      }
    }, delayBetween);
    return () => clearTimeout(nextLineTimer);
  }, [charIndex, lineIndex, lines, completed, instant, speed, delayBetween, onComplete]);

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
  onComplete: PropTypes.func,
};

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, hooks).
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
     - Renamed onCompleteLastLine to onComplete for clarity and convention.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - PropTypes for all props.
  4. 🤝 INTEGRATION CHECK
     - Expects `lines` (array), `onComplete` (function) from parent.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract animation logic to a custom hook for reuse.
     - Could add unit tests for animation and callback.
     - Could accept a `className` prop for more flexible styling.
*/
