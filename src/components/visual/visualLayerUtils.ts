/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Helper functions shared by optional room visual layers.
*/

import type { CoordinateUnit, VisibilityGate } from '../../ui/visualRooms/types';

export function hasInventoryItem(state: any, itemId: string): boolean {
  const playerInventory = state?.player?.inventory;
  const rootInventory = state?.inventory;

  return Boolean(
    (Array.isArray(playerInventory) && playerInventory.includes(itemId)) ||
      (Array.isArray(rootInventory) && rootInventory.includes(itemId)),
  );
}

export function hasFlag(state: any, flag: string): boolean {
  return Boolean(state?.flags?.[flag] || state?.player?.flags?.[flag]);
}

export function isVisibleByGate(gate: VisibilityGate, state: any): boolean {
  if (gate.visible && !gate.visible(state)) return false;
  if (gate.visibleFlag && !hasFlag(state, gate.visibleFlag)) return false;
  if (gate.requiredFlag && !hasFlag(state, gate.requiredFlag)) return false;
  if (gate.hiddenFlag && hasFlag(state, gate.hiddenFlag)) return false;
  if (gate.requiredInventoryItem && !hasInventoryItem(state, gate.requiredInventoryItem)) return false;
  return true;
}

export function isItemInCurrentRoom(state: any, itemId: string, roomId: string): boolean {
  if (hasInventoryItem(state, itemId)) return false;

  const room = state?.roomMap?.[roomId];
  const roomItems = Array.isArray(room?.items) ? room.items : [];

  return roomItems.some((item: any) => {
    if (typeof item === 'string') return item === itemId;
    return item?.id === itemId || item?.itemId === itemId || item?.name === itemId;
  });
}

export function positionToCssValue(value: number, unit: CoordinateUnit = 'ratio'): string {
  return unit === 'percent' ? `${value}%` : `${value * 100}%`;
}
