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

// LeaderboardStub.ts - local top 10 scoreboard
export interface Entry { name: string; score: number; ts: number; }
const KEY = 'catacombe_dash_leaderboard_v1';
function load(): Entry[] { try { const raw = localStorage.getItem(KEY); if (!raw) return []; return JSON.parse(raw); } catch { return []; } }
function save(entries: Entry[]) { try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {} }
export function submitScore(name: string, score: number) { const entries = load(); entries.push({ name, score, ts: Date.now() }); entries.sort((a,b)=>b.score-a.score); const top = entries.slice(0,10); save(top); return top; }
export function getTop(): Entry[] { return load().sort((a,b)=>b.score-a.score).slice(0,10); }
