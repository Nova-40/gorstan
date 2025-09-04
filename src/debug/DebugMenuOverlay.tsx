import React, { useMemo, useState, useEffect } from 'react';
import { useGameState } from '@/state/gameState';
import { useDebugMenu } from './useDebugMenu';
import { FEATURES } from '@/config';
import { listAllTrials } from './TrialsRegistry';
import { launchTrial } from './TrialLauncher';
import { MiniquestEngine } from '@/engine/miniquestInitializer';
import SuperstringCollapse from '@/miniquests/SuperstringCollapse';
import { getAllRoomsAsObject } from '@/utils/roomLoader';

interface Props { onClose: () => void; }

// Simple utility to collect all registered miniquests (by scanning engine map)
function listAllMiniquests(): { id: string; roomId: string; title: string; difficulty?: string }[] {
  try {
    const engine: any = MiniquestEngine.getInstance();
    const out: { id: string; roomId: string; title: string; difficulty?: string }[] = [];
    const mqMap: Map<string, any[]> = engine._debugExposeRoomQuests?.() || (engine as any).roomQuests || new Map();
    mqMap.forEach((quests, roomId) => {
      quests.forEach((q: any) => out.push({ id: q.id, roomId, title: q.title, difficulty: q.difficulty }));
    });
    return out.sort((a,b)=> a.id.localeCompare(b.id));
  } catch { return []; }
}

export const DebugMenuOverlay: React.FC<Props> = ({ onClose }) => {
  const { dispatch, state } = useGameState();
  const debug = useDebugMenu();
  const [filter, setFilter] = useState('');
  const [seed, setSeed] = useState('');
  const [tab, setTab] = useState<'miniquests' | 'trials' | 'world' | 'arcade'>('miniquests');
  const [activeMiniQuest, setActiveMiniQuest] = useState<string | null>(null);
  // World / room parity features
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomFilter, setRoomFilter] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [arcadeVisible, setArcadeVisible] = useState(false);
  const [selectedArcade, setSelectedArcade] = useState<string>('catacombe');
  const isSuperUser = useMemo(() => { try { return localStorage.getItem('gorstan.superuser')==='1'; } catch { return false; } }, []);

  // New simplified debug menu hook only exposes open/toggle/show/hide
  if (!debug.open) return null;

  const miniquests = useMemo(() => listAllMiniquests(), []);
  const filteredMini = miniquests.filter(m => !filter || m.id.includes(filter) || m.title?.toLowerCase().includes(filter.toLowerCase()));
  const trials = listAllTrials();
  // Load rooms when enabled
  useEffect(() => {
    // Always attempt to load rooms when open (feature gating removed in simplified hook)
    try {
      const all = Object.keys(getAllRoomsAsObject());
      setRooms(all.sort());
    } catch {/* silent */}
  }, []);
  const filteredRooms = rooms.filter(r => !roomFilter || r.toLowerCase().includes(roomFilter.toLowerCase())).slice(0, 300);

  const canMini = FEATURES.MINIQUEST_DEBUG_LAUNCH;
  const canTrials = FEATURES.TRIALS_DEBUG_LAUNCH;

  const handleLaunchMiniquest = (mq: { id: string; roomId: string }) => {
    if (!canMini) return;
    // Move player to the quest's room (non-invasive) then attempt.
    dispatch({ type: 'MOVE_PLAYER', payload: { roomId: mq.roomId } });
    // Attempt quest via command simulation – or directly through engine controller if available.
    dispatch({ type: 'ADD_MESSAGE', payload: { text: `Debug: attempting mini-quest ${mq.id}`, type: 'system' } });
    // Fire a custom event; existing quest UI/system may hook (keeps decoupled)
    document.dispatchEvent(new CustomEvent('debug:launch-miniquest', { detail: { id: mq.id, roomId: mq.roomId } }));
  };

  const handleLaunchTrial = (trialId: string) => {
    if (!canTrials) return;
    const numericSeed = seed ? Number(seed) : undefined;
    if (seed && Number.isNaN(numericSeed)) return;
    launchTrial(trialId, dispatch, numericSeed !== undefined ? { seed: numericSeed } : {});
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-start justify-center p-8 pointer-events-none">
      <div className="pointer-events-auto w-[880px] max-h-[85vh] overflow-hidden rounded-lg shadow-2xl border border-fuchsia-500/40 bg-black/85 backdrop-blur-md font-mono text-sm text-fuchsia-100">
        <div className="flex items-center justify-between px-4 py-2 border-b border-fuchsia-600/30 bg-fuchsia-900/30">
          <div className="flex items-center gap-4">
            <strong className="tracking-wide text-fuchsia-200">Debug Menu</strong>
            <div className="flex gap-2 text-[11px]">
              <button onClick={() => setTab('miniquests')} className={tab==='miniquests'? 'px-2 py-1 rounded bg-fuchsia-600 text-black font-semibold':'px-2 py-1 rounded bg-fuchsia-700/40 hover:bg-fuchsia-600/40'}>Mini-Quests</button>
              <button onClick={() => setTab('trials')} className={tab==='trials'? 'px-2 py-1 rounded bg-fuchsia-600 text-black font-semibold':'px-2 py-1 rounded bg-fuchsia-700/40 hover:bg-fuchsia-600/40'}>Trials</button>
              <button onClick={() => setTab('world')} className={tab==='world'? 'px-2 py-1 rounded bg-fuchsia-600 text-black font-semibold':'px-2 py-1 rounded bg-fuchsia-700/40 hover:bg-fuchsia-600/40'}>World</button>
              <button onClick={() => setTab('arcade')} className={tab==='arcade'? 'px-2 py-1 rounded bg-fuchsia-600 text-black font-semibold':'px-2 py-1 rounded bg-fuchsia-700/40 hover:bg-fuchsia-600/40'}>Arcade</button>
            </div>
          </div>
          <div className="flex gap-2">
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="filter" className="px-2 py-1 rounded bg-black/40 border border-fuchsia-600/40 text-xs outline-none focus:border-fuchsia-400" />
            <button onClick={debug.toggle} className="px-2 py-1 rounded bg-fuchsia-700/40 hover:bg-fuchsia-600/50 text-xs">Hide</button>
            <button onClick={() => { debug.hide(); onClose(); }} className="px-2 py-1 rounded bg-fuchsia-700/40 hover:bg-fuchsia-600/50 text-xs">Close</button>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-fuchsia-700/30" style={{ maxHeight: 'calc(85vh - 46px)' }}>
          <div className="p-3 overflow-y-auto">
            {tab === 'miniquests' && (
              <div className="space-y-1">
                {filteredMini.slice(0,400).map(m => (
                  <div key={m.id} className="flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-fuchsia-700/30">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-fuchsia-200">{m.id}</div>
                      <div className="text-[10px] text-fuchsia-400 truncate">{m.roomId}</div>
                    </div>
                    <div className="flex gap-1">
                      <button disabled={!canMini} onClick={() => handleLaunchMiniquest(m)} className="px-2 py-0.5 text-[11px] rounded bg-fuchsia-600/70 hover:bg-fuchsia-500 disabled:opacity-30 text-black">Run</button>
                      {m.id==='superstringCollapse' && (
                        <button onClick={()=> setActiveMiniQuest('superstringCollapse')} className="px-2 py-0.5 text-[11px] rounded bg-indigo-500/80 hover:bg-indigo-400 text-black">Play</button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredMini.length === 0 && <div className="text-fuchsia-400 text-xs">No mini-quests match filter</div>}
              </div>
            )}
            {tab === 'trials' && (
              <div className="space-y-2">
                <div className="flex gap-2 items-center mb-2">
                  <input value={seed} onChange={e=>setSeed(e.target.value)} placeholder="seed (optional)" className="px-2 py-1 rounded bg-black/40 border border-fuchsia-600/40 text-xs outline-none focus:border-fuchsia-400 w-40" />
                  <div className="text-[10px] text-fuchsia-400">Seed sets deterministic artifact sampling (future-ready)</div>
                </div>
                {trials.map(t => (
                  <div key={t.id} className="flex items-center justify-between gap-3 px-2 py-1 rounded hover:bg-fuchsia-700/30">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-fuchsia-200">{t.title}</div>
                      <div className="text-[10px] text-fuchsia-400 truncate">{t.description}</div>
                    </div>
                    <button disabled={!canTrials} onClick={() => handleLaunchTrial(t.id)} className="px-3 py-0.5 text-[11px] rounded bg-fuchsia-600/70 hover:bg-fuchsia-500 disabled:opacity-30 text-black">Launch</button>
                  </div>
                ))}
              </div>
            )}
            {tab === 'world' && (
              <div className="space-y-3">
            {tab === ('arcade' as typeof tab) && (
              <div className="space-y-2">
                <div className="text-xs text-fuchsia-300">Standalone Arcade Mini-Quests</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=> setActiveMiniQuest('superstringCollapse')} className="px-3 py-1 rounded bg-indigo-600/70 hover:bg-indigo-500 text-[11px] font-semibold text-black">Superstring Collapse</button>
                </div>
                <p className="text-[10px] text-fuchsia-400/80 leading-snug">Arcade tab mounts mini-quests in an isolated modal. Completion auto-awards lore fragments.</p>
              </div>
            )}
                <div className="flex gap-1 items-center">
                  <input value={roomFilter} onChange={e=>setRoomFilter(e.target.value)} placeholder="Filter rooms" className="flex-1 px-2 py-1 rounded bg-black/40 border border-fuchsia-600/40 text-xs outline-none focus:border-fuchsia-400" />
                  <button disabled={!selectedRoom} onClick={()=> selectedRoom && dispatch({ type:'MOVE_PLAYER', payload:{ roomId: selectedRoom } })} className="px-3 py-1 rounded bg-fuchsia-600/70 hover:bg-fuchsia-500 disabled:opacity-30 text-black text-[11px]">Jump</button>
                  <button onClick={()=>dispatch({ type:'ENABLE_DEBUG_MODE' })} className="px-3 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-black text-[11px] font-semibold">Enable Debug</button>
                </div>
                <div className="h-48 overflow-y-auto border border-fuchsia-600/30 rounded p-1 space-y-0.5">
                  {filteredRooms.map(r => (
                    <button key={r} onClick={()=>setSelectedRoom(r)} className={`w-full text-left px-2 py-0.5 rounded ${selectedRoom===r?'bg-fuchsia-600/60 text-white':'hover:bg-fuchsia-600/30'}`}>{r}</button>
                  ))}
                  {filteredRooms.length===0 && <div className="px-2 py-1 text-fuchsia-400">No matches</div>}
                </div>
                <div className="border border-fuchsia-600/30 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-fuchsia-300">Arcades</span>
                    <button onClick={()=>setArcadeVisible(a=>!a)} className="text-[10px] px-2 py-0.5 bg-fuchsia-700/40 hover:bg-fuchsia-600/50 rounded">{arcadeVisible? 'Hide':'Show'}</button>
                  </div>
                  {arcadeVisible && (
                    <div className="space-y-2">
                      <div className="flex gap-1 flex-wrap">
                        <button
                          onClick={()=> setSelectedArcade('catacombe')}
                          className={`px-2 py-0.5 rounded text-[11px] ${selectedArcade==='catacombe'? 'bg-fuchsia-600 text-white':'bg-fuchsia-700/30 hover:bg-fuchsia-600/40'}`}
                        >Catacombe Dash</button>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={()=> dispatch({ type:'LAUNCH_ARCADE', payload:{ id: 'catacombeDash' } })}
                          className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-semibold rounded px-3 py-1 text-[11px]"
                        >Start</button>
                        <button
                          onClick={()=>dispatch({ type:'EXIT_ARCADE' })}
                          className="px-3 py-1 bg-fuchsia-700/50 hover:bg-fuchsia-600/60 rounded text-[11px]"
                        >Exit</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[10px] text-fuchsia-400/70 leading-snug">
                  Superuser: {isSuperUser?'YES':'NO'} • Debug Flag: {state.settings?.debugMode?'ON':'OFF'}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 overflow-y-auto text-[11px]">
            <div className="mb-2 font-semibold text-fuchsia-300">Session / Flags</div>
            <div className="grid grid-cols-2 gap-1 mb-4">
              <div className="opacity-70">Room</div><div className="truncate">{state.currentRoomId}</div>
              <div className="opacity-70">Stage</div><div>{(state as any).stage}</div>
              <div className="opacity-70">TrialsActive</div><div>{(state.flags?.pending_trials_route ? 'PENDING' : '-') }</div>
              <div className="opacity-70">Miniquests</div><div>{Object.keys(state.miniquestState||{}).length}</div>
            </div>
            <div className="mb-2 font-semibold text-fuchsia-300">Hotkeys</div>
            <ul className="list-disc ml-5 space-y-1 mb-4">
              <li>F10 – Toggle menu</li>
              <li>Ctrl+` – Toggle menu</li>
            </ul>
            <div className="mb-2 font-semibold text-fuchsia-300">Notes</div>
            <p className="text-fuchsia-400/80 leading-snug">
              This overlay lists registered mini-quests (extracted from engine map) and offers a non-invasive launch path.
              Trials launch routes only trigger existing stage transitions; no gameplay logic is modified here.
            </p>
          </div>
        </div>
      </div>
      {activeMiniQuest === 'superstringCollapse' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-[1300]">
          <div className="relative border border-fuchsia-600/40 rounded-lg bg-black/90 p-4 shadow-xl">
            <button
              onClick={()=> setActiveMiniQuest(null)}
              className="absolute -top-3 -right-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-black rounded-full w-8 h-8 text-sm font-bold" aria-label="Close mini-quest">×</button>
            <div className="mb-2 text-fuchsia-200 font-semibold text-sm">Superstring Collapse</div>
            <SuperstringCollapse
              debugMode
              onComplete={(success, reward) => {
                if (success && reward) {
                  dispatch({ type: 'ADD_MESSAGE', payload: { text: `Reward acquired: ${reward}`, type: 'system' } });
                } else if (!success) {
                  dispatch({ type: 'ADD_MESSAGE', payload: { text: 'Mini-quest failed.', type: 'system' } });
                }
                setActiveMiniQuest(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugMenuOverlay;
