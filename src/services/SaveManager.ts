/*
  SaveManager - Modern save/load operations for the game
  Handles save/load operations with validation and optimization
*/

import type { LocalGameState } from '../types/GameTypes';

export interface SaveFile {
  version: number;
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
  playerName: string;
  timestamp: string;
  version: number;
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

export class SaveManager {
  public static CURRENT_VERSION = 7;

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
    try {
      // Validate before saving
      if (!this.validate(saveFile)) {
        return {
          success: false,
          message: 'Save validation failed - invalid save data structure'
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
          gameVersion: '3.8.8',
          features: [
            'modern_save_system',
            'data_integrity_checking',
            'automatic_optimization'
          ]
        }
      };

      // Generate checksum if game state exists
      if (finalSaveFile.gameState) {
        const saveFileForChecksum = { ...finalSaveFile };
        if (saveFileForChecksum.metadata) {
          delete saveFileForChecksum.metadata.checksum;
        }
        finalSaveFile.metadata!.checksum = this.generateChecksum(saveFileForChecksum);
      }

      const key = `save_slot_${slot}`;
      localStorage.setItem(key, JSON.stringify(finalSaveFile));
      
      return {
        success: true,
        message: `Game saved successfully to slot ${slot}`
      };

    } catch (error) {
      return {
        success: false,
        message: `Save failed: ${error}`,
        warnings: ['Save operation failed - please try again']
      };
    }
  }

  /**
   * Modern load operation without legacy migration
   */
  static async load(slot: number): Promise<SaveFile | null> {
    try {
      const key = `save_slot_${slot}`;
      const data = localStorage.getItem(key);
      if (!data) {return null;}

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
    
    for (let i = 0; i < 10; i++) {
      try {
        const key = `save_slot_${i}`;
        const data = localStorage.getItem(key);
        
        if (data) {
          const saveFile: SaveFile = JSON.parse(data);
          
          if (this.validate(saveFile)) {
            slots.push({
              slot: i,
              playerName: saveFile.playerName,
              timestamp: saveFile.timestamp,
              version: saveFile.version,
              needsMigration: false, // No migration needed in modern system
              compatible: true, // All modern saves are compatible
              size: data.length,
              migrationSummary: 'Modern save format'
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
    try {
      const key = `save_slot_${slot}`;
      localStorage.removeItem(key);
      return true;
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
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Clear all save data (for development/testing)
   */
  static clearAllSaves(): void {
    for (let i = 0; i < 10; i++) {
      const key = `save_slot_${i}`;
      localStorage.removeItem(key);
    }
  }
}
