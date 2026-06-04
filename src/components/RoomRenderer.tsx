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
// Renders room descriptions, image logic, and optional clickable room hotspots.

import React, { useState, useEffect, useCallback } from 'react';

import { Bone, Fish, Bot, UserCircle, ChefHat, Shield } from 'lucide-react';

import { RoomNPC } from '../types/Room';

import { useGameState } from '../state/gameState';
import SmartImage from './media/SmartImage';
import SmartVideo from './media/SmartVideo';
import MicroObjectives from './MicroObjectives';
import ClickableRoomOverlay from './ClickableRoomOverlay';
import type { ClickableHotspot } from '../ui/clickableRooms/types';

const npcIconMap: Record<string, React.ElementType> = {
  'mr wendell': Bone,
  dominic: Fish,
  ayla: Bot,
  polly: UserCircle,
  chef: ChefHat,
  albie: Shield,
};

interface NpcDisplayProps {
  npc: RoomNPC;
}

const NpcDisplay: React.FC<NpcDisplayProps> = ({ npc }) => {
  // Variable declaration
  const Icon = npcIconMap[npc.name.toLowerCase()] || UserCircle;
  // Variable declaration
  const description = npc.entryMessage || `${npc.name} is here.`;
  // JSX return block or main return
  return (
    <div className="npc-item flex items-center space-x-2" title={description}>
      <Icon size={20} className="text-green-400" />
      <span className="npc-name font-medium text-green-300">{npc.name}</span>
    </div>
  );
};

const RoomRenderer: React.FC = () => {
  const { state, dispatch } = useGameState();
  // Variable declaration
  const room = state.roomMap?.[state.currentRoomId];
  // React state declaration
  const [looked, setLooked] = useState(false);
  const [lastRoomId, setLastRoomId] = useState<string | null>(null);

  const handleClickableRoomCommand = useCallback(
    (command: string): void => {
      dispatch({ type: 'COMMAND_INPUT', payload: command });
    },
    [dispatch],
  );

  // React effect hook
  useEffect(() => {
    setLooked(false);

    if (room && room.id !== lastRoomId) {
      setLastRoomId(room.id);

      // Variable declaration
      const descriptionLines = Array.isArray(room.description)
        ? room.description
        : [room.description ?? 'You see nothing of note.'];

      // Variable declaration
      const entryMessages = [
        { text: `--- ${room.title} ---`, type: 'narrative' },
        ...descriptionLines.map((line) => ({ text: line, type: 'narrative' })),
      ];

      if (room.consoleIntro && room.consoleIntro.length > 0) {
        // Variable declaration
        const interpolateText = (text: string): string => {
          return text.replace(/\{\{PLAYER_NAME\}\}/g, state.player?.name || 'Player');
        };

        // Variable declaration
        const consoleIntroMessages = [
          { text: '', type: 'system' },
          { text: `=== ${room.title.toUpperCase()} ===`, type: 'system' },
          ...room.consoleIntro.map((line) => ({ text: interpolateText(line), type: 'system' })),
          { text: '', type: 'system' },
        ];
        entryMessages.push(...consoleIntroMessages);
      }

      // Handle traps if present
      if (!state.player?.flags?.trapsDisabled && Array.isArray((room as unknown as { traps?: unknown }).traps)) {
        const trapsRaw = (room as unknown as { traps?: unknown }).traps as unknown[] | undefined;
        const traps = (trapsRaw || []).filter((t): t is { id?: string; triggered?: boolean } =>
          typeof t === 'object' && t !== null && ('id' in (t as Record<string, unknown>) || 'triggered' in (t as Record<string, unknown>)),
        );
        const activeTrap = traps.find((t) => !t.triggered);
        if (activeTrap) {
          dispatch({ type: 'TRIGGER_TRAP', payload: activeTrap });
        }
      }

      // Variable declaration
      const entryTimestamp = Date.now();
      entryMessages.forEach((msg, index) => {
        // Variable declaration
        const message = {
          id: `room-entry-${room.id}-${entryTimestamp}-${index}`,
          text: msg.text,
          type: (msg.type as 'narrative' | 'system' | 'action' | 'error') || 'system',
          timestamp: entryTimestamp + index,
        };
        dispatch({ type: 'RECORD_MESSAGE', payload: message });
      });
    }
  }, [room?.id, lastRoomId, room, dispatch]);

  if (!room || !room.id) {
    // JSX return block or main return
    return (
      <div className="room-container p-4 text-center text-red-500">
        Error: No room data available.
        <div className="text-sm mt-2 text-gray-600">
          Current Room ID: {state.currentRoomId || 'undefined'}
        </div>
      </div>
    );
  }

  // Variable declaration
  const hasExtraDetails = room.items && room.items.length > 0;
  const roomHotspots = ((room as any).clickHotspots || (room as any).hotspots || []) as ClickableHotspot[];
  const showHotspotDebug = Boolean(state.settings?.debugMode || state.flags?.showClickableHotspots);

  // JSX return block or main return
  return (
    <div className="room-container flex flex-col h-full bg-black rounded-lg shadow-inner overflow-hidden border border-green-600">
      {}
      {room.image ? (
        <div className="room-image-wrapper h-full w-full overflow-hidden clickable-room-wrapper">
          {room.image.toLowerCase().endsWith('.gif') ? (
            <SmartVideo src={`/images/${room.image}`} className="w-full h-full object-cover" />
          ) : (
            <SmartImage src={`/images/${room.image}`} alt={room.title} className="w-full h-full object-cover" sizes="100vw" />
          )}
          <ClickableRoomOverlay
            hotspots={roomHotspots}
            state={state}
            onCommand={handleClickableRoomCommand}
            debug={showHotspotDebug}
          />
        </div>
      ) : (
        <div className="room-no-image h-full w-full flex items-center justify-center bg-gray-900 text-green-600">
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-400 mb-2">{room.title}</h2>
            <p className="text-sm">No image available</p>
          </div>
        </div>
      )}

      {}
      {room.music && (
        <audio autoPlay loop>
          <source src={room.music} type="audio/mpeg" />
        </audio>
      )}
      {/* Micro-objectives overlay */}
      <MicroObjectives />
    </div>
  );
};

export default RoomRenderer;
