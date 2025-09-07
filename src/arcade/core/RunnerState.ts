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

// RunnerState.ts - game state & step logic
import type { Runner, LevelSlice, Hazard } from './Entities';
import { maybeGenerateNextSlice } from './LevelGen';
import { applyCollectibles } from './Collectibles';
import { tickShadows } from './Shadows';
import { collide } from './Hazards';
import { resolveSchrodinger } from './SchrHazard';
import { computeScore } from '../features/Scoring';

export interface RunnerInput { laneDelta: -1 | 0 | 1; jump: boolean; slide: boolean; }
export interface PowerState { phaseMs: number; }
export interface GameConfig { baseSpeed: number; maxSpeed: number; accel: number; laneWidth: number; gravity: number; jumpVel: number; slideMs: number; quantumDurationMs: number; entropySpeed: number; }
export interface GameState { tick: number; timeMs: number; rngSeed: number; mode: 'endless' | 'story' | 'trials'; runner: Runner; power: PowerState; slices: LevelSlice[]; score: number; fragments: number; loreUnlocked: string[]; entropyZ: number; isPaused: boolean; isGameOver: boolean; combo?: number; sinceHitMs?: number; }

export const DEFAULT_CONFIG: GameConfig = { baseSpeed: 7, maxSpeed: 18, accel: 0.003, laneWidth: 2.5, gravity: 28, jumpVel: 10.5, slideMs: 600, quantumDurationMs: 6000, entropySpeed: 5 };

export function createInitialState(config: GameConfig, seed: number, mode: GameState['mode']): GameState {
  return { tick: 0, timeMs: 0, rngSeed: seed, mode, runner: { lane: 1, y: 0, z: 0, velocityZ: config.baseSpeed, isSliding: false, isPhasing: false, hp: 3 }, power: { phaseMs: 0 }, slices: [], score: 0, fragments: 0, loreUnlocked: [], entropyZ: -20, isPaused: false, isGameOver: false, combo:0, sinceHitMs:0 };
}

export function step(state: GameState, input: RunnerInput, dtMs: number): GameState {
  if (state.isPaused || state.isGameOver) return state;
  const cfg = DEFAULT_CONFIG; // later allow dynamic config
  let { runner } = state;
  // lane change
  if (input.laneDelta !== 0) {
    const newLane = runner.lane + input.laneDelta as Runner['lane'];
    if (newLane >= 0 && newLane <= 2) runner = { ...runner, lane: newLane };
  }
  // forward speed accel
  let velocityZ = Math.min(runner.velocityZ + cfg.accel * dtMs, cfg.maxSpeed);
  let z = runner.z + velocityZ * (dtMs / 1000);
  // jump / gravity basic integration (parabola approximation)
  let y = runner.y;
  const onGround = y <= 0;
  let vy = 0;
  if (onGround && input.jump) {
    vy = cfg.jumpVel;
    y += vy * (dtMs / 1000);
  } else if (!onGround) {
    vy -= cfg.gravity * (dtMs / 1000);
    y += vy * (dtMs / 1000);
    if (y < 0) y = 0;
  }
  const isSliding = input.slide && onGround;
  let phaseMs = state.power.phaseMs;
  if (phaseMs > 0) phaseMs = Math.max(0, phaseMs - dtMs);
  const isPhasing = phaseMs > 0;
  // entropy wave advances at entropySpeed
  const entropyZ = state.entropyZ + cfg.entropySpeed * (dtMs / 1000);
  // Update runner portion first
  let next: GameState = { ...state, runner: { ...runner, y, z, velocityZ, isSliding, isPhasing }, power: { phaseMs } };

  // Ensure procedural slices ahead
  const genResult = maybeGenerateNextSlice(next.runner.z, next.slices, { seed: next.rngSeed, difficulty: clamp01(next.runner.z / 1500), mode: next.mode });
  if (genResult.slice) next = { ...next, slices: genResult.existing };

  // Apply collectibles
  next = applyCollectibles(next);

  // Resolve Schr hazards lazily & detect collisions in active window (within 2m)
  let hitFatal = false;
  let tookDamage = false;
  const ACTIVE_RANGE = 2.2;
  const updatedSlices: LevelSlice[] = next.slices.map(slice => {
    if (slice.zEnd < next.runner.z - 10) return slice; // keep old slices (could prune later)
    let changed = false;
    const hazards: Hazard[] = slice.hazards.map(h => {
      if (Math.abs(h.z - next.runner.z) < ACTIVE_RANGE && h.kind === 'schrodinger' && h.active === undefined) {
        changed = true; return resolveSchrodinger(h, next);
      }
      return h;
    });
    for (const h of hazards) {
      if (!hitFatal && Math.abs(h.z - next.runner.z) < 1.2) {
        const c = collide(h, next);
        if (c.hit) {
          tookDamage = true;
          if (c.fatal) { hitFatal = true; break; }
        }
      }
    }
    return changed ? { ...slice, hazards } : slice;
  });
  if (tookDamage && !isPhasing) {
    const newHp = hitFatal ? 0 : Math.max(0, next.runner.hp - 1);
    next = { ...next, runner: { ...next.runner, hp: newHp }, combo:0, sinceHitMs:0 };
  if (newHp <= 0) { try { (window as any).gorstanMetrics?.noteDeath?.(); } catch {} }
  }
  const gainedFragment = next.fragments > state.fragments;
  if (!tookDamage) {
    next = { ...next, combo: (next.combo||0) + (gainedFragment?1:0), sinceHitMs: (next.sinceHitMs||0) + dtMs };
  }
  next = { ...next, slices: updatedSlices };

  // Shadow AI
  next = tickShadows(next, dtMs);

  // Canonical score via breakdown (distance+fragments+combo scaled by survival)
  const breakdown = computeScore(next as any);

  const caught = entropyZ >= z - 1; // entropy catch
  const dead = next.runner.hp <= 0;
  next = { ...next, tick: next.tick + 1, timeMs: next.timeMs + dtMs, entropyZ, isGameOver: next.isGameOver || caught || dead, score: breakdown.total };
  return next;
}

function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v; }
