/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// src/components/WelcomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { getVersionString, getShortVersion } from '../config/version';

interface WelcomeScreenProps {
  onBegin: () => void;
  onLoadGame: () => void;
  onStartDemo?: () => void;
}

interface AylaGuidanceProps {
  onDismiss: () => void;
  onStartDemo: () => void;
}

interface RadialProgressRingProps {
  progress: number;
}

const AylaGuidanceModal: React.FC<AylaGuidanceProps> = ({ onDismiss, onStartDemo }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-cyan-400 rounded-xl p-6 max-w-2xl w-full text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/images/Ayla.png"
            alt="Ayla"
            className="w-16 h-16 rounded-full border-2 border-cyan-400"
          />
          <div>
            <h3 className="text-xl font-bold text-cyan-300">Ayla</h3>
            <p className="text-sm text-gray-300">Your Guide Through the Multiverse</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-cyan-200">
            *A cosmic presence manifests, her voice carrying the weight of infinite realities*
          </p>

          <p className="text-white">
            "Greetings, traveler. I sense you're contemplating your journey through Gorstan. Let me
            illuminate the paths before you..."
          </p>

          <div className="bg-black bg-opacity-30 rounded-lg p-4 space-y-2">
            <h4 className="text-cyan-300 font-semibold">What You Can Experience:</h4>
            <ul className="text-gray-200 space-y-1">
              <li>
                • <strong>Explore</strong> - Navigate a multiverse of interconnected rooms and
                realities
              </li>
              <li>
                • <strong>Interact</strong> - Converse with AI-powered NPCs who remember your
                choices
              </li>
              <li>
                • <strong>Solve Puzzles</strong> - Uncover secrets through logic and observation
              </li>
              <li>
                • <strong>Shape Reality</strong> - Your decisions ripple across dimensions
              </li>
              <li>
                • <strong>Discover Lore</strong> - Unravel the mysteries of the Lattice and beyond
              </li>
            </ul>
          </div>

          <div className="bg-black bg-opacity-30 rounded-lg p-4 space-y-2">
            <h4 className="text-cyan-300 font-semibold">How to Play:</h4>
            <ul className="text-gray-200 space-y-1">
              <li>
                • Type commands like <code className="bg-gray-700 px-1 rounded">look</code>,{' '}
                <code className="bg-gray-700 px-1 rounded">north</code>,{' '}
                <code className="bg-gray-700 px-1 rounded">talk to [character]</code>
              </li>
              <li>• Use the Quick Actions panel for common commands</li>
              <li>• Ask me for help anytime - I'm always watching over you</li>
              <li>• Save your progress and return anytime</li>
            </ul>
          </div>

          <p className="text-cyan-200 italic">
            "If you're unsure where to begin, I recommend the demo experience - a guided tour of
            Gorstan's core mysteries."
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onStartDemo}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Start Demo Experience
          </button>
          <button
            onClick={onDismiss}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            I'll Explore on My Own
          </button>
        </div>
      </div>
    </div>
  );
};

// Radial progress ring component
const RadialProgressRing: React.FC<RadialProgressRingProps> = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 70 70">
        {/* Background ring */}
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="rgba(34, 197, 94, 0.15)"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="rgb(34, 197, 94)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))',
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-green-400 rounded-full opacity-90 animate-pulse"></div>
      </div>
    </div>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin, onLoadGame, onStartDemo }) => {
  const [showAylaGuidance, setShowAylaGuidance] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [timerProgress, setTimerProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Reset inactivity timer on any interaction
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    // Reset progress
    setTimerProgress(0);

    // Start main timer (2 minutes)
    const timer = setTimeout(() => {
      setShowAylaGuidance(true);
    }, 120000);

    // Start progress ring animation
    const startTime = Date.now();
    const duration = 120000; // 2 minutes

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setTimerProgress(progress);

      if (progress >= 100) {
        clearInterval(progressTimer);
      }
    }, 100); // Update every 100ms for smooth animation

    setInactivityTimer(timer);
    setProgressInterval(progressTimer);
  }, [inactivityTimer, progressInterval]);

  // Initialize timer and add event listeners
  useEffect(() => {
    resetInactivityTimer();

    // Add event listeners for user interaction
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Log version info to console for debugging
    console.log(`%c🎮 Gorstan Game - ${getVersionString()}`, 'color: #10b981; font-weight: bold;');

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [resetInactivityTimer]);

  const handleAylaStartDemo = () => {
    setShowAylaGuidance(false);
    if (onStartDemo) {
      onStartDemo();
    }
  };

  const handleAylaDismiss = () => {
    setShowAylaGuidance(false);
    resetInactivityTimer(); // Restart timer after dismissal
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto px-4 border bg-gradient-to-b from-slate-900 to-black text-green-400 border-2 border-green-500 p-6 m-4 rounded-xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center flex items-center justify-center gap-4">
          <img
            src={'/images/gorstanicon.png'}
            alt="The Odd Rabbit"
            className="w-[72px] h-[72px] rounded-full shadow-md"
          />
          Welcome to Gorstan
          <span className="text-lg text-yellow-400 ml-2">({getShortVersion()})</span>
        </h1>
        <div className="text-sm text-green-300 mb-2 font-mono">{getVersionString()}</div>
        <p className="text-md md:text-lg text-center max-w-2xl mb-6">
          A multiverse simulation of coffee, consequence, and quantum possibility. Tread carefully.
          The rabbit is watching.
        </p>

        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <a
              href="https://buymeacoffee.com/gorstan"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl hover:bg-yellow-300 text-center min-w-[180px] transition-all"
            >
              ☕ Buy Geoff a Coffee
            </a>
            <a
              href="https://geoffwebsterbooks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-500 text-center min-w-[180px] transition-all"
            >
              📚 Explore the Books
            </a>
            <a
              href="https://thegorstanchronicles.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-400 text-center min-w-[180px] transition-all"
            >
              🌐 Visit Gorstan Chronicles
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-[600px]">
            <div></div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={onBegin}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition-all min-w-[180px]"
                type="button"
              >
                Enter Simulation
              </button>

              <button
                onClick={onLoadGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition-all min-w-[180px]"
                type="button"
              >
                Load Saved Game
              </button>
            </div>
            <div></div>
          </div>
        </div>

        {/* Build version - visible for deployment verification */}
        <div className="absolute bottom-2 right-2 text-green-300 text-xs opacity-60 select-none font-mono">
          {getVersionString()}
        </div>

        {/* Backup version indicator - always visible */}
        <div className="absolute bottom-2 left-2 text-green-400 text-xs opacity-40 select-none">
          Gorstan Live
        </div>

        {/* Radial progress ring for Ayla timer - more prominent position */}
        <div className="absolute top-6 right-6">
          <RadialProgressRing progress={timerProgress} />
        </div>
      </div>

      {/* Ayla Guidance Modal */}
      {showAylaGuidance && (
        <AylaGuidanceModal onDismiss={handleAylaDismiss} onStartDemo={handleAylaStartDemo} />
      )}
    </>
  );
};

export default WelcomeScreen;
