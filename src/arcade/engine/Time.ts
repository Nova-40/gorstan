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

// Time.ts - simple time utilities for deterministic runs
export interface TimeSnapshot { startMs: number; nowMs: number; elapsedMs: number; }
export function createTime(): TimeSnapshot { const now = performance.now(); return { startMs: now, nowMs: now, elapsedMs: 0 }; }
export function advance(time: TimeSnapshot, dtMs: number): TimeSnapshot { return { ...time, nowMs: time.nowMs + dtMs, elapsedMs: time.elapsedMs + dtMs }; }
