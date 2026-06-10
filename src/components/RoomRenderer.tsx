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
// Renders room descriptions and image logic.

import React, { useState, useEffect } from 'react';

import { Bone, Fish, Bot, UserCircle, ChefHat, Shield } from 'lucide-react';

import { RoomNPC } from '../types/Room';

import { getCanonicalEffects, getCanonicalHotspots, getRoomFlags } from '../engine/worldModel';
import { useGameState } from '../state/gameState';

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
  const displayName = npc.name ?? npc.id ?? 'Unknown visitor';
  const Icon = npcIconMap[displayName.toLowerCase()] || UserCircle;
  // Variable declaration
  const description = npc.entryMessage || `${displayName} is here.`;
  // JSX return block or main return
  return (
    <div className="npc-item flex items-center space-x-2" title={description}>
      <Icon size={20} className="text-green-400" />
      <span className="npc-name font-medium text-green-300">{displayName}</span>
    </div>
  );
};

interface RoomRendererProps {
  onIssueCommand?: (command: string) => void;
  showHotspots?: boolean;
}

const RoomRenderer: React.FC<RoomRendererProps> = ({ onIssueCommand, showHotspots = false }) => {
  const { state, dispatch } = useGameState();
  // Variable declaration
  const room = state.roomMap?.[state.currentRoomId];
  // React state declaration
  const [looked, setLooked] = useState(false);
  const [lastRoomId, setLastRoomId] = useState<string | null>(null);

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

      // Variable declaration
      const roomData = room as any;
      if (Array.isArray(roomData.traps) && roomData.traps.length > 0 && !state.player?.flags?.trapsDisabled) {
        // Variable declaration
        const activeTrap = roomData.traps.find((trap: any) => !trap.triggered);
        if (activeTrap) {
          dispatch({ type: 'COMMAND_INPUT', payload: 'trigger trap' });
        }
      }

      // Variable declaration
      const entryTimestamp = Date.now();
      entryMessages.forEach((msg, index) => {
        // Variable declaration
        const message = {
          id: `room-entry-${room.id}-${entryTimestamp}-${index}`,
          text: msg.text,
          type: msg.type as any,
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

  const roomData = room as any;
  const roomImageSrc = room.image
    ? room.image.startsWith('/')
      ? room.image
      : room.image.includes('/')
        ? `/images/${room.image}`
        : `/images/${room.image}`
    : '';
  const roomHotspots = getCanonicalHotspots(
    room,
    getRoomFlags(state.flags as Record<string, string | number | boolean>, state.player?.flags),
  );
  const itemPlacements = Array.isArray(roomData.itemPlacements) ? roomData.itemPlacements : [];
  const roomEffects = getCanonicalEffects(room);
  void itemPlacements;

  // JSX return block or main return
  return (
    <div className="room-container flex flex-col h-full bg-black rounded-lg shadow-inner overflow-hidden border border-green-600">
      {}
      {room.image ? (
        <div className="room-image-wrapper h-full w-full overflow-hidden relative">
          <img
            src={roomImageSrc}
            alt={room.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log(`Failed to load image: ${roomImageSrc}`);
              e.currentTarget.style.display = 'none';
            }}
          />
          {roomEffects.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {roomEffects.map((effect) => (
                <div key={effect.id} className="absolute top-2 right-2 bg-black/50 text-xs text-green-200 px-2 py-1 rounded">
                  {effect.label || effect.kind}
                </div>
              ))}
            </div>
          )}
          {roomHotspots.length > 0 && (
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {roomHotspots.map((hotspot) => (
                <g key={hotspot.id}>
                  <title>{hotspot.description || hotspot.label}</title>
                  <rect
                    x={hotspot.x}
                    y={hotspot.y}
                    width={hotspot.width}
                    height={hotspot.height}
                    rx="1"
                    fill={showHotspots ? 'rgba(34, 197, 94, 0.15)' : 'transparent'}
                    stroke={showHotspots ? 'rgba(74, 222, 128, 0.95)' : 'transparent'}
                    strokeWidth={showHotspots ? 0.6 : 0}
                    className="cursor-pointer"
                    onClick={() =>
                      onIssueCommand?.(hotspot.command || `inspect ${hotspot.label.toLowerCase()}`)
                    }
                  />
                </g>
              ))}
            </svg>
          )}
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
    </div>
  );
};

export default RoomRenderer;
