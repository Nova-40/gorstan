// TeletypeConsole.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// A reusable teletype-style console for Gorstan (and beyond).
// -----------------------------------------------------------
// Props
//   lines        (string | string[])  – single line or array of lines to type.
//   speed        (number)             – ms delay between chars (default 40).
//   delayBetween (number)             – ms pause between full lines (default 500).
//   className    (string)             – extra Tailwind classes for wrapper.
//   cursor       (boolean)            – show blinking cursor (default true).
//   instant      (boolean)            – if true, render instantly (no typing).
//   onComplete   (function)           – callback after all typing done.
//
// Usage example:
//   <TeletypeConsole
//       lines={["The room hums with static.", "Portals shimmer in the air."]}
//       speed={30}
//       className="text-green-400 font-mono text-lg"
//   />

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function TeletypeConsole({
  lines = "",
  speed = 40,
  delayBetween = 500,
  className = "",
  cursor = true,
  instant = false,
  onComplete = () => {},
}) {
  const textLines = Array.isArray(lines) ? lines : [lines];

  const [finishedLines, setFinished] = useState([]);
  const [current, setCurrent] = useState("");
  const [lIdx, setLIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);

  useEffect(() => {
    if (instant) {
      setFinished(textLines);
      setCurrent("");
      onComplete();
    }
  }, [instant]);

  useEffect(() => {
    if (instant) return;

    if (lIdx >= textLines.length) {
      onComplete();
      return;
    }

    const line = textLines[lIdx];

    if (cIdx < line.length) {
      const id = setTimeout(() => {
        setCurrent((p) => p + line[cIdx]);
        setCIdx(cIdx + 1);
      }, speed);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => {
      setFinished((p) => [...p, line]);
      setCurrent("");
      setCIdx(0);
      setLIdx(lIdx + 1);
    }, delayBetween);
    return () => clearTimeout(id);
  }, [cIdx, lIdx, instant, speed, delayBetween, textLines, onComplete]);

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {finishedLines.map((ln, i) => (
        <p key={i} className="mb-2">{ln}</p>
      ))}
      {current && (
        <p className="mb-2">
          {current}
          {cursor && <span className="animate-pulse">▊</span>}
        </p>
      )}
    </div>
  );
}

TeletypeConsole.propTypes = {
  lines: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  speed: PropTypes.number,
  delayBetween: PropTypes.number,
  className: PropTypes.string,
  cursor: PropTypes.bool,
  instant: PropTypes.bool,
  onComplete: PropTypes.func,
};