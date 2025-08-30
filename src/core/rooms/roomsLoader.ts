
import type { RoomDef, RoomExit, Zone, TeleportStyle } from './RoomModel';
import rooms from '../../data/rooms.json';

// Raw room JSON can have exits either as an object mapping label->roomId or an array of {to,label}
type RawRoom = {
  id?: string;
  title?: string;
  zone?: string;
  enterText?: any;
  exits?: Record<string, string> | { to: string; label?: string }[];
  teleportStyle?: TeleportStyle;
  unlocksLore?: string[];
  objectiveHints?: string[];
  ambient?: string;
  actions?: { id: string; label: string; effects: string[] }[];
  [k: string]: any; // tolerate extra fields
};

function normalizeExits(exits: RawRoom['exits']): RoomExit[] {
  if (Array.isArray(exits)) {
    return exits.filter(e => e && e.to).map(e => ({ to: String(e.to), label: e.label || String(e.to) }));
  }
  if (exits && typeof exits === 'object') {
    return Object.entries(exits).map(([label, to]) => ({ to: String(to), label }));
  }
  return [];
}

function normalizeEnterText(val: any): string[] {
  if (Array.isArray(val)) return val.map(v => String(v));
  if (val == null) return [];
  return [String(val)];
}

const normalizedRooms: Record<string, RoomDef> = {};
for (const [id, raw] of Object.entries(rooms as Record<string, RawRoom>)) {
  const rr = raw || {} as RawRoom;
  const zone = (rr.zone as Zone) || 'default';
  normalizedRooms[id] = {
    id: rr.id || id,
    title: rr.title || id,
    zone,
    enterText: normalizeEnterText(rr.enterText),
    exits: normalizeExits(rr.exits),
    teleportStyle: rr.teleportStyle,
    unlocksLore: rr.unlocksLore,
    objectiveHints: rr.objectiveHints,
    ambient: rr.ambient,
    actions: rr.actions
  };
}

export function getRoom(id: string): RoomDef | null {
  return normalizedRooms[id] || null;
}

export function getAllRooms(): RoomDef[] {
  return Object.values(normalizedRooms);
}
