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

// PauseMenu.tsx - pause overlay with controls & top scores
import React, { useEffect, useState } from 'react';
import { loadLeaderboard, formatScore } from '@/arcade/features/Leaderboard';

interface Props { visible: boolean; onResume: () => void; onQuit: () => void; }
export const PauseMenu: React.FC<Props> = ({ visible, onResume, onQuit }) => {
  const [scores, setScores] = useState(() => loadLeaderboard().slice(0,5));
  useEffect(()=>{ if (visible) setScores(loadLeaderboard().slice(0,5)); }, [visible]);
  if (!visible) return null;
  return <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-green-200 font-mono" role="dialog" aria-label="Pause menu">
    <div className="p-6 border border-green-500/60 rounded bg-slate-900/85 w-[340px] max-w-[90%] space-y-5">
      <h2 className="text-xl">Paused</h2>
      <section className="text-[11px] leading-snug">
        <h3 className="font-semibold mb-1 tracking-wide text-xs">Controls</h3>
        <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          <li><span className="opacity-60">Move</span> ← / →</li>
          <li><span className="opacity-60">Jump</span> Space / W</li>
          <li><span className="opacity-60">Slide</span> S / ↓</li>
          <li><span className="opacity-60">Phase</span> Q (when charged)</li>
          <li><span className="opacity-60">Pause</span> Esc</li>
        </ul>
      </section>
      <section className="text-[11px]">
        <h3 className="font-semibold mb-1 tracking-wide text-xs">Top Scores</h3>
        <ol className="space-y-0.5 max-h-24 overflow-auto pr-1">
          {scores.map((s,i)=>(<li key={s.timestamp}><span className="inline-block w-5">{i+1}.</span>{formatScore(s.score)} <span className="opacity-60">/ {s.distance.toFixed(0)}m / {s.fragments}f</span></li>))}
          {scores.length===0 && <li className="opacity-60">No runs yet</li>}
        </ol>
      </section>
      <div className="flex gap-2 pt-1 text-sm">
        <button onClick={onResume} className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded">Resume</button>
        <button onClick={onQuit} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 rounded">Quit</button>
      </div>
    </div>
  </div>;
};
