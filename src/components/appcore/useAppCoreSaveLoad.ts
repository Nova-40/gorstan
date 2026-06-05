/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Save/load controller for AppCore modularisation.

  This hook mirrors AppCore's existing save-slot responsibilities but is kept
  separate so AppCore can be wired to it in a safe later patch.
*/

import { useCallback, useEffect, useState } from 'react';

import { SaveManager } from '../../services/SaveManager';
import type { SaveFile } from '../../services/SaveManager';
import type { AppCoreSaveSlot } from './AppCoreTypes';

interface UseAppCoreSaveLoadArgs {
  readonly state: any;
  readonly dispatch: (action: any) => void;
  readonly closeModal: () => void;
}

interface UseAppCoreSaveLoadResult {
  readonly saveSlots: AppCoreSaveSlot[];
  readonly loadSaveSlots: () => Promise<void>;
  readonly handleSave: (slotId: string, slotName: string) => Promise<void>;
  readonly handleLoad: (slotId: string) => Promise<void>;
  readonly handleDeleteSave: (slotId: string) => void;
}

function recordMessage(dispatch: (action: any) => void, text: string, type: 'system' | 'error' | 'warning' | 'info' = 'system'): void {
  dispatch({
    type: 'RECORD_MESSAGE',
    payload: {
      id: `save-load-${Date.now()}`,
      text,
      type,
      timestamp: Date.now(),
    },
  });
}

function getSavedCurrentRoom(saveFile: SaveFile, fallbackRoomId: string): string {
  const currentRoom = saveFile.progress.storylineProgress?.currentRoom;
  return typeof currentRoom === 'string' && currentRoom.length > 0 ? currentRoom : fallbackRoomId;
}

export function useAppCoreSaveLoad({ state, dispatch, closeModal }: UseAppCoreSaveLoadArgs): UseAppCoreSaveLoadResult {
  const [saveSlots, setSaveSlots] = useState<AppCoreSaveSlot[]>([]);

  const loadSaveSlots = useCallback(async () => {
    try {
      const saveSlotInfos = await SaveManager.listSlots();
      setSaveSlots(
        saveSlotInfos.map((slot) => ({
          id: slot.slot.toString(),
          name: slot.playerName,
          playerName: slot.playerName,
          currentRoom: 'Unknown',
          timestamp: Date.parse(slot.timestamp),
          score: 0,
          playTime: 0,
        })),
      );
    } catch (error) {
      console.error('Failed to load save slots:', error);
    }
  }, []);

  const handleSave = useCallback(
    async (slotId: string, slotName: string) => {
      try {
        const saveFile: SaveFile = {
          version: SaveManager.CURRENT_VERSION,
          playerName: state.player?.name || 'Player',
          progress: {
            questsCompleted: 0,
            achievementsUnlocked: (state.metadata?.achievements || []).length,
            totalScore: state.player?.score ?? 0,
            totalPlayTime: state.metadata?.playTime ?? 0,
            roomsVisited: Object.keys(state.flags || {}).filter((key) => key.startsWith('visited_')).length || 1,
            secretsFound: Object.keys(state.flags || {}).filter((key) => key.startsWith('secret_')).length || 0,
            characterInteractions: Object.keys(state.flags || {}).filter((key) => key.startsWith('met_')).length || 0,
            storylineProgress: {
              currentRoom: state.currentRoomId,
              flags: state.flags,
              inventory: state.player?.inventory || [],
              achievements: state.metadata?.achievements || [],
            },
          },
          timestamp: new Date().toISOString(),
          gameState: state,
          metadata: {
            saveVersion: SaveManager.CURRENT_VERSION,
            gameVersion: '3.8.8',
            features: ['modern_save_system', 'data_integrity_checking', 'automatic_optimization'],
            compatibility: {
              minGameVersion: '3.8.0',
              maxGameVersion: '9.9.9',
            },
          },
        };

        const numericSlotId = Number.parseInt(slotId, 10);
        const result = await SaveManager.save(numericSlotId, saveFile);
        if (!result.success) {
          throw new Error(result.message);
        }

        const newSlots = saveSlots.filter((slot) => slot.id !== slotId);
        newSlots.push({
          id: slotId,
          name: slotName,
          playerName: saveFile.playerName,
          currentRoom: getSavedCurrentRoom(saveFile, state.currentRoomId),
          timestamp: Date.now(),
          score: saveFile.progress.totalScore,
          playTime: state.metadata?.playTime || 0,
        });

        setSaveSlots(newSlots);
        recordMessage(dispatch, `Game saved as "${slotName}"`);
        closeModal();
      } catch (error) {
        console.error('Failed to save game:', error);
        recordMessage(dispatch, `Failed to save game: ${error}`, 'error');
      }
    },
    [state, saveSlots, dispatch, closeModal],
  );

  const handleLoad = useCallback(
    async (slotId: string) => {
      try {
        const saveFile = await SaveManager.load(Number.parseInt(slotId, 10));
        if (!saveFile) {
          throw new Error('Save file not found or corrupted');
        }

        const gameState = saveFile.gameState;
        if (gameState) {
          dispatch({ type: 'ADVANCE_STAGE', payload: gameState.stage });
          dispatch({ type: 'SET_PLAYER_NAME', payload: gameState.player?.name || saveFile.playerName });
          dispatch({ type: 'MOVE_TO_ROOM', payload: gameState.currentRoomId });

          Object.entries(gameState.flags || {}).forEach(([flag, value]) => {
            dispatch({ type: 'SET_FLAG', payload: { flag, value } });
          });

          if (gameState.player?.inventory) {
            gameState.player.inventory.forEach((item: string) => {
              dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
            });
          }
        }

        await loadSaveSlots();
        closeModal();
      } catch (error) {
        console.error('Failed to load game:', error);
        recordMessage(dispatch, `Failed to load game: ${error}`, 'error');
      }
    },
    [dispatch, closeModal, loadSaveSlots],
  );

  const handleDeleteSave = useCallback(
    (slotId: string) => {
      try {
        const deleted = SaveManager.deleteSave(Number.parseInt(slotId, 10));
        if (!deleted) {
          throw new Error('Save delete failed');
        }

        const newSlots = saveSlots.filter((slot) => slot.id !== slotId);
        setSaveSlots(newSlots);
        recordMessage(dispatch, 'Save deleted successfully');
      } catch (error) {
        console.error('Failed to delete save:', error);
        recordMessage(dispatch, `Failed to delete save: ${error}`, 'error');
      }
    },
    [saveSlots, dispatch],
  );

  useEffect(() => {
    void loadSaveSlots();
  }, [loadSaveSlots]);

  return {
    saveSlots,
    loadSaveSlots,
    handleSave,
    handleLoad,
    handleDeleteSave,
  };
}
