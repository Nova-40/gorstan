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

// LevelGen.ts - procedural slice generation with safe lane path & spawn tables
import type { LevelSlice, Hazard, Collectible, Shadow, Lane } from './Entities';
import { mulberry32, seededChoice } from '../engine/RNG';

export interface SliceGenOptions {
  seed: number;
  zStart: number;
  difficulty: number; // 0..1 scaling (later dynamic)
  mode: 'endless' | 'story' | 'trials';
  lastSafeLane?: Lane; // to bias continuity
}

interface SpawnTables {
  hazards: Array<{ kind: Hazard['kind']; weight: number }>;
}

const BASE_TABLE: SpawnTables = {
  hazards: [
    { kind: 'spike', weight: 5 },
    { kind: 'pit', weight: 3 },
    { kind: 'wall', weight: 2 },
    { kind: 'schrodinger', weight: 2 },
  ],
};

function pickHazard(rand: () => number, table = BASE_TABLE.hazards): Hazard['kind'] {
  const total = table.reduce((s, h) => s + h.weight, 0);
  let roll = rand() * total;
  for (const h of table) { roll -= h.weight; if (roll <= 0) return h.kind; }
  return (table[0]?.kind ?? 'spike');
}

// Guarantee at least one lane is free of solid hazards every 10m segment inside the slice.
export function generateSlice(opts: SliceGenOptions): LevelSlice {
  const { seed, zStart, difficulty, lastSafeLane } = opts;
  const rand = mulberry32((seed ^ zStart) >>> 0);
  const baseLen = 60 + rand() * 120; // 60-180m
  const len = baseLen * (0.85 + difficulty * 0.3);
  const zEnd = zStart + Math.round(len);
  const hazards: Hazard[] = [];
  const collectibles: Collectible[] = [];
  const shadows: Shadow[] = [];

  // Determine a continuous safe lane path that can occasionally shift one lane left/right.
  let safeLane: Lane = (lastSafeLane ?? (1 as Lane));
  let nextShiftZ = zStart + 20 + rand() * 25;
  for (let z = zStart; z < zEnd; z += 5) {
    if (z >= nextShiftZ) {
      // Attempt shift -1/0/+1 within bounds
      const deltas: Lane[] = [safeLane];
      if (safeLane > 0) deltas.push((safeLane - 1) as Lane);
      if (safeLane < 2) deltas.push((safeLane + 1) as Lane);
      safeLane = seededChoice(rand, deltas);
      nextShiftZ = z + 20 + rand() * 35;
    }
    // Spawn collectibles: fragment roughly every ~2m aggregated by step (here every 5m cell maybe 0-3)
    const fragmentChance = 0.55; // per cell – yields ~1.5 per cell avg (cap below)
    let placedFragments = 0;
    for (let lane: Lane = 0 as Lane; lane <= 2; lane = (lane + 1) as Lane) {
      if (rand() < fragmentChance && placedFragments < 2) { // limit density
        collectibles.push({ id: `frag-${z}-${lane}`, lane, z: z + rand(), type: 'fragment' });
        placedFragments++;
      }
    }
    // Quantum shard very rare (~1 per 200m) – approximate: chance per cell based on length
    if (rand() < (len / 200) * 0.02) {
      collectibles.push({ id: `quant-${z}`, lane: seededChoice(rand, [0,1,2] as Lane[]), z: z + rand(), type: 'quantum' });
    }

    // Hazards: ensure safe lane free of blocking hazards in this 5m band.
    for (let lane: Lane = 0 as Lane; lane <= 2; lane = (lane + 1) as Lane) {
      if (lane === safeLane) continue; // keep cell free for guaranteed path
      if (rand() < 0.65 - difficulty * 0.15) continue; // density gate
      const kind = pickHazard(rand);
      hazards.push({ id: `hz-${z}-${lane}`, lane, z: z + (rand()*4), kind });
    }
  }

  // Spawn shadows near end of slice based on difficulty.
  if (difficulty > 0.15) {
    const shadowCount = Math.min(1 + Math.floor(difficulty * 3), 3);
    for (let i = 0; i < shadowCount; i++) {
      shadows.push({ id: `sh-${zStart}-${i}` , lane: seededChoice(rand, [0,1,2] as Lane[]), z: zStart + 30 + rand()*(len-40), mood: 'hunt' });
    }
  }

  return { zStart, zEnd, collectibles, hazards, shadows };
}

export function maybeGenerateNextSlice(stateZ: number, existing: LevelSlice[], opts: Omit<SliceGenOptions,'zStart'>): { slice?: LevelSlice; existing: LevelSlice[] } {
  const FAR_AHEAD = 250; // maintain coverage this far
  const furthest = existing.reduce((m,s)=> Math.max(m,s.zEnd), stateZ);
  if (furthest - stateZ < FAR_AHEAD) {
  const lastSlice = existing[existing.length-1];
  const lastSafe = lastSlice ? determineSafeLane(lastSlice) : (1 as Lane);
    const slice = generateSlice({ ...opts, zStart: furthest + 5, lastSafeLane: lastSafe });
    return { slice, existing: [...existing, slice] };
  }
  return { existing };
}

function determineSafeLane(slice: LevelSlice): Lane {
  // heuristic: lane with fewest hazards near end
  const counts: Record<Lane, number> = { 0:0,1:0,2:0 } as any;
  slice.hazards.forEach(h=>{ if (h.z > slice.zEnd - 20) counts[h.lane]++; });
  const first = Object.entries(counts).sort((a,b)=>a[1]-b[1])[0];
  return (first ? (first[0] as any) : 1) as Lane;
}

