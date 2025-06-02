import React, { useState, useEffect } from "react";
import CRTFrame from "./CRTFrame";

const TeletypeIntro = ({ onJump, onWait, onSip, skipIntro = false }) => {
  const playerName = localStorage.getItem("playerName") || "traveller";

  const introText = [
    `Good day, ${playerName}.`,
    "You’re heading home, coffee in hand — a comforting ritual.",
    "The air hums faintly, like static waiting to snap.",
    "Something feels... familiar. Like this has happened before.",
    "The lights flicker — just once. You tell yourself it’s nothing.",
    "You glance at your reflection in the café window — but it lingers after you move.",
    "A voice? No, just caffeine and imagination.",
    "You cross the road. The signal blinks green.",
    "And then —",
    "BIG YELLOW TRUCK comes out of nowhere, hurtling toward you at a rate of knots..."
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [ready, setReady] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [sipUsed, setSipUsed] = useState(false);

  useEffect(() => {
    if (skipIntro) {
      setShowButtons(true);
      return;
    }

    if (currentLine < introText.length) {
      const timeout = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 1200);
      return () => clearTimeout(timeout);
    } else {
      setReady(true);
      setTimeout(() => setShowButtons(true), 1000);
    }
  }, [currentLine, skipIntro]);

  const handleSip = () => {
    if (!sipUsed) {
      setSipUsed(true);
      onSip();
    }
  };

  return (
    <CRTFrame>
      <main className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-screen-sm">
          {skipIntro ? (
            <p className="mb-4">[Intro skipped]</p>
          ) : (
            introText.slice(0, currentLine).map((line, i) => (
              <p key={i} className="mb-2 animate-pulse">{line}</p>
            ))
          )}

          {showButtons && (
            <div className="mt-6 flex flex-col gap-3 items-center">
              <button
                onClick={onJump}
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl transition-shadow duration-200 shadow-lg hover:shadow-green-500"
                aria-label="Jump"
              >
                Jump
              </button>
              <button
                onClick={onWait}
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl transition-shadow duration-200 shadow-lg hover:shadow-green-500"
                aria-label="Wait"
              >
                Wait
              </button>
              <button
                onClick={handleSip}
                disabled={sipUsed}
                className={`$ {
                  sipUsed ? "opacity-50 cursor-not-allowed" : "hover:shadow-green-500"
                } bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl transition-shadow duration-200 shadow-lg`}
                aria-label="Sip Coffee"
              >
                Sip Coffee
              </button>
            </div>
          )}
        </div>
      </main>
    </CRTFrame>
  );
};

export default TeletypeIntro;
