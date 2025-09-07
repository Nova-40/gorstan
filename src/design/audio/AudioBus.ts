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

// AudioBus - unified lightweight event → sound routing layer (Design System Step 5)
// Uses existing audioManager (sample-based) and arcade oscillator fallback for simple beeps.
import { audioManager, initAudio } from '../../audio/sfx';
import { playSfx as playArcadeSfx } from '../../arcade/engine/Audio';

export type AudioEvent =
  | { type: 'teleport'; mode: 'fractal' | 'trek'; phase: 'start' | 'end' }
  | { type: 'runeSprint:lowTime'; seconds: number }
  | { type: 'runeSprint:fragment'; total: number }
  | { type: 'trials:phaseStart'; phase: string }
  | { type: 'trials:fail'; reason: string }
  | { type: 'meta:artifactUnlock'; id: string };

let initialized = false;
async function ensureInit() { if (!initialized) { try { await initAudio(); } catch {} initialized = true; } }

// Debounce tracker for low-time beeps (store seconds already beeped recently)
const lastBeepSeconds: Set<number> = new Set();

export async function routeAudio(ev: AudioEvent) {
  await ensureInit();
  switch (ev.type) {
    case 'teleport':
      playArcadeSfx(ev.mode === 'fractal' ? 'teleport_in' : 'teleport_out');
      break;
    case 'runeSprint:lowTime':
      if (ev.seconds <= 10) {
        // Debounce: only allow one beep per second boundary
        if (!lastBeepSeconds.has(ev.seconds)) {
          playArcadeSfx('entropy_beep');
          lastBeepSeconds.add(ev.seconds);
          // prune after 15s to prevent unbounded growth
          setTimeout(() => lastBeepSeconds.delete(ev.seconds), 15000);
        }
      }
      break;
    case 'runeSprint:fragment':
      audioManager.playSFX('blink', { playbackRate: 1 + (ev.total % 5) * 0.05 });
      break;
    case 'trials:phaseStart':
      playArcadeSfx('phase_start');
      break;
    case 'trials:fail':
      playArcadeSfx('shadow_stun');
      break;
    case 'meta:artifactUnlock':
      audioManager.playSFX('spellCast', { playbackRate: 1.15 });
      break;
  }
}

// DOM bridge: listen to existing CustomEvents and translate into AudioEvents
export function installGlobalAudioBridge() {
  if (typeof document === 'undefined') return; // SSR safety
  const handlers: Array<[string, any]> = [];

  const add = (name: string, fn: (e: Event) => void) => { document.addEventListener(name, fn as any); handlers.push([name, fn]); };

  add('ui:teleport', e => {
    const d = (e as CustomEvent).detail || {}; routeAudio({ type: 'teleport', mode: d.mode || 'trek', phase: 'start' });
  });
  add('rs:tick', e => {
    const d = (e as CustomEvent).detail || {}; if (typeof d.timeRemaining === 'number') {
      const sec = Math.floor(d.timeRemaining/1000); if (sec <= 10 && sec >=0) routeAudio({ type: 'runeSprint:lowTime', seconds: sec });
    }
  });
  add('rs:chamber-solved', () => {
    // treat as fragment collect – actual total fetched via event chain would require storage; simplified ping
    routeAudio({ type: 'runeSprint:fragment', total: 0 });
  });
  add('trials:artifact-run', () => routeAudio({ type: 'trials:phaseStart', phase: 'artifact-run' }));
  add('trials:fail', e => {
    const d = (e as CustomEvent).detail || {}; routeAudio({ type: 'trials:fail', reason: d.reason || 'unknown' });
  });
  add('trials:artifact-unlock', e => {
    const d = (e as CustomEvent).detail || {}; if (d.id) routeAudio({ type: 'meta:artifactUnlock', id: d.id });
  });

  return () => handlers.forEach(([n, fn]) => document.removeEventListener(n, fn as any));
}