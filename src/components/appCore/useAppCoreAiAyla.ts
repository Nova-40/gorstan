import { useCallback, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Room } from '../../types/Room';
import type { NPC } from '../../types/NPCTypes';
import type { AylaHintResponse } from '../../services/aylaHintSystem';
import type { AIGuidanceResponse } from '../../services/unifiedAI';
import type { GameplayUpdate } from '../../services/aiUsageMonitor';
import { unifiedAI } from '../../services/unifiedAI';
import { aiUsageMonitor } from '../../services/aiUsageMonitor';
import { npcAI } from '../../services/npcAI';

type GameDispatch = (action: any) => void;

type UseAppCoreAiAylaParams = {
  state: any;
  dispatch: GameDispatch;
  room: Room | undefined;
  npcsInRoom: NPC[];
  commandHistory: string[];
  roomEntryTime: number;
  currentRoomId: string;
  aylaHintSystem: any;
  currentHint: AylaHintResponse | null;
  currentGuidance: AIGuidanceResponse | null;
  setCurrentHint: Dispatch<SetStateAction<AylaHintResponse | null>>;
  setCurrentGuidance: Dispatch<SetStateAction<AIGuidanceResponse | null>>;
  setGameplayUpdates: Dispatch<SetStateAction<GameplayUpdate[]>>;
  setNpcBehaviors: Dispatch<SetStateAction<Record<string, string>>>;
};

export function useAppCoreAiAyla({
  state,
  dispatch,
  room,
  npcsInRoom,
  commandHistory,
  roomEntryTime,
  currentRoomId,
  aylaHintSystem,
  currentHint,
  currentGuidance,
  setCurrentHint,
  setCurrentGuidance,
  setGameplayUpdates,
  setNpcBehaviors,
}: UseAppCoreAiAylaParams) {
  // Setup AI Usage Monitoring and NPC AI Integration
  useEffect(() => {
    // Subscribe to AI usage updates
    const unsubscribe = aiUsageMonitor.onUpdate((update) => {
      setGameplayUpdates((prev) => [...prev.slice(-19), update]); // Keep last 20 updates

      // Console logging for real-time monitoring
      if (update.type === 'ai_interaction') {
        console.log('[AI Monitor] AI Interaction:', update.data);
      }
    });

    // Track initial room visit
    if (currentRoomId) {
      aiUsageMonitor.trackRoomVisit(currentRoomId, state);
    }

    return unsubscribe;
  }, [currentRoomId, state, setGameplayUpdates]);

  // NPC AI Behavior Generation
  useEffect(() => {
    const generateNPCBehaviors = async () => {
      if (!room || npcsInRoom.length === 0) {
        return;
      }

      for (const npc of npcsInRoom) {
        try {
          const npcProfile = npcAI.getAllNPCs().find((p) => p.npcId === npc.id);
          if (!npcProfile) {
            continue;
          }

          const context = {
            npcProfile,
            currentRoom: room,
            playerPresent: true,
            gameState: state,
            recentPlayerActions: commandHistory.slice(-5),
            timeInRoom: Date.now() - roomEntryTime,
            nearbyNPCs: npcsInRoom.map((n) => n.id).filter((id) => id !== npc.id),
          };

          const behavior = await npcAI.generateNPCBehavior(context);
          if (behavior && behavior.shouldDisplay) {
            setNpcBehaviors((prev) => ({
              ...prev,
              [npc.id]: behavior.content,
            }));

            // Display behavior in console if significant
            if (behavior.priority === 'high' || behavior.type === 'callout') {
              dispatch({
                type: 'ADD_MESSAGE',
                payload: {
                  id: Date.now().toString(),
                  text: `**${npc.name}**: ${behavior.content}`,
                  type: 'npc',
                  timestamp: Date.now(),
                },
              });
            }
          }
        } catch (error) {
          console.warn(`[NPC AI] Behavior generation failed for ${npc.id}:`, error);
        }
      }
    };

    // Generate behaviors after a short delay when room/NPCs change
    const timeout = setTimeout(generateNPCBehaviors, 2000);
    return () => clearTimeout(timeout);
  }, [room, npcsInRoom, commandHistory, roomEntryTime, state, dispatch, setNpcBehaviors]);

  // Enhanced hint checking function with unified AI
  const checkForHints = useCallback(
    async (cmd: string, _lowerCmd: string) => {
      if (!aylaHintSystem || currentHint || currentGuidance) {
        return;
      }

      // Check if this was a failed command (we can check this by looking at recent messages)
      const recentMessages = state.messages.slice(-3);
      const hasFailureMessage = recentMessages.some(
        (msg: any) =>
          msg.text.includes("don't understand") ||
          msg.text.includes("can't") ||
          msg.text.includes('no one') ||
          msg.text.includes("don't see") ||
          msg.text.includes('not here') ||
          msg.type === 'error',
      );

      // Also check for repeated commands or signs of being stuck
      const recentCommands = commandHistory.slice(-5);
      const hasRepeatedCommands = recentCommands.filter((c) => c === cmd).length >= 2;
      const hasVariousFailedAttempts = recentCommands.length >= 3;

      if (hasFailureMessage || hasRepeatedCommands || hasVariousFailedAttempts) {
        try {
          // Try unified AI first for comprehensive guidance
          const unifiedContext = {
            gameState: state,
            currentRoom: room!,
            recentCommands: commandHistory,
            timeInRoom: Date.now() - roomEntryTime,
            failedAttempts: hasFailureMessage ? [cmd] : [],
          };

          const unifiedGuidance = await unifiedAI.getUnifiedGuidance(unifiedContext);

          if (unifiedGuidance) {
            setCurrentGuidance(unifiedGuidance);
            return;
          }

          // Fallback to traditional Ayla hint system
          const context = {
            currentRoom: room!,
            gameState: state,
            recentCommands: commandHistory,
            timeInRoom: Date.now() - roomEntryTime,
            failedAttempts: hasFailureMessage ? [cmd] : [],
            stuckDuration: Date.now() - roomEntryTime,
          };

          const hintResponse = await aylaHintSystem.shouldAylaInterrupt(context);

          if (hintResponse) {
            setCurrentHint(hintResponse);
          }
        } catch (error) {
          console.warn('Failed to generate hint:', error);
        }
      }
    },
    [
      aylaHintSystem,
      currentHint,
      currentGuidance,
      state,
      commandHistory,
      room,
      roomEntryTime,
      setCurrentGuidance,
      setCurrentHint,
    ],
  );

  const trackAiCommand = useCallback(
    (cmd: string, isSuccessfulCommand: boolean, roomId: string) => {
      aiUsageMonitor.trackCommand(cmd, isSuccessfulCommand, roomId);
    },
    [],
  );

  return {
    checkForHints,
    trackAiCommand,
  };
}
