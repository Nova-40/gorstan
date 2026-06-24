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

type VisualSceneMetadata = {
  id?: string;
  ambient?: 'cafe-warmth' | 'apartment-light' | string;
  testId?: string;
};

type NormalizedRoomHotspot = {
  id: string;
  label: string;
  command: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description?: string;
};

const toPercentage = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, value));
};

const normalizeHotspot = (hotspot: unknown, index: number): NormalizedRoomHotspot => {
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

const visualSceneCss = `
  .visual-scene-ambient {
    pointer-events: none;
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .visual-scene-ambient::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 72% 24%, rgba(255, 196, 120, 0.28), transparent 24%),
      linear-gradient(115deg, transparent 0%, rgba(255, 224, 170, 0.16) 44%, transparent 64%);
    mix-blend-mode: screen;
    opacity: 0.72;
  }

  .visual-scene-ambient--apartment-light::before {
    background:
      radial-gradient(circle at 76% 18%, rgba(210, 235, 255, 0.22), transparent 26%),
      linear-gradient(108deg, transparent 0%, rgba(245, 250, 255, 0.14) 38%, transparent 66%);
    opacity: 0.62;
  }

  .visual-scene-ambient::after {
    content: '';
    position: absolute;
    left: 55%;
    top: 48%;
    width: 18%;
    height: 28%;
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(255,255,255,0.25), transparent 62%);
    filter: blur(13px);
    animation: visual-scene-cafe-steam 4.8s ease-in-out infinite;
  }

  @keyframes visual-scene-cafe-steam {
    0% { opacity: 0.08; transform: translate3d(-10%, 14%, 0) scale(0.82); }
    50% { opacity: 0.24; transform: translate3d(0, -8%, 0) scale(1.04); }
    100% { opacity: 0.08; transform: translate3d(10%, -26%, 0) scale(1.2); }
  }

  @media (prefers-reduced-motion: reduce) {
    .visual-scene-ambient::after {
      animation: none;
      opacity: 0.12;
      transform: translate3d(0, 0, 0);
    }
  }
`;

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
  const visualScene = roomData.visualScene as VisualSceneMetadata | undefined;
  const visualSceneId = visualScene?.id;
  const visualSceneAmbient = visualScene?.ambient;
  const visualSceneTestId = visualScene?.testId || (visualSceneId ? `${visualSceneId}-ambient` : undefined);
  const roomImageSrc = room.image
    ? room.image.startsWith('/')
      ? room.image
      : room.image.includes('/')
        ? `/images/${room.image}`
        : `/images/${room.image}`
    : '';
  const rawRoomHotspots = Array.isArray(roomData.clickHotspots)
    ? roomData.clickHotspots
    : Array.isArray(roomData.hotspots)
      ? roomData.hotspots
      : [];
  const roomHotspots = rawRoomHotspots
    .filter((hotspot: RoomHotspot) => hotspot?.visible !== false)
    .map(normalizeHotspot)
    .filter((hotspot: NormalizedRoomHotspot) => hotspot.command.trim().length > 0);
  const itemPlacements = Array.isArray(roomData.itemPlacements) ? roomData.itemPlacements : [];
  const roomEffects = Array.isArray(roomData.effects) ? roomData.effects : [];
  void itemPlacements;
  void roomEffects;

  const handleHotspotCommand = (hotspot: NormalizedRoomHotspot) => {
    dispatch({ type: 'COMMAND_INPUT', payload: hotspot.command });
  };

  const handleHotspotKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    hotspot: NormalizedRoomHotspot
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHotspotCommand(hotspot);
    }
  };

  // JSX return block or main return
  return (
    <div className="room-container flex flex-col h-full bg-black rounded-lg shadow-inner overflow-hidden border border-green-600">
      {visualSceneAmbient && <style>{visualSceneCss}</style>}
      {room.image ? (
        <div
          className="room-image-wrapper relative h-full w-full overflow-hidden"
          data-visual-scene={visualSceneId}
        >
          <img
            src={roomImageSrc}
            alt={room.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log(`Failed to load image: ${roomImageSrc}`);
              e.currentTarget.style.display = 'none';
            }}
          />

          {visualSceneAmbient && (
            <div
              className={`visual-scene-ambient visual-scene-ambient--${visualSceneAmbient}`}
              data-testid={visualSceneTestId}
              aria-hidden="true"
            />
          )}

          {roomHotspots.map((hotspot: any) => (
            <button
              key={hotspot.id}
              type="button"
              aria-label={`${hotspot.label}: ${hotspot.command}`}
              title={hotspot.description || `${hotspot.label} (${hotspot.command})`}
              data-hotspot-id={hotspot.id}
              data-command={hotspot.command}
              className="group absolute rounded-lg border border-green-200/45 bg-black/15 text-left text-xs text-green-100 outline-none ring-1 ring-black/20 backdrop-blur-[1px] transition hover:border-green-100 hover:bg-green-400/20 hover:shadow-[0_0_18px_rgba(134,239,172,0.28)] focus:border-green-100 focus:bg-green-400/25 focus:ring-2 focus:ring-green-200/90 focus:shadow-[0_0_22px_rgba(187,247,208,0.35)]"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleHotspotCommand(hotspot)}
              onKeyDown={(event) => handleHotspotKeyDown(event, hotspot)}
            >
              <span className="pointer-events-none absolute left-1 top-1 hidden max-w-44 rounded bg-black/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-green-50 shadow-lg group-hover:block group-focus:block">
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

      {room.music && (
        <audio autoPlay loop>
          <source src={room.music} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};

export default RoomRenderer;
