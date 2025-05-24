
import React, { useEffect, useState } from 'react';

export default function TeletypeConsole({ lines = [], onCompleteLastLine }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const playClick = () => {
    const audio = new Audio('/keystroke.mp3'); // Corrected path for /public usage
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (lineIndex >= lines.length) {
      if (onCompleteLastLine) onCompleteLastLine();
      return;
    }

    if (charIndex < lines[lineIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + lines[lineIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
        playClick();
      }, 40); // speed per character

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, lines[lineIndex]]);
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
        setCurrentLine('');
      }, 600); // pause before next line

      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex, lines, onCompleteLastLine]);

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
