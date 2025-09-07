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

// Lightweight analytics event dispatcher (replace with PostHog / Plausible integration later)
import type { AnalyticsEventName } from '@/types/access';

type Payload = Record<string, any> | undefined;

const queue: Array<{ name: AnalyticsEventName; payload?: Payload; ts: number }> = [];
let flushing = false;

export function track(name: AnalyticsEventName, payload?: Payload) {
  try {
    queue.push({ name, payload, ts: Date.now() });
    // For now just log (guard against production noise via env flag later)
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload || {});
    document.dispatchEvent(new CustomEvent('analytics:event', { detail: { name, payload } }));
  } catch {/* noop */}
}

export function consumeQueuedAnalytics() { return [...queue]; }

// Environment gating: only allow network analytics if explicitly enabled.
// Opt-in via VITE_ANALYTICS_NETWORK=1 (e.g. production deploy). This avoids noisy 404s in dev.
const ENABLE_ANALYTICS_NETWORK = ((): boolean => {
  try { return import.meta.env.VITE_ANALYTICS_NETWORK === '1'; } catch { return false; }
})();
async function flushQueue() {
  if (flushing || queue.length === 0) return;
  if (!ENABLE_ANALYTICS_NETWORK) { // Always drop silently when not enabled
    queue.splice(0, queue.length);
    return;
  }
  flushing = true;
  const batch = queue.splice(0, queue.length);
  try {
    navigator.sendBeacon?.('/.netlify/functions/analytics-batch', JSON.stringify(batch)) ||
      await fetch('/.netlify/functions/analytics-batch', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(batch) });
  } catch { /* ignore network errors */ }
  flushing = false;
}

// Auto flush on visibility change / before unload
try {
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushQueue(); });
  window.addEventListener('beforeunload', () => { flushQueue(); });
} catch {/* ignore */}

// Flush periodically
setInterval(() => { flushQueue(); }, 15000);
