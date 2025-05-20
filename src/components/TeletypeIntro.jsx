// Gorstan v2.2.2 – All modules validated and standardized
// TeletypeIntro.jsx – Safeguarded True Teletype
import { useEffect, useState } from "react";
export default function TeletypeIntro({ playerName = "Player", onChoice }) {
  const fullIntro = [
    `Good day, ${playerName}...`,
    "You’re walking home from work, coffee in hand.",
    "The sun is setting, casting long shadows on the pavement.",
    "You’re tired, but you’re almost home.",
    "You take a sip of your coffee, savouring the warmth.",
    "The world is quiet, the kind of quiet that makes you feel safe.",
    "You think about the day’s events, the strange things you’ve seen.",
    "A lavender rabbit with ghost-pale eyes, watching you as if it already knew the ending to your story.",
    "The light is green.",
    "WAIT — WHAT’S THAT?",
    "A BIG YELLOW TRUCK barreling toward you...",
    "Your instincts scream:"
  ];
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [linesShown, setLinesShown] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [showChoices, setShowChoices] = useState(false);
  useEffect(() => {
    if (lineIndex < fullIntro.length) {
      const line = fullIntro[lineIndex];
      const isEndOfLine = charIndex >= line.length;
      const timer = setTimeout(() => {
        if (isEndOfLine) {
          setLinesShown((prev) => [...prev, line]);
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
          setCurrentLine("");
        } else {
          setCurrentLine(line.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }
      }, 30);
      return () => clearTimeout(timer);
    } else if (!showChoices) {
      const delay = setTimeout(() => {
        setShowChoices(true);
        const splatTimeout = setTimeout(() => {
          localStorage.setItem("hesitated", "true");
          onChoice("timeout");
        }, 10000);
        return () => clearTimeout(splatTimeout);
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [charIndex, lineIndex, showChoices]);
  return (
    <div className="p-6 font-mono text-green-400 space-y-1" role="dialog" aria-label="Intro">
      {linesShown.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      {!showChoices && (
        <>
          <p>{currentLine}</p>
          {linesShown.length === 0 && currentLine && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setLinesShown([...fullIntro]);
                  setLineIndex(fullIntro.length);
                  setShowChoices(true);
                }}
                className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
              >
                Skip Intro
              </button>
            </div>
          )}
        </>
      )}
      {showChoices && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <button onClick={() => onChoice("jump")} className="bg-green-700 px-4 py-2 rounded text-white hover:bg-green-600">
            Jump
          </button>
          <button onClick={() => onChoice("wait")} className="bg-yellow-600 px-4 py-2 rounded text-white hover:bg-yellow-500">
            Wait
          </button>
          <button onClick={() => onChoice("sip")} className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500">
            Sip Coffee
          </button>
        </div>
      )}
    </div>
  );
}
