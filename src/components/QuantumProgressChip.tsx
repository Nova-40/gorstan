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

import React, { useContext, useMemo } from 'react';
import { GameStateContext } from '../state/gameState';
import { getLevelProgress, getNextLevelExperience } from '../utils/quantumMagicHelpers';

export const QuantumProgressChip: React.FC = () => {
  const ctx = useContext(GameStateContext);
  const progression = ctx?.state.quantum?.progression;
  const total = progression?.totalExperience ?? 0;
  const level = progression?.quantumLevel ?? 0;

  const { progressPercent } = useMemo(() => getLevelProgress(total, level), [total, level]);
  const nextXP = useMemo(() => getNextLevelExperience(level), [level]);
  const remaining = Math.max(0, nextXP - total);

  if (!progression) return null;

  return (
    <div className="fixed top-4 right-4 z-40 pointer-events-none select-none" style={{ transform: 'translateY(64px)' }}>
      <div className="pointer-events-auto bg-gray-900/90 border border-purple-600 text-purple-200 rounded shadow px-3 py-2 min-w-[200px]">
        <div className="text-xs font-semibold">Quantum Level {level}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
            <div className="h-2 bg-purple-600" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-xs tabular-nums">{progressPercent}%</div>
        </div>
        <div className="text-[11px] text-gray-400 mt-1">{remaining} XP to next</div>
      </div>
    </div>
  );
};

export default QuantumProgressChip;
