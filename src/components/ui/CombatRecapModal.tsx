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
  Post-combat recap modal using RetroModal styling
*/

import React, { useEffect, useRef } from 'react';
import { RetroModal } from './RetroModal';

export interface CombatRecapData {
  outcome: 'victory' | 'defeat';
  durationMs: number;
  stats: {
    actions: number;
    damageDealt: number;
    damageTaken: number;
    parryAttempts: number;
    parrySuccesses: number;
  };
  enemies: Array<{ id: string; name: string; hp: number; maxHP?: number }>;
  xpAward: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: CombatRecapData;
  autoCloseMs?: number; // optional auto-close for rapid loops
}

export const CombatRecapModal: React.FC<Props> = ({ isOpen, onClose, data, autoCloseMs }) => {
  const durationSec = Math.max(1, Math.round(data.durationMs / 1000));
  const parryRate = data.stats.parryAttempts > 0 
    ? Math.round((data.stats.parrySuccesses / data.stats.parryAttempts) * 100)
    : 0;

  const tip = data.outcome === 'victory'
    ? (parryRate > 0
        ? 'Nice parries. Try a riposte after a perfect dodge for big damage.'
        : 'Try timing a parry to open a riposte window for bonus damage.')
    : 'Dodges grant riposte windows. Watch for the cue, then strike.';

  // Accessibility: manage focus on open and keyboard shortcuts
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    let autoTimer: number | undefined;
    if (autoCloseMs && autoCloseMs > 0) {
      autoTimer = window.setTimeout(() => onClose(), autoCloseMs) as unknown as number;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      if (autoTimer) window.clearTimeout(autoTimer);
    };
  }, [isOpen, onClose, autoCloseMs]);

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title={data.outcome === 'victory' ? 'Combat Victory' : 'Combat Defeat'}
      subtitle={`+${data.xpAward} Quantum XP`}
    >
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-gray-800/60 rounded">
            <div className="text-gray-400">Duration</div>
            <div className="text-green-300 font-mono">{durationSec}s</div>
          </div>
          <div className="p-2 bg-gray-800/60 rounded">
            <div className="text-gray-400">Actions</div>
            <div className="text-green-300 font-mono">{data.stats.actions}</div>
          </div>
          <div className="p-2 bg-gray-800/60 rounded">
            <div className="text-gray-400">Damage Dealt</div>
            <div className="text-green-300 font-mono">{data.stats.damageDealt}</div>
          </div>
          <div className="p-2 bg-gray-800/60 rounded">
            <div className="text-gray-400">Damage Taken</div>
            <div className="text-green-300 font-mono">{data.stats.damageTaken}</div>
          </div>
          <div className="p-2 bg-gray-800/60 rounded col-span-2">
            <div className="text-gray-400">Parry Success</div>
            <div className="text-green-300 font-mono">{data.stats.parrySuccesses}/{data.stats.parryAttempts} ({parryRate}%)</div>
          </div>
        </div>

        <div>
          <div className="text-gray-400 mb-1">Enemies</div>
          <ul className="list-disc pl-5 text-gray-200">
            {data.enemies.map(e => (
              <li key={e.id}>
                {e.name} – {Math.max(0, e.hp)}{typeof e.maxHP === 'number' ? `/${e.maxHP}` : ''} HP
              </li>
            ))}
          </ul>
        </div>

        <div className="p-2 bg-indigo-900/30 border border-indigo-700 rounded text-indigo-200">
          {tip}
        </div>

    <div className="flex justify-end">
          <button
      onClick={onClose}
      ref={closeBtnRef}
      className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded"
          >
            Continue
          </button>
        </div>
      </div>
    </RetroModal>
  );
};

export default CombatRecapModal;
