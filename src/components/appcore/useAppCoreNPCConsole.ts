/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  NPC console controller for AppCore modularisation.
*/

import { useCallback, useState } from 'react';

import { npcReact } from '../../engine/npcEngine';
import type { NPC } from '../../types/NPCTypes';
import type { OpenModalType } from './AppCoreTypes';
import { createAylaHelper } from './useResolvedNPCs';

interface UseAppCoreNPCConsoleArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly npcsInRoom: NPC[];
  readonly openModal: (name: OpenModalType) => void;
}

interface UseAppCoreNPCConsoleResult {
  readonly selectedNPC: NPC | null;
  readonly setSelectedNPC: React.Dispatch<React.SetStateAction<NPC | null>>;
  readonly isGroupConversation: boolean;
  readonly setIsGroupConversation: React.Dispatch<React.SetStateAction<boolean>>;
  readonly handleOpenNPCConsole: (npc?: NPC) => void;
  readonly handleTalkToAyla: () => void;
  readonly handleNPCMessage: (message: string, npcId: string) => void;
  readonly handleSelectNPC: (npc: NPC) => void;
  readonly handleGroupConversation: () => void;
}

export function useAppCoreNPCConsole({
  state,
  dispatch,
  npcsInRoom,
  openModal,
}: UseAppCoreNPCConsoleArgs): UseAppCoreNPCConsoleResult {
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [isGroupConversation, setIsGroupConversation] = useState(false);

  const handleOpenNPCConsole = useCallback(
    (npc?: NPC) => {
      if (npc) {
        setSelectedNPC(npc);
        openModal('npcConsole');
      } else if (npcsInRoom.length === 1) {
        setSelectedNPC(npcsInRoom[0] ?? null);
        openModal('npcConsole');
      } else if (npcsInRoom.length > 1) {
        openModal('npcSelection');
      } else {
        setSelectedNPC(createAylaHelper());
        openModal('npcConsole');
      }
    },
    [npcsInRoom, openModal],
  );

  const handleTalkToAyla = useCallback(() => {
    setSelectedNPC(createAylaHelper());
    openModal('npcConsole');
  }, [openModal]);

  const handleNPCMessage = useCallback(
    (message: string, npcId: string) => {
      npcReact(npcId, message, state);
    },
    [state],
  );

  const handleSelectNPC = useCallback(
    (npc: NPC) => {
      setSelectedNPC(npc);
      openModal('npcConsole');
    },
    [openModal],
  );

  const handleGroupConversation = useCallback(() => {
    dispatch({
      type: 'RECORD_MESSAGE',
      payload: {
        id: `group-chat-start-${Date.now()}`,
        text: `🗣️ You begin a group conversation with ${npcsInRoom.map((npc) => npc.name).join(', ')}.`,
        type: 'narrative',
        timestamp: Date.now(),
      },
    });

    setIsGroupConversation(true);
    setSelectedNPC(npcsInRoom[0] || null);
    openModal('npcConsole');
  }, [dispatch, npcsInRoom, openModal]);

  return {
    selectedNPC,
    setSelectedNPC,
    isGroupConversation,
    setIsGroupConversation,
    handleOpenNPCConsole,
    handleTalkToAyla,
    handleNPCMessage,
    handleSelectNPC,
    handleGroupConversation,
  };
}
