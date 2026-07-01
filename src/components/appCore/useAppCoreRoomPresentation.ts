import { useMemo } from 'react';
import { useRoomTransition } from '../../hooks/useRoomTransition';
import type { Room } from '../../types/Room';

type AvailableDirections = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  jump: boolean;
  sit: boolean;
  up: boolean;
  down: boolean;
};

type DirectionRoomTitles = {
  north: string;
  south: string;
  east: string;
  west: string;
  jump: string;
  sit: string;
  up: string;
  down: string;
  back: string;
  out: string;
};

type UseAppCoreRoomPresentationParams = {
  room: Room | undefined;
  previousRoom: Room | null | undefined;
  lastMovementAction: string | null;
  roomMap: Record<string, Room>;
  currentRoomId: string;
  stage: string;
};

export function useAppCoreRoomPresentation({
  room,
  previousRoom,
  lastMovementAction,
  roomMap,
  currentRoomId,
  stage,
}: UseAppCoreRoomPresentationParams) {
  // Enhanced room transition info with proper typing
  const transitionInfo = useRoomTransition(previousRoom ?? null, room ?? null, lastMovementAction ?? undefined);

  // Enhanced direction state with proper typing and memoization
  const availableDirections: AvailableDirections = useMemo(() => {
    const directions = {
      north: Boolean(room?.exits?.north),
      south: Boolean(room?.exits?.south),
      east: Boolean(room?.exits?.east),
      west: Boolean(room?.exits?.west),
      jump: Boolean(room?.exits?.jump),
      sit: Boolean(room?.exits?.sit),
      up: Boolean(room?.exits?.up),
      down: Boolean(room?.exits?.down),
    };

    // Debug logging to see what's happening
    console.log('[AppCore] Current stage:', stage);
    console.log('[AppCore] Current room:', currentRoomId);
    console.log('[AppCore] Room object:', room);
    console.log('[AppCore] Room exits:', room?.exits);
    console.log('[AppCore] Available directions:', directions);

    return directions;
  }, [room?.exits, currentRoomId, stage]);

  const directionRoomTitles: DirectionRoomTitles = useMemo(
    () => ({
      north: room?.exits?.north ? (roomMap[room.exits.north]?.title ?? room.exits.north) : '',
      south: room?.exits?.south ? (roomMap[room.exits.south]?.title ?? room.exits.south) : '',
      east: room?.exits?.east ? (roomMap[room.exits.east]?.title ?? room.exits.east) : '',
      west: room?.exits?.west ? (roomMap[room.exits.west]?.title ?? room.exits.west) : '',
      jump: room?.exits?.jump ? (roomMap[room.exits.jump]?.title ?? room.exits.jump) : '',
      sit: room?.exits?.sit ? (roomMap[room.exits.sit]?.title ?? room.exits.sit) : '',
      up: room?.exits?.up ? (roomMap[room.exits.up]?.title ?? room.exits.up) : '',
      down: room?.exits?.down ? (roomMap[room.exits.down]?.title ?? room.exits.down) : '',
      back: room?.exits?.back ? (roomMap[room.exits.back]?.title ?? room.exits.back) : '',
      out: room?.exits?.out ? (roomMap[room.exits.out]?.title ?? room.exits.out) : '',
    }),
    [room?.exits, roomMap],
  );

  return {
    transitionInfo,
    availableDirections,
    directionRoomTitles,
  };
}
