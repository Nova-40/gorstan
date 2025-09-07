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

// Shadows.ts - shadow AI behaviors (hunt / scatter / glitch)
import type { Shadow } from './Entities';
import type { GameState } from './RunnerState';
import { mulberry32 } from '../engine/RNG';

interface ShadowRuntime { moodTimer: number; }
const runtimeCache: Record<string, ShadowRuntime> = {};

export function tickShadows(state: GameState, dtMs: number): GameState {
  if (!state.slices.length) return state;
  const rand = mulberry32((state.rngSeed ^ state.tick) >>> 0);
  const updatedSlices = state.slices.map(slice => {
    if (!slice.shadows.length) return slice;
    const shadows: Shadow[] = slice.shadows.map(sh => {
      const rt = runtimeCache[sh.id] || (runtimeCache[sh.id] = { moodTimer: 2000 + rand()*4000 });
      rt.moodTimer -= dtMs;
      let mood = sh.mood;
      if (rt.moodTimer <= 0) {
        // cycle mood
        rt.moodTimer = 2500 + rand()*5000;
        mood = mood === 'hunt' ? (rand() < 0.6 ? 'scatter' : 'glitch') : 'hunt';
      }
      // behaviour: hunt moves toward runner Z slightly faster than entropy, scatter drifts back, glitch jumps lanes randomly
      let z = sh.z;
      let lane = sh.lane;
      if (mood === 'hunt') {
        const dz = (state.runner.z - sh.z);
        z += Math.min(dz, (2 + rand()*3) * dtMs/1000); // accelerate but clamp
        if (rand()<0.02) lane = clampLane(lane + (rand()<0.5?-1:1));
      } else if (mood === 'scatter') {
        z -= 4 * dtMs/1000; // fall back
        if (rand()<0.04) lane = clampLane(lane + (rand()<0.5?-1:1));
      } else { // glitch
        if (rand()<0.12) lane = clampLane(rand()<0.5?0:2);
        if (rand()<0.2) z += (rand()-0.5)*4; // jitter
      }
      return { ...sh, z, lane, mood };
    });
    return { ...slice, shadows };
  });
  return { ...state, slices: updatedSlices };
}

function clampLane(l: number): any { return l<0?0: l>2?2:l; }
