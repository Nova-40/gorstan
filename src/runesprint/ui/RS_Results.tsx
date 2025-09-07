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

// RS_Results.tsx – Results / Game Over screen with outcome quips
import React from 'react';
import { getQuip } from '../features/RS_LoreRegister';

interface RSResultsProps {
  outcome: 'success' | 'fail_time' | 'fail_guardian' | 'fail_rage' | 'fail_skip';
  fragments: number;
  perfect: boolean;
  onRestart: () => void;
  onExit: () => void;
}

export const RSResults: React.FC<RSResultsProps> = ({ outcome, fragments, perfect, onRestart, onExit }) => {
  const outcomeLine = (() => {
    switch (outcome) {
      case 'success': return perfect ? 'Chamber purified. Probability auditors suspicious.' : 'Checksum restored. Runtime stable.';
      case 'fail_time': return 'Entropy wins again.';
      case 'fail_guardian': return 'Debug process successful.';
      case 'fail_rage': return 'Escalation complete. Enjoy oblivion.';
      case 'fail_skip': return 'You skipped yourself into a corner. Bold choice.';
    }
  })();
  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center backdrop-blur bg-black/80 text-console font-mono">
      <div className="w-full max-w-md p-6 rounded-lg bg-slate-900/80 border border-cyan-400/30 space-y-4">
        <h2 className="text-xl text-cyan-300 tracking-wide">Rune Sprint Results</h2>
        <p className="text-sm text-cyan-100">{outcomeLine}</p>
        {perfect && <p className="text-xs text-emerald-400">{getQuip('perfect_chamber')}</p>}
        <p className="text-xs text-fuchsia-300">Fragments Collected: {fragments}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onRestart} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded text-xs">Restart</button>
          <button onClick={onExit} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs">Exit</button>
        </div>
      </div>
    </div>
  );
};

export default RSResults;
