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

type RoomHotspot = {
  id?: string;
  label?: string;
  command?: string;
  description?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
};

const toPercentage = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, value));
};

const normalizeHotspot = (hotspot: unknown, index: number): Required<Pick<RoomHotspot, 'id' | 'label' | 'command' | 'x' | 'y' | 'width' | 'height'>> &
  Pick<RoomHotspot, 'description'> => {
  const data = hotspot && typeof hotspot === 'object' ? (hotspot as RoomHotspot) : {};
  const fallbackLabel = data.id ? data.id.replace(/[_-]+/g, ' ') : `Hotspot ${index + 1}`;

  return {
    id: data.id || `room-hotspot-${index}`,
    label: data.label || fallbackLabel,
    command: data.command || '',
    description: data.description,
    x: toPercentage(data.x, 50),
    y: toPercentage(data.y, 50),
    width: toPercentage(data.width, 12),
    height: toPercentage(data.height, 12),
  };
};

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

const RoomRenderer: React.FC = () => {
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
  const roomHotspots = (Array.isArray(roomData.clickHotspots)
    ? roomData.clickHotspots
    : Array.isArray(roomData.hotspots)
      ? roomData.hotspots
      : [])
    .filter((hotspot: RoomHotspot) => hotspot?.visible !== false)
    .map(normalizeHotspot)
    .filter((hotspot: ReturnType<typeof normalizeHotspot>) => hotspot.command.trim().length > 0);
  const itemPlacements = Array.isArray(roomData.itemPlacements) ? roomData.itemPlacements : [];
  const roomEffects = Array.isArray(roomData.effects) ? roomData.effects : [];
  void itemPlacements;
  void roomEffects;
  void looked;

  const handleHotspotCommand = (hotspot: ReturnType<typeof normalizeHotspot>) => {
    dispatch({ type: 'COMMAND_INPUT', payload: hotspot.command });
  };

  // JSX return block or main return
  return (
    <div className="room-container flex flex-col h-full bg-black rounded-lg shadow-inner overflow-hidden border border-green-600">
      {}
      {room.image ? (
        <div className="room-image-wrapper relative h-full w-full overflow-hidden">
          <img
            src={roomImageSrc}
            alt={room.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log(`Failed to load image: ${roomImageSrc}`);
              e.currentTarget.style.display = 'none';
            }}
          />

          {roomHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              aria-label={`${hotspot.label}: ${hotspot.command}`}
              title={hotspot.description || `${hotspot.label} (${hotspot.command})`}
              className="group absolute rounded border border-green-300/50 bg-black/10 text-left text-xs text-green-100 outline-none transition hover:border-green-200 hover:bg-green-500/20 focus:border-green-100 focus:bg-green-500/25 focus:ring-2 focus:ring-green-300/80"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleHotspotCommand(hotspot)}
            >
              <span className="pointer-events-none absolute left-1 top-1 hidden max-w-40 rounded bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-green-100 group-hover:block group-focus:block">
                {hotspot.label}
              </span>
            </button>
          ))}
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
