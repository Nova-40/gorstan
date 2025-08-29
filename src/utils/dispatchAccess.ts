
/**
 * Global access to the game dispatch function, for use in non-React service modules.
 * This avoids prop-drilling and keeps a single path for room changes (via MOVE_TO_ROOM).
 */
import type { GameAction } from '../types/GameTypes';

let _dispatch: ((action: GameAction) => void) | null = null;

export function setGameDispatch(fn: (action: GameAction) => void) {
  _dispatch = fn;
}

export function getGameDispatch() {
  return _dispatch;
}
