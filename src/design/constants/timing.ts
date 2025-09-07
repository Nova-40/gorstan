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

// Shared timing constants for game modes (Design System Step 4 linkage)
export const RUNE_SPRINT_BASE_DURATION_MS = 60000; // 60s baseline per run
export const TRIALS_DEFAULT_PHASE_DURATION_MS = 60000; // placeholder per-phase slice
export const TELEPORT_EFFECT_DURATION_MS = 650; // matches CSS keyframes length

// Utility helpers
export const msToSec = (ms: number) => (ms / 1000);
export const clamp = (v: number, min=0, max=1) => Math.min(max, Math.max(min, v));