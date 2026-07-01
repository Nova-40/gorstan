import { useCallback, useEffect, useState } from 'react';
import type { Room } from '../../types/Room';
import type { GameTransition } from '../../types/GameTypes';
import { SaveManager, parseSaveSlotId } from '../../services/SaveManager';
import { safeSetStorageItem } from '../../utils/safeStorage';
import {
  readLegacySaveSlots,
  recordAppMessage,
  resolveRoomId,
  type SaveSlotView,
} from './appCoreHelpers';

type UseAppCoreSaveSlotsParams = {
  state: any;
  dispatch: (action: any) => void;
  closeModal: () => void;
  roomMap: Record<string, Room>;
};

export function useAppCoreSaveSlots({
  state,
  dispatch,
  closeModal,
  roomMap,
}: UseAppCoreSaveSlotsParams) {
  const [saveSlots, setSaveSlots] = useState<SaveSlotView[]>([]);

  const loadSaveSlots = useCallback(async () => {
    // Load traditional save slots for compatibility. Malformed legacy data should not block
    // modern save discovery or startup.
    const legacySlots = readLegacySaveSlots();

    try {
      const saveSlotInfos = await SaveManager.listSlots();
      const modernSlots = saveSlotInfos.map((slot) => ({
        id: slot.slot,
        name: slot.saveName,
        playerName: slot.playerName,
        currentRoom: slot.currentRoom,
        timestamp: Date.parse(slot.timestamp),
        score: slot.totalScore,
        playTime: slot.playTime,
      }));

      setSaveSlots((modernSlots.length > 0 ? modernSlots : legacySlots).sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error('Failed to load save slots:', error);
      setSaveSlots(legacySlots.sort((a, b) => a.id - b.id));
    }
  }, []);

  const handleSave = useCallback(
    async (slotId: number, slotName: string) => {
      const parsedSlotId = parseSaveSlotId(slotId);
      if (parsedSlotId === null) {
        recordAppMessage(dispatch, `Refused save: invalid slot "${slotId}".`, 'error');
        return;
      }

      try {
        // Create enhanced save file structure
        const saveFile = {
          version: 7, // Current version
          saveName: slotName,
          playerName: state.player.name || 'Player',
          progress: {
            questsCompleted: 0, // Calculate based on game state
            achievementsUnlocked: (state.metadata?.achievements || []).length,
            totalScore: state.player.score || 0,
            totalPlayTime: state.metadata?.playTime ?? 0,
            roomsVisited:
              Object.keys(state.flags || {}).filter((key) => key.startsWith('visited_')).length ||
              1,
            secretsFound:
              Object.keys(state.flags || {}).filter((key) => key.startsWith('secret_')).length || 0,
            characterInteractions:
              Object.keys(state.flags || {}).filter((key) => key.startsWith('met_')).length || 0,
            storylineProgress: {
              currentRoom: state.currentRoomId,
              flags: state.flags,
              inventory: state.player.inventory,
              achievements: state.metadata?.achievements || [],
            },
          },
          timestamp: new Date().toISOString(),
          gameState: {
            ...state,
            progress: {
              questsCompleted: 0, // Calculate based on game state
              achievementsUnlocked: (state.metadata?.achievements || []).length,
              totalScore: state.player.score || 0,
              totalPlayTime: state.metadata?.playTime ?? 0,
              roomsVisited:
                Object.keys(state.flags || {}).filter((key) => key.startsWith('visited_')).length ||
                1,
              secretsFound:
                Object.keys(state.flags || {}).filter((key) => key.startsWith('secret_')).length ||
                0,
              characterInteractions:
                Object.keys(state.flags || {}).filter((key) => key.startsWith('met_')).length || 0,
              storylineProgress: {
                currentRoom: state.currentRoomId,
                flags: state.flags,
                inventory: state.player.inventory,
                achievements: state.metadata?.achievements || [],
              },
            },
            transition: state.transition as GameTransition | undefined, // Type assertion for compatibility
            settings: {
              difficulty:
                (state.settings?.difficulty as 'easy' | 'normal' | 'hard' | 'nightmare') ||
                'normal',
              autoSave: state.settings?.autoSave ?? true,
              autoSaveInterval: state.settings?.autoSaveInterval ?? 60,
              soundEnabled: state.settings?.soundEnabled ?? true,
              musicEnabled: state.settings?.musicEnabled ?? true,
              animationsEnabled: state.settings?.animationsEnabled ?? true,
              textSpeed: state.settings?.textSpeed ?? 50,
              fontSize: (state.settings?.fontSize as 'small' | 'medium' | 'large') || 'medium',
              theme: (state.settings?.theme as 'light' | 'dark' | 'auto') || 'auto',
              debugMode: state.settings?.debugMode ?? false,
              fullscreen: state.settings?.fullscreen ?? false,
              cheatMode: state.settings?.cheatMode ?? false,
            },
            metadata: {
              version: state.metadata?.version || '3.9.0',
              playTime: state.metadata?.playTime ?? 0,
              lastSaved:
                typeof state.metadata?.lastSaved === 'string'
                  ? Date.now()
                  : (state.metadata?.lastSaved ?? null),
              resetCount: state.metadata?.resetCount ?? 0,
              achievements: state.metadata?.achievements ?? [],
            },
          },
          metadata: {
            saveVersion: 7,
            gameVersion: '3.9.0',
            features: ['save_migration_v7', 'backward_compatibility', 'data_integrity_checking'],
            compatibility: {
              minGameVersion: '3.8.0',
              maxGameVersion: '9.9.9',
            },
          },
        };

        // Use enhanced SaveManager with migration support
        const result = await SaveManager.save(parsedSlotId, saveFile);

        if (result.success) {
          // Update traditional save slots for UI compatibility
          const newSlots = saveSlots.filter((slot) => slot.id !== parsedSlotId);
          newSlots.push({
            id: parsedSlotId,
            name: slotName,
            playerName: saveFile.playerName,
            currentRoom: saveFile.progress.storylineProgress?.currentRoom || state.currentRoomId,
            timestamp: Date.now(),
            score: saveFile.progress.totalScore,
            playTime: state.metadata?.playTime || 0,
          });

          const sortedSlots = newSlots.sort((a, b) => a.id - b.id);
          setSaveSlots(sortedSlots);
          if (!safeSetStorageItem('gorstan_save_slots', JSON.stringify(sortedSlots))) {
            recordAppMessage(
              dispatch,
              'Save slot list could not be stored; browser storage is unavailable.',
              'warning',
            );
          }

          dispatch({
            type: 'RECORD_MESSAGE',
            payload: {
              id: `save-success-${Date.now()}`,
              text: `Game saved as "${slotName}" with migration support`,
              type: 'system',
              timestamp: Date.now(),
            },
          });
        } else {
          throw new Error(result.message);
        }

        closeModal();
      } catch (error) {
        console.error('Failed to save game:', error);
        recordAppMessage(dispatch, `Failed to save game: ${error}`, 'error');
      }
    },
    [state, saveSlots, dispatch, closeModal],
  );

  const handleLoad = useCallback(
    async (slotId: number) => {
      const parsedSlotId = parseSaveSlotId(slotId);
      if (parsedSlotId === null) {
        recordAppMessage(dispatch, `Refused load: invalid slot "${slotId}".`, 'error');
        return;
      }

      try {
        // Use enhanced SaveManager with automatic migration
        const saveFile = await SaveManager.load(parsedSlotId);

        if (saveFile) {
          // Load the save data
          if (saveFile.gameState) {
            const gameState = saveFile.gameState;
            const savedRoomId = resolveRoomId(roomMap, gameState.currentRoomId || 'controlnexus');

            dispatch({ type: 'ADVANCE_STAGE', payload: 'game' });
            dispatch({ type: 'SET_PLAYER_NAME', payload: gameState.player?.name || saveFile.playerName || 'Player' });
            dispatch({ type: 'MOVE_TO_ROOM', payload: savedRoomId });

            // Restore flags
            Object.entries(gameState.flags || {}).forEach(([flag, value]) => {
              dispatch({ type: 'SET_FLAG', payload: { flag, value } });
            });

            // Restore other state if available
            if (gameState.player.inventory) {
              gameState.player.inventory.forEach((item: string) => {
                dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
              });
            }

            if (savedRoomId !== gameState.currentRoomId) {
              recordAppMessage(
                dispatch,
                'Saved room was unavailable; returned to a safe starting room.',
                'warning',
              );
            }
          }

          dispatch({
            type: 'RECORD_MESSAGE',
            payload: {
              id: `load-success-${Date.now()}`,
              text: `Game loaded: "${saveFile.playerName}" (v${saveFile.version})`,
              type: 'system',
              timestamp: Date.now(),
            },
          });

          // Refresh save slots to reflect any migrations
          await loadSaveSlots();
          closeModal();
        } else {
          throw new Error('Save file not found or corrupted');
        }
      } catch (error) {
        console.error('Failed to load game:', error);
        dispatch({
          type: 'RECORD_MESSAGE',
          payload: {
            id: `load-error-${Date.now()}`,
            text: `Failed to load game: ${error}`,
            type: 'error',
            timestamp: Date.now(),
          },
        });
      }
    },
    [dispatch, closeModal, loadSaveSlots, roomMap],
  );

  const handleDeleteSave = useCallback(
    (slotId: number) => {
      const parsedSlotId = parseSaveSlotId(slotId);
      if (parsedSlotId === null) {
        recordAppMessage(dispatch, `Refused delete: invalid slot "${slotId}".`, 'error');
        return;
      }

      try {
        if (!SaveManager.deleteSave(parsedSlotId)) {
          recordAppMessage(dispatch, `Failed to delete save slot ${parsedSlotId + 1}.`, 'error');
          return;
        }

        const newSlots = saveSlots.filter((slot) => slot.id !== parsedSlotId);
        const sortedSlots = newSlots.sort((a, b) => a.id - b.id);
        setSaveSlots(sortedSlots);
        safeSetStorageItem('gorstan_save_slots', JSON.stringify(sortedSlots));

        dispatch({
          type: 'RECORD_MESSAGE',
          payload: {
            id: `delete-success-${Date.now()}`,
            text: 'Save deleted successfully',
            type: 'system',
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        console.error('Failed to delete save:', error);
      }
    },
    [saveSlots, dispatch],
  );

  // Load save slots on component mount
  useEffect(() => {
    loadSaveSlots();
  }, [loadSaveSlots]);

  return {
    saveSlots,
    loadSaveSlots,
    handleSave,
    handleLoad,
    handleDeleteSave,
  };
}
