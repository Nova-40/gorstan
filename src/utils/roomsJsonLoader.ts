
import rooms from '../data/rooms.json';

export type SimpleRoom = {
  id: string;
  title: string;
  zone: 'glitch' | 'nexus' | 'elfhame' | 'maze' | 'default';
  enterText: string[];
  exits: { to: string; label: string }[];
};

export function getSimpleRoom(id: string): SimpleRoom | undefined {
  const r = (rooms as Record<string, SimpleRoom>)[id];
  return r;
}

export function getAllSimpleRooms(): SimpleRoom[] {
  return Object.values(rooms as Record<string, SimpleRoom>);
}
