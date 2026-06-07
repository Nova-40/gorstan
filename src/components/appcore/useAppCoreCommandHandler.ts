/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Command handler controller for AppCore modularisation.
*/

import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { npcReact } from '../../engine/npcEngine';
import { aiUsageMonitor } from '../../services/aiUsageMonitor';
import { demoController } from '../../demo/demoController';
import { demoService } from '../../demo/DemoModeService';
import { itemDescriptions } from '../../data/itemDescriptions';
import type { Room } from '../../types/Room';
import type { NPC } from '../../types/NPCTypes';
import type { OpenModalType } from './AppCoreTypes';

interface UseAppCoreCommandHandlerArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly room: Room | undefined;
  readonly currentRoomId: string;
  readonly inventory: string[];
  readonly npcsInRoom: NPC[];
  readonly isDemo: boolean;
  readonly isDemoActive: boolean;
  readonly setIsDemoActive: Dispatch<SetStateAction<boolean>>;
  readonly setCommandHistory: Dispatch<SetStateAction<string[]>>;
  readonly setLastMovementAction: Dispatch<SetStateAction<string>>;
  readonly setPreviousRoom: Dispatch<SetStateAction<Room | null>>;
  readonly pushCurrentRoomToHistory: () => void;
  readonly handleLookAround: () => void;
  readonly openModal: (name: OpenModalType) => void;
  readonly checkForHints: (command: string, lowerCommand: string) => Promise<void>;
  readonly launchMiniQuest: (id: string) => void;
}

interface UseAppCoreCommandHandlerResult {
  readonly handleCommand: (command: string) => void;
  readonly handlePressAction: () => void;
}

function recordMessage(dispatch: (action: any) => void, text: string, type: string = 'system'): void {
  dispatch({
    type: 'ADD_MESSAGE',
    payload: {
      id: Date.now().toString(),
      text,
      type,
      timestamp: Date.now(),
    },
  });
}

export function useAppCoreCommandHandler({
  state,
  dispatch,
  room,
  currentRoomId,
  inventory,
  npcsInRoom,
  isDemo,
  isDemoActive,
  setIsDemoActive,
  setCommandHistory,
  setLastMovementAction,
  setPreviousRoom,
  pushCurrentRoomToHistory,
  handleLookAround,
  openModal,
  checkForHints,
  launchMiniQuest,
}: UseAppCoreCommandHandlerArgs): UseAppCoreCommandHandlerResult {
  const handlePressAction = useCallback((): void => {
    dispatch({
      type: currentRoomId === 'introreset' ? 'PRESS_BLUE_BUTTON' : 'PRESS_ACTION',
    });
  }, [dispatch, currentRoomId]);

  const handleCommand = useCallback(
    (command: string): void => {
      const lowerCommand = command.toLowerCase().trim();
      setCommandHistory((previous) => [...previous.slice(-9), command]);

      if (lowerCommand.startsWith('talk to ')) {
        const npcName = lowerCommand.replace('talk to ', '').trim();
        const match = npcsInRoom.find((npc) => npc.name.toLowerCase() === npcName || npc.id === npcName);

        if (match) {
          npcReact(match.id, 'greet', state);
        } else {
          recordMessage(dispatch, `You don't see anyone named "${npcName}".`, 'error');
        }
        return;
      }

      if (lowerCommand === 'miniquests') {
        import('../../minigames/core/MiniQuestRegistry')
          .then((module) => {
            const list = module.listMiniQuests();
            list.forEach((quest: any) => {
              recordMessage(dispatch, `${quest.id}: ${quest.displayName} (${quest.difficulty})`, 'info');
            });
          })
          .catch((error) => console.warn('Failed to list miniquests', error));
        return;
      }

      if (lowerCommand.startsWith('play ')) {
        const [, id] = lowerCommand.split(/\s+/);
        if (!id) return;

        import('../../minigames/core/MiniQuestRegistry').then((module) => {
          const spec = module.getMiniQuestById(id);
          if (!spec) {
            recordMessage(dispatch, `Unknown mini-quest '${id}'. Use 'miniquests' to list.`, 'error');
            return;
          }
          launchMiniQuest(id);
        });
        return;
      }

      const modalCommands: Record<string, OpenModalType> = {
        inv: 'inventory',
        inventory: 'inventory',
        'show inventory': 'inventory',
        'show inv': 'inventory',
        look: 'look',
        'show look': 'look',
        'show room': 'look',
        'examine room': 'look',
        use: 'useItem',
        'show use': 'useItem',
        'use item': 'useItem',
        pickup: 'pickUp',
        'pick up': 'pickUp',
        get: 'pickUp',
        take: 'pickUp',
      };

      const modalCommand = modalCommands[lowerCommand];
      if (modalCommand) {
        modalCommand === 'look' ? handleLookAround() : openModal(modalCommand);
        return;
      }

      if (lowerCommand.startsWith('look at ')) {
        const item = lowerCommand.replace('look at ', '').trim();
        if (item) {
          if (inventory.includes(item)) {
            const description =
              itemDescriptions[item] ||
              `You look at the ${item}, but it doesn't seem particularly special.`;
            recordMessage(dispatch, description);
          } else {
            recordMessage(dispatch, `You're not carrying a '${item}'.`, 'error');
          }
          return;
        }
      }

      const movementCommands = ['sit', 'north', 'south', 'east', 'west', 'up', 'down'];
      const isMovementCommand =
        movementCommands.includes(lowerCommand) ||
        lowerCommand.includes('portal') ||
        lowerCommand.includes('enter') ||
        lowerCommand.includes('step');

      if (isMovementCommand) {
        setLastMovementAction(lowerCommand);
        if (room) {
          pushCurrentRoomToHistory();
          setPreviousRoom(room);
        }
      } else {
        setLastMovementAction('');
        if (room) setPreviousRoom(room);
      }

      if (isDemo) {
        if (lowerCommand === 'start demo' || lowerCommand === 'demo start') {
          if (!isDemoActive) {
            setIsDemoActive(true);
            demoService.start();
            recordMessage(dispatch, '🎬 Starting scripted demo mode...');
          } else {
            recordMessage(dispatch, '🎬 Demo is already running. Press ESC to skip.');
          }
          return;
        }

        if (lowerCommand === 'stop demo' || lowerCommand === 'demo stop' || lowerCommand === 'skip demo') {
          if (isDemoActive) {
            demoService.stop('manual_cmd');
            setIsDemoActive(false);
            recordMessage(dispatch, '🎬 Demo stopped. You now have full control.');
          } else {
            recordMessage(dispatch, '🎬 No demo is currently running.', 'info');
          }
          return;
        }

        if (lowerCommand === 'next demo' || lowerCommand === 'demo next') {
          if (isDemoActive) {
            demoController.skipToNext();
            recordMessage(dispatch, '🎬 Skipping to next demo step...');
          } else {
            recordMessage(dispatch, '🎬 No demo is currently running.', 'info');
          }
          return;
        }
      }

      dispatch({ type: 'COMMAND_INPUT', payload: command });

      const isSuccessfulCommand =
        !lowerCommand.includes('unknown') &&
        !lowerCommand.includes("can't") &&
        !lowerCommand.includes('invalid');

      aiUsageMonitor.trackCommand(command, isSuccessfulCommand, currentRoomId);
      void checkForHints(command, lowerCommand);
    },
    [
      state,
      dispatch,
      room,
      currentRoomId,
      inventory,
      npcsInRoom,
      isDemo,
      isDemoActive,
      setIsDemoActive,
      setCommandHistory,
      setLastMovementAction,
      setPreviousRoom,
      pushCurrentRoomToHistory,
      handleLookAround,
      openModal,
      checkForHints,
      launchMiniQuest,
    ],
  );

  return { handleCommand, handlePressAction };
}
