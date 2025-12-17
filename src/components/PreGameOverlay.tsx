import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { loseLife, resetLives } from '../engine/livesManager';
import { useTeletype } from '../lib/teletype/useTeletype';

type PregameChoice = 'sip' | 'nothing' | 'jump';

type OverlayPhase = 'opening' | 'alBriefing';

export type PreGameOverlayProps = {
  onBeginGame: () => void;
};

const OPENING_IDLE_MS = 8000;
const OPENING_WARNING_MS = 5000;

// Chosen to be fast enough for tests and not feel sluggish.
const OPENING_TELETYPE_MS_PER_CHAR = 18;

// Text block (exact, including blank lines)
const OPENING_TEXT_BLOCK_LINES: string[] = [
  'You step out of the coffee shop with a fresh cup in hand.',
  'The air is cold, the coffee is hot, and your confidence is unjustified.',
  '',
  'Polly appears beside you like a bad decision with good timing.',
  'She smiles. Not warmly.',
  '',
  'A truck thunders past—far too close, far too real.',
  'Polly gives you a polite little shove in the direction of immediate consequences.',
  '',
  'What do you do?',
  'The truck gets louder.',
  'Use ↑/↓ then Enter:',
];

const OPENING_CHOICES: Array<{ id: PregameChoice; label: string }> = [
  { id: 'sip', label: 'Sip coffee' },
  { id: 'nothing', label: 'Do nothing' },
  { id: 'jump', label: 'Jump' },
];

const OPENING_DO_NOTHING_LINES: string[] = [
  'You do nothing.',
  'It’s a bold strategy, historically favoured by people who aren’t about to be flattened.',
  '',
  'The truck makes an executive decision.',
  '',
  'You lose a life.',
  'And then—somehow—you are back outside the coffee shop, still holding the same coffee like it’s trying to teach you something.',
];

const OPENING_IDLE_HIT_LINES: string[] = [
  'You hesitate. The universe interprets this as consent.',
  'The truck makes contact with alarming professionalism.',
];

const OPENING_JUMP_LINES: string[] = [
  'You jump.',
  'Reality misses you by inches and pretends it meant to.',
  '',
  '(The world continues. Unfortunately.)',
];

const OPENING_AL_BRIEFING_LINES: string[] = [
  'You sip the coffee.',
  'It’s good. Of course it is. The universe always makes sure the last nice thing is properly seasoned.',
  '',
  'Al is there—leaning like he’s been waiting in your timeline for ages.',
  '',
  '“Right,” Al says. “Quick briefing.”',
  '',
  '“You’ve been chosen. Not because the universe thinks you’re a hero…”',
  'Al pauses, enjoying himself.',
  '“But because you’re truly disposable and no one will miss you if you fail.”',
  '',
  'Al smiles and winks.',
  '“Nah. Just messing with you.”',
  '',
  '“You are important. I just can’t tell you why… yet.”',
];

const OPENING_IDLE_WARNING_LINE = 'The truck gets louder.';

const VITE_BASE_URL = ((import.meta as any).env?.BASE_URL as string | undefined) ?? '/';
const INTRO_MUSIC_SRC = `${VITE_BASE_URL.endsWith('/') ? VITE_BASE_URL : `${VITE_BASE_URL}/`}audio/intro.mp3`;
const POLLY_SHOVE_LINE = 'Polly gives you a polite little shove in the direction of immediate consequences.';

function isJSDOMEnvironment(): boolean {
  return typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
}

function isTestEnvironment(): boolean {
  // Vite/Vitest convention
  return typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE === 'test';
}

export const PreGameOverlay: React.FC<PreGameOverlayProps> = ({ onBeginGame }) => {
  const [phase, setPhase] = useState<OverlayPhase>('opening');
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [choicesEnabled, setChoicesEnabled] = useState<boolean>(false);
  const [continueEnabled, setContinueEnabled] = useState<boolean>(false);

  const { displayedText, clear: clearTeletype, setText, append } = useTeletype({
    msPerChar: isTestEnvironment() ? 0 : OPENING_TELETYPE_MS_PER_CHAR,
  });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartPendingRef = useRef<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicStartedRef = useRef<boolean>(false);
  const musicStoppedRef = useRef<boolean>(false);

  const selectedChoice = useMemo(() => OPENING_CHOICES[selectedIdx]?.id ?? 'sip', [selectedIdx]);

  const stopIntroMusic = useCallback((): void => {
    if (isJSDOMEnvironment() || isTestEnvironment()) {
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // no-op
    }
  }, []);

  const clearTimers = useCallback((): void => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const startOpeningScreen = useCallback((): void => {
    restartPendingRef.current = false;
    setPhase('opening');
    setSelectedIdx(0);
    setChoicesEnabled(false);
    setContinueEnabled(false);
    clearTeletype();

    setText(OPENING_TEXT_BLOCK_LINES, () => {
      setChoicesEnabled(true);
    });
  }, [clearTeletype, setText]);

  const restartOpeningLoop = useCallback((): void => {
    if (restartPendingRef.current) {
      return;
    }
    restartPendingRef.current = true;
    clearTimers();
    startOpeningScreen();
  }, [clearTimers, startOpeningScreen]);

  const triggerDoNothingConsequence = useCallback(
    (opts: { fromInactivity: boolean }): void => {
      clearTimers();
      setChoicesEnabled(false);

      const remaining = loseLife();

      const consequenceLines: string[] = [];
      if (opts.fromInactivity) {
        consequenceLines.push(...OPENING_IDLE_HIT_LINES, '');
      }
      consequenceLines.push(...OPENING_DO_NOTHING_LINES);

      append(['', '', ...consequenceLines], () => {
        if (remaining > 0) {
          // Clear the screen and restart on the next tick so the consequence renders first.
          setTimeout(() => {
            restartOpeningLoop();
          }, 0);
        } else {
          // Existing hard reset behaviour.
          localStorage.clear();
          window.location.reload();
        }
      });
    },
    [append, clearTimers, restartOpeningLoop],
  );

  const triggerJump = useCallback((): void => {
    clearTimers();
    setChoicesEnabled(false);

    append(['', '', ...OPENING_JUMP_LINES], () => {
      onBeginGame();
    });
  }, [append, clearTimers, onBeginGame]);

  const triggerSipCoffee = useCallback((): void => {
    clearTimers();
    setPhase('alBriefing');
    setChoicesEnabled(false);
    setContinueEnabled(false);
    clearTeletype();

    setText(OPENING_AL_BRIEFING_LINES, () => {
      setContinueEnabled(true);
    });
  }, [clearTeletype, clearTimers, setText]);

  const triggerContinueFromAl = useCallback((): void => {
    if (!continueEnabled || phase !== 'alBriefing') {
      return;
    }
    onBeginGame();
  }, [continueEnabled, onBeginGame, phase]);

  const activateChoice = useCallback(
    (choice: PregameChoice): void => {
      if (!choicesEnabled || phase !== 'opening') {
        return;
      }
      if (choice === 'jump') {
        triggerJump();
        return;
      }
      if (choice === 'sip') {
        triggerSipCoffee();
        return;
      }
      triggerDoNothingConsequence({ fromInactivity: false });
    },
    [choicesEnabled, phase, triggerDoNothingConsequence, triggerJump, triggerSipCoffee],
  );

  const armInactivityTimers = useCallback((): void => {
    if (phase !== 'opening' || !choicesEnabled) {
      return;
    }

    clearTimers();

    warningTimerRef.current = setTimeout(() => {
      // Only emit if not already shown.
      if (!displayedText.includes(OPENING_IDLE_WARNING_LINE)) {
        append(['', OPENING_IDLE_WARNING_LINE]);
      }
    }, OPENING_WARNING_MS);

    idleTimerRef.current = setTimeout(() => {
      triggerDoNothingConsequence({ fromInactivity: true });
    }, OPENING_IDLE_MS);
  }, [append, choicesEnabled, clearTimers, displayedText, phase, triggerDoNothingConsequence]);

  // Focus root container for keyboard-only operation.
  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  // Auto-scroll as new characters are printed.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [displayedText]);

  // Start intro music once when the overlay mounts.
  useEffect(() => {
    resetLives();

    if (!musicStartedRef.current) {
      musicStartedRef.current = true;

      if (isTestEnvironment()) {
        // Avoid jsdom media API gaps; audio isn't relevant to automated tests.
        startOpeningScreen();
        return;
      }

      const audio = new Audio(INTRO_MUSIC_SRC);
      audioRef.current = audio;
      audio.loop = false;
      audio.volume = 0.6;
      if (!isJSDOMEnvironment()) {
        try {
          const playResult = audio.play();
          if (playResult && typeof (playResult as any).catch === 'function') {
            (playResult as Promise<void>).catch(() => {
              // Autoplay might be blocked until a user gesture.
            });
          }
        } catch {
          // Some environments (e.g. tests) do not implement media playback.
        }
      }
    }

    startOpeningScreen();

    return () => {
      clearTimers();
      stopIntroMusic();
      audioRef.current = null;
    };
  }, [clearTimers, startOpeningScreen, stopIntroMusic]);

  // Hard-stop intro music once the shove line is fully printed.
  useEffect(() => {
    if (musicStoppedRef.current) {
      return;
    }
    if (displayedText.includes(POLLY_SHOVE_LINE)) {
      musicStoppedRef.current = true;
      stopIntroMusic();
    }
  }, [displayedText, stopIntroMusic]);

  // Inactivity timer: starts when choices are shown.
  useEffect(() => {
    if (phase !== 'opening' || !choicesEnabled) {
      clearTimers();
      return;
    }

    armInactivityTimers();

    return () => {
      clearTimers();
    };
  }, [armInactivityTimers, choicesEnabled, clearTimers, phase]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (phase === 'opening' && choicesEnabled) {
        // Any key activity while choices are shown resets inactivity timers.
        armInactivityTimers();

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIdx((i) => (i + 1) % OPENING_CHOICES.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIdx((i) => (i - 1 + OPENING_CHOICES.length) % OPENING_CHOICES.length);
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          activateChoice(selectedChoice);
          return;
        }
      }

      if (phase === 'alBriefing' && continueEnabled) {
        if (e.key === 'Enter') {
          e.preventDefault();
          triggerContinueFromAl();
        }
      }
    },
    [activateChoice, armInactivityTimers, choicesEnabled, continueEnabled, phase, selectedChoice, triggerContinueFromAl],
  );

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[9999] bg-black text-green-400 font-mono flex items-center justify-center p-4 md:p-8 focus:outline-none"
      aria-label="Opening sequence"
    >
      <div className="w-full max-w-4xl h-full max-h-[90vh] border border-green-600 rounded bg-black flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 whitespace-pre-wrap leading-relaxed">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed m-0">{displayedText}</pre>
        </div>

        {phase === 'opening' && choicesEnabled && (
          <div className="border-t border-green-600 p-4" aria-label="Choices">
            <div className="grid gap-2">
              {OPENING_CHOICES.map((choice, idx) => {
                const selected = idx === selectedIdx;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => activateChoice(choice.id)}
                    className={
                      selected
                        ? 'w-full text-left px-3 py-2 border border-green-300 bg-black'
                        : 'w-full text-left px-3 py-2 border border-transparent hover:border-green-600'
                    }
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === 'alBriefing' && (
          <div className="border-t border-green-600 p-4" aria-label="Continue">
            <button
              type="button"
              onClick={triggerContinueFromAl}
              disabled={!continueEnabled}
              className={
                continueEnabled
                  ? 'px-4 py-2 border border-green-300 hover:border-green-200 w-full text-left'
                  : 'px-4 py-2 border border-green-900 opacity-60 w-full text-left cursor-not-allowed'
              }
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreGameOverlay;
