/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Keyboard shortcut controller for AppCore modularisation.
*/

import { useEffect } from 'react';

import { demoController } from '../../demo/demoController';
import { demoService } from '../../demo/DemoModeService';
import { IS_DEV } from '../../config/mode';
import type { GameStage, OpenModalType } from './AppCoreTypes';
import type { NPC } from '../../types/NPCTypes';

interface UseAppCoreKeyboardArgs {
  readonly modal: OpenModalType;
  readonly closeModal: () => void;
  readonly openModal: (name: OpenModalType) => void;
  readonly showPause: boolean;
  readonly setShowPause: (show: boolean) => void;
  readonly stage: GameStage;
  readonly hasFlag: (flag: string) => boolean;
  readonly dispatch: (action: any) => void;
  readonly isDemoActive: boolean;
  readonly setIsDemoActive: (active: boolean) => void;
  readonly setShowPerformanceDashboard: (show: boolean) => void;
  readonly showAIMonitor: boolean;
  readonly setShowAIMonitor: (show: boolean) => void;
  readonly npcsInRoom: NPC[];
  readonly handleOpenNPCConsole: (npc?: NPC) => void;
}

export function useAppCoreKeyboard({
  modal,
  closeModal,
  openModal,
  showPause,
  setShowPause,
  stage,
  hasFlag,
  dispatch,
  isDemoActive,
  setIsDemoActive,
  setShowPerformanceDashboard,
  showAIMonitor,
  setShowAIMonitor,
  npcsInRoom,
  handleOpenNPCConsole,
}: UseAppCoreKeyboardArgs): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'F10' && IS_DEV) {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_DEBUG' });
        return;
      }

      if (event.key === 'Escape' && modal) {
        closeModal();
        return;
      }

      if (event.key === 'Escape' && showPause) {
        setShowPause(false);
        return;
      }

      if (event.key === 'Escape' && stage === 'game' && !modal && !showPause) {
        setShowPause(true);
        return;
      }

      if (event.key === 'Escape' && hasFlag('showDebugPanel')) {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_DEBUG' });
        return;
      }

      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        openModal('saveGame');
        return;
      }

      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        setShowPerformanceDashboard(true);
        return;
      }

      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        setShowAIMonitor(!showAIMonitor);
        return;
      }

      if (event.key.toLowerCase() === 't' && !modal && stage === 'game') {
        if (npcsInRoom.length === 1 && npcsInRoom[0]) {
          handleOpenNPCConsole(npcsInRoom[0]);
        } else if (npcsInRoom.length > 1) {
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

      if (event.key === 'Escape' && isDemoActive) {
        event.preventDefault();
        try {
          demoService.stop('user_esc');
        } catch {
          try {
            demoController.skipDemo();
          } catch {
            // Ignore fallback failure.
          }
        }

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
    showPause,
    setShowPause,
    stage,
    hasFlag,
    dispatch,
    isDemoActive,
    setIsDemoActive,
    setShowPerformanceDashboard,
    showAIMonitor,
    setShowAIMonitor,
    npcsInRoom,
    handleOpenNPCConsole,
  ]);
}
