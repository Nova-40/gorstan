import { describe, test, expect, beforeEach } from 'vitest';
import { SaveManager } from '../services/SaveManager';

describe('Save Migration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('Save format includes current version', async () => {
    const mockSaveFile = {
      playerName: 'Test Player',
      timestamp: new Date().toISOString(),
      version: 1, // Will be updated by save method
      metadata: {
        saveVersion: 1,
        gameVersion: '3.8.8',
        timestamp: new Date().toISOString()
      },
      gameData: {
        currentRoomId: 'test-room',
        player: { inventory: [] },
        flags: { testFlag: true }
      }
    };

    const result = await SaveManager.save(0, mockSaveFile);
    expect(result.success).toBe(true);

    // Check that saved data has current version
    const savedData = localStorage.getItem('save_slot_0');
    expect(savedData).toBeTruthy();

    const parsed = JSON.parse(savedData!);
    expect(parsed.version).toBe(SaveManager.CURRENT_VERSION);
    expect(parsed.metadata.saveVersion).toBe(SaveManager.CURRENT_VERSION);
  });

  test('Load handles missing version gracefully', () => {
    // Create a save without version (simulating old save)
    const oldSave = {
      currentRoomId: 'test-room',
      player: { name: 'Test Player', inventory: [] },
      flags: { oldFlag: true },
      history: []
      // No version field
    };

    localStorage.setItem('save_slot_legacy', JSON.stringify(oldSave));

    const result = SaveManager.loadGame('legacy');
    
    // Should handle gracefully
    if (result.success) {
      expect(result.data).toBeDefined();
    } else {
      // Or provide helpful error
      expect(result.error).toContain('version');
    }
  });

  test('Version compatibility check', () => {
    const validSave = {
      version: SaveManager.CURRENT_VERSION,
      currentRoomId: 'test-room',
      player: { name: 'Test Player', inventory: [] },
      flags: { testFlag: true },
      history: [],
      metadata: {
        saveVersion: SaveManager.CURRENT_VERSION,
        gameVersion: '3.8.8',
        timestamp: new Date().toISOString()
      }
    };

    localStorage.setItem('save_slot_valid', JSON.stringify(validSave));

    const result = SaveManager.loadGame('valid');
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.version).toBe(SaveManager.CURRENT_VERSION);
    }
  });

  test('Future version handling', () => {
    const futureSave = {
      version: SaveManager.CURRENT_VERSION + 5, // Future version
      currentRoomId: 'test-room',
      player: { name: 'Test Player', inventory: [] },
      flags: { futureFlag: true },
      history: [],
      metadata: {
        saveVersion: SaveManager.CURRENT_VERSION + 5,
        gameVersion: '4.0.0',
        timestamp: new Date().toISOString()
      }
    };

    localStorage.setItem('save_slot_future', JSON.stringify(futureSave));

    const result = SaveManager.loadGame('future');
    
    // Should handle future versions gracefully
    if (!result.success) {
      expect(result.error).toContain('version');
    }
  });

  test('Metadata preservation during save/load cycle', () => {
    const gameState = {
      currentRoomId: 'test-room',
      player: { name: 'Test Player', inventory: ['item1'] },
      flags: { important: true },
      history: [{ id: 1, text: 'Test message', timestamp: Date.now() }]
    };

    // Save
    const saveResult = SaveManager.saveGame('metadata-test', gameState);
    expect(saveResult.success).toBe(true);

    // Load
    const loadResult = SaveManager.loadGame('metadata-test');
    expect(loadResult.success).toBe(true);

    if (loadResult.success) {
      expect(loadResult.data.version).toBe(SaveManager.CURRENT_VERSION);
      expect(loadResult.data.currentRoomId).toBe('test-room');
      expect(loadResult.data.player.name).toBe('Test Player');
      expect(loadResult.data.flags.important).toBe(true);
    }
  });

  test('Corrupted save handling', () => {
    // Store corrupted JSON
    localStorage.setItem('save_slot_corrupted', '{ invalid json');

    const result = SaveManager.loadGame('corrupted');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('Empty save slot handling', () => {
    const result = SaveManager.loadGame('nonexistent');
    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });
});
