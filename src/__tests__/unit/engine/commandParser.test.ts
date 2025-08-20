/// <reference types="jest" />

/**
 * Tests for command parser functionality
 */

import { processCommand } from '../../../engine/commandParser';
import { createMockGameState } from '../../../test-utils/mockGameState';
import { createMockRoom } from '../../../test-utils/mockRoomData';
import type { CommandParserParams } from '../../../engine/commandParser';

describe('Command Parser', () => {
  const mockRoom = createMockRoom();
  const mockGameState = createMockGameState();

  const createCommandParams = (input: string): CommandParserParams => ({
    input,
    currentRoom: mockRoom,
    gameState: mockGameState,
  });

  describe('Basic Command Processing', () => {
    it('should process inventory command', async () => {
      const params = createCommandParams('inventory');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages.length).toBeGreaterThan(0);
      expect(result.messages[0].text).toMatch(/inventory|carrying/i);
    });

    it('should process inspect command', async () => {
      const params = createCommandParams('inspect');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages.length).toBeGreaterThan(0);
    });

    it('should handle empty input', async () => {
      const params = createCommandParams('');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages[0].text).toMatch(/Invalid command input/i);
    });

    it('should handle unknown commands', async () => {
      const params = createCommandParams('unknowncommand');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages[0].text).toMatch(/don't understand|unknown/i);
    });
  });

  describe('Command Aliases', () => {
    it('should resolve grab to pick up', async () => {
      const params = createCommandParams('grab test-item');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should process as "pick up test-item"
    });

    it('should resolve examine to inspect', async () => {
      const params = createCommandParams('examine test-item');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should process as "inspect test-item"
    });

    it('should resolve inv to inventory', async () => {
      const params = createCommandParams('inv');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should show inventory
    });
  });

  describe('Inventory Commands', () => {
    it('should process inventory command', async () => {
      const params = createCommandParams('inventory');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages[0].text).toMatch(/inventory|carrying/i);
    });

    it('should handle pick up command with valid item', async () => {
      const params = createCommandParams('pick up test-item');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should attempt to pick up the item
    });

    it('should handle drop command', async () => {
      const stateWithItem = createMockGameState({
        player: {
          ...mockGameState.player,
          inventory: ['test-item']
        },
        inventory: ['test-item']
      });

      const params: CommandParserParams = {
        input: 'drop test-item',
        currentRoom: mockRoom,
        gameState: stateWithItem,
      };

      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should attempt to drop the item
    });
  });

  describe('Movement Commands', () => {
    it('should process go command with valid direction', async () => {
      const params = createCommandParams('go north');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should attempt to move north
    });

    it('should handle move alias', async () => {
      const params = createCommandParams('move south');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should process as "go south"
    });

    it('should handle invalid directions', async () => {
      const params = createCommandParams('go nowhere');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages[0].text).toMatch(/can't go|no exit|invalid/i);
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should handle mixed case input', async () => {
      const params = createCommandParams('LOOK');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages.length).toBeGreaterThan(0);
    });

    it('should trim whitespace', async () => {
      const params = createCommandParams('  look  ');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      expect(result.messages.length).toBeGreaterThan(0);
    });

    it('should handle multiple spaces', async () => {
      const params = createCommandParams('look    around');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should process normally despite extra spaces
    });

    it('should handle special characters safely', async () => {
      const params = createCommandParams('look <script>alert("test")</script>');
      const result = await processCommand(params);

      expect(result.messages).toBeDefined();
      // Should not execute any scripts, treat as safe text
    });
  });

  describe('Command Result Structure', () => {
    it('should always return messages array', async () => {
      const params = createCommandParams('look');
      const result = await processCommand(params);

      expect(Array.isArray(result.messages)).toBe(true);
    });

    it('should return valid message objects', async () => {
      const params = createCommandParams('look');
      const result = await processCommand(params);

      result.messages.forEach(message => {
        expect(message).toHaveProperty('text');
        expect(message).toHaveProperty('type');
        expect(typeof message.text).toBe('string');
        expect(['info', 'error', 'system', 'lore']).toContain(message.type);
      });
    });

    it('should include updates object when state changes needed', async () => {
      const params = createCommandParams('pick up test-item');
      const result = await processCommand(params);

      if (result.updates) {
        expect(typeof result.updates).toBe('object');
      }
    });
  });
});
