import { getRoom } from '../core/rooms/roomsLoader';
import { executeEffects } from '../utils/roomActions';
/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Quick actions panel for combat spells and abilities
*/

import React from 'react';
import { useGameState } from '../state/gameState';
import { processCommand } from '../engine/commandParser';
import type { Actor } from '../types/combat';

interface QuickActionsPanelProps {
  isVisible?: boolean;
}

interface SpellButton {
  id: string;
  name: string;
  focusCost: number;
  cooldown: number;
  icon: string;
  description: string;
}

const AVAILABLE_SPELLS: SpellButton[] = [
  {
    id: 'firebolt',
    name: 'Fire Bolt',
    focusCost: 15,
    cooldown: 2000,
    icon: '🔥',
    description: 'Launch a burning projectile that inflicts fire damage over time'
  },
  {
    id: 'frostnova',
    name: 'Frost Nova',
    focusCost: 25,
    cooldown: 4000,
    icon: '❄️',
    description: 'Create an explosion of frost that chills nearby enemies'
  },
  {
    id: 'chainlightning',
    name: 'Chain Lightning',
    focusCost: 30,
    cooldown: 5000,
    icon: '⚡',
    description: 'Shock that arcs between multiple targets'
  },
  {
    id: 'blink',
    name: 'Blink',
    focusCost: 20,
    cooldown: 8000,
    icon: '✨',
    description: 'Instantly teleport with brief invulnerability'
  },
  {
    id: 'ward',
    name: 'Ward',
    focusCost: 35,
    cooldown: 12000,
    icon: '🛡️',
    description: 'Create a protective barrier that absorbs damage'
  },
  {
    id: 'timedilation',
    name: 'Time Dilation',
    focusCost: 50,
    cooldown: 15000,
    icon: '⏱️',
    description: 'Slow down time for precise timing (accessibility safe)'
  }
];

export const CombatActionsPanel: React.FC<QuickActionsPanelProps> = ({ 
  isVisible = true 
}) => {
  const { state, dispatch } = useGameState();

  // Only show during combat
  if (!state.combat?.inCombat || !isVisible) {
    return null;
  }

  const player = state.combat.player as Actor;
  const currentFocus = player?.focus || 0;
  const maxFocus = player?.stats?.focus || 100;

  const handleSpellCast = (spellId: string) => {
    const currentRoom = state.roomMap[state.currentRoomId];
    if (!currentRoom) {return;} // safety
    const result = processCommand({
      input: `cast ${spellId}`,
      currentRoom,
      gameState: state
    });

    // Add messages to history
    result.messages.forEach(message => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `spell-${Date.now()}-${Math.random()}`,
          text: message.text,
          type: 'system',
          timestamp: Date.now()
        }
      });
    });

    // Apply state updates
    if (result.updates) {
      Object.entries(result.updates).forEach(([key, value]) => {
        if (key === 'combat') {
          dispatch({
            type: 'UPDATE_COMBAT_STATE',
            payload: value
          });
        }
      });
    }
  };

  const handleMeleeAttack = () => {
    const currentRoom = state.roomMap[state.currentRoomId];
    if (!currentRoom) {return;}
    const result = processCommand({
      input: 'melee',
      currentRoom,
      gameState: state
    });

    result.messages.forEach(message => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `melee-${Date.now()}-${Math.random()}`,
          text: message.text,
          type: 'system',
          timestamp: Date.now()
        }
      });
    });

    if (result.updates) {
      Object.entries(result.updates).forEach(([key, value]) => {
        if (key === 'combat') {
          dispatch({
            type: 'UPDATE_COMBAT_STATE',
            payload: value
          });
        }
      });
    }
  };

  const handleParry = () => {
    const currentRoom = state.roomMap[state.currentRoomId];
    if (!currentRoom) {return;}
    const result = processCommand({
      input: 'parry',
      currentRoom,
      gameState: state
    });

    result.messages.forEach(message => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `parry-${Date.now()}-${Math.random()}`,
          text: message.text,
          type: 'system',
          timestamp: Date.now()
        }
      });
    });

    if (result.updates) {
      Object.entries(result.updates).forEach(([key, value]) => {
        if (key === 'combat') {
          dispatch({
            type: 'UPDATE_COMBAT_STATE',
            payload: value
          });
        }
      });
    }
  };

  const handleDodge = () => {
    const currentRoom = state.roomMap[state.currentRoomId];
    if (!currentRoom) {return;}
    const result = processCommand({
      input: 'dodge',
      currentRoom,
      gameState: state
    });

    result.messages.forEach(message => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `dodge-${Date.now()}-${Math.random()}`,
          text: message.text,
          type: 'system',
          timestamp: Date.now()
        }
      });
    });

    if (result.updates) {
      Object.entries(result.updates).forEach(([key, value]) => {
        if (key === 'combat') {
          dispatch({
            type: 'UPDATE_COMBAT_STATE',
            payload: value
          });
        }
      });
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 z-50">
      <div className="flex flex-col gap-3">
        {/* Focus bar */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-400 font-medium">Focus:</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-blue-500 transition-all ${prefersReducedMotion ? '' : 'duration-300'}`}
              style={{ width: `${(currentFocus / maxFocus) * 100}%` }}
            />
          </div>
          <span className="text-blue-300 text-xs min-w-[50px]">
            {currentFocus}/{maxFocus}
          </span>
        </div>

        {/* Combat actions */}
        <div className="flex gap-2">
          <button
            onClick={handleMeleeAttack}
            className={`px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors ${prefersReducedMotion ? '' : 'duration-200'}`}
            title="Melee attack"
          >
            ⚔️ Attack
          </button>
          <button
            onClick={handleParry}
            className={`px-3 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded text-sm font-medium transition-colors ${prefersReducedMotion ? '' : 'duration-200'}`}
            title="Parry incoming attacks"
          >
            🛡️ Parry
          </button>
          <button
            onClick={handleDodge}
            className={`px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors ${prefersReducedMotion ? '' : 'duration-200'}`}
            title="Dodge with timing"
          >
            💨 Dodge
          </button>
        </div>

        {/* Spell buttons */}
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_SPELLS.map(spell => {
            const canCast = currentFocus >= spell.focusCost;
            return (
              <button
                key={spell.id}
                onClick={() => canCast && handleSpellCast(spell.id)}
                disabled={!canCast}
                className={`
                  p-2 rounded text-sm font-medium transition-all
                  ${prefersReducedMotion ? '' : 'duration-200'}
                  ${canCast 
                    ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }
                `}
                title={`${spell.description} (${spell.focusCost} focus)`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{spell.icon}</span>
                  <span className="text-xs">{spell.name}</span>
                  <span className="text-xs opacity-70">{spell.focusCost}F</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Help text */}
        <div className="text-xs text-gray-400 text-center">
          Combat Quick Actions • Use console commands for advanced options
        </div>
      </div>
    </div>
  );
};

export default CombatActionsPanel;