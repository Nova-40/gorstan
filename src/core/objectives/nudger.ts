
/**
 * Objectives Nudger — prints a gentle hint every few minutes if the player is idle.
 * Hooked from AppCore on mount.
 */
import { getGameDispatch } from '../../utils/dispatchAccess';
import { getRoom } from '../rooms/roomsLoader';

let _timer: number | null = null;
let _lastActivity = Date.now();

export function registerActivity() { _lastActivity = Date.now(); }

function pickHint(state: any): string | null {
  const r = getRoom(state?.currentRoomId || '');
  const hints = (r?.objectiveHints || []) as string[];
  if (hints && hints.length > 0 && typeof hints[0] === 'string') {return hints[0];}
  return null;
}

export function installObjectivesNudger(getState: () => any, minutes = 3) {
  uninstallObjectivesNudger();
  const dispatch = getGameDispatch();
  _timer = window.setInterval(() => {
    const now = Date.now();
    const idleMinutes = (now - _lastActivity) / 60_000;
    if (idleMinutes >= minutes) {
      const state = getState();
      const hint = pickHint(state);
      if (hint) {
        dispatch?.({ type: 'RECORD_MESSAGE', payload: { id: `nudger-${now}`, text: hint, type: 'hint', timestamp: now } });
        _lastActivity = now;
      }
    }
  }, 60_000);
}

export function uninstallObjectivesNudger(){
  if (_timer !== null) { clearInterval(_timer); _timer = null; }
}
