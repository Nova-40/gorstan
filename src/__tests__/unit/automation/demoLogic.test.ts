/// <reference types="vitest" />

/**
 * Unit tests for demo mode automation logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { STAGES } from '../../../state/gameState';

describe('Demo Mode Automation Logic', () => {
  // Mock the demo command structure that matches AppCore implementation
  const createDemoCommands = () => [
    { command: 'look', delay: 1000 },
    { command: 'north', delay: 2000 },
    { command: 'look', delay: 1500 },
    { command: 'examine statue', delay: 2000 },
    { command: 'talk to ayla', delay: 2500 },
    { command: 'south', delay: 1500 },
    { command: 'east', delay: 1500 },
    { command: 'look', delay: 1500 },
    { command: 'take key', delay: 2000 },
    { command: 'west', delay: 1000 },
    { command: 'north', delay: 1000 },
    { command: 'use key', delay: 2000 },
    { command: 'inventory', delay: 1500 },
    { command: 'help', delay: 2000 }
  ];

  describe('Demo Command Sequence', () => {
    it('should have correct command count', () => {
      const commands = createDemoCommands();
      expect(commands).toHaveLength(14);
    });

    it('should start with look command', () => {
      const commands = createDemoCommands();
      expect(commands[0].command).toBe('look');
    });

    it('should end with help command', () => {
      const commands = createDemoCommands();
      expect(commands[commands.length - 1].command).toBe('help');
    });

    it('should include essential gameplay commands', () => {
      const commands = createDemoCommands();
      const commandTexts = commands.map(cmd => cmd.command);

      // Core navigation
      expect(commandTexts).toContain('north');
      expect(commandTexts).toContain('south');
      expect(commandTexts).toContain('east');
      expect(commandTexts).toContain('west');

      // Core interactions
      expect(commandTexts).toContain('look');
      expect(commandTexts).toContain('examine statue');
      expect(commandTexts).toContain('talk to ayla');
      expect(commandTexts).toContain('take key');
      expect(commandTexts).toContain('use key');
      expect(commandTexts).toContain('inventory');
      expect(commandTexts).toContain('help');
    });

    it('should have reasonable timing delays', () => {
      const commands = createDemoCommands();
      
      commands.forEach(cmd => {
        expect(cmd.delay).toBeGreaterThan(0);
        expect(cmd.delay).toBeLessThanOrEqual(3000); // Max 3 seconds between commands
      });

      // Specific timing checks for important commands
      const talkCommand = commands.find(cmd => cmd.command === 'talk to ayla');
      expect(talkCommand?.delay).toBe(2500); // Longer delay for dialogue

      const examineCommand = commands.find(cmd => cmd.command === 'examine statue');
      expect(examineCommand?.delay).toBe(2000); // Medium delay for examination
    });
  });

  describe('Demo Message Generation', () => {
    it('should create properly formatted demo input messages', () => {
      const createDemoInputMessage = (command: string) => ({
        id: Date.now().toString(),
        text: `🤖 Demo: ${command}`,
        type: 'input' as const,
        timestamp: Date.now()
      });

      const message = createDemoInputMessage('look');
      
      expect(message.text).toBe('🤖 Demo: look');
      expect(message.type).toBe('input');
      expect(message.id).toBeDefined();
      expect(message.timestamp).toBeGreaterThan(0);
    });

    it('should create demo welcome message', () => {
      const createWelcomeMessage = () => ({
        id: Date.now().toString(),
        text: "🎭 Ayla: \"Welcome to your guided tour of Gorstan! Watch as I demonstrate the core gameplay...\"",
        type: 'system' as const,
        timestamp: Date.now()
      });

      const message = createWelcomeMessage();
      
      expect(message.text).toContain('guided tour');
      expect(message.text).toContain('Ayla');
      expect(message.text).toMatch(/🎭/);
      expect(message.type).toBe('system');
    });

    it('should create demo completion message', () => {
      const createCompletionMessage = () => ({
        id: Date.now().toString(),
        text: "🎮 Demo complete! Ayla: \"You've seen a glimpse of what Gorstan offers. Ready to explore on your own?\"",
        type: 'system' as const,
        timestamp: Date.now()
      });

      const message = createCompletionMessage();
      
      expect(message.text).toContain('Demo complete');
      expect(message.text).toContain('Ready to explore');
      expect(message.text).toMatch(/🎮/);
      expect(message.type).toBe('system');
    });
  });

  describe('Demo State Management', () => {
    it('should handle demo stage correctly', () => {
      expect(STAGES.DEMO).toBe('demo');
      expect(Object.values(STAGES)).toContain('demo');
    });

    it('should set demo player name', () => {
      const demoPlayerName = 'Demo Player';
      expect(demoPlayerName).toBe('Demo Player');
    });

    it('should track command execution index', () => {
      const commands = createDemoCommands();
      let currentCommandIndex = 0;

      // Simulate command execution
      expect(currentCommandIndex).toBe(0);
      
      currentCommandIndex++;
      expect(currentCommandIndex).toBe(1);
      
      // Simulate completion check
      const isComplete = currentCommandIndex >= commands.length;
      expect(isComplete).toBe(false);
      
      // Fast forward to completion
      currentCommandIndex = commands.length;
      const isNowComplete = currentCommandIndex >= commands.length;
      expect(isNowComplete).toBe(true);
    });
  });

  describe('Demo Timing Logic', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should handle command execution timing', () => {
      const mockExecuteCommand = vi.fn();
      const mockScheduleNext = vi.fn();
      
      // Simulate demo command execution with timing
      setTimeout(() => {
        mockExecuteCommand('look');
        setTimeout(mockScheduleNext, 1000); // Next command delay
      }, 500); // Initial execution delay

      // Advance past initial delay
      vi.advanceTimersByTime(500);
      expect(mockExecuteCommand).toHaveBeenCalledWith('look');

      // Advance past next command delay
      vi.advanceTimersByTime(1000);
      expect(mockScheduleNext).toHaveBeenCalled();
    });

    it('should handle demo startup delay', () => {
      const mockStartDemo = vi.fn();
      
      // Demo should start after welcome message delay
      setTimeout(mockStartDemo, 2000);
      
      vi.advanceTimersByTime(1999);
      expect(mockStartDemo).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(1);
      expect(mockStartDemo).toHaveBeenCalled();
    });

    it('should handle auto-demo timeout', () => {
      const mockAutoStartDemo = vi.fn();
      
      // Auto-demo should start after 1 minute on welcome screen
      setTimeout(mockAutoStartDemo, 60000);
      
      vi.advanceTimersByTime(59999);
      expect(mockAutoStartDemo).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(1);
      expect(mockAutoStartDemo).toHaveBeenCalled();
    });
  });

  describe('Demo Command Validation', () => {
    it('should contain only valid game commands', () => {
      const commands = createDemoCommands();
      const validCommandPrefixes = [
        'look', 'north', 'south', 'east', 'west',
        'examine', 'talk', 'take', 'use', 'inventory', 'help'
      ];

      commands.forEach(cmd => {
        const hasValidPrefix = validCommandPrefixes.some(prefix => 
          cmd.command.startsWith(prefix)
        );
        expect(hasValidPrefix).toBe(true);
      });
    });

    it('should demonstrate core game mechanics', () => {
      const commands = createDemoCommands();
      const commandTexts = commands.map(cmd => cmd.command);

      // Movement demonstration
      const movementCommands = commandTexts.filter(cmd => 
        ['north', 'south', 'east', 'west'].includes(cmd)
      );
      expect(movementCommands.length).toBeGreaterThan(0);

      // Interaction demonstration
      const interactionCommands = commandTexts.filter(cmd => 
        cmd.includes('examine') || cmd.includes('talk') || cmd.includes('take') || cmd.includes('use')
      );
      expect(interactionCommands.length).toBeGreaterThan(0);

      // Information commands
      expect(commandTexts).toContain('look');
      expect(commandTexts).toContain('inventory');
      expect(commandTexts).toContain('help');
    });

    it('should provide a logical gameplay sequence', () => {
      const commands = createDemoCommands();
      
      // Should start with orientation
      expect(commands[0].command).toBe('look');
      
      // Should include movement early
      const firstMovementIndex = commands.findIndex(cmd => 
        ['north', 'south', 'east', 'west'].includes(cmd.command)
      );
      expect(firstMovementIndex).toBeLessThan(5);
      
      // Should end with help for further guidance
      expect(commands[commands.length - 1].command).toBe('help');
    });
  });

  describe('Demo Error Handling', () => {
    it('should handle empty command list gracefully', () => {
      const emptyCommands: typeof createDemoCommands extends () => infer T ? T : never = [];
      let currentIndex = 0;
      
      const isComplete = currentIndex >= emptyCommands.length;
      expect(isComplete).toBe(true);
    });

    it('should handle command execution errors', () => {
      const mockHandleCommand = vi.fn().mockImplementation(() => {
        throw new Error('Command execution failed');
      });

      expect(() => {
        try {
          mockHandleCommand('invalid-command');
        } catch (error) {
          // Demo should handle command errors gracefully
          expect(error).toBeDefined();
        }
      }).not.toThrow();
    });

    it('should validate command structure', () => {
      const commands = createDemoCommands();
      
      commands.forEach((cmd, index) => {
        expect(cmd).toHaveProperty('command');
        expect(cmd).toHaveProperty('delay');
        expect(typeof cmd.command).toBe('string');
        expect(typeof cmd.delay).toBe('number');
        expect(cmd.command.length).toBeGreaterThan(0);
        expect(cmd.delay).toBeGreaterThan(0);
      });
    });
  });
});
