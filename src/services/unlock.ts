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

import { UnlockState } from '@/types/game';
import { createClient } from '@supabase/supabase-js';

// Crockford Base32 alphabet (no I,L,O,U) per spec
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function isCrockfordBase32(str: string): boolean {
  return /^[0-9A-HJKMNP-TV-Z]+$/i.test(str);
}

export function generateBetaCode(): string {
  let s = '';
  for (let i=0;i<8;i++) s += CROCKFORD[Math.floor(Math.random()*CROCKFORD.length)];
  return s;
}

const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

const BETA_PATTERN = /^(?:GORSTAN-|GOR-)?([0-9A-HJKMNP-TV-Z]{8})$/i;

// Hard-coded internal debug beta key (bypasses checksum / backend lookup)
export const DEBUG_BETA_KEY = 'X2R6B4KV';
export async function verifyBetaCode(code:string): Promise<UnlockState> {
  await sleep(250);
  const trimmed = code.trim().toUpperCase();
  // Direct debug override
  if (trimmed === DEBUG_BETA_KEY) {
    try { localStorage.setItem('gorstan.superuser','1'); } catch {}
    return { isUnlocked:true, source:'beta', betaTag:'DEBG' };
  }
  const m = BETA_PATTERN.exec(trimmed);
  if (!m) return { isUnlocked:false, source:null };
  const canonical = (m[1] ?? '').toUpperCase();
  if (!isCrockfordBase32(canonical)) return { isUnlocked:false, source:null };
  // Superuser (debug) override pattern: any valid code ending with ZZZZ unlocks debug mode
  const isSuperUser = canonical.endsWith('ZZZZ');
  if (isSuperUser) {
    try { localStorage.setItem('gorstan.superuser', '1'); } catch {}
  }
  // Tag can embed first 4 chars for display / analytics; superuser flagged via localStorage
  return { isUnlocked:true, source:'beta', betaTag:canonical.slice(0,4) };
}

export async function connectPatreon(): Promise<UnlockState> {
  await sleep(500);
  return { isUnlocked:true, source:'patreon', tier:'council-3' };
}

// ----------------------
// Supabase Secure Unlock
// ----------------------

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anon) throw new Error('supabase_env_missing');
    supabaseClient = createClient(url, anon, { auth: { persistSession: false } });
  }
  return supabaseClient;
}

/**
 * Attempt to unlock with a user-entered code against the verify-code Edge Function.
 * On success stores session key and begins heartbeat.
 */
export async function unlockWithCode(userCode: string, deviceHint?: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke('verify-code', {
    body: { code: userCode, deviceHint: deviceHint ?? navigator.userAgent }
  });
  if (error || !data?.ok) {
    throw new Error((data as any)?.reason ?? error?.message ?? 'unlock_failed');
  }
  const { session_key, code_type, allow_multiple } = data as any;
  try { localStorage.setItem('gorstan_session_key', session_key); } catch {}
  startHeartbeat(session_key);
  return { session_key, code_type, allow_multiple };
}

/** Start periodic heartbeat to keep session active */
export function startHeartbeat(sessionKey: string) {
  if (typeof window === 'undefined') return;
  if ((window as any).__gorstanHeartbeat) return;
  const supabase = getSupabase();
  (window as any).__gorstanHeartbeat = setInterval(async () => {
    try {
      await supabase.functions.invoke('heartbeat-session', { body: { session_key: sessionKey } });
    } catch { /* ignore */ }
  }, 30_000);
}

/** End current session (best-effort). */
export async function endSession() {
  if (typeof window === 'undefined') return;
  const key = localStorage.getItem('gorstan_session_key');
  if (!key) return;
  try {
    const supabase = getSupabase();
    await supabase.functions.invoke('end-session', { body: { session_key: key } });
  } catch { /* ignore */ }
  try { localStorage.removeItem('gorstan_session_key'); } catch {}
  if ((window as any).__gorstanHeartbeat) clearInterval((window as any).__gorstanHeartbeat);
  (window as any).__gorstanHeartbeat = null;
}
