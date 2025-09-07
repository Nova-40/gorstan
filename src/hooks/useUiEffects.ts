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

/**
 * useUiEffects - trigger UI micro-effects (glitch / teleport) via CustomEvents.
 * Keeps game logic decoupled from presentation overlays.
 */
import { useCallback, useRef } from 'react';

export type TeleportMode = 'fractal' | 'trek';

interface GlitchOptions { kind?: 'spark' | 'fish' | string; intensity?: number; source?: string }
interface TeleportOptions { source?: string; durationMs?: number }

function useRateLimiter(windowMs = 250) {
  const lastRef = useRef<Record<string, number>>({});
  return (key: string) => {
    const now = Date.now();
    const last = lastRef.current[key] || 0;
    if (now - last < windowMs) return false;
    lastRef.current[key] = now;
    return true;
  };
}

export function useUiEffects() {
  const allow = useRateLimiter(120);

  const glitch = useCallback((options?: GlitchOptions) => {
    if (!allow('glitch')) return;
    const detail = {
      kind: options?.kind || 'spark',
      intensity: Math.min(1, Math.max(0, options?.intensity ?? 0.6)),
      source: options?.source || 'logic',
      ts: Date.now()
    };
    try { document.dispatchEvent(new CustomEvent('ui:glitch', { detail })); } catch {}
  }, [allow]);

  const teleport = useCallback((mode: TeleportMode, options?: TeleportOptions) => {
    if (!allow('teleport')) return;
    const detail = { mode, source: options?.source || 'logic', durationMs: options?.durationMs || 600, ts: Date.now() };
    try { document.dispatchEvent(new CustomEvent('ui:teleport', { detail })); } catch {}
  }, [allow]);

  return { glitch, teleport };
}

export default useUiEffects;
