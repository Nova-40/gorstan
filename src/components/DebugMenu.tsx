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

import React, { useEffect, useState } from 'react';
import { useGameState } from '@/state/gameState';
import { getAllRoomsAsObject } from '@/utils/roomLoader';

interface DebugMenuProps { onClose: () => void; }

// Simple floating debug menu to jump to any room or trigger arcade trials.
const DebugMenu: React.FC<DebugMenuProps> = ({ onClose }) => {
  const { state, dispatch } = useGameState();
  const [rooms, setRooms] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState('');
  const [show, setShow] = useState(true);
  const [arcadeVisible, setArcadeVisible] = useState(false);
  const [selectedArcade, setSelectedArcade] = useState<string>('catacombe');
  const isSuperUser = (()=>{ try { return localStorage.getItem('gorstan.superuser')==='1'; } catch { return false; }})();
  const debugAllowed = isSuperUser || state.flags?.debugMode;

  useEffect(() => {
    if (!debugAllowed) return;
    const all = Object.keys(getAllRoomsAsObject());
    setRooms(all.sort());
  }, [debugAllowed]);

  if (!debugAllowed || !show) return null;

  const filtered = rooms.filter(r => !filter || r.toLowerCase().includes(filter.toLowerCase())).slice(0, 200);
  const arcades = [
    { id: 'catacombe', label: 'Catacombe Dash' }
  ];

  return (
    <div className="fixed top-4 right-4 z-[1200] w-80 bg-black/80 border border-fuchsia-500/40 rounded shadow-lg p-3 font-mono text-xs text-fuchsia-100">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-fuchsia-300 tracking-wide">Debug Menu</strong>
        <div className="flex gap-1">
          <button onClick={()=>setShow(false)} className="px-2 py-0.5 bg-fuchsia-700/40 hover:bg-fuchsia-600/50 rounded">Hide</button>
          <button onClick={onClose} className="px-2 py-0.5 bg-fuchsia-700/40 hover:bg-fuchsia-600/50 rounded">Close</button>
        </div>
      </div>
      <div className="mb-2 flex gap-1">
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter rooms" className="flex-1 px-2 py-1 bg-black/40 border border-fuchsia-600/40 rounded outline-none focus:border-fuchsia-400" />
      </div>
      <div className="h-40 overflow-y-auto border border-fuchsia-600/30 rounded mb-2 p-1 space-y-0.5">
        {filtered.map(r => (
          <button key={r} onClick={()=>setSelected(r)} className={`w-full text-left px-2 py-0.5 rounded ${selected===r?'bg-fuchsia-600/60 text-white':'hover:bg-fuchsia-600/30'}`}>{r}</button>
        ))}
        {filtered.length===0 && <div className="px-2 py-1 text-fuchsia-400">No matches</div>}
      </div>
      <div className="flex gap-2 mb-2">
        <button disabled={!selected} onClick={()=> selected && dispatch({ type:'MOVE_PLAYER', payload:{ roomId: selected } })} className="flex-1 disabled:opacity-40 bg-fuchsia-600 hover:bg-fuchsia-500 text-black font-semibold rounded px-3 py-1">Jump</button>
        <button onClick={()=>dispatch({ type:'ENABLE_DEBUG_MODE' })} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-black font-semibold">Enable Debug</button>
      </div>
      <div className="border border-fuchsia-600/30 rounded p-2 mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-fuchsia-300">Arcades</span>
          <button onClick={()=>setArcadeVisible(a=>!a)} className="text-[10px] px-2 py-0.5 bg-fuchsia-700/40 hover:bg-fuchsia-600/50 rounded">{arcadeVisible? 'Hide':'Show'}</button>
        </div>
        {arcadeVisible && (
          <div className="space-y-2">
            <div className="flex gap-1 flex-wrap">
              {arcades.map(a => (
                <button
                  key={a.id}
                  onClick={()=> setSelectedArcade(a.id)}
                  className={`px-2 py-0.5 rounded text-[11px] ${selectedArcade===a.id? 'bg-fuchsia-600 text-white':'bg-fuchsia-700/30 hover:bg-fuchsia-600/40'}`}
                >{a.label}</button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={()=>{
                  if (selectedArcade === 'catacombe') {
                    dispatch({ type:'LAUNCH_ARCADE', payload:{ id: 'catacombeDash' } });
                  }
                }}
                className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-semibold rounded px-3 py-1"
              >Start</button>
              <button
                onClick={()=>dispatch({ type:'EXIT_ARCADE' })}
                className="px-3 py-1 bg-fuchsia-700/50 hover:bg-fuchsia-600/60 rounded"
              >Exit</button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 text-[10px] text-fuchsia-400/70 leading-snug">
        Superuser: {isSuperUser?'YES':'NO'} • Debug Flag: {state.settings?.debugMode?'ON':'OFF'}
      </div>
    </div>
  );
};

export default DebugMenu;