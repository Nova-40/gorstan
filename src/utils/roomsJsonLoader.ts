
import rooms from '../data/rooms.json';

export type SimpleRoom = {
  id: string;
  title: string;
  zone: 'glitch' | 'nexus' | 'elfhame' | 'maze' | 'default';
  enterText: string[];
  exits: { to: string; label: string }[];
};

type RawSimple = any;

const simpleCache: Record<string, SimpleRoom> = {};
for (const [id, value] of Object.entries(rooms as any)) {
  const raw: any = value;
  const zone = (raw?.zone || 'default') as SimpleRoom['zone'];
  const enterText = Array.isArray(raw?.enterText) ? raw.enterText.map((t: any) => String(t)) : (raw?.enterText ? [String(raw.enterText)] : []);
  const exitsRaw = raw?.exits;
  let exits: { to: string; label: string }[] = [];
  if (Array.isArray(exitsRaw)) {
    exits = exitsRaw.filter((e: any) => e && e.to).map((e: any) => ({ to: String(e.to), label: e.label || String(e.to) }));
  } else if (exitsRaw && typeof exitsRaw === 'object') {
    exits = Object.entries(exitsRaw).map(([label, to]) => ({ to: String(to), label }));
  }
  simpleCache[id] = { id, title: raw.title || id, zone, enterText, exits };
}

export function getSimpleRoom(id: string): SimpleRoom | undefined {
  return simpleCache[id];
}

export function getAllSimpleRooms(): SimpleRoom[] {
  return Object.values(simpleCache);
}
