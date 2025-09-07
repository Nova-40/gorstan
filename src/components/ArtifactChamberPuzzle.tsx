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
import { ScientistLogicPuzzle } from './ScientistLogicPuzzle';

/*
  ArtifactChamberPuzzle – Simple rune sequence logic puzzle.
  Player must activate runes in the correct order. On success awards artifact attunement.
*/

const TARGET_SEQUENCE = ['A','D','B','C'];

export const ArtifactChamberPuzzle: React.FC = () => {
  const { state, dispatch } = useGameState();
  const solved = state.flags?.artifact_chamber_puzzle_solved;
  const [progress, setProgress] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showScientistTrial, setShowScientistTrial] = useState(false);

  const handleRune = (r: string) => {
    if (solved) return;
    const nextIndex = progress.length;
    const correct = TARGET_SEQUENCE[nextIndex] === r;
    if (!correct) {
      setAttempts(a=>a+1);
      setProgress([]);
      if (hintLevel < 3) setHintLevel(h=>h+1);
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: `The rune '${r}' flares red and the pattern collapses.`, type: 'system', timestamp: Date.now() } });
      return;
    }
    const newProg = [...progress, r];
    setProgress(newProg);
    if (newProg.length === TARGET_SEQUENCE.length) {
      // Solved
      dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'The runes resonate in harmonic alignment. Power floods the chamber.', type: 'narrative', timestamp: Date.now() } });
      dispatch({ type: 'SET_FLAGS', payload: { ...state.flags, artifact_chamber_puzzle_solved: true } });
      dispatch({ type: 'ADD_TRAIT', payload: 'artifact_attuned' });
      dispatch({ type: 'ADD_MESSAGE', payload: { id: (Date.now()+1).toString(), text: 'You attune to the Ancient Core Artifact. Your magic surges.', type: 'system', timestamp: Date.now()+1 } });
      dispatch({ type: 'ADD_SCORE', payload: 250 });
    }
  };

  const hints: string[] = [
    'Four runes. Each responds differently to sequence position.',
    'One rune likes to begin, another to end.',
    'A begins. C dislikes the edges. D prefers second.',
    'Sequence: A ? ? C – test remaining placements.'
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-slate-200 p-4 gap-4">
      <h1 className="text-2xl font-mono tracking-wide text-cyan-300">Artifact Chamber</h1>
      {!solved && <p className="max-w-md text-center text-sm opacity-80">Four ancient runes hover above the pedestal. Touch them in the harmonic order to awaken the artifact.</p>}
      {solved && <p className="max-w-md text-center text-sm text-emerald-300">The artifact hums with stabilized power. Your attunement is complete.</p>}
      <div className="flex gap-4 mt-2">
        {['A','B','C','D'].map(r=>{
          const active = progress.includes(r) && TARGET_SEQUENCE.indexOf(r) < progress.length;
          return (
            <button
              key={r}
              onClick={()=>handleRune(r)}
              disabled={solved}
              className={`w-16 h-16 rounded-md font-bold text-xl border transition-colors ${active? 'bg-cyan-600 border-cyan-300':'bg-slate-800 border-slate-600 hover:bg-slate-700'} ${solved? 'opacity-60 cursor-default':''}`}
            >{r}</button>
          );
        })}
      </div>
      {!solved && (
        <div className="text-xs font-mono text-amber-300 mt-2 min-h-[1.5rem]">
          {hintLevel>0 && hints.slice(0,hintLevel).map((h,i)=>(<div key={i}>{h}</div>))}
        </div>
      )}
      <div className="text-xs opacity-60">Progress: {progress.join('-') || '—'} | Attempts: {attempts}</div>
      {solved && !showScientistTrial && (
        <button
          onClick={()=> { setShowScientistTrial(true); dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now().toString(), text: 'A quiet certainty settles within you. Deeper analytical protocols unlock.', type: 'narrative', timestamp: Date.now() } }); }}
          className="mt-4 px-4 py-2 text-sm rounded bg-cyan-700 hover:bg-cyan-600"
        >Commence Scientist Trial</button>
      )}
      {solved && showScientistTrial && <ScientistLogicPuzzle />}
    </div>
  );
};

export default ArtifactChamberPuzzle;