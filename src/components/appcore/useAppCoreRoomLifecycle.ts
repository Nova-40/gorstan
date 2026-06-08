/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Room lifecycle controller for AppCore modularisation.
*/

import { useEffect, useState } from 'react';

import { handleRoomEntryForWanderingNPCs } from '../../engine/wanderingNPCController';
import { handleRoomEntry } from '../../engine/roomEventHandler';
import { onRoomEntry, periodicConversationCheck } from '../../npc/triggers';
import { FEATURES } from '../../config';
import type { Room } from '../../types/Room';
import type { NPC } from '../../types/NPCTypes';
import type { GameStage, OpenModalType } from './AppCoreTypes';

interface UseAppCoreRoomLifecycleArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly room: Room | undefined;
  readonly currentRoomId: string;
  readonly stage: GameStage;
  readonly previousRoom: Room | null;
  readonly setPreviousRoom: (room: Room | null) => void;
  readonly setRoomEntryTime: (time: number) => void;
  readonly setSelectedNPC: (npc: NPC | null) => void;
  readonly setIsGroupConversation: (active: boolean) => void;
  readonly openModal: (name: OpenModalType) => void;
  readonly roomFallbackAttempted: boolean;
  readonly setRoomFallbackAttempted: (attempted: boolean) => void;
}

export function useAppCoreRoomLifecycle({
  state,
  dispatch,
  room,
  currentRoomId,
  stage,
  previousRoom,
  setPreviousRoom,
  setRoomEntryTime,
  setSelectedNPC,
  setIsGroupConversation,
  openModal,
  roomFallbackAttempted,
  setRoomFallbackAttempted,
}: UseAppCoreRoomLifecycleArgs): void {
  const [lastShownRoomDescription, setLastShownRoomDescription] = useState<string | null>(null);

  useEffect(() => {
    const roomMap = state.roomMap && typeof state.roomMap === 'object' ? state.roomMap : {};
    const roomMapLoaded = Object.keys(roomMap).length > 0;
    if (!roomMapLoaded) return;

    if (!room && currentRoomId && !roomFallbackAttempted) {
      const fallbackRoomId = roomMap.controlnexus ? 'controlnexus' : Object.keys(roomMap)[0];
      if (!fallbackRoomId) return;

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          text: `Room transition failed: Room '${currentRoomId}' does not exist. Returning to ${fallbackRoomId}.`,
          type: 'error',
          timestamp: Date.now(),
        },
      });
      dispatch({ type: 'MOVE_TO_ROOM', payload: fallbackRoomId });
      setRoomFallbackAttempted(true);
    }
  }, [room, currentRoomId, dispatch, roomFallbackAttempted, setRoomFallbackAttempted, state.roomMap]);

  useEffect(() => {
    if (room && room.id) {
      if (!previousRoom) {
        setPreviousRoom(room);
        setRoomEntryTime(Date.now());
      } else if (previousRoom.id !== room.id) {
        setRoomEntryTime(Date.now());
      }
    }
  }, [room, previousRoom, setPreviousRoom, setRoomEntryTime]);

  useEffect(() => {
    if (!room?.description || room.description === lastShownRoomDescription) return;

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: Date.now().toString(),
        text: room.description,
        type: 'system',
        timestamp: Date.now(),
      },
    });

    setLastShownRoomDescription(
      Array.isArray(room.description) ? room.description.join(' ') : room.description,
    );

    if (!room.id) return;

    handleRoomEntry(room, state, dispatch);
    handleRoomEntryForWanderingNPCs(room, state, dispatch);
    onRoomEntry(state, dispatch, room.id, state.previousRoomId);

    const currentZone = room.zone || '';
    const npcsInRoom = state.npcsInRoom || [];

    if (npcsInRoom.length > 1) {
      import('../../npc/groupChatLogic').then(({ GroupChatManager }) => {
        if (GroupChatManager.shouldForceGroupChat(room.id, currentZone)) {
          dispatch({ type: 'SET_FLAG', payload: { flag: 'forceGroupChat', value: true } });

          if (currentZone === 'stantonZone' || currentZone === 'stantonharcourtZone') {
            setTimeout(() => {
              setIsGroupConversation(true);
              setSelectedNPC(npcsInRoom[0] || null);
              openModal('npcConsole');
            }, 2000);
          }
        }
      });
    }
  }, [room, lastShownRoomDescription, dispatch, state, setSelectedNPC, setIsGroupConversation, openModal]);

  useEffect(() => {
    if (!room || !FEATURES.MINI_QUESTS_ENABLED) return;

    const cfg = (room as any).quantumMiniQuest as import('../../minigames/core/roomTrigger').QuantumMiniCfg | undefined;
    if (!cfg) return;

    import('../../minigames/core/roomTrigger')
      .then((module) => {
        void module.maybeLaunchRoomMini(cfg, room.id);
      })
      .catch(() => {});
  }, [room]);

  useEffect(() => {
    if (stage === 'game' && room && room.id) {
      const interval = setInterval(() => {
        periodicConversationCheck(state, dispatch, room.id);
      }, 120000);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [stage, room, state, dispatch]);
}
