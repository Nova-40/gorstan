/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code,
  artwork, storyline, or any other part without written permission.

  Full licence terms: see EULA.md in the project root.
*/

// Shared room data types used by the room registry, renderer and command pipeline.
// Keep this file declarative. Do not import Room from itself.

import type { ClickableHotspot } from '../ui/clickableRooms/types';
import type { RoomEffect, RoomItemPlacement } from '../ui/visualRooms/types';

export interface Room {
  id: string;
  title: string;
  description: string | string[];
  image?: string;
  exits?: Partial<RoomExits>;
  flags?: RoomFlags;
  items?: RoomItem[] | string[];
  npcs?: RoomNPC[] | string[];
  trap?: RoomTrap;
  traps?: RoomTrap[];
  music?: string;
  zone?: string;
  ambientAudio?: string;
  consoleIntro?: string[];
  environment?: unknown[];
  interactables?: Record<string, unknown>;
  events?: Record<string, unknown>;

  /** Optional point-and-click/parser bridge data. */
  clickHotspots?: ClickableHotspot[];
  hotspots?: ClickableHotspot[];

  /** Optional visual-only room layers. Missing arrays must be treated as empty. */
  itemPlacements?: RoomItemPlacement[];
  effects?: RoomEffect[];

  [key: string]: unknown;
}

export interface RoomExits {
  north?: string;
  south?: string;
  east?: string;
  west?: string;
  northeast?: string;
  northwest?: string;
  southeast?: string;
  southwest?: string;
  up?: string;
  down?: string;
  in?: string;
  out?: string;
  back?: string;
  jump?: string;
  return?: string;
  portal?: string;
  climb?: string;
  swim?: string;
  coffee?: string;
  chair?: string;
  green?: string;
  church?: string;
  sit?: string;
  [custom: string]: string | undefined;
}

export interface RoomFlags {
  hidden?: boolean;
  locked?: boolean;
  noSave?: boolean;
  cursed?: boolean;
  [customFlag: string]: boolean | undefined;
}

export interface RoomItem {
  id: string;
  name?: string;
  description?: string;
  isKey?: boolean;
  cursed?: boolean;
  oneTimeUse?: boolean;
  itemId?: string;
  [key: string]: unknown;
}

export interface RoomNPC {
  id: string;
  name?: string;
  entryMessage?: string;
  memoryTags?: string[];
  hostileOnInsult?: boolean;
  reactsToItem?: string;
  [key: string]: unknown;
}

export interface RoomTrap {
  id?: string;
  type?: 'instant' | 'puzzle' | 'timed' | string;
  effect?: string;
  condition?: string;
  failureMessage?: string;
  description?: string;
  severity?: string;
  damage?: number;
  triggered?: boolean;
  [key: string]: unknown;
}

export interface MinimalRoomGameState {
  currentRoomId: string;
  stage: string;
  player?: {
    name?: string;
  };
  rooms?: Record<string, Room>;
  roomMap?: Record<string, Room>;
}
