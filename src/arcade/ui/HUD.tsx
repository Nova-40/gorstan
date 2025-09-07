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

// HUD.tsx - runtime HUD with score breakdown & accessibility labels
import React from 'react';
import { computeScore } from '@/arcade/features/Scoring';
import type { GameState } from '@/arcade/core/RunnerState';

interface Props { state: GameState; }
export const HUD: React.FC<Props> = ({ state }) => {
  const breakdown = computeScore(state as any);
  const distance = state.runner.z;
  const phaseMs = state.power.phaseMs;
  const entropyGap = (state.runner.z - state.entropyZ);
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 text-green-300 font-mono text-[10px] md:text-xs flex gap-4 bg-black/60 px-3 md:px-4 py-2 rounded border border-green-500/40" role="status" aria-label="Run status HUD">
      <span title="Distance travelled">Dist {distance.toFixed(1)}m</span>
      <span title="Fragments collected">Frag {state.fragments}</span>
      <span title="Active combo">Combo {state.combo}</span>
      <span title="Phase remaining">Phase {Math.ceil(phaseMs/1000)}s</span>
      <span title="Entropy gap">Gap {entropyGap.toFixed(1)}m</span>
      <span title="Survival multiplier">x{breakdown.survivalMultiplier}</span>
      <span title="Score total">Score {breakdown.total}</span>
    </div>
  );
};
