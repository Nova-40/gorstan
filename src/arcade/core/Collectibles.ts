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

// Collectibles.ts - pickup handling
import type { Collectible } from './Entities';
import type { GameState } from './RunnerState';

export function applyCollectibles(state: GameState): GameState {
	if (!state.slices.length) return state;
	let fragments = state.fragments;
	let power = state.power;
	const PICK_RADIUS_Z = 0.8;
	const runnerZ = state.runner.z;
	const updatedSlices = state.slices.map(slice => {
		if (slice.zEnd < runnerZ - 5) return slice; // far behind, ignore
		let changed = false;
		const remaining: Collectible[] = [];
		for (const c of slice.collectibles) {
			if (Math.abs(c.z - runnerZ) < PICK_RADIUS_Z && c.lane === state.runner.lane) {
				changed = true;
				if (c.type === 'fragment') fragments += 1;
				else if (c.type === 'quantum' && power.phaseMs <= 0) power = { ...power, phaseMs: power.phaseMs + 6000 };
			} else remaining.push(c);
		}
		return changed ? { ...slice, collectibles: remaining } : slice;
	});
	return { ...state, slices: updatedSlices, fragments, power };
}
