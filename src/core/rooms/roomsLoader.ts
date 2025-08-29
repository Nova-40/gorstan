
import type { RoomDef } from './RoomModel';
import rooms from '../../data/rooms.json';
// fallback

const jsonRooms = rooms as Record<string, RoomDef>;

export function getRoom(id: string): RoomDef | null {
  const r = jsonRooms[id];
  if (r) return r;
  return r || null;
}

export function getAllRooms(): RoomDef[] {
  return Object.values(jsonRooms);
}
