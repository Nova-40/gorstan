
/**
 * Parse and execute room action effects.
 * Supported effects:
 *  - flag:set:<key>
 *  - flag:clear:<key>
 *  - item:add:<id>[:qty]
 *  - item:remove:<id>[:qty]
 *  - teleport:to:<roomId>
 *  - lore:unlock:<id>
 *  - say:<text>
 */
import { getGameDispatch } from './dispatchAccess';
import { teleportToRoom } from '../engine/roomRouter';

export async function executeEffects(effects: string[]) {
  const dispatch = getGameDispatch?.();
  for (const e of effects) {
    const [head, op, ...rest] = e.split(':');
    if (!head) continue;
    try {
      switch (head) {
        case 'flag': {
          const key = rest.join(':'); // after op
          if (op === 'set') dispatch?.({ type: 'SET_FLAG', payload: { key, value: true } });
          if (op === 'clear') dispatch?.({ type: 'SET_FLAG', payload: { key, value: false } });
          break;
        }
        case 'item': {
          const [id, qtyStr] = rest;
          const qty = Math.max(1, parseInt(qtyStr || '1', 10) || 1);
          if (op === 'add') dispatch?.({ type: 'ADD_ITEM', payload: { id, qty } });
          if (op === 'remove') dispatch?.({ type: 'REMOVE_ITEM', payload: { id, qty } });
          break;
        }
        case 'teleport': {
          const [dest] = rest;
          if (op === 'to' && dest) await teleportToRoom(dest);
          break;
        }
        case 'lore': {
          const [id] = rest;
          if (op === 'unlock' && id) dispatch?.({ type: 'UNLOCK_LORE', payload: id });
          break;
        }
        case 'say': {
          const text = [op, ...rest].join(':');
          dispatch?.({ type: 'RECORD_MESSAGE', payload: { text, type: 'system', timestamp: Date.now() } });
          break;
        }
      }
    } catch (err) {
      dispatch?.({ type: 'RECORD_MESSAGE', payload: { text: `Action failed: ${String(err)}`, type: 'error', timestamp: Date.now() } });
    }
  }
}
