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
import React, { useEffect, useRef } from "react";
import { getVersionString, getShortVersion } from "../config/version";
import RadialProgressRing from "../ui/RadialProgressRing";
import { attachWelcomeIdleAutostart, detachWelcomeIdleAutostart } from "../engine/idleAutostart";
import { startDemo } from "../demo/demoRouter";
import { useIdleGuidanceTimers } from "../hooks/useIdleGuidanceTimers";
import "../ui/theme.css";

interface WelcomeScreenProps {
  onBegin: () => void;
  onLoadGame: () => void;
  onStartDemo?: () => void;
}

interface AylaGuidanceProps { onDismiss: () => void; onStartDemo: () => void; }
const AylaGuidanceModal: React.FC<AylaGuidanceProps> = ({ onDismiss, onStartDemo }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-cyan-400 rounded-xl p-6 max-w-2xl w-full text-white shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <img src="/images/Ayla.png" alt="Ayla" className="w-16 h-16 rounded-full border-2 border-cyan-400" />
        <div>
          <h3 className="text-xl font-bold text-cyan-300">Ayla</h3>
          <p className="text-sm text-gray-300">Your Guide Through the Multiverse</p>
        </div>
      </div>
      <div className="space-y-4 mb-6 text-sm">
        <p className="text-cyan-200">*A cosmic presence manifests, her voice carrying the weight of infinite realities*</p>
        <p className="text-white">"Greetings, traveler. I sense you're contemplating your journey through Gorstan. Let me illuminate the paths before you..."</p>
        <div className="bg-black/30 rounded-lg p-4 space-y-2">
          <h4 className="text-cyan-300 font-semibold">What You Can Experience:</h4>
          <ul className="text-gray-200 space-y-1 list-disc pl-4">
            <li><strong>Explore</strong> – Interconnected realities</li>
            <li><strong>Interact</strong> – AI NPCs with memory</li>
            <li><strong>Solve Puzzles</strong> – Logic & observation</li>
            <li><strong>Shape Reality</strong> – Decisions ripple</li>
            <li><strong>Discover Lore</strong> – The Lattice & beyond</li>
          </ul>
        </div>
        <div className="bg-black/30 rounded-lg p-4 space-y-2">
          <h4 className="text-cyan-300 font-semibold">How to Play:</h4>
          <ul className="text-gray-200 space-y-1 list-disc pl-4">
            <li>Type commands like <code className="bg-gray-700 px-1 rounded">look</code>, <code className="bg-gray-700 px-1 rounded">north</code>, <code className="bg-gray-700 px-1 rounded">talk to [character]</code></li>
            <li>Use Quick Actions for common commands</li>
            <li>Ask Ayla for help anytime</li>
            <li>Save progress and return</li>
          </ul>
        </div>
        <p className="text-cyan-200 italic">"Unsure where to begin? Try the guided demo first."</p>
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={onStartDemo} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">Start Demo Experience</button>
        <button onClick={onDismiss} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all">I'll Explore Alone</button>
      </div>
    </div>
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin, onLoadGame, onStartDemo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showDemoCountdown, demoSecondsRemaining, guidanceProgress, showGuidanceModal, resetAll, dismissGuidance } = useIdleGuidanceTimers({
    demoTotalMs: 150000,
    guidanceTotalMs: 120000,
    onDemoTrigger: () => { if (onStartDemo) {onStartDemo();} },
    onGuidanceTrigger: () => { /* modal auto shown by hook */ }
  });

  // Set up idle autostart system
  useEffect(() => {
    attachWelcomeIdleAutostart();
    return () => { detachWelcomeIdleAutostart(); };
  }, []);

  // Log version info to console for debugging
  React.useEffect(() => {
    console.log(`%c🎮 Gorstan Game - ${getVersionString()}`, 'color: #10b981; font-weight: bold;');
  }, []);

  return (
    <>
    <div ref={containerRef} className="relative flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto px-4 border bg-gradient-to-b from-slate-900 to-black text-green-400 border-2 border-green-500 p-6 m-4 rounded-xl">
      
      {/* Idle Countdown in top-right corner */}
  {showDemoCountdown && (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center" aria-live="polite">
          <RadialProgressRing
    progress={1 - demoSecondsRemaining / 150}
            size={90}
            strokeWidth={5}
            mode="gradient"
            gradientColors={["#22c55e", "#f59e0b", "#ef4444"]}
    label={`Idle demo starts in ${Math.ceil(demoSecondsRemaining)} seconds`}
    title={`Idle demo starts in ${Math.ceil(demoSecondsRemaining)}s`}
          />
          <div className="mt-1 text-xs text-green-300 font-mono" role="status">
    {Math.ceil(demoSecondsRemaining)}s
          </div>
        </div>
      )}

      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center flex items-center justify-center gap-4">
        <img
          src={"/images/gorstanicon.png"}
          alt="The Odd Rabbit"
          className="w-[72px] h-[72px] rounded-full shadow-md"
        />
        Welcome to Gorstan
        <span className="text-lg text-yellow-400 ml-2">({getShortVersion()})</span>
      </h1>
      <p className="text-md md:text-lg text-center max-w-2xl mb-6">
        A multiverse simulation of coffee, consequence, and quantum possibility. Tread carefully. The rabbit is watching.
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
            
            {onStartDemo && (
              <button
                onClick={onStartDemo}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition-all min-w-[180px]"
                type="button"
              >
                Quick Demo
              </button>
            )}
          </div>
          <div></div>
        </div>
      </div>
      
      {/* Secondary Ayla guidance radial (2 min popup) */}
    {!showGuidanceModal && (
        <div className="absolute top-4 left-4 z-10">
      <RadialProgressRing progress={guidanceProgress} size={70} strokeWidth={4} mode="spectrum" label="Ayla guidance timer" title="Ayla guidance timer" />
        </div>
      )}

      {/* Build version - visible for deployment verification */}
      <div className="absolute bottom-2 right-2 text-green-300 text-xs opacity-60 select-none font-mono">
        {getVersionString()}
      </div>
      
      {/* Backup version indicator - always visible */}
      <div className="absolute bottom-2 left-2 text-green-400 text-xs opacity-40 select-none">
        Gorstan Live
      </div>
    </div>
    {showGuidanceModal && onStartDemo && (
      <AylaGuidanceModal 
        onDismiss={() => { dismissGuidance(); }} 
        onStartDemo={() => { if (onStartDemo) {onStartDemo();} dismissGuidance(); }} 
      />
    )}
    </>
  );
};

export default WelcomeScreen;
