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

// LoreRegister.ts - fragment set unlock logic
// Unlock table: thresholds -> fragment keys
const TABLE: { threshold: number; id: string; label: string }[] = [
	{ threshold: 1, id: 'primer', label: 'Chronicle Primer' },
	{ threshold: 3, id: 'anomalyPing', label: 'Anomaly Ping' },
	{ threshold: 5, id: 'glitchWhisper', label: 'Glitch Whisper' },
	{ threshold: 8, id: 'codexShard', label: 'Codex Shard' },
	{ threshold: 12, id: 'metaWeave', label: 'Meta‑Weave Insight' }
];

export interface LoreUnlock { id: string; label: string }

export function computeLoreUnlocks(fragments: number): LoreUnlock[] {
	return TABLE.filter(t => fragments >= t.threshold).map(t => ({ id: t.id, label: t.label }));
}

export function nextLoreUnlock(fragments: number): { remaining: number; target: LoreUnlock | null } {
	for (const row of TABLE) {
		if (fragments < row.threshold) {
			return { remaining: row.threshold - fragments, target: { id: row.id, label: row.label } };
		}
	}
	return { remaining: 0, target: null };
}
