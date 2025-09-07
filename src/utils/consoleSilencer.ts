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

// consoleSilencer.ts
// Centralized console silencing for demo mode.
// Suppresses console.log/info/debug while active (warn/error still pass through)

interface SilencerState {
  enabled: boolean;
  originalLog?: (...args: any[]) => void;
  originalInfo?: (...args: any[]) => void;
  originalDebug?: (...args: any[]) => void;
}

const silencerState: SilencerState = { enabled: false };

function noop() { /* silenced */ }

export function enableDemoSilence(): void {
  if (typeof window === 'undefined') return;
  // Respect verbose flag: never silence if developer explicitly wants logs.
  try { if ((window as any).__GORSTAN_DEMO_VERBOSE) return; } catch {}
  if (silencerState.enabled) return;
  silencerState.originalLog = console.log;
  silencerState.originalInfo = console.info;
  silencerState.originalDebug = console.debug;
  console.log = noop as any;
  console.info = noop as any;
  console.debug = noop as any;
  silencerState.enabled = true;
}

export function disableDemoSilence(): void {
  if (!silencerState.enabled) return;
  if (silencerState.originalLog) console.log = silencerState.originalLog;
  if (silencerState.originalInfo) console.info = silencerState.originalInfo;
  if (silencerState.originalDebug) console.debug = silencerState.originalDebug as any;
  silencerState.enabled = false;
}

export function isDemoSilenced(): boolean { return silencerState.enabled; }

// Expose a minimal toggle for manual debugging/testing.
try {
  (window as any).GORSTAN_demoSilence = (on?: boolean) => {
    if (on === undefined) return isDemoSilenced();
    if (on) enableDemoSilence(); else disableDemoSilence();
    return isDemoSilenced();
  };
} catch {}
