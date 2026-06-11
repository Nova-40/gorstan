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
import React, { useEffect, useRef } from 'react';
import { GAME_STATUS, getVersionString } from '../config/version';
import RadialCountdown from '../ui/RadialCountdown';
import { attachWelcomeIdleAutostart, detachWelcomeIdleAutostart } from '../engine/idleAutostart';
import '../ui/theme.css';

interface WelcomeScreenProps {
  onBegin: () => void;
  onLoadGame: () => void;
  hasSavedGames?: boolean;
  onStartDemo?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onBegin,
  onLoadGame,
  hasSavedGames = false,
  onStartDemo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showIdleCountdown, setShowIdleCountdown] = React.useState(false);
  const [idleTimeRemaining, setIdleTimeRemaining] = React.useState(150); // 2.5 minutes
  const supportLinks = [
    {
      href: 'https://buymeacoffee.com/gorstan',
      label: 'Support',
      description: 'Buy Geoff a Coffee',
    },
    {
      href: 'https://geoffwebsterbooks.com',
      label: 'Books',
      description: 'Explore the Books',
    },
    {
      href: 'https://thegorstanchronicles.com',
      label: 'Chronicles',
      description: 'Visit Gorstan Chronicles',
    },
  ];
  const idleSecondsRemaining = Math.ceil(idleTimeRemaining);

  // Set up idle autostart system
  useEffect(() => {
    const handleIdleCountdownReset = (event: CustomEvent) => {
      const { total, remaining } = event.detail;
      const timeRemainingSeconds = remaining / 1000;
      setIdleTimeRemaining(timeRemainingSeconds);

      // Show countdown when we have less than total time and more than 0
      setShowIdleCountdown(remaining < total && remaining > 0);
    };

    const handleDemoStart = () => {
      console.log('[WelcomeScreen] Demo starting - hiding countdown');
      setShowIdleCountdown(false);

      // Trigger the demo UI if we have a handler
      if (onStartDemo) {
        onStartDemo();
      }
    };

    // Listen for idle countdown events
    window.addEventListener('idle-countdown-reset', handleIdleCountdownReset as EventListener);
    window.addEventListener('demo-start', handleDemoStart);

    // Attach the idle autostart system
    attachWelcomeIdleAutostart();

    return () => {
      window.removeEventListener('idle-countdown-reset', handleIdleCountdownReset as EventListener);
      window.removeEventListener('demo-start', handleDemoStart);
      detachWelcomeIdleAutostart();
    };
  }, [onStartDemo]);

  // Log version info to console for debugging
  React.useEffect(() => {
    console.log(`%c🎮 Gorstan Game - ${getVersionString()}`, 'color: #10b981; font-weight: bold;');
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-hidden bg-black text-green-100"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_38%),radial-gradient(circle_at_20%_80%,_rgba(56,189,248,0.08),_transparent_30%),linear-gradient(180deg,_rgba(3,7,18,0.96),_rgba(0,0,0,1))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(20,83,45,0.18),transparent)]" />

      {/* Idle Countdown in top-right corner */}
      {showIdleCountdown && (
        <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
          <RadialCountdown totalMs={150000} className="radial-countdown-container" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-5 overflow-hidden rounded-[28px] border border-green-900/70 bg-[rgba(5,10,18,0.88)] p-5 shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-7">
          <section className="relative overflow-hidden rounded-3xl border border-green-900/50 bg-[linear-gradient(180deg,rgba(6,13,24,0.92),rgba(0,0,0,0.76))] px-5 py-6 sm:px-6 sm:py-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(74,222,128,0.08),_transparent_35%)]" />
            <div className="relative space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-green-500">
                <span>The Odd Rabbit Presents</span>
                <span className="rounded-full border border-green-800/70 bg-black/30 px-3 py-1 text-[11px] tracking-[0.24em] text-green-300">
                  {GAME_STATUS}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={'/images/gorstanicon.png'}
                    alt="The Odd Rabbit mark"
                    className="h-14 w-14 rounded-full border border-green-900/70 bg-black/60 shadow-lg shadow-black/50 sm:h-[72px] sm:w-[72px]"
                  />
                  <div>
                    <h1 className="text-4xl font-semibold tracking-[0.3em] text-green-50 sm:text-6xl">
                      GORSTAN
                    </h1>
                    <div className="mt-2 text-sm text-green-500">Parser-first illustrated adventure</div>
                  </div>
                </div>

                <p className="max-w-2xl text-base leading-7 text-green-100/90 sm:text-lg">
                  A parser-first illustrated adventure of coffee, consequence, and quantum possibility.
                </p>
                <p className="max-w-xl text-sm leading-6 text-green-400/85 sm:text-base">
                  Trust the paperwork only when cornered.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-green-300/85 sm:grid-cols-2">
                <div className="rounded-2xl border border-green-900/50 bg-black/30 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-green-500">Mode</div>
                  <div className="mt-2 text-sm leading-6 text-green-100/90">
                    Type commands, use the shell panels, and let the menu get out of your way.
                  </div>
                </div>
                <div className="rounded-2xl border border-green-900/50 bg-black/30 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-green-500">Tone</div>
                  <div className="mt-2 text-sm leading-6 text-green-100/90">
                    Dry British bureaucracy, unstable realities, and regrettably important coffee.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-green-900/50 pt-4 text-xs uppercase tracking-[0.24em] text-green-500">
                <span>Support Archive</span>
                {supportLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-green-900/60 bg-black/25 px-3 py-1.5 text-[11px] tracking-[0.2em] text-green-300 transition hover:border-green-700 hover:bg-green-950/40 hover:text-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={`${link.description} (opens in a new tab)`}
                    title={`${link.description} (opens in a new tab)`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <aside className="flex flex-col justify-between rounded-3xl border border-green-900/50 bg-black/65 p-4 shadow-[0_0_0_1px_rgba(34,197,94,0.06)] sm:p-5">
            <div className="space-y-4">
              <div className="rounded-2xl border border-green-900/60 bg-green-950/20 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.28em] text-green-500">Title Screen</div>
                <div className="mt-2 text-sm leading-6 text-green-100/90">
                  Begin a new run, resume an existing save, or hand control to the demo system.
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onBegin}
                  className="group w-full rounded-2xl border border-green-700/70 bg-green-600/90 px-5 py-4 text-left text-white shadow-[0_16px_32px_rgba(22,163,74,0.2)] transition hover:border-green-500 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  type="button"
                  aria-label="Begin a new game"
                >
                  <div className="text-base font-semibold uppercase tracking-[0.22em]">Begin</div>
                  <div className="mt-1 text-sm text-green-50/85">Proceed to name capture and the opening briefing.</div>
                </button>

                <button
                  onClick={onLoadGame}
                  className="w-full rounded-2xl border border-green-900/70 bg-black/40 px-5 py-4 text-left text-green-50 transition hover:border-green-600 hover:bg-green-950/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  type="button"
                  aria-label={hasSavedGames ? 'Load an existing saved game' : 'Open the load saved game menu'}
                >
                  <div className="text-base font-semibold uppercase tracking-[0.22em]">
                    {hasSavedGames ? 'Load Game' : 'Load Saved Game'}
                  </div>
                  <div className="mt-1 text-sm text-green-300/85">
                    {hasSavedGames
                      ? 'Resume from an existing slot without skipping the normal flow.'
                      : 'Open the save interface and check for any existing slots.'}
                  </div>
                </button>

                {onStartDemo && (
                  <button
                    onClick={onStartDemo}
                    className="w-full rounded-2xl border border-amber-700/40 bg-amber-950/20 px-5 py-4 text-left text-amber-100 transition hover:border-amber-500/60 hover:bg-amber-950/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    type="button"
                    aria-label="Start the developer demo"
                  >
                    <div className="text-base font-semibold uppercase tracking-[0.22em]">Developer Demo</div>
                    <div className="mt-1 text-sm text-amber-100/80">
                      Let the automation handle the opening paperwork and move straight into a guided run.
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-5 text-xs text-green-400/80">
              {showIdleCountdown && (
                <div className="rounded-2xl border border-green-900/60 bg-black/30 px-4 py-3 leading-5 text-green-300">
                  Demo autostart armed. If nobody intervenes, Ayla will start the tour in about {idleSecondsRemaining} seconds.
                </div>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-green-900/50 pt-3">
                <span className="uppercase tracking-[0.24em] text-green-500">Build</span>
                <span className="font-mono text-green-300/85">{getVersionString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
