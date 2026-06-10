import type { Room as LegacyRoom, RoomItem, RoomNPC } from '../types/Room';

export type GameFlagValue = boolean | number | string;
export type GameFlagRecord = Record<string, GameFlagValue>;

export interface VisibilityRule {
  requiredFlags?: string[];
  forbiddenFlags?: string[];
}

export interface Exit extends VisibilityRule {
  direction: string;
  targetRoomId: string;
  label?: string;
  blockedMessage?: string;
}

export interface RoomAction extends VisibilityRule {
  id: string;
  label: string;
  command: string;
}

export interface Hotspot extends VisibilityRule {
  id: string;
  label: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  command?: string;
  cursor?: string;
}

export interface GameObject extends VisibilityRule {
  id: string;
  name: string;
  description?: string;
  aliases: string[];
  verbs?: string[];
  portable?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  aliases: string[];
}

export interface AchievementState {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  hidden?: boolean;
  unlockedAt?: string;
}

export interface RoomEffect {
  id: string;
  kind: 'sprite' | 'ambient' | 'particle' | 'overlay';
  label?: string;
  image?: string;
}

export interface RoomMapMetadata {
  zone?: string;
  coordinates?: { x: number; y: number };
  discovered?: boolean;
}

export interface MapRoomView {
  id: string;
  title: string;
  zone: string;
  isCurrent: boolean;
  isVisited: boolean;
  exits: string[];
  coordinates?: { x: number; y: number };
  hotspots: number;
  actions: number;
}

export interface MapZoneView {
  id: string;
  label: string;
  rooms: MapRoomView[];
  visitedCount: number;
}

export interface SaveState {
  version: number;
  currentRoomId: string;
  inventory: string[];
  flags: GameFlagRecord;
  achievements: AchievementState[];
  timestamp: string;
}

export interface SaveAdapter {
  kind: string;
  save: (slot: number, state: SaveState) => Promise<void> | void;
  load: (slot: number) => Promise<SaveState | null> | SaveState | null;
  list?: () => Promise<number[]> | number[];
}

export interface Room {
  id: string;
  title: string;
  description: string | string[];
  exits: Exit[];
  objects: GameObject[];
  actions: RoomAction[];
  hotspots: Hotspot[];
  effects: RoomEffect[];
  flags?: VisibilityRule;
  map?: RoomMapMetadata;
}

const MOVEMENT_DIRECTIONS = new Set([
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
  'northeast',
  'northwest',
  'southeast',
  'southwest',
  'in',
  'out',
  'back',
]);

const CONTEXTUAL_EXIT_ACTIONS = new Set(['jump', 'sit', 'climb', 'wait', 'listen', 'press']);

function hasRequiredFlags(rule: VisibilityRule | undefined, flags: GameFlagRecord): boolean {
  if (!rule?.requiredFlags?.length) {
    return true;
  }

  return rule.requiredFlags.every((flag) => Boolean(flags[flag]));
}

function hasForbiddenFlags(rule: VisibilityRule | undefined, flags: GameFlagRecord): boolean {
  if (!rule?.forbiddenFlags?.length) {
    return false;
  }

  return rule.forbiddenFlags.some((flag) => Boolean(flags[flag]));
}

export function isRuleVisible(rule: VisibilityRule | undefined, flags: GameFlagRecord): boolean {
  return hasRequiredFlags(rule, flags) && !hasForbiddenFlags(rule, flags);
}

function normaliseObject(item: string | RoomItem): GameObject {
  if (typeof item === 'string') {
    return {
      id: item,
      name: item,
      aliases: [item],
      portable: true,
    };
  }

  return {
    id: item.id || item.name,
    name: item.name,
    description: item.description,
    aliases: [item.name, item.id].filter(Boolean),
    portable: !item.oneTimeUse,
  };
}

function normaliseHotspot(hotspot: Record<string, unknown>, index: number): Hotspot {
  const label =
    typeof hotspot.label === 'string'
      ? hotspot.label
      : typeof hotspot.name === 'string'
        ? hotspot.name
        : `Hotspot ${index + 1}`;
  const command =
    typeof hotspot.command === 'string'
      ? hotspot.command
      : Array.isArray(hotspot.commands) && typeof hotspot.commands[0] === 'string'
        ? hotspot.commands[0]
        : `inspect ${label.toLowerCase()}`;

  return {
    id:
      typeof hotspot.id === 'string'
        ? hotspot.id
        : label.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    label,
    description: typeof hotspot.description === 'string' ? hotspot.description : undefined,
    x: Number(hotspot.x ?? hotspot.left ?? 0),
    y: Number(hotspot.y ?? hotspot.top ?? 0),
    width: Number(hotspot.width ?? hotspot.w ?? 10),
    height: Number(hotspot.height ?? hotspot.h ?? 10),
    command,
    cursor: typeof hotspot.cursor === 'string' ? hotspot.cursor : undefined,
  };
}

export function getRoomFlags(flags?: GameFlagRecord, playerFlags?: GameFlagRecord): GameFlagRecord {
  return {
    ...(flags || {}),
    ...(playerFlags || {}),
  };
}

export function getCanonicalExits(room: LegacyRoom | null | undefined): Exit[] {
  if (!room?.exits) {
    return [];
  }

  return Object.entries(room.exits)
    .filter(([, targetRoomId]) => typeof targetRoomId === 'string' && targetRoomId.length > 0)
    .map(([direction, targetRoomId]) => ({
      direction,
      targetRoomId: targetRoomId as string,
      label: direction,
    }));
}

export function getCanonicalActions(room: LegacyRoom | null | undefined): RoomAction[] {
  if (!room) {
    return [];
  }

  const exitActions = getCanonicalExits(room)
    .filter((exit) => CONTEXTUAL_EXIT_ACTIONS.has(exit.direction))
    .map((exit) => ({
      id: `exit-action-${exit.direction}`,
      label: exit.direction[0].toUpperCase() + exit.direction.slice(1),
      command: exit.direction,
    }));

  const roomActions = Array.isArray((room as Record<string, unknown>).actions)
    ? ((room as Record<string, unknown>).actions as Array<Record<string, unknown>>).map(
        (action, index) => ({
          id: typeof action.id === 'string' ? action.id : `room-action-${index}`,
          label:
            typeof action.label === 'string'
              ? action.label
              : typeof action.command === 'string'
                ? action.command
                : `Action ${index + 1}`,
          command:
            typeof action.command === 'string'
              ? action.command
              : typeof action.label === 'string'
                ? action.label.toLowerCase()
                : 'look',
        }),
      )
    : [];

  return [...exitActions, ...roomActions];
}

export function getCanonicalHotspots(
  room: LegacyRoom | null | undefined,
  flags: GameFlagRecord = {},
): Hotspot[] {
  if (!room) {
    return [];
  }

  const rawHotspots = Array.isArray((room as Record<string, unknown>).clickHotspots)
    ? ((room as Record<string, unknown>).clickHotspots as Array<Record<string, unknown>>)
    : Array.isArray((room as Record<string, unknown>).hotspots)
      ? ((room as Record<string, unknown>).hotspots as Array<Record<string, unknown>>)
      : [];

  return rawHotspots.map(normaliseHotspot).filter((hotspot) => isRuleVisible(hotspot, flags));
}

export function getCanonicalObjects(room: LegacyRoom | null | undefined): GameObject[] {
  if (!room?.items?.length) {
    return [];
  }

  return room.items.map(normaliseObject);
}

export function getCanonicalEffects(room: LegacyRoom | null | undefined): RoomEffect[] {
  const effects = Array.isArray((room as Record<string, unknown> | undefined)?.effects)
    ? (((room as Record<string, unknown>).effects as Array<Record<string, unknown>>) || []).map(
        (effect, index) => ({
          id: typeof effect.id === 'string' ? effect.id : `effect-${index}`,
          kind: ((
            effect.kind === 'sprite' ||
            effect.kind === 'ambient' ||
            effect.kind === 'particle' ||
            effect.kind === 'overlay'
              ? effect.kind
              : 'overlay'
          ) as RoomEffect['kind']),
          label: typeof effect.label === 'string' ? effect.label : undefined,
          image: typeof effect.image === 'string' ? effect.image : undefined,
        }),
      )
    : [];

  return effects;
}

export function getRoomMapMetadata(room: LegacyRoom | null | undefined): RoomMapMetadata | undefined {
  if (!room) {
    return undefined;
  }

  const rawMap = (room as Record<string, unknown>).map;
  if (rawMap && typeof rawMap === 'object') {
    const mapValue = rawMap as Record<string, unknown>;
    return {
      zone:
        typeof mapValue.zone === 'string'
          ? mapValue.zone
          : typeof room.zone === 'string'
            ? room.zone
            : undefined,
      coordinates:
        mapValue.coordinates && typeof mapValue.coordinates === 'object'
          ? {
              x: Number((mapValue.coordinates as Record<string, unknown>).x ?? 0),
              y: Number((mapValue.coordinates as Record<string, unknown>).y ?? 0),
            }
          : undefined,
      discovered: typeof mapValue.discovered === 'boolean' ? mapValue.discovered : undefined,
    };
  }

  if (typeof room.zone === 'string') {
    return { zone: room.zone };
  }

  return undefined;
}

export function toWorldRoom(room: LegacyRoom | null | undefined, flags: GameFlagRecord = {}): Room | null {
  if (!room) {
    return null;
  }

  return {
    id: room.id,
    title: room.title || room.name || room.id,
    description: room.description,
    exits: getCanonicalExits(room).filter((exit) => isRuleVisible(exit, flags)),
    objects: getCanonicalObjects(room),
    actions: getCanonicalActions(room).filter((action) => isRuleVisible(action, flags)),
    hotspots: getCanonicalHotspots(room, flags),
    effects: getCanonicalEffects(room),
    map: getRoomMapMetadata(room),
  };
}

function formatZoneLabel(zoneId: string): string {
  return zoneId
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\bzone\b/i, 'Zone')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function deriveWorldMap(
  roomMap: Record<string, LegacyRoom>,
  currentRoomId: string,
  visitedRoomIds: string[] = [],
): MapZoneView[] {
  const visited = new Set(visitedRoomIds);
  const zones = new Map<string, MapRoomView[]>();

  Object.values(roomMap).forEach((room) => {
    const worldRoom = toWorldRoom(room);
    if (!worldRoom) {
      return;
    }

    const zoneId = worldRoom.map?.zone || 'unknown';
    const zoneRooms = zones.get(zoneId) || [];
    zoneRooms.push({
      id: worldRoom.id,
      title: worldRoom.title,
      zone: zoneId,
      isCurrent: worldRoom.id === currentRoomId,
      isVisited: visited.has(worldRoom.id),
      exits: worldRoom.exits.map((exit) => `${exit.direction} -> ${exit.targetRoomId}`),
      coordinates: worldRoom.map?.coordinates,
      hotspots: worldRoom.hotspots.length,
      actions: worldRoom.actions.length,
    });
    zones.set(zoneId, zoneRooms);
  });

  return [...zones.entries()]
    .sort((left, right) => formatZoneLabel(left[0]).localeCompare(formatZoneLabel(right[0])))
    .map(([zoneId, rooms]) => ({
      id: zoneId,
      label: formatZoneLabel(zoneId),
      visitedCount: rooms.filter((room) => room.isVisited).length,
      rooms: rooms.sort((left, right) => left.title.localeCompare(right.title)),
    }));
}

export function deriveCompassOptions(room: LegacyRoom | null | undefined): {
  movement: Exit[];
  actions: RoomAction[];
} {
  const exits = getCanonicalExits(room);

  return {
    movement: exits.filter((exit) => MOVEMENT_DIRECTIONS.has(exit.direction)),
    actions: getCanonicalActions(room),
  };
}

export function getUseTargetLabels(room: LegacyRoom | null | undefined): string[] {
  const objects = getCanonicalObjects(room).map((item) => item.name);
  const hotspots = getCanonicalHotspots(room).map((hotspot) => hotspot.label);
  return [...new Set([...objects, ...hotspots])];
}

export function serializeSaveState(state: {
  currentRoomId: string;
  flags?: GameFlagRecord;
  player?: { inventory?: string[] };
  metadata?: { achievements?: string[] };
}): SaveState {
  const achievements = (state.metadata?.achievements || []).map((achievementId) => ({
    id: achievementId,
    title: achievementId,
    description: achievementId,
    unlocked: true,
  }));

  return {
    version: 1,
    currentRoomId: state.currentRoomId,
    inventory: state.player?.inventory || [],
    flags: state.flags || {},
    achievements,
    timestamp: new Date().toISOString(),
  };
}

export function getRoomNpcNames(room: LegacyRoom | null | undefined): string[] {
  if (!room?.npcs?.length) {
    return [];
  }

  return room.npcs.map((npc) => (typeof npc === 'string' ? npc : (npc as RoomNPC).name));
}