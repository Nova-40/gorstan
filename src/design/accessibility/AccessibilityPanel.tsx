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

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { audioManager } from '../../audio/sfx';
import { ScreenReaderSupport } from '../../utils/accessibility';

interface A11yPrefs {
  accessibilityMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  masterVolume: number;
  sfxVolume: number;
  muted?: boolean;
  _prevMaster?: number;
  _prevSfx?: number;
}

const DEFAULT_PREFS: A11yPrefs = {
  accessibilityMode: false,
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  masterVolume: 1,
  sfxVolume: 1,
  muted: false
};

const LS_KEY = 'gorstan:a11y:prefs:v1';

export const AccessibilityPanel: React.FC<{ dispatch: any; className?: string; }> = ({ dispatch }) => {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(() => {
    try { const raw = localStorage.getItem(LS_KEY); if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }; } catch {}
    return DEFAULT_PREFS;
  });
  const srRef = useRef<ScreenReaderSupport | null>(null);

  // Initialize screen reader helper once (only when panel mounts)
  useEffect(() => { srRef.current = new ScreenReaderSupport(); }, []);

  // Persist & apply classes / volumes
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(prefs)); } catch {}
    const root = document.documentElement;
    const toggleClass = (cls: string, on: boolean) => { on ? root.classList.add(cls) : root.classList.remove(cls); };
    toggleClass('high-contrast', prefs.highContrast);
    toggleClass('reduce-motion', prefs.reducedMotion);
    // font size classes: remove old then add
    ['font-size-small','font-size-medium','font-size-large','font-size-xlarge'].forEach(c => root.classList.remove(c));
    root.classList.add(`font-size-${prefs.fontSize}`);
    audioManager.setMasterVolume(prefs.masterVolume);
    audioManager.setSFXVolume(prefs.sfxVolume);
    // Update game state accessibility flag so existing guards react
    dispatch?.({ type: 'UPDATE_GAME_STATE', payload: { accessibilityMode: prefs.accessibilityMode } });
  }, [prefs, dispatch]);

  // Keyboard shortcut Alt+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) { e.preventDefault(); setOpen(o => !o); } }; 
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const update = useCallback(<K extends keyof A11yPrefs>(k: K, v: A11yPrefs[K]) => {
    setPrefs(p => ({ ...p, [k]: v }));
    if (k === 'accessibilityMode' && srRef.current) {
      // announceStatus is available on ScreenReaderSupport
      (srRef.current as any).announceStatus?.(v ? 'Accessibility mode enabled' : 'Accessibility mode disabled');
    }
  }, []);

  const toggleMute = () => {
    setPrefs(p => {
      if (!p.muted) {
        return { ...p, muted: true, _prevMaster: p.masterVolume, _prevSfx: p.sfxVolume, masterVolume: 0, sfxVolume: 0 };
      } else {
        return { ...p, muted: false, masterVolume: p._prevMaster ?? 1, sfxVolume: p._prevSfx ?? 1 };
      }
    });
  };

  // Simple cycle for font size
  const cycleFont = () => {
  const order: Array<A11yPrefs['fontSize']> = ['small','medium','large','xlarge'];
  const idx = order.indexOf(prefs.fontSize);
  const next = order[(idx + 1) % order.length] || 'medium';
  update('fontSize', next);
  };

  // Panel UI (lightweight to avoid design system dependency churn)
  return (
    <div className="fixed bottom-2 left-2 z-[660] font-mono text-xs">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="px-2 py-1 rounded bg-black/70 border border-emerald-400/40 text-emerald-200 hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        aria-expanded={open}
        aria-controls="a11y-panel"
      >A11y</button>
      {open && (
        <div id="a11y-panel" role="dialog" aria-label="Accessibility preferences" className="mt-2 w-72 p-3 rounded-lg bg-slate-900/95 border border-emerald-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold tracking-wide text-emerald-300">Accessibility</span>
            <button onClick={() => setOpen(false)} className="text-emerald-300 hover:text-emerald-100" aria-label="Close panel">✕</button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={prefs.accessibilityMode} onChange={e => update('accessibilityMode', e.target.checked)} />
            <span>Mode</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer opacity-90">
            <input type="checkbox" checked={prefs.highContrast} onChange={e => update('highContrast', e.target.checked)} />
            <span>High contrast</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer opacity-90">
            <input type="checkbox" checked={prefs.reducedMotion} onChange={e => update('reducedMotion', e.target.checked)} />
            <span>Reduced motion</span>
          </label>
          <button type="button" onClick={cycleFont} className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600/60">
            Font: {prefs.fontSize}
          </button>
          <div>
            <label className="block mb-1">Master Volume {Math.round(prefs.masterVolume*100)}%</label>
            <input type="range" min={0} max={1} step={0.05} value={prefs.masterVolume} onChange={e => update('masterVolume', parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block mb-1">SFX Volume {Math.round(prefs.sfxVolume*100)}%</label>
            <input type="range" min={0} max={1} step={0.05} value={prefs.sfxVolume} onChange={e => update('sfxVolume', parseFloat(e.target.value))} className="w-full" />
          </div>
          <button type="button" onClick={toggleMute} className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600/60">
            {prefs.muted ? 'Unmute' : 'Mute'}
          </button>
          <p className="text-[10px] leading-relaxed text-emerald-300/60">Alt+Shift+A to toggle. Enabling accessibility mode suppresses certain visual effects & easter eggs.</p>
        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;
