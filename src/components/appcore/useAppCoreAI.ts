/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  AI monitoring and hint orchestration for AppCore modularisation.
*/

import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { AylaHintSystem } from '../../services/aylaHintSystem';
import type { AylaHintResponse } from '../../services/aylaHintSystem';
import { unifiedAI } from '../../services/unifiedAI';
import type { AIGuidanceResponse } from '../../services/unifiedAI';
import { aiUsageMonitor } from '../../services/aiUsageMonitor';
import type { GameplayUpdate } from '../../services/aiUsageMonitor';
import type { Room } from '../../types/Room';
import type { NPC } from '../../types/NPCTypes';

interface UseAppCoreAIArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly room: Room | undefined;
  readonly currentRoomId: string;
  readonly npcsInRoom: NPC[];
  readonly commandHistory: string[];
  readonly roomEntryTime: number;
}

interface UseAppCoreAIResult {
  readonly currentHint: AylaHintResponse | null;
  readonly setCurrentHint: Dispatch<SetStateAction<AylaHintResponse | null>>;
  readonly currentGuidance: AIGuidanceResponse | null;
  readonly setCurrentGuidance: Dispatch<SetStateAction<AIGuidanceResponse | null>>;
  readonly gameplayUpdates: GameplayUpdate[];
  readonly showAIMonitor: boolean;
  readonly setShowAIMonitor: Dispatch<SetStateAction<boolean>>;
  readonly npcBehaviors: Record<string, string>;
  readonly setNpcBehaviors: Dispatch<SetStateAction<Record<string, string>>>;
  readonly checkForHints: (command: string, lowerCommand: string) => Promise<void>;
}

export function useAppCoreAI({
  state,
  dispatch,
  room,
  currentRoomId,
  npcsInRoom,
  commandHistory,
  roomEntryTime,
}: UseAppCoreAIArgs): UseAppCoreAIResult {
  const [currentHint, setCurrentHint] = useState<AylaHintResponse | null>(null);
  const [currentGuidance, setCurrentGuidance] = useState<AIGuidanceResponse | null>(null);
  const [gameplayUpdates, setGameplayUpdates] = useState<GameplayUpdate[]>([]);
  const [showAIMonitor, setShowAIMonitor] = useState<boolean>(false);
  const [npcBehaviors, setNpcBehaviors] = useState<Record<string, string>>({});
  const [aylaHintSystem] = useState(() => new AylaHintSystem());

  useEffect(() => {
    const unsubscribe = aiUsageMonitor.onUpdate((update) => {
      setGameplayUpdates((previous) => [...previous.slice(-19), update]);

      if (update.type === 'ai_interaction') {
        console.log('[AI Monitor] AI Interaction:', update.data);
      }
    });

    if (currentRoomId) {
      aiUsageMonitor.trackRoomVisit(currentRoomId, state);
    }

    return unsubscribe;
  }, [currentRoomId, state]);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      void (async () => {
        if (cancelled) return;
        try {
          const module = await import('../AppCore.behaviors');
          await module.default(npcsInRoom, room, commandHistory, roomEntryTime, state, dispatch);
        } catch (error) {
          console.warn('[AppCore] Lazy NPC behavior module failed to load or run', error);
        }
      })();
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [room, npcsInRoom, commandHistory, roomEntryTime, state, dispatch]);

  const checkForHints = useCallback(
    async (command: string, _lowerCommand: string) => {
      if (!aylaHintSystem || currentHint || currentGuidance || !room) {
        return;
      }

      const recentMessages = state.messages.slice(-3);
      const hasFailureMessage = recentMessages.some(
        (message: any) =>
          message.text.includes("don't understand") ||
          message.text.includes("can't") ||
          message.text.includes('no one') ||
          message.text.includes("don't see") ||
          message.text.includes('not here') ||
          message.type === 'error',
      );

      const recentCommands = commandHistory.slice(-5);
      const hasRepeatedCommands = recentCommands.filter((entry) => entry === command).length >= 2;
      const hasVariousFailedAttempts = recentCommands.length >= 3;

      if (!hasFailureMessage && !hasRepeatedCommands && !hasVariousFailedAttempts) {
        return;
      }

      try {
        const context = {
          gameState: state,
          currentRoom: room,
          recentCommands: commandHistory,
          timeInRoom: Date.now() - roomEntryTime,
          failedAttempts: hasFailureMessage ? [command] : [],
          stuckDuration: Date.now() - roomEntryTime,
        };

        const unifiedGuidance = await unifiedAI.getUnifiedGuidance(context);
        if (unifiedGuidance) {
          setCurrentGuidance(unifiedGuidance);
          return;
        }

        const hintResponse = await aylaHintSystem.shouldAylaInterrupt(context);
        if (hintResponse) {
          setCurrentHint(hintResponse);
        }
      } catch (error) {
        console.warn('Failed to generate hint:', error);
      }
    },
    [aylaHintSystem, currentHint, currentGuidance, state, commandHistory, room, roomEntryTime],
  );

  return {
    currentHint,
    setCurrentHint,
    currentGuidance,
    setCurrentGuidance,
    gameplayUpdates,
    showAIMonitor,
    setShowAIMonitor,
    npcBehaviors,
    setNpcBehaviors,
    checkForHints,
  };
}
