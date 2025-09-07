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

// NPCEvents.ts - lane blocking / flavor events generator
export interface NPCEvent { id: string; type: 'dominic' | 'polly' | 'ayla'; z: number; lane: 0|1|2; line: string }

const LINES: Record<NPCEvent['type'], string[]> = {
	dominic: [
		'Dominic: Showtime!',
		'Dominic hums an old glitch melody.',
		'Dominic: Keep moving, keep rewriting.'
	],
	polly: [
		'Polly: The air tastes electric.',
		'Polly adjusts spectral feathers.',
		'Polly: I logged three anomalies ahead.'
	],
	ayla: [
		'Ayla: Pattern trajectory stable.',
		'Ayla: Momentum preserved.',
		'Ayla: Synchronizing sensory lattice.'
	]
};

export function generateNPCEvents(distance: number, seed = 0): NPCEvent[] {
	// Rough spacing every ~300 units with variation
	const events: NPCEvent[] = [];
	const rng = mulberry32(seed >>> 0);
	for (let z = 450; z < distance; z += 300 + Math.floor(rng()*120)) {
		const choices: NPCEvent['type'][] = ['dominic','polly','ayla'];
		const type = choices[Math.floor(rng()*choices.length)] || 'dominic';
		const lineSet = LINES[type] || LINES.dominic;
		const line = lineSet[Math.floor(rng()*lineSet.length)] || lineSet[0];
		events.push({ id: `${type}-${z}-${Math.random().toString(36).slice(2,6)}`, type, z, lane: Math.floor(rng()*3) as 0|1|2, line: line as string });
	}
	return events;
}

// Simple mulberry32 (duplicate kept local to avoid cross import weight)
function mulberry32(a: number) {
	return function() {
		let t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
