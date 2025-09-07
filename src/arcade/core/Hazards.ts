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

// Hazards.ts - collision + hazard helpers (expanded)
import type { Hazard } from './Entities';
import type { GameState } from './RunnerState';

interface CollisionResult { hit: boolean; fatal: boolean; kind?: Hazard['kind']; }

// Basic lane + Z band collision with small tolerance and conditional bypass logic.
export function checkCollision(h: Hazard, state: GameState): boolean {
  return collide(h, state).hit;
}

export function collide(h: Hazard, state: GameState): CollisionResult {
  const r = state.runner;
  if (h.lane !== r.lane) return { hit:false, fatal:false };
  const dz = Math.abs(h.z - r.z);
  if (dz > 0.8) return { hit:false, fatal:false };
  // Schrodinger hazards inactive until resolved externally (active true means real)
  if (h.kind === 'schrodinger' && h.active === false) return { hit:false, fatal:false };
  // Pit: only if runner is on ground when overlapping
  if (h.kind === 'pit' && r.y > 0.1) return { hit:false, fatal:false };
  // Wall: sliding grants bypass
  if (h.kind === 'wall' && r.isSliding) return { hit:false, fatal:false };
  // Phasing bypasses everything except pits (still fall) & schrodinger collapse maybe later
  if (r.isPhasing && (h.kind !== 'pit')) return { hit:false, fatal:false };
  // Fatality rules: pits & walls are fatal. Spikes + unresolved schrodinger do 1 damage (non-fatal if hp>1)
  const fatal = (h.kind === 'pit' || h.kind === 'wall');
  return { hit:true, fatal, kind:h.kind };
}

