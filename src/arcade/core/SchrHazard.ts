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

// SchrHazard.ts - collapse logic for Schrodinger hazards (stub)
import type { Hazard } from './Entities';
import type { GameState } from './RunnerState';
import { mulberry32 } from '../engine/RNG';

export function resolveSchrodinger(h: Hazard, state: GameState): Hazard {
  if (h.kind !== 'schrodinger' || h.active !== undefined) return h;
  const rand = mulberry32((state.rngSeed ^ Math.floor(h.z)) >>> 0)();
  const active = rand < 0.6; // 60% default
  return { ...h, active };
}
