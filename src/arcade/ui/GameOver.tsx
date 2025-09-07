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

// GameOver.tsx - enhanced game over screen with breakdown & leaderboard
import React, { useEffect, useState } from 'react';
import { computeScore } from '@/arcade/features/Scoring';
import type { GameState } from '@/arcade/core/RunnerState';
import { recordRun, loadLeaderboard, type RunEntry, formatScore } from '@/arcade/features/Leaderboard';
import { useAccess } from '@/stores/access';

interface Props { visible: boolean; state?: GameState | null; onRetry: () => void; onQuit: () => void; }
export const GameOver: React.FC<Props> = ({ visible, state, onRetry, onQuit }) => {
  const access = useAccess(s => s.access);
  const [board, setBoard] = useState<RunEntry[]>([]);
  const [recorded, setRecorded] = useState(false);
  if (!visible || !state) return null;
  const breakdown = computeScore(state as any);
  useEffect(() => {
    if (visible && state && !recorded) {
      const entry: RunEntry = { score: breakdown.total, distance: state.runner.z, fragments: state.fragments, combo: state.combo||0, timeMs: state.timeMs, timestamp: Date.now() };
      const updated = recordRun(entry);
      setBoard(updated);
      setRecorded(true);
    } else if (visible) {
      setBoard(loadLeaderboard());
    }
  }, [visible, state, recorded, breakdown.total]);
  const rank = board.findIndex(e => e.score === breakdown.total) + 1;
  return <div className="fixed inset-0 bg-black/85 flex items-center justify-center text-green-200 font-mono" role="dialog" aria-label="Game over screen">
    <div className="p-6 border border-green-500/60 rounded bg-slate-900/80 space-y-4 min-w-[300px] max-w-[460px]">
      <h2 className="text-xl flex items-center gap-2">Run Over {rank>0 && <span className="text-[10px] px-2 py-0.5 bg-green-700/40 rounded">#{rank}</span>}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
        <div className="opacity-70">Distance</div><div>{state.runner.z.toFixed(1)}m</div>
        <div className="opacity-70">Fragments</div><div>{state.fragments}</div>
        <div className="opacity-70">Combo Bonus</div><div>{breakdown.comboBonus}</div>
        <div className="opacity-70">Base Distance</div><div>{breakdown.baseDistance}</div>
        <div className="opacity-70">Fragment Bonus</div><div>{breakdown.fragmentBonus}</div>
        <div className="opacity-70">Survival x</div><div>{breakdown.survivalMultiplier}</div>
        <div className="col-span-2 border-t border-green-800 mt-1 pt-1 flex justify-between text-sm font-semibold">Total <span>{formatScore(breakdown.total)}</span></div>
      </div>
      <div className="text-[11px] pt-2">
        <h3 className="font-semibold mb-1 text-xs tracking-wide">Leaderboard</h3>
        <ol className="space-y-0.5 max-h-36 overflow-auto pr-1">
          {board.map((e,i)=>(<li key={e.timestamp} className={i===0? 'text-emerald-300':'opacity-80'}><span className="inline-block w-5">{i+1}.</span>{formatScore(e.score)} <span className="opacity-60">/ {e.distance.toFixed(0)}m / {e.fragments}f / c{e.combo}</span></li>))}
          {board.length===0 && <li className="opacity-60">No runs yet</li>}
        </ol>
      </div>
      {access.state==='locked' && <div className="text-[11px] bg-amber-800/30 border border-amber-600/40 rounded p-2 leading-snug">
        Unlock full access to extend runs, earn lore & compete globally.
        <div className="pt-1">
          <button onClick={()=>window.dispatchEvent(new CustomEvent('open-unlock-dialog'))} className="px-2 py-1 bg-amber-600 rounded text-black text-xs font-semibold">Unlock Options</button>
        </div>
      </div>}
      <div className="flex gap-2 pt-2 text-sm">
        <button onClick={onRetry} className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded">Retry</button>
        <button onClick={onQuit} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 rounded">Quit</button>
      </div>
    </div>
  </div>;
};
