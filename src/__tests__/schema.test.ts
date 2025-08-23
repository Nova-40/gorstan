import { describe, test, expect } from 'vitest';
import { RoomSchema, SaveDataSchema } from '../schema/room';
import { assert, safeParse, isValid } from '../schema/assert';

describe('Schema Validation', () => {
  describe('RoomSchema', () => {
    test('validates correct room data', () => {
      const validRoom = {
        id: 'test-room',
        name: 'Test Room',
        zone: 'testZone',
        image: 'test.jpg',
        description: 'A test room',
        exits: [
          { to: 'other-room', description: 'Go north' }
        ]
      };

      expect(() => assert(validRoom, RoomSchema)).not.toThrow();
      expect(isValid(validRoom, RoomSchema)).toBe(true);
      
      const result = safeParse(validRoom, RoomSchema);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('test-room');
      }
    });

    test('rejects invalid room data', () => {
      const invalidRoom = {
        id: '', // Empty string should fail
        name: 'Test Room',
        zone: 'testZone'
        // Missing required fields
      };

      expect(() => assert(invalidRoom, RoomSchema)).toThrow();
      expect(isValid(invalidRoom, RoomSchema)).toBe(false);
      
      const result = safeParse(invalidRoom, RoomSchema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('id');
      }
    });

    test('handles optional fields correctly', () => {
      const minimalRoom = {
        id: 'minimal',
        name: 'Minimal Room',
        zone: 'testZone',
        image: 'minimal.jpg',
        description: 'Basic room'
      };

      const result = safeParse(minimalRoom, RoomSchema);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.exits).toEqual([]);
        expect(result.data.items).toBeUndefined();
        expect(result.data.npcs).toBeUndefined();
      }
    });
  });

  describe('SaveDataSchema', () => {
    test('validates correct save data', () => {
      const validSave = {
        version: 1,
        player: {
          currentRoom: 'start-room',
          inventory: ['sword', 'potion'],
          health: 75
        },
        flags: {
          hasKey: true,
          doorUnlocked: false
        },
        visitedRooms: ['start-room', 'forest'],
        timestamp: new Date().toISOString()
      };

      expect(() => assert(validSave, SaveDataSchema)).not.toThrow();
      expect(isValid(validSave, SaveDataSchema)).toBe(true);
    });

    test('applies default values correctly', () => {
      const minimalSave = {
        version: 1,
        player: {
          currentRoom: 'start'
        }
      };

      const result = safeParse(minimalSave, SaveDataSchema);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.player.inventory).toEqual([]);
        expect(result.data.player.health).toBe(100);
        expect(result.data.flags).toEqual({});
        expect(result.data.visitedRooms).toEqual([]);
      }
    });

    test('enforces health constraints', () => {
      const invalidHealth = {
        version: 1,
        player: {
          currentRoom: 'start',
          health: 150 // Over maximum
        }
      };

      expect(isValid(invalidHealth, SaveDataSchema)).toBe(false);
      
      const negativeHealth = {
        version: 1,
        player: {
          currentRoom: 'start',
          health: -10 // Below minimum
        }
      };

      expect(isValid(negativeHealth, SaveDataSchema)).toBe(false);
    });
  });

  describe('Assert utility functions', () => {
    test('assert throws descriptive errors', () => {
      const invalid = { id: '' };
      
      expect(() => assert(invalid, RoomSchema, 'test room')).toThrow(
        expect.stringMatching(/test room|Invalid data structure/)
      );
    });

    test('safeParse returns detailed error messages', () => {
      const invalid = { 
        id: '',
        exits: [{ to: '' }] // Nested validation error
      };
      
      const result = safeParse(invalid, RoomSchema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('id');
        expect(result.error).toContain('exits.0.to');
      }
    });
  });
});
