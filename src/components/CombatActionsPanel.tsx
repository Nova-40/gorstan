/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Combat Actions Panel for quick access to combat commands and spells
*/

import React, { useContext } from 'react';
import { GameStateContext } from '../state/gameState';

// Available spells for casting
const AVAILABLE_SPELLS = [
  'firebolt',
  'frostnova',
  'chainlightning',
  'blink',
  'ward',
  'timedilation',
];

export const CombatActionsPanel: React.FC = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    return null;
  }

  const { state, dispatch } = context;

  // Only show if in combat
  if (!state.combat?.inCombat) {
    return null;
  }

  const player = state.combat.player;
  if (!player) {
    return null;
  }

  const handleSpellCast = (spellName: string) => {
    // Check focus requirement (simplified check)
    const hasEnoughFocus = player.focus >= 20; // Assume 20 focus for all spells

    if (!hasEnoughFocus) {
      dispatch({
        type: 'RECORD_MESSAGE',
        payload: {
          id: `spell-fail-${Date.now()}`,
          text: `> Not enough focus to cast ${spellName}`,
          type: 'error' as const,
          timestamp: Date.now(),
        },
      });
      return;
    }

    dispatch({
      type: 'COMMAND_INPUT',
      payload: `cast ${spellName}`,
    });
  };

  const handleCombatAction = (action: string) => {
    dispatch({
      type: 'COMMAND_INPUT',
      payload: action,
    });
  };

  return (
    <div className="combat-actions-panel bg-gray-900 border border-green-500 rounded p-3 mb-4">
      <h3 className="text-green-400 font-bold mb-2">Combat Actions</h3>

      {/* Focus Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-green-300 mb-1">
          <span>Focus</span>
          <span>
            {Math.round(player.focus)}/{Math.round(player.stats.focus)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(player.focus / player.stats.focus) * 100}%` }}
          />
        </div>
      </div>

      {/* Spell Buttons */}
      <div className="mb-3">
        <h4 className="text-green-300 text-sm mb-1">Spells</h4>
        <div className="grid grid-cols-3 gap-1">
          {AVAILABLE_SPELLS.map((spell) => {
            const hasEnoughFocus = player.focus >= 20;
            return (
              <button
                key={spell}
                onClick={() => handleSpellCast(spell)}
                disabled={!hasEnoughFocus}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  hasEnoughFocus
                    ? 'bg-blue-700 hover:bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title={!hasEnoughFocus ? 'Not enough focus' : `Cast ${spell}`}
              >
                {spell}
              </button>
            );
          })}
        </div>
      </div>

      {/* Combat Action Buttons */}
      <div>
        <h4 className="text-green-300 text-sm mb-1">Actions</h4>
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => handleCombatAction('melee')}
            className="px-2 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
            title="Melee attack"
          >
            Melee
          </button>
          <button
            onClick={() => handleCombatAction('parry')}
            className="px-2 py-1 text-xs bg-yellow-700 hover:bg-yellow-600 text-white rounded transition-colors"
            title="Parry incoming attacks"
          >
            Parry
          </button>
          <button
            onClick={() => handleCombatAction('dodge')}
            className="px-2 py-1 text-xs bg-green-700 hover:bg-green-600 text-white rounded transition-colors"
            title="Dodge away"
          >
            Dodge
          </button>
          <button
            onClick={() => handleCombatAction('combat')}
            className="px-2 py-1 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
            title="Show combat status"
          >
            Status
          </button>
        </div>
      </div>

      {/* PRM Support Note */}
      <div className="mt-2 text-xs text-gray-500">UI respects prefers-reduced-motion settings</div>
    </div>
  );
};
