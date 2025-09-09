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

// src/components/NPCBanterToggle.tsx
// NPC Banter Toggle Component for Inter-NPC Conversations
// Gorstan Game Beta 1

import React, { useState } from 'react';
import { useGameState } from '../state/gameState';

const NPCBanterToggle: React.FC = () => {
  const { state, dispatch } = useGameState();
  const [hovered, setHovered] = useState(false);

  const overhearEnabled = state.overhearNPCBanter ?? true;

  const toggleBanter = () => {
    const newState = !overhearEnabled;
    dispatch({
      type: 'SET_OVERHEAR',
      payload: newState,
    });
  };

  return (
    <button
      onClick={toggleBanter}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        px-3 py-2 rounded-lg border transition-all duration-200
        ${
          overhearEnabled
            ? 'bg-blue-600 border-blue-500 text-white'
            : 'bg-gray-600 border-gray-500 text-gray-300'
        }
        ${hovered ? 'shadow-lg transform scale-105' : ''}
        hover:border-opacity-80
      `}
      title={overhearEnabled ? 'Hide NPC conversations' : 'Show NPC conversations'}
    >
      {overhearEnabled ? '💬' : '🤐'}
      <span className="ml-2 text-sm">{overhearEnabled ? 'NPC Chatter On' : 'NPC Chatter Off'}</span>
    </button>
  );
};

export default NPCBanterToggle;
