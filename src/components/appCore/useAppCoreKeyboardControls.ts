import { useEffect } from 'react';
import type { NPC } from '../../types/NPCTypes';
import { demoController } from '../../demo/demoController';

type UseAppCoreKeyboardControlsParams = {
  modal: any;
  closeModal: () => void;
  openModal: (name: any) => void;
  npcsInRoom: NPC[];
  handleOpenNPCConsole: (npc?: NPC) => void;
  stage: string;
  dispatch: (action: any) => void;
  isDemoActive: boolean;
  setIsDemoActive: (isDemoActive: boolean) => void;
  setShowPerformanceDashboard: (show: boolean) => void;
  setShowAIMonitor: React.Dispatch<React.SetStateAction<boolean>>;
  lookModalTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
};

export function useAppCoreKeyboardControls({
  modal,
  closeModal,
  openModal,
  npcsInRoom,
  handleOpenNPCConsole,
  stage,
  dispatch,
  isDemoActive,
  setIsDemoActive,
  setShowPerformanceDashboard,
  setShowAIMonitor,
  lookModalTimeoutRef,
}: UseAppCoreKeyboardControlsParams) {
  // Enhanced keyboard handler with proper typing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && modal) {
        closeModal();
      }

      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        openModal('saveGame');
      }

      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowPerformanceDashboard(true);
      }

      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setShowAIMonitor((prev) => !prev);
      }

      if (e.key.toLowerCase() === 't' && !modal && stage === 'game') {
        // Talk to NPC shortcut
        if (npcsInRoom.length === 1) {
          handleOpenNPCConsole(npcsInRoom[0]);
        } else if (npcsInRoom.length > 1) {
          // Show list of available NPCs
          dispatch({
            type: 'RECORD_MESSAGE',
            payload: {
              id: `npc-list-${Date.now()}`,
              text: `NPCs available: ${npcsInRoom.map((npc) => npc.name).join(', ')}. Click on one or use "talk [name]"`,
              type: 'info',
              timestamp: Date.now(),
            },
          });
        } else {
          dispatch({
            type: 'RECORD_MESSAGE',
            payload: {
              id: `no-npcs-${Date.now()}`,
              text: 'There is no one here to talk to.',
              type: 'error',
              timestamp: Date.now(),
            },
          });
        }
      }

      if (e.key === 'Escape' && isDemoActive) {
        // Skip demo with ESC key
        e.preventDefault();
        demoController.skipDemo();
        setIsDemoActive(false);
        dispatch({
          type: 'RECORD_MESSAGE',
          payload: {
            id: `demo-skip-${Date.now()}`,
            text: '🎬 Demo skipped. You now have full control.',
            type: 'system',
            timestamp: Date.now(),
          },
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    modal,
    closeModal,
    openModal,
    npcsInRoom,
    handleOpenNPCConsole,
    stage,
    dispatch,
    isDemoActive,
    setIsDemoActive,
    setShowPerformanceDashboard,
    setShowAIMonitor,
  ]);

  // Enhanced cleanup effect with proper typing
  useEffect(() => {
    return () => {
      if (lookModalTimeoutRef.current) {
        clearTimeout(lookModalTimeoutRef.current);
        lookModalTimeoutRef.current = null;
      }
    };
  }, [lookModalTimeoutRef]);
}
