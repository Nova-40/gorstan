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

import React, { useState } from 'react';
import { useGameState } from '../state/gameState';

/*
  ScientistLogicPuzzle – Hard liar/truthteller style puzzle.
  Characters:
    Polly – always lies
    Al – always tells truth
    Morthos – may lie or tell truth
  Goal: Determine which crystal stabilizer frequency (1, 2, or 3) is correct.
  They make statements about which frequency will cause a collapse. Player must deduce the safe (true) frequency.
  Reward: grants 'logic_resonance' trait + score if solved; limited hints escalate.
*/

interface Statement {
  speaker: 'Polly' | 'Al' | 'Morthos';
  text: string;
  refersTo: number; // frequency
  claimType: 'safe' | 'danger';
}

const FREQUENCIES = [1,2,3];

// Puzzle design logic:
// Truth table we choose: Actual safe frequency = 2
// Statements:
//  Al: "Frequency 2 is safe." (true)
//  Polly: "Frequency 3 will not destabilise the chamber." (lie -> 3 actually dangerous)
//  Polly lying implies frequency 3 is dangerous.
//  Morthos: "Frequency 1 is dangerous." (could be true or false; we design actual: frequency 1 dangerous so Morthos tells truth here (allowed))
// Derived: freq1 dangerous, freq3 dangerous -> only freq2 safe.

const SAFE_FREQUENCY = 2;

const baseStatements: Statement[] = [
  { speaker: 'Al', text: 'Frequency 2 is safe.', refersTo: 2, claimType: 'safe' },
  { speaker: 'Polly', text: 'Frequency 3 will not destabilise the chamber.', refersTo: 3, claimType: 'safe' },
  { speaker: 'Morthos', text: 'Frequency 1 is dangerous.', refersTo: 1, claimType: 'danger' }
];

export const ScientistLogicPuzzle: React.FC = () => {
  const { state, dispatch } = useGameState();
  const solved = state.flags?.scientist_logic_puzzle_solved;
  const [selection, setSelection] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);

  const evaluate = (freq: number) => {
    if (solved) return;
    setSelection(freq);
    if (freq === SAFE_FREQUENCY) {
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'You select frequency '+freq+'. Harmonic stability achieved.', type: 'system', timestamp: Date.now() } });
      dispatch({ type: 'SET_FLAGS', payload: { ...state.flags, scientist_logic_puzzle_solved: true } });
      if (!state.player.traits?.includes('logic_resonance')) {
        dispatch({ type: 'ADD_TRAIT', payload: 'logic_resonance' });
        dispatch({ type: 'ADD_MESSAGE', payload: { id: (Date.now()+1).toString(), text: 'Trait gained: Logic Resonance – magical calculations gain a subtle boost.', type: 'narrative', timestamp: Date.now()+1 } });
      }
      dispatch({ type: 'ADD_SCORE', payload: 400 });
      return;
    }
    setAttempts(a=>a+1);
    if (hintLevel < 4) setHintLevel(h=>h+1);
    // Failure consequence: return player to start of trials
    dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: '🐇 The Aevira consider you unsuitable to hold the artifact, please try again.', type: 'error', timestamp: Date.now() } });
    // Reset relevant artifact puzzle flags so they can attempt again if needed
    dispatch({ type: 'SET_FLAGS', payload: { ...state.flags, artifact_chamber_puzzle_solved: false, scientist_logic_puzzle_solved: false } });
    // Move player back to the first trials room
    dispatch({ type: 'CHANGE_ROOM', payload: 'trials_rockfield' });
  };

  const hints = [
    'Exactly one frequency is safe.',
    'Al never lies. Polly never tells the truth.',
    'If Polly says a frequency will not destabilise, that frequency is actually dangerous.',
    'Morthos might help or mislead; focus on the contradiction between Al and Polly.',
    'Eliminate the two frequencies Polly or Morthos point toward as safe/dangerous—one remains.'
  ];

  return (
    <div className="mt-8 p-4 border border-cyan-700 rounded bg-slate-900/70 max-w-lg w-full">
      <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">Scientist Logic Trial</h2>
      {!solved && <p className="text-xs opacity-80 mb-2">Three crystal stabiliser frequencies hum softly. The scientists offer their statements.</p>}
      {solved && <p className="text-xs text-emerald-400 mb-2">Stability locked. Your mind resonates with structured clarity.</p>}
      <ul className="text-xs mb-3 space-y-1">
        {baseStatements.map((s,i)=> (
          <li key={i} className="italic text-slate-300"><span className="text-cyan-400">{s.speaker}:</span> "{s.text}"</li>
        ))}
      </ul>
      <div className="flex gap-2 mb-2">
        {FREQUENCIES.map(f => (
          <button key={f} disabled={!!solved} onClick={()=>evaluate(f)} className={`px-3 py-2 rounded text-sm font-mono border ${selection===f && !solved ? 'border-amber-400' : 'border-slate-600'} ${solved && f===SAFE_FREQUENCY ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-800 hover:bg-slate-700'}`}>f{f}</button>
        ))}
      </div>
      {!solved && <div className="text-[10px] text-amber-300 min-h-[2.5rem]">{hints.slice(0,hintLevel).map((h,i)=>(<div key={i}>{h}</div>))}</div>}
      <div className="text-[10px] opacity-60">Attempts: {attempts}</div>
      {solved && <div className="text-[10px] text-cyan-300">Trait logic_resonance active.</div>}
    </div>
  );
};

export default ScientistLogicPuzzle;
