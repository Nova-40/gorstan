/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Hidden developer/debug panel. Dev controls only; no gameplay rules live here.

import React from 'react';
import { useGameState } from '../state/gameState';
import type { GameMessage } from '../types/GameTypes';

interface DebugPanelProps {
  onClose?: () => void;
}

type MessageType = GameMessage['type'];

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const { state, dispatch } = useGameState();
  const flags = state.flags || {};
  const activeFlags = Object.entries(flags)
    .filter(([, value]) => Boolean(value))
    .sort(([left], [right]) => left.localeCompare(right));

  const addDebugMessage = (text: string, type: MessageType = 'system') => {
    dispatch({
      type: 'RECORD_MESSAGE',
      payload: {
        id: `debug-${Date.now()}`,
        text: `[DEBUG] ${text}`,
        type,
        timestamp: Date.now(),
      },
    });
  };

  const moveToRoom = (roomId: string) => {
    dispatch({ type: 'MOVE_TO_ROOM', payload: roomId });
    addDebugMessage(`Warped to ${roomId}.`);
  };

  const addInventoryItem = (itemId: string) => {
    dispatch({ type: 'ADD_TO_INVENTORY', payload: itemId });
    addDebugMessage(`Added ${itemId} to inventory.`);
  };

  const setFlag = (flag: string, value: unknown) => {
    dispatch({ type: 'SET_FLAG', payload: { flag, value } });
    addDebugMessage(`Set ${flag} = ${String(value)}.`);
  };

  const clearActiveFlags = () => {
    activeFlags.forEach(([flag]) => {
      dispatch({ type: 'SET_FLAG', payload: { flag, value: false } });
    });
    addDebugMessage('Cleared active flags by setting them to false.');
  };

  const enableDebugMode = () => {
    dispatch({ type: 'ENABLE_DEBUG_MODE' });
    addDebugMessage('Debug mode enabled.');
  };

  const toggleCheatMode = () => {
    dispatch({ type: 'TOGGLE_CHEAT_MODE' });
    addDebugMessage(`Cheat mode toggled from ${String(state.settings?.cheatMode)}.`);
  };

  return (
    <div
      className="debug-panel fixed right-4 top-4 z-50 max-h-[85vh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-green-700 bg-black/95 p-4 text-sm text-green-100 shadow-2xl shadow-black"
      role="dialog"
      aria-label="Developer debug panel"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-green-50">Developer Debug Panel</h2>
          <p className="text-xs text-green-400">Dev tools only. Parser, room state and trap rules remain authoritative.</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-green-700 px-2 py-1 text-xs text-green-100 hover:bg-green-950"
          >
            Close
          </button>
        )}
      </div>

      <section className="mb-4 rounded-lg border border-green-900/70 bg-green-950/30 p-3">
        <h3 className="mb-2 text-xs uppercase tracking-wide text-green-400">Current State</h3>
        <div>Room: {state.currentRoomId || 'unknown'}</div>
        <div>Player: {state.player?.name || 'unknown'}</div>
        <div>Health: {state.player?.health ?? 'unknown'}</div>
        <div>Cheat mode: {String(state.settings?.cheatMode ?? false)}</div>
        <div>Debug mode: {String(state.settings?.debugMode ?? false)}</div>
      </section>

      <section className="mb-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={enableDebugMode} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
          Enable Debug Mode
        </button>
        <button type="button" onClick={toggleCheatMode} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
          Toggle Cheat Mode
        </button>
      </section>

      <section className="mb-4 rounded-lg border border-green-900/70 bg-green-950/20 p-3">
        <h3 className="mb-2 text-xs uppercase tracking-wide text-green-400">Warp</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => moveToRoom('controlnexus')} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Control Nexus
          </button>
          <button type="button" onClick={() => moveToRoom('dalesapartment')} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Dale's Apartment
          </button>
          <button type="button" onClick={() => moveToRoom('findlaterscornercoffeeshop')} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Findlater's Café
          </button>
          <button type="button" onClick={() => moveToRoom('ancientsroom')} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Ancients' Room
          </button>
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-green-900/70 bg-green-950/20 p-3">
        <h3 className="mb-2 text-xs uppercase tracking-wide text-green-400">Inventory / Flags</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => addInventoryItem('coffee')} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Add Coffee
          </button>
          <button type="button" onClick={() => setFlag('ctrlClickOnInstructions', true)} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Enable Ctrl Debug Access
          </button>
          <button type="button" onClick={() => setFlag('napkinExtrapolated', true)} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Set Napkin Extrapolated
          </button>
          <button type="button" onClick={() => setFlag('sidedWith', 'al')} className="rounded border border-green-700 px-3 py-2 hover:bg-green-950">
            Set Sided With Al
          </button>
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-amber-700/70 bg-amber-950/20 p-3">
        <h3 className="mb-2 text-xs uppercase tracking-wide text-amber-300">Trap Debug Flags</h3>
        <p className="mb-2 text-xs text-amber-100/80">These set flags only. Trap behaviour must be handled by the canonical trap engine.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => setFlag('debug_traps_disabled', true)} className="rounded border border-amber-700 px-3 py-2 hover:bg-amber-950">
            Traps Off
          </button>
          <button type="button" onClick={() => setFlag('debug_traps_disabled', false)} className="rounded border border-amber-700 px-3 py-2 hover:bg-amber-950">
            Traps Normal
          </button>
          <button type="button" onClick={() => setFlag('debug_trap_warnings_only', true)} className="rounded border border-amber-700 px-3 py-2 hover:bg-amber-950">
            Warnings Only
          </button>
          <button type="button" onClick={() => setFlag('debug_trap_warnings_only', false)} className="rounded border border-amber-700 px-3 py-2 hover:bg-amber-950">
            Warnings Normal
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-green-900/70 bg-green-950/20 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-xs uppercase tracking-wide text-green-400">Active Flags</h3>
          <button type="button" onClick={clearActiveFlags} className="rounded border border-green-700 px-2 py-1 text-xs hover:bg-green-950">
            Clear Active Flags
          </button>
        </div>
        {activeFlags.length === 0 ? (
          <p className="text-green-400/80">No active flags.</p>
        ) : (
          <ul className="max-h-52 space-y-1 overflow-y-auto font-mono text-xs text-green-200">
            {activeFlags.map(([flag, value]) => (
              <li key={flag} className="rounded bg-black/40 px-2 py-1">
                {flag}: {String(value)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DebugPanel;
