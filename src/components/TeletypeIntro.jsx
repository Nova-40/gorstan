// Gorstan Game Module — v3.1.0
// MIT License © 2025 Geoff Webster
// TeletypeIntro.jsx – Character-by-character teletype with blinking cursor and restored story

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * TeletypeIntro
 * Renders a teletype intro sequence with a blinking cursor and timed options.
 *
 * @component
 * @param {Object} props
 * @param {string} props.playerName - The player's name for personalisation.
 * @param {Function} props.onJump - Handler for "Jump into the void".
 * @param {Function} props.onWait - Handler for "Wait and see".
 * @param {Function} props.onSip - Handler for "Sip your coffee".
 * @param {Function} props.onSkip - Handler for skipping the intro.
 * @param {number} props.resetCount - How many times the player has reset.
 * @returns {JSX.Element}
 */
const TeletypeIntro = ({ playerName = "Player", onJump, onWait, onSip, onSkip, resetCount = 0 }) => {
  const countdownRefs = useRef([]);

  const getStory = () => {
    if (resetCount === 1) {
      return [
        `You again, ${playerName}?`,
        "That truck doesn't like you, does it?",
        "You smell coffee. You always do.",
        "Somewhere, a rabbit laughs.",
        "The green man beckons again...",
        "Incoming— you know what happens next.",
        "Will you try a different choice this time?"
      ];
    } else if (resetCount === 2) {
      return [
        `Welcome back, ${playerName}.`,
        "The multiverse is patient, but curious.",
        "A sense of déjà vu wraps around your ankles.",
        "Your coffee is colder. Your steps more cautious.",
        "What if you jumped first, just once?",
        "The kerb awaits. So does the truck."
      ];
    } else if (resetCount >= 3) {
      return [
        `Oh it's you again, ${playerName}.`,
        "We've done this before. Several times.",
        "You're not learning. Or maybe you are.",
        "This is your loop now."
      ];
    }
    // Original first-time story
    return [
      `Good day, ${playerName}.`,
      "You stand at the kerb. The city hums as reality pretends to behave.",
      "The air is thick with the smell of rain and diesel.",
      "You reflect on the strange events of the day.",
      "A lavender rabbit with white eyes that seemed to look into your soul.",
      "Steam rises. You sip your coffee. It tastes like the end of something.",
      "The crossing is green and you step off the kerb.",
      "Suddenly—",
      "A BIG YELLOW TRUCK comes out of nowhere heading for you at a rate of knots.",
      "The world slows down.",
      "You have a choice to make.",
      "Your instincts scream:"
    ];
  };

  const fullStory = getStory();

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    if (lineIndex < fullStory.length) {
      if (charIndex < fullStory[lineIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentLine(fullStory[lineIndex].slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        const delay = setTimeout(() => {
          setDisplayedText((prev) => [...prev, fullStory[lineIndex]]);
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
          setCurrentLine('');
        }, 500);
        return () => clearTimeout(delay);
      }
    } else if (!showOptions) {
      const finalDelay = setTimeout(() => {
        setShowOptions(true);
        setTimerStarted(true);

        countdownRefs.current.push(setTimeout(() => setCountdownText('3'), 12000));
        countdownRefs.current.push(setTimeout(() => setCountdownText('2'), 13000));
        countdownRefs.current.push(setTimeout(() => setCountdownText('1'), 14000));
        countdownRefs.current.push(setTimeout(onWait, 15000));
      }, 1000);
      return () => clearTimeout(finalDelay);
    }
  }, [charIndex, lineIndex, showOptions, onWait, fullStory]);

  const cancelCountdowns = () => {
    countdownRefs.current.forEach(clearTimeout);
    countdownRefs.current = [];
  };

  const handleChoice = (action) => {
    cancelCountdowns();
    action();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-black text-green-400 font-mono p-6 text-lg transition duration-700"
      style={{ animation: showOptions ? 'pulseBg 2s infinite' : 'none' }}
    >
      <div className="w-full max-w-xl space-y-2 flex flex-col items-center justify-center text-center">
        {displayedText.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
        {lineIndex < fullStory.length && (
          <div className="inline">
            {currentLine}
            <span className="animate-pulse">▮</span>
          </div>
        )}
        {countdownText && (
          <div className="text-7xl text-yellow-300 font-extrabold animate-pulse">
            {countdownText}
          </div>
        )}
      </div>

      {showOptions && timerStarted && (
        <div className="mt-8 flex flex-col space-y-4 w-full max-w-xs animate-fade-in">
          <button
            onClick={() => handleChoice(onJump)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            type="button"
          >
            Jump into the void
          </button>
          <button
            onClick={() => handleChoice(onWait)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            type="button"
          >
            Wait and see
          </button>
          <button
            onClick={() => handleChoice(onSip)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            type="button"
          >
            Sip your coffee
          </button>
          <button
            onClick={() => handleChoice(onSkip)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
            type="button"
          >
            Skip intro
          </button>
        </div>
      )}
    </div>
  );
};

TeletypeIntro.propTypes = {
  playerName: PropTypes.string,
  onJump: PropTypes.func.isRequired,
  onWait: PropTypes.func.isRequired,
  onSip: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  resetCount: PropTypes.number
};

export default TeletypeIntro;

if (typeof window !== "undefined" && !document.getElementById("pulseBgStyle")) {
  const style = document.createElement('style');
  style.id = "pulseBgStyle";
  style.innerHTML = `
    @keyframes pulseBg {
      0%, 100% { background-color: #000; }
      50% { background-color: #061d12; }
    }
  `;
  document.head.appendChild(style);
}

