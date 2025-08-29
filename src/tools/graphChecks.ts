import { Room } from '../types/RoomTypes';

export type RoomGraph = Record<string, Room>;

export function validateGraph(graphs: RoomGraph[]): string[] {
  const errs: string[] = [];
  const all: RoomGraph = Object.assign({}, ...graphs);
  for (const [id, room] of Object.entries(all)) {
    const exits: any = (room as any).exits;
    if (!exits) continue;
    if (Array.isArray(exits)) {
      for (const ex of exits) {
        const to = (ex as any)?.to;
        if (typeof to === 'string' && !all[to]) errs.push(`Exit from ${id} -> ${to} missing`);
      }
    } else if (typeof exits === 'object') {
      for (const val of Object.values(exits)) {
        if (typeof val === 'string') {
          if (!all[val]) errs.push(`Exit from ${id} -> ${val} missing`);
        } else if (val && typeof val === 'object' && 'to' in (val as any)) {
          const to = (val as any).to;
          if (typeof to === 'string' && !all[to]) errs.push(`Exit from ${id} -> ${to} missing`);
        }
      }
    }
  }
  return errs;
}
