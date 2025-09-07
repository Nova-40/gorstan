/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

import React, { useEffect, useRef, useState } from 'react';
import { useGate } from '@/state/GateContext';
import { GameMode } from '@/types/game';

export const LandingScreen: React.FC = () => {
  const { mode, setMode, unlock, config } = useGate();
  const lastInput = useRef<number>(Date.now());
  const bump = () => { lastInput.current = Date.now(); };

  useEffect(() => {
    window.addEventListener('mousemove', bump);
    window.addEventListener('keydown', bump);
    return () => { window.removeEventListener('mousemove', bump); window.removeEventListener('keydown', bump); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (config.enableAttract && mode === GameMode.LOCKED && Date.now() - lastInput.current > config.attractIdleMs) {
        setMode(GameMode.ATTRACT);
      }
    }, 400);
    return () => clearInterval(t);
  }, [config.enableAttract, config.attractIdleMs, mode, setMode]);

  // --- Glitchy Banner + Teletype Intro ---
  const fullTitle = 'GORSTAN//ARCHIVE_LINK_ESTABLISHED';
  const [typed, setTyped] = useState('');
  const [cursorOn, setCursorOn] = useState(true);
  const [glitchTick, setGlitchTick] = useState(0);
  const [muted, setMuted] = useState(false);
  const prefersReducedMotion = useRef<boolean>(false);
  const finished = typed.length === fullTitle.length;
  const audioCtxRef = useRef<AudioContext|null>(null);
  const lastCharTime = useRef<number>(performance.now());

  useEffect(() => {
    try { prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch {}
  }, []);

  function playTick(char: string) {
    if (muted || prefersReducedMotion.current) return;
    // Slightly vary frequency based on char code for retro terminal vibe.
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const base = 440 + (char.charCodeAt(0) % 50) * 6; // 440–740 Hz window
      osc.frequency.value = base;
      gain.gain.value = 0.035;
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Typewriter effect
  useEffect(() => {
    if (prefersReducedMotion.current) { setTyped(fullTitle); return; }
    if (typed.length < fullTitle.length) {
      const delta = 28 + Math.random() * 55; // base speed
      const t = setTimeout(() => {
        const nextLen = typed.length + 1;
        const next = fullTitle.slice(0, nextLen);
        setTyped(next);
  const ch = next.charAt(next.length - 1);
  if (ch) playTick(ch);
        lastCharTime.current = performance.now();
      }, delta);
      return () => clearTimeout(t);
    }
  }, [typed, fullTitle]);
  useEffect(() => { const c = setInterval(()=> setCursorOn(c=>!c), 480); return () => clearInterval(c); }, []);
  // light glitch pulse
  useEffect(() => { const g = setInterval(()=> setGlitchTick(t=>t+1), 900 + Math.random()*1200); return () => clearInterval(g); }, []);

  // Skip typing on any key or click once started
  useEffect(() => {
    if (finished) return;
    const skip = () => { setTyped(fullTitle); };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('mousedown', skip, { once: true });
    return () => { window.removeEventListener('keydown', skip); window.removeEventListener('mousedown', skip); };
  }, [finished, fullTitle]);

  const showGlitch = !prefersReducedMotion.current && glitchTick % 5 === 0 && finished; // occasional glitch once fully typed

  // Stronger glitch burst every ~12 seconds
  const strongGlitch = !prefersReducedMotion.current && finished && glitchTick % 13 === 0;

  return (
    <div className="w-full h-full p-6 font-mono select-none">
      <div className="mb-6">
        <div className="relative inline-block text-xl tracking-wide">
          <span className="text-emerald-300/90 drop-shadow-[0_0_4px_rgba(16,185,129,0.6)]">{typed}</span>
          {cursorOn && <span className="text-emerald-400 animate-pulse">{!finished ? '_' : ''}</span>}
          {showGlitch && (
            <span className="absolute inset-0 pointer-events-none mix-blend-screen text-emerald-200 animate-[pulse_120ms_ease-in-out_1] translate-x-px skew-x-[3deg]" style={{textShadow:'0 0 6px rgba(16,185,129,0.9)'}}>GOR5T4N//ARCH1VE_L1NK_E57ABL15HED</span>
          )}
          {strongGlitch && (
            <span className="absolute inset-0 pointer-events-none mix-blend-screen text-emerald-100 animate-[pulse_160ms_ease-in-out_1] translate-x-[2px] skew-x-[-4deg]" style={{textShadow:'0 0 10px rgba(16,185,129,1)'}}>GØRSTΛN//ARCHIVE_LINK_ESTABLISHED</span>
          )}
        </div>
        <div className="mt-2 text-xs text-emerald-200/70 whitespace-pre leading-relaxed max-w-xl">
          {finished ? 'Session channel synchronized. Awaiting directive…' : ''}
        </div>
        <div className="mt-1 flex gap-3 items-center text-[10px] text-emerald-400/60">
          {!finished && <span>[press any key / click to skip]</span>}
          <button onClick={()=>setMuted(m=>!m)} className="uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/40">{muted ? 'Sound: Off' : 'Sound: On'}</button>
        </div>
      </div>
      <div className="grid gap-3 max-w-sm">
  <button onClick={() => { setMode(GameMode.DEMO); try { dispatchEvent(new CustomEvent('gorstan:force-demo-stage')); } catch {} }}>▶ Play Training Demo</button>
  <button onClick={() => setMode(GameMode.ATTRACT)}>👀 Watch Showcase</button>
        <button disabled={!unlock.isUnlocked} onClick={() => unlock.isUnlocked && setMode(GameMode.FULL)}>
          {unlock.isUnlocked ? '🔓 Enter Full Game' : 'Full Game (Locked)'}
        </button>
        <button onClick={() => dispatchEvent(new CustomEvent('open-beta-dialog'))}>Enter Beta Code</button>
        <button onClick={() => dispatchEvent(new CustomEvent('open-patreon-dialog'))}>Connect Patreon</button>
      </div>
      <small className="opacity-70 block mt-3">Idle {Math.floor(config.attractIdleMs/1000)}s to view Attract Mode.</small>
    </div>
  );
};

export default LandingScreen;
