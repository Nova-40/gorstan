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

// Scoring.ts - distance, fragment, combo & survival multipliers
import type { GameState } from '../core/RunnerState';

export interface ScoreBreakdown { baseDistance: number; fragmentBonus: number; comboBonus: number; survivalMultiplier: number; total: number; }

export function computeScore(state: GameState & { combo?: number; sinceHitMs?: number }): ScoreBreakdown {
	const baseDistance = Math.floor(state.runner.z * 0.5);
	const fragmentBonus = state.fragments * 10;
	const combo = state.combo || 0;
	const comboBonus = Math.floor(combo * combo * 0.75); // quadratic scaling
	const survivalMs = state.sinceHitMs ?? state.timeMs;
	const survivalMultiplier = 1 + Math.min(1.5, survivalMs / 600000); // up to +150% over 10m
	const raw = (baseDistance + fragmentBonus + comboBonus) * survivalMultiplier;
	return { baseDistance, fragmentBonus, comboBonus, survivalMultiplier: Number(survivalMultiplier.toFixed(2)), total: Math.floor(raw) };
}

