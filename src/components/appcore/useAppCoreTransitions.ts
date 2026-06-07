/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Teleport and transition controller for AppCore modularisation.
*/

import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { useRoomTransition } from '../../hooks/useRoomTransition';
import type { Room } from '../../types/Room';
import type { GameStage, TeleportType } from './AppCoreTypes';

interface UseAppCoreTransitionsArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly room: Room | undefined;
  readonly roomMap: Record<string, Room>;
  readonly currentRoomId: string;
  readonly stage: GameStage;
}

interface UseAppCoreTransitionsResult {
  readonly teleportType: TeleportType;
  readonly setTeleportType: Dispatch<SetStateAction<TeleportType>>;
  readonly teleportCallback: () => void;
  readonly setTeleportCallback: Dispatch<SetStateAction<() => void>>;
  readonly transitionType: string | null;
  readonly setTransitionType: Dispatch<SetStateAction<string | null>>;
  readonly readyForTransition: boolean;
  readonly setReadyForTransition: Dispatch<SetStateAction<boolean>>;
  readonly transitionTargetRoom: string;
  readonly setTransitionTargetRoom: Dispatch<SetStateAction<string>>;
  readonly transitionInventory: string[];
  readonly setTransitionInventory: Dispatch<SetStateAction<string[]>>;
  readonly lastMovementAction: string;
  readonly setLastMovementAction: Dispatch<SetStateAction<string>>;
  readonly roomTransitionActive: boolean;
  readonly setRoomTransitionActive: Dispatch<SetStateAction<boolean>>;
  readonly previousRoom: Room | null;
  readonly setPreviousRoom: Dispatch<SetStateAction<Room | null>>;
  readonly transitionInfo: ReturnType<typeof useRoomTransition>;
  readonly handleRoomChange: (newRoomId: string) => void;
  readonly handleQuickExit: (exitName: 'jump' | 'sit') => void;
  readonly handleTeleportComplete: () => void;
  readonly handleRoomTransitionComplete: () => void;
}

export function useAppCoreTransitions({
  state,
  dispatch,
  room,
  roomMap,
  currentRoomId,
  stage,
}: UseAppCoreTransitionsArgs): UseAppCoreTransitionsResult {
  const [teleportType, setTeleportType] = useState<TeleportType>(null);
  const [teleportCallback, setTeleportCallback] = useState<() => void>(() => () => {});
  const [transitionType, setTransitionType] = useState<string | null>(null);
  const [readyForTransition, setReadyForTransition] = useState<boolean>(false);
  const [transitionTargetRoom, setTransitionTargetRoom] = useState<string>('controlnexus');
  const [transitionInventory, setTransitionInventory] = useState<string[]>([]);
  const [lastMovementAction, setLastMovementAction] = useState<string>('');
  const [roomTransitionActive, setRoomTransitionActive] = useState<boolean>(false);
  const [previousRoom, setPreviousRoom] = useState<Room | null>(null);

  void state;
  const transitionInfo = useRoomTransition(previousRoom, room ?? null, lastMovementAction);

  const handleRoomChange = useCallback(
    (newRoomId: string) => {
      console.log('[AppCore] handleRoomChange called with:', newRoomId);
      if (newRoomId === currentRoomId) return;

      if (room) {
        setPreviousRoom(room);
      }

      const currentZone = room?.zone;
      const newRoom = roomMap[newRoomId];
      const newZone = newRoom?.zone;

      if (currentZone && newZone && currentZone !== newZone) {
        console.log('[AppCore] Zone change detected:', currentZone, '→', newZone);
        const newTeleportType: Exclude<TeleportType, null> = newZone === 'glitchZone' ? 'fractal' : 'trek';
        setTeleportType(newTeleportType);
        setTeleportCallback(() => () => {
          console.log('[AppCore] Teleport animation complete, changing room');
          dispatch({ type: 'MOVE_TO_ROOM', payload: newRoomId });
        });
      } else {
        console.log('[AppCore] Same zone movement, direct change');
        dispatch({ type: 'MOVE_TO_ROOM', payload: newRoomId });
      }
    },
    [currentRoomId, room, roomMap, dispatch],
  );

  const handleQuickExit = useCallback(
    (exitName: 'jump' | 'sit') => {
      const targetRoomId = room?.exits?.[exitName];
      if (!targetRoomId) {
        return;
      }

      handleRoomChange(targetRoomId);
    },
    [room, handleRoomChange],
  );

  const handleTeleportComplete = useCallback((): void => {
    setTeleportType(null);
    teleportCallback();
    setTeleportCallback(() => () => {});
  }, [teleportCallback]);

  const handleRoomTransitionComplete = useCallback((): void => {
    setRoomTransitionActive(false);
    setLastMovementAction('');
  }, []);

  useEffect(() => {
    if (stage.startsWith('transition_')) {
      const nextTransitionType = stage.replace('transition_', '');
      console.log('[AppCore] Setting transition type from stage:', stage, '→', nextTransitionType);
      setTransitionType(nextTransitionType);
    }
  }, [stage]);

  useEffect(() => {
    if (!readyForTransition || !transitionType || Object.keys(roomMap).length === 0) {
      return;
    }

    try {
      const target = transitionTargetRoom.trim().toLowerCase();
      const foundRoom = roomMap[target];
      const targetRoomId = foundRoom ? target : 'controlnexus';

      console.log('[AppCore] Executing transition to room:', targetRoomId);
      dispatch({ type: 'MOVE_TO_ROOM', payload: targetRoomId });

      transitionInventory.forEach((item) => {
        console.log('[AppCore] Adding transition inventory item:', item);
        dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
      });

      console.log('[AppCore] Advancing to game stage');
      dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });
      setTransitionType(null);
      setReadyForTransition(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Transition execution failed:', errorMessage);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: 'Transition execution failed.',
          type: 'error',
          timestamp: Date.now(),
        },
      });
      setTransitionType(null);
      setReadyForTransition(false);
    }
  }, [readyForTransition, transitionType, roomMap, transitionTargetRoom, transitionInventory, dispatch]);

  useEffect(() => {
    if (room && previousRoom && room.id !== previousRoom.id) {
      setRoomTransitionActive(true);
    }
  }, [room, previousRoom]);

  return {
    teleportType,
    setTeleportType,
    teleportCallback,
    setTeleportCallback,
    transitionType,
    setTransitionType,
    readyForTransition,
    setReadyForTransition,
    transitionTargetRoom,
    setTransitionTargetRoom,
    transitionInventory,
    setTransitionInventory,
    lastMovementAction,
    setLastMovementAction,
    roomTransitionActive,
    setRoomTransitionActive,
    previousRoom,
    setPreviousRoom,
    transitionInfo,
    handleRoomChange,
    handleQuickExit,
    handleTeleportComplete,
    handleRoomTransitionComplete,
  };
}
