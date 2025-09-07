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

// Client-side API helpers – stub implementations pending serverless endpoints.
import type { ValidateCodeRequest, ValidateCodeResponse, PatreonEntitlement, UserAccess } from '@/types/access';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json() as Promise<T>;
}

export async function validateBetaCode(req: ValidateCodeRequest): Promise<ValidateCodeResponse> {
  const isLocal = (() => { try { return import.meta.env.DEV || (typeof location !== 'undefined' && location.port === '5173'); } catch { return true; }})();
  if (isLocal) {
    // Pure stub locally: skip network entirely to avoid 404 spam
    await new Promise(r => setTimeout(r, 120));
    if (/^(?:GORSTAN-|GOR-)?([0-9A-HJKMNP-TV-Z]{8})$/i.test(req.code.trim())) {
      return { ok: true, state: 'beta', token: 'stub.beta.' + btoa(req.code).replace(/=+$/,'') };
    }
  return { ok: false, message: 'Invalid code (offline validation)' };
  }
  try {
    const res = await fetch('/.netlify/functions/validate-code', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req)
    });
    return await json<ValidateCodeResponse>(res);
  } catch {
    // Network failure fallback (production offline)
    await new Promise(r => setTimeout(r, 300));
    if (/^(?:GORSTAN-|GOR-)?([0-9A-HJKMNP-TV-Z]{8})$/i.test(req.code.trim())) {
      return { ok: true, state: 'beta', token: 'stub.beta.' + btoa(req.code).replace(/=+$/,'') };
    }
  return { ok: false, message: 'Invalid code (offline validation)' };
  }
}

export async function connectPatreon(): Promise<PatreonEntitlement> {
  // Placeholder: instantly resolves to Supporter tier
  await new Promise(r => setTimeout(r, 600));
  return { ok: true, tier: 'Supporter', token: 'stub.patreon.jwt' };
}

export async function refreshAccess(): Promise<UserAccess> {
  const stored = (()=>{ try { return JSON.parse(localStorage.getItem('gorstan.accessState')||'null') as UserAccess | null; } catch { return null; }})();
  const token = stored?.token;
  try {
    const res = await fetch('/.netlify/functions/access-refresh', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} });
    if (!res.ok) throw new Error('refresh failed');
    const data = await res.json();
    return data as UserAccess;
  } catch {
    // Fallback to stored state
    if (stored) return stored;
    return { state: 'locked' };
  }
}
