/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Derives quick-action direction availability and destination labels from the
  current room. Extracted from AppCore as a pure memoised hook.
*/

import { useMemo } from 'react';

import type { Room } from '../../types/Room';
import type { AppCoreDirectionAvailability, AppCoreDirectionTitles } from './AppCoreTypes';

interface RoomDirectionState {
  readonly availableDirections: AppCoreDirectionAvailability;
  readonly directionRoomTitles: AppCoreDirectionTitles;
}

export function useRoomDirections(room: Room | undefined, roomMap: Record<string, Room>): RoomDirectionState {
  const availableDirections = useMemo<AppCoreDirectionAvailability>(
    () => ({
      north: Boolean(room?.exits?.north),
      south: Boolean(room?.exits?.south),
      east: Boolean(room?.exits?.east),
      west: Boolean(room?.exits?.west),
      jump: Boolean(room?.exits?.jump),
      sit: Boolean(room?.exits?.sit),
      up: Boolean(room?.exits?.up),
      down: Boolean(room?.exits?.down),
    }),
    [room?.exits],
  );

  const directionRoomTitles = useMemo<AppCoreDirectionTitles>(
    () => ({
      north: room?.exits?.north ? (roomMap[room.exits.north]?.title ?? room.exits.north) : '',
      south: room?.exits?.south ? (roomMap[room.exits.south]?.title ?? room.exits.south) : '',
      east: room?.exits?.east ? (roomMap[room.exits.east]?.title ?? room.exits.east) : '',
      west: room?.exits?.west ? (roomMap[room.exits.west]?.title ?? room.exits.west) : '',
      jump: room?.exits?.jump ? (roomMap[room.exits.jump]?.title ?? room.exits.jump) : '',
      sit: room?.exits?.sit ? (roomMap[room.exits.sit]?.title ?? room.exits.sit) : '',
      up: room?.exits?.up ? (roomMap[room.exits.up]?.title ?? room.exits.up) : '',
      down: room?.exits?.down ? (roomMap[room.exits.down]?.title ?? room.exits.down) : '',
    }),
    [room?.exits, roomMap],
  );

  return { availableDirections, directionRoomTitles };
}
