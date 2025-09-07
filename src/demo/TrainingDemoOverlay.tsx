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

import React, { useEffect } from 'react';
import { startTrainingDemo, stopTrainingDemo, isTrainingDemoActive } from './trainingDemoController';
import { useGameState } from '@/state/gameState';

interface Props { onEnd: () => void }

const TrainingDemoOverlay: React.FC<Props> = ({ onEnd }) => {
  const { dispatch } = useGameState();

  useEffect(() => {
    if(dispatch) startTrainingDemo(dispatch);
    const esc = (e: KeyboardEvent) => { if(e.key==='Escape'){ stopTrainingDemo(); onEnd(); }};
    window.addEventListener('keydown', esc);
    const endWatcher = setInterval(()=>{ if(!isTrainingDemoActive()) { clearInterval(endWatcher); onEnd(); }}, 1000);
    return () => { window.removeEventListener('keydown', esc); stopTrainingDemo(); clearInterval(endWatcher); };
  }, [dispatch, onEnd]);

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-[70] flex justify-center mt-2">
      <div className="pointer-events-auto bg-black/70 border border-emerald-500/40 text-emerald-200 px-4 py-2 rounded shadow font-mono text-xs flex gap-3 items-center">
        <span>Interactive Training Demo</span>
        <button className="px-2 py-0.5 bg-emerald-700/40 hover:bg-emerald-600/50 rounded border border-emerald-400/30" onClick={()=>{ stopTrainingDemo(); onEnd(); }}>Exit</button>
        <button className="px-2 py-0.5 bg-fuchsia-700/40 hover:bg-fuchsia-600/50 rounded border border-fuchsia-400/30" onClick={()=>{ try{ dispatchEvent(new CustomEvent('open-patreon-dialog')); }catch{} }}>Subscribe</button>
      </div>
    </div>
  );
};
export default TrainingDemoOverlay;
