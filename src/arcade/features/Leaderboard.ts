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

// Leaderboard.ts - simple localStorage-backed leaderboard for Catacombe Dash
export interface RunEntry { score: number; distance: number; fragments: number; combo: number; timeMs: number; timestamp: number; }

const KEY = 'gorstan.arcade.leaderboard';
const MAX_ENTRIES = 10;

export function loadLeaderboard(): RunEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(v => typeof v === 'object' && v && typeof v.score === 'number');
  } catch { return []; }
}

export function saveLeaderboard(entries: RunEntry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {}
}

export function recordRun(entry: RunEntry): RunEntry[] {
  const entries = loadLeaderboard();
  entries.push(entry);
  entries.sort((a,b) => b.score - a.score);
  const trimmed = entries.slice(0, MAX_ENTRIES);
  saveLeaderboard(trimmed);
  return trimmed;
}

export function formatScore(n: number) { return n.toLocaleString(); }