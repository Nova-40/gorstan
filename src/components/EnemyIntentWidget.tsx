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

/*
  EnemyIntentWidget – shows upcoming enemy actions and simple ETAs
*/

import React, { useEffect, useState } from 'react';
import { CombatSystem } from '../combat/CombatSystem';
import { CombatState } from '../types/enums';

interface IntentInfo {
  id: string;
  name: string;
  state: CombatState;
  nextActionId?: string;
  etaMs?: number;
}

function formatMs(ms?: number): string {
  if (ms == null) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export const EnemyIntentWidget: React.FC<{ pollMs?: number }> = ({ pollMs = 200 }) => {
  const [intents, setIntents] = useState<IntentInfo[]>([]);

  // Poll the combat system for lightweight intent updates while in combat
  useEffect(() => {
    const cs = CombatSystem.getInstance();
  let raf: number | null = null;
    let timer: number | null = null;

    const tick = () => {
      const state = cs.getState();
      if (!state.inCombat) {
        setIntents([]);
        return;
      }
      const next = cs.getEnemyIntents() as IntentInfo[];
      setIntents(next);
    };

    // Use interval for stability; avoid spamming renders
    timer = window.setInterval(tick, pollMs);
    tick();

    return () => {
  if (timer) clearInterval(timer);
  if (raf != null) cancelAnimationFrame(raf);
    };
  }, [pollMs]);

  const hasData = intents.length > 0 && intents.some(i => i.nextActionId || i.state !== CombatState.Idle);
  if (!hasData) return null;

  return (
    <div className="mt-2 text-xs text-green-300" aria-live="polite" aria-label="Enemy intentions">
      <div className="grid grid-cols-1 gap-1">
        {intents.map((e) => (
          <div key={e.id} className="flex items-center justify-between bg-gray-900/60 border border-green-700/40 rounded px-2 py-1">
            <div className="flex items-center gap-2">
              <span aria-hidden>👁️</span>
              <span className="text-green-200">
                {e.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-300">
              {e.nextActionId ? (
                <>
                  <span className="uppercase tracking-wide">{e.nextActionId.replace(/_/g, ' ')}</span>
                  {typeof e.etaMs === 'number' && (
                    <span className="px-1.5 py-0.5 rounded bg-green-900/40 border border-green-700/50" title="Time until attack is active">
                      {formatMs(e.etaMs)}
                    </span>
                  )}
                </>
              ) : (
                <span className="italic text-green-400/80">gauging...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnemyIntentWidget;
