/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// User interface panel display.

import React from 'react';
import { useGameState } from '../state/gameState';
import { demoService } from '../demo/DemoModeService';
import { isDemoRunning } from '../demo/state';
import { useFlags } from '../hooks/useFlags';
import { IS_DEV } from '../config/mode';
import { DEMO_PACKS } from '../demo/DemoPacks';
import { useState } from 'react';
import { useMiniQuest } from '../minigames/core/useMiniQuest';
import { FEATURES } from '../config';

const DebugPanel: React.FC = () => {
  const { state, dispatch } = useGameState();
  const { hasFlag } = useFlags();
  const [selectedPack, setSelectedPack] = useState<string | undefined>(DEMO_PACKS[0]?.id);
  const mini = useMiniQuest();

  // Variable declaration
  const clearFlags = () => {
    dispatch({ type: 'CLEAR_ALL_FLAGS' });
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        text: '[DEBUG] All flags cleared.',
        type: 'system',
        timestamp: Date.now(),
      },
    });
  };

  // Variable declaration
  const listFlags = Object.keys(state.flags || {});

  // JSX return block or main return
  return (
    <div className="debug-panel">
      {/* Mini-quest quick launcher */}
      {FEATURES.MINI_QUESTS_ENABLED && (
        <div style={{ marginBottom: 8 }}>
          <strong>Mini-Quests</strong>
          <div style={{ marginTop: 6 }}>
            <button onClick={() => mini.launch('atomWeaver', state.currentRoomId)}>
              Play Atom Weaver
            </button>
          </div>
        </div>
      )}
      {/* Demo controls (dev only) */}
      {IS_DEV && hasFlag('DEMO_MODE_ENABLED') && (
        <div style={{ marginBottom: 8 }}>
          <strong>Demo</strong>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
            <select value={selectedPack} onChange={(e) => setSelectedPack(e.target.value)}>
              {DEMO_PACKS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button onClick={() => demoService.start(selectedPack)}>Start Demo</button>
            <button onClick={() => demoService.stop('manual')}>Stop Demo</button>
            <div style={{ padding: '4px 8px', borderRadius: 8, background: isDemoRunning() ? '#9f7aea' : '#94a3b8', color: '#fff' }}>
              {isDemoRunning() ? 'Running' : 'Idle'}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() =>
          dispatch({ type: 'SET_ROOM', payload: { roomId: 'offgorstanZone_ancientvault' } })
        }
      >
        Warp: Ancient Vault
      </button>
      <button
        onClick={() =>
          dispatch({ type: 'SET_ROOM', payload: { roomId: 'offmultiverseZone_shatteredrealm' } })
        }
      >
        Warp: Shattered Realm
      </button>
      <button
        onClick={() =>
          dispatch({ type: 'SET_FLAG', payload: { key: 'napkinExtrapolated', value: true } })
        }
      >
        Set Flag: Napkin Extrapolated
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_FLAG', payload: { key: 'sidedWith', value: 'al' } })}
      >
        Set Flag: Sided with Al
      </button>
      <h3>Debug Panel</h3>
      <button onClick={clearFlags}>Clear All Flags</button>
      <h4>Active Flags:</h4>
      <ul>
        {listFlags.length === 0 ? (
          <li>
            <em>No active flags</em>
          </li>
        ) : (
          listFlags.map((flag, i) => <li key={i}>{flag}</li>)
        )}
      </ul>
    </div>
  );
};

export default DebugPanel;
