/*
  SaveManager - Modern save/load operations for the game
  Handles save/load operations with validation and optimization
*/

import type { LocalGameState } from '../types/GameTypes';
import { safeGetStorageItem, safeRemoveStorageItem, safeSetStorageItem } from '../utils/safeStorage';

export interface SaveFile {
  version: number;
  saveName?: string;
  playerName: string;
  progress: {
    questsCompleted: number;
    achievementsUnlocked: number;
    totalScore: number;
    totalPlayTime: number;
    roomsVisited: number;
    secretsFound: number;
    characterInteractions: number;
    storylineProgress?: Record<string, unknown>;
  };
  timestamp: string;
  gameState?: LocalGameState;
  metadata?: {
    saveVersion: number;
    gameVersion: string;
    checksum?: string;
    features?: string[];
    compatibility?: {
      minGameVersion: string;
      maxGameVersion: string;
    };
  };
}

export interface SaveSlotInfo {
  slot: number;
  saveName: string;
  playerName: string;
  currentRoom: string;
  timestamp: string;
  version: number;
  totalScore: number;
  playTime: number;
  needsMigration: boolean;
  compatible: boolean;
  size: number;
  migrationSummary: string;
}

export interface SaveOperation {
  success: boolean;
  message: string;
  backupId?: string;
  warnings?: string[];
}

export const MAX_SAVE_SLOTS = 10;

export function isValidSaveSlot(slot: unknown): slot is number {
  return typeof slot === 'number' && Number.isInteger(slot) && slot >= 0 && slot < MAX_SAVE_SLOTS;
}

export function parseSaveSlotId(value: unknown): number | null {
  if (typeof value === 'number') {
    return isValidSaveSlot(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);
  return isValidSaveSlot(parsed) ? parsed : null;
}

export class SaveManager {
  public static CURRENT_VERSION = 7;

  private static getSaveSlotKey(slot: number): string | null {
    return isValidSaveSlot(slot) ? `save_slot_${slot}` : null;
  }

  /**
   * Modern validation for save files
   */
  static validate(saveFile: SaveFile): boolean {
    if (!saveFile || typeof saveFile !== 'object') {
      return false;
    }

    // Basic structure validation
    if (!saveFile.playerName || !saveFile.timestamp) {
      return false;
    }

    // Version validation
    if (typeof saveFile.version !== 'number' || saveFile.version < 1) {
      return false;
    }

    // Game state validation
    if (saveFile.gameState) {
      return this.validateGameState(saveFile.gameState);
    }

    return true;
  }

  /**
   * Validate game state structure
   */
  private static validateGameState(gameState: LocalGameState): boolean {
    if (!gameState || typeof gameState !== 'object') {
      return false;
    }

    // Check essential properties exist
    return (
      gameState.player &&
      typeof gameState.player === 'object' &&
      typeof gameState.currentRoomId === 'string' &&
      Array.isArray(gameState.history)
    );
  }

  /**
   * Modern save operation without legacy migration
   */
  static async save(slot: number, saveFile: SaveFile): Promise<SaveOperation> {
    if (!isValidSaveSlot(slot)) {
      return {
        success: false,
        message: `Save failed: invalid slot "${slot}"`,
        warnings: ['Saves must target a numeric slot between 0 and 9'],
      };
    }

    try {
      // Validate before saving
      if (!this.validate(saveFile)) {
        return {
          success: false,
          message: 'Save validation failed - invalid save data structure',
        };
      }

      // Create final save file with current version
      const finalSaveFile: SaveFile = {
        ...saveFile,
        timestamp: new Date().toISOString(),
        version: this.CURRENT_VERSION,
        metadata: {
          ...saveFile.metadata,
          saveVersion: this.CURRENT_VERSION,
          gameVersion: '3.9.0',
          features: ['modern_save_system', 'data_integrity_checking', 'automatic_optimization'],
        },
      };

      // Generate checksum if game state exists
      if (finalSaveFile.gameState) {
        const saveFileForChecksum = { ...finalSaveFile };
        if (saveFileForChecksum.metadata) {
          delete saveFileForChecksum.metadata.checksum;
        }
        finalSaveFile.metadata = {
          saveVersion: finalSaveFile.metadata?.saveVersion ?? this.CURRENT_VERSION,
          gameVersion: finalSaveFile.metadata?.gameVersion ?? '3.9.0',
          features: finalSaveFile.metadata?.features,
          compatibility: finalSaveFile.metadata?.compatibility,
          checksum: this.generateChecksum(saveFileForChecksum),
        };
      }

      const key = this.getSaveSlotKey(slot);
      if (!key) {
        return {
          success: false,
          message: `Save failed: invalid slot "${slot}"`,
          warnings: ['Saves must target a numeric slot between 0 and 9'],
        };
      }

      if (!safeSetStorageItem(key, JSON.stringify(finalSaveFile))) {
        return {
          success: false,
          message: 'Save failed: local storage is unavailable',
          warnings: ['Browser storage is unavailable or full'],
        };
      }

      return {
        success: true,
        message: `Game saved successfully to slot ${slot}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Save failed: ${error}`,
        warnings: ['Save operation failed - please try again'],
      };
    }
  }

  /**
   * Modern load operation without legacy migration
   */
  static async load(slot: number): Promise<SaveFile | null> {
    if (!isValidSaveSlot(slot)) {
      console.warn(`[SaveManager] Ignored invalid slot id: ${slot}`);
      return null;
    }

    try {
      const key = this.getSaveSlotKey(slot);
      if (!key) {
        return null;
      }
      const data = safeGetStorageItem(key);
      if (!data) {
        return null;
      }

      const saveFile: SaveFile = JSON.parse(data);

      // Basic validation
      if (!this.validate(saveFile)) {
        console.warn(`[SaveManager] Invalid save file in slot ${slot}`);
        return null;
      }

      return saveFile;
    } catch (error) {
      console.error('[SaveManager] Load failed:', error);
      return null;
    }
  }

  /**
   * List all available save slots
   */
  static async listSlots(): Promise<SaveSlotInfo[]> {
    const slots: SaveSlotInfo[] = [];

    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      try {
        const key = this.getSaveSlotKey(i);
        if (!key) {
          continue;
        }
        const data = safeGetStorageItem(key);

        if (data) {
          const saveFile: SaveFile = JSON.parse(data);

          if (this.validate(saveFile)) {
            const gameState = saveFile.gameState;
            slots.push({
              slot: i,
              saveName: saveFile.saveName || saveFile.playerName || `Slot ${i + 1}`,
              playerName: saveFile.playerName,
              currentRoom: gameState?.currentRoomId || 'Unknown',
              timestamp: saveFile.timestamp,
              version: saveFile.version,
              totalScore: saveFile.progress.totalScore || 0,
              playTime: saveFile.progress.totalPlayTime || 0,
              needsMigration: false, // No migration needed in modern system
              compatible: true, // All modern saves are compatible
              size: data.length,
              migrationSummary: 'Modern save format',
            });
          }
        }
      } catch (error) {
        console.warn(`[SaveManager] Error reading slot ${i}:`, error);
      }
    }

    return slots;
  }

  /**
   * Delete a save slot
   */
  static deleteSave(slot: number): boolean {
    if (!isValidSaveSlot(slot)) {
      console.warn(`[SaveManager] Ignored invalid slot delete request: ${slot}`);
      return false;
    }

    try {
      const key = this.getSaveSlotKey(slot);
      if (!key) {
        return false;
      }
      return safeRemoveStorageItem(key);
    } catch (error) {
      console.error('[SaveManager] Delete failed:', error);
      return false;
    }
  }

  /**
   * Generate checksum for save data integrity
   */
  private static generateChecksum(data: Record<string, unknown>): string {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Clear all save data (for development/testing)
   */
  static clearAllSaves(): void {
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      const key = this.getSaveSlotKey(i);
      if (key) {
        safeRemoveStorageItem(key);
      }
    }
  }
}
