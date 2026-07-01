import type { Room } from '../../types/Room';
import { parseSaveSlotId } from '../../services/SaveManager';
import { safeGetStorageItem } from '../../utils/safeStorage';

export type SaveSlotView = {
  id: number;
  name: string;
  playerName: string;
  currentRoom: string;
  timestamp: number;
  score: number;
  playTime: number;
};

export const formatExitLabel = (exitKey: string): string => {
  if (!exitKey) {
    return 'Exit';
  }

  return exitKey
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const commandForExit = (exitKey: string): string => {
  const normalizedExit = exitKey.toLowerCase().trim();
  return `go ${normalizedExit}`;
};

export function readLegacySaveSlots(): SaveSlotView[] {
  const saved = safeGetStorageItem('gorstan_save_slots');
  if (!saved) {
    return [];
  }

  try {
    const parsedSlots = JSON.parse(saved);
    if (!Array.isArray(parsedSlots)) {
      return [];
    }

    return parsedSlots
      .map((slot) => {
        const slotId = parseSaveSlotId(slot?.id);
        if (slotId === null) {
          return null;
        }

        return {
          id: slotId,
          name:
            typeof slot?.name === 'string' && slot.name.trim().length > 0
              ? slot.name
              : `Slot ${slotId + 1}`,
          playerName:
            typeof slot?.playerName === 'string' && slot.playerName.trim().length > 0
              ? slot.playerName
              : 'Player',
          currentRoom:
            typeof slot?.currentRoom === 'string' && slot.currentRoom.trim().length > 0
              ? slot.currentRoom
              : 'Unknown',
          timestamp: typeof slot?.timestamp === 'number' ? slot.timestamp : 0,
          score: typeof slot?.score === 'number' ? slot.score : 0,
          playTime: typeof slot?.playTime === 'number' ? slot.playTime : 0,
        };
      })
      .filter((slot): slot is SaveSlotView => slot !== null);
  } catch (error) {
    console.warn('Ignored malformed legacy save slot list:', error);
    return [];
  }
}

export function recordAppMessage(
  dispatch: (action: any) => void,
  text: string,
  type: 'system' | 'error' | 'warning' | 'info' = 'system',
): void {
  dispatch({
    type: 'RECORD_MESSAGE',
    payload: {
      id: `appcore-${Date.now()}`,
      text,
      type,
      timestamp: Date.now(),
    },
  });
}

export function resolveRoomId(
  roomMap: Record<string, Room>,
  candidate: unknown,
  fallbackRoomId = 'controlnexus',
): string {
  if (typeof candidate === 'string' && candidate && roomMap[candidate]) {
    return candidate;
  }

  if (roomMap[fallbackRoomId]) {
    return fallbackRoomId;
  }

  return Object.keys(roomMap)[0] || fallbackRoomId;
}
