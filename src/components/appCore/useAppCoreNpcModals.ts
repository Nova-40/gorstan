import { useCallback, useEffect } from 'react';
import type { NPC, NPCMood } from '../../types/NPCTypes';
import { npcReact } from '../../engine/npcEngine';

type UseAppCoreNpcModalsParams = {
  state: any;
  dispatch: (action: any) => void;
  npcsInRoom: NPC[];
  openModal: (name: any) => void;
  setSelectedNPC: (npc: NPC | null) => void;
  setIsGroupConversation: (isGroupConversation: boolean) => void;
};

const createAylaHelper = (): NPC => ({
  id: 'ayla',
  name: 'Ayla',
  location: 'universal',
  description: 'Your helpful guide through the game',
  portrait: '/images/Ayla.png',
  mood: 'helpful' as NPCMood,
  memory: {
    interactions: 0,
    lastInteraction: Date.now(),
    playerActions: [],
    relationship: 50,
    knownFacts: [],
  },
});

export function useAppCoreNpcModals({
  state,
  dispatch,
  npcsInRoom,
  openModal,
  setSelectedNPC,
  setIsGroupConversation,
}: UseAppCoreNpcModalsParams) {
  const handleOpenNPCConsole = useCallback(
    (npc?: NPC) => {
      if (npc) {
        // Specific NPC provided
        setSelectedNPC(npc);
        openModal('npcConsole');
      } else if (npcsInRoom.length === 1) {
        // Single NPC in room
        setSelectedNPC(npcsInRoom[0]);
        openModal('npcConsole');
      } else if (npcsInRoom.length > 1) {
        // Multiple NPCs - show selection modal
        openModal('npcSelection');
      } else {
        // No NPCs present - default to Ayla
        setSelectedNPC(createAylaHelper());
        openModal('npcConsole');
      }
    },
    [npcsInRoom, openModal, setSelectedNPC],
  );

  const handleTalkToAyla = useCallback(() => {
    // Switch from NPC selection to talking to Ayla directly
    setSelectedNPC(createAylaHelper());
    openModal('npcConsole');
  }, [openModal, setSelectedNPC]);

  const handleNPCMessage = useCallback(
    (message: string, npcId: string) => {
      // Send message to NPC engine
      npcReact(npcId, message, state);

      // Note: Conversation logging is handled within NPCConsole to prevent double-echo
      // Only log significant game-affecting interactions to main console
    },
    [state],
  );

  const handleSelectNPC = useCallback(
    (npc: NPC) => {
      setSelectedNPC(npc);
      openModal('npcConsole');
    },
    [openModal, setSelectedNPC],
  );

  const handleGroupConversation = useCallback(() => {
    // Add group conversation history message
    dispatch({
      type: 'RECORD_MESSAGE',
      payload: {
        id: `group-chat-start-${Date.now()}`,
        text: `🗣️ You begin a group conversation with ${npcsInRoom.map((npc) => npc.name).join(', ')}.`,
        type: 'narrative',
        timestamp: Date.now(),
      },
    });

    // Set group conversation mode and open with first NPC as primary
    setIsGroupConversation(true);
    setSelectedNPC(npcsInRoom[0] || null);
    openModal('npcConsole');
  }, [dispatch, npcsInRoom, openModal, setIsGroupConversation, setSelectedNPC]);

  // Monitor for NPC console flag
  useEffect(() => {
    if (state.flags?.openNPCConsole) {
      const npcId = state.flags.openNPCConsole;
      const targetNPC = npcsInRoom.find(
        (npc: NPC) => npc.id === npcId || npc.name.toLowerCase() === npcId.toLowerCase(),
      );

      if (targetNPC) {
        handleOpenNPCConsole(targetNPC);
        // Clear the flag
        dispatch({ type: 'SET_FLAG', payload: { flag: 'openNPCConsole', value: null } });
      }
    }
  }, [state.flags?.openNPCConsole, npcsInRoom, handleOpenNPCConsole, dispatch]);

  return {
    handleOpenNPCConsole,
    handleTalkToAyla,
    handleNPCMessage,
    handleSelectNPC,
    handleGroupConversation,
  };
}
