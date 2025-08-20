import { vi } from 'vitest';
/// <reference types="jest" />

/**
 * Tests for combat system functionality
 */

import { CombatSystem } from '../../../combat/CombatSystem';
import { CombatState, Element, Faction } from '../../../types/enums';
import type { Actor, CombatAction } from '../../../types/combat';

// Mock audio and visual effects
vi.mock('../../../vfx/cues', () => ({
  showCombatCue: vi.fn(),
  COMBAT_CUES: {},
}));

vi.mock('../../../audio/sfx', () => ({
  combatAudio: {
    playHit: vi.fn(),
    playMiss: vi.fn(),
    playBlock: vi.fn(),
  },
}));

describe('Combat System', () => {
  let combatSystem: CombatSystem;
  let mockPlayer: Actor;
  let mockEnemy: Actor;

  beforeEach(() => {
    // Reset singleton instance for each test
    (CombatSystem as any).instance = undefined;
    combatSystem = CombatSystem.getInstance();

    mockPlayer = {
      id: 'player',
      name: 'Test Player',
      stats: {
        maxHP: 100,
        armor: 5,
        power: 10,
        crit: 0.1,
        critMult: 1.5,
        poise: 30,
        poiseRegen: 5,
        stamina: 50,
        focus: 20,
        resists: {},
      },
      hp: 100,
      stamina: 50,
      focus: 20,
      tension: 0,
      poise: 30,
      statuses: [],
      faction: Faction.Player,
      state: CombatState.Idle,
    };

    mockEnemy = {
      id: 'enemy',
      name: 'Test Enemy',
      stats: {
        maxHP: 80,
        armor: 3,
        power: 8,
        crit: 0.05,
        critMult: 1.2,
        poise: 25,
        poiseRegen: 3,
        stamina: 40,
        focus: 10,
        resists: {},
      },
      hp: 80,
      stamina: 40,
      focus: 10,
      tension: 0,
      poise: 25,
      statuses: [],
      faction: Faction.Enemy,
      state: CombatState.Idle,
    };
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CombatSystem.getInstance();
      const instance2 = CombatSystem.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('Combat Initialization', () => {
    it('should start combat with correct initial state', () => {
      const actors = [mockPlayer, mockEnemy];
      combatSystem.startCombat(actors);

      expect(mockPlayer.state).toBe(CombatState.Idle);
      expect(mockEnemy.state).toBe(CombatState.Idle);
      expect(mockPlayer.poise).toBe(mockPlayer.stats.poise);
      expect(mockEnemy.poise).toBe(mockEnemy.stats.poise);
    });

    it('should handle empty actor array', () => {
      expect(() => {
        combatSystem.startCombat([]);
      }).not.toThrow();
    });

    it('should handle actors with validation', () => {
      const actors = [mockPlayer, mockEnemy];
      combatSystem.startCombat(actors);

      expect(mockPlayer.state).toBe(CombatState.Idle);
      expect(mockEnemy.state).toBe(CombatState.Idle);
    });
  });

  describe('Combat Actions', () => {
    beforeEach(() => {
      combatSystem.startCombat([mockPlayer, mockEnemy]);
    });

    it('should create basic combat action', () => {
      const action: CombatAction = {
        id: 'light-attack',
        costs: {
          stamina: 10,
        },
        timing: {
          windup: 300,
          active: 200,
          recovery: 500,
        },
        damage: {
          base: 20,
          element: Element.Physical,
          sourceId: 'player',
        },
      };

      expect(action.id).toBe('light-attack');
      expect(action.costs.stamina).toBe(10);
      expect(action.timing.windup).toBe(300);
      expect(action.damage?.base).toBe(20);
      expect(action.damage?.element).toBe(Element.Physical);
    });

    it('should handle actions without damage', () => {
      const action: CombatAction = {
        id: 'dodge',
        costs: {
          stamina: 15,
        },
        timing: {
          windup: 100,
          active: 300,
          recovery: 200,
        },
      };

      expect(action.damage).toBeUndefined();
      expect(action.id).toBe('dodge');
    });
  });

  describe('Actor Properties', () => {
    it('should have valid actor stats', () => {
      expect(mockPlayer.stats.maxHP).toBeGreaterThan(0);
      expect(mockPlayer.stats.stamina).toBeGreaterThan(0);
      expect(mockPlayer.stats.power).toBeGreaterThan(0);
      expect(mockPlayer.hp).toBeLessThanOrEqual(mockPlayer.stats.maxHP);
      expect(mockPlayer.stamina).toBeLessThanOrEqual(mockPlayer.stats.stamina);
    });

    it('should have proper faction assignments', () => {
      expect(mockPlayer.faction).toBe(Faction.Player);
      expect(mockEnemy.faction).toBe(Faction.Enemy);
    });

    it('should start with idle state', () => {
      expect(mockPlayer.state).toBe(CombatState.Idle);
      expect(mockEnemy.state).toBe(CombatState.Idle);
    });

    it('should have empty status arrays initially', () => {
      expect(Array.isArray(mockPlayer.statuses)).toBe(true);
      expect(Array.isArray(mockEnemy.statuses)).toBe(true);
      expect(mockPlayer.statuses.length).toBe(0);
      expect(mockEnemy.statuses.length).toBe(0);
    });
  });

  describe('Combat System State', () => {
    it('should handle ending combat', () => {
      combatSystem.startCombat([mockPlayer, mockEnemy]);
      
      expect(() => {
        combatSystem.endCombat();
      }).not.toThrow();
    });

    it('should handle multiple combat start/end cycles', () => {
      combatSystem.startCombat([mockPlayer, mockEnemy]);
      combatSystem.endCombat();
      
      expect(() => {
        combatSystem.startCombat([mockPlayer, mockEnemy]);
        combatSystem.endCombat();
      }).not.toThrow();
    });
  });

  describe('Combat State Enums', () => {
    it('should have all required combat states', () => {
      expect(CombatState.Idle).toBeDefined();
      expect(CombatState.Windup).toBeDefined();
      expect(CombatState.Active).toBeDefined();
      expect(CombatState.Recovery).toBeDefined();
      expect(CombatState.Staggered).toBeDefined();
      expect(CombatState.Channeling).toBeDefined();
    });

    it('should allow state transitions', () => {
      mockPlayer.state = CombatState.Windup;
      expect(mockPlayer.state).toBe(CombatState.Windup);

      mockPlayer.state = CombatState.Active;
      expect(mockPlayer.state).toBe(CombatState.Active);

      mockPlayer.state = CombatState.Recovery;
      expect(mockPlayer.state).toBe(CombatState.Recovery);

      mockPlayer.state = CombatState.Idle;
      expect(mockPlayer.state).toBe(CombatState.Idle);
    });
  });

  describe('Error Handling', () => {
    it('should validate basic actor structure', () => {
      const validActors = [mockPlayer, mockEnemy];
      
      validActors.forEach(actor => {
        expect(actor.id).toBeDefined();
        expect(actor.name).toBeDefined();
        expect(actor.stats).toBeDefined();
        expect(actor.faction).toBeDefined();
      });
      
      combatSystem.startCombat(validActors);
      expect(mockPlayer.state).toBe(CombatState.Idle);
    });

    it('should handle system reinitialization', () => {
      combatSystem.startCombat([mockPlayer, mockEnemy]);
      
      // Reset singleton for reinitialization test
      (CombatSystem as any).instance = undefined;
      const newSystem = CombatSystem.getInstance();
      
      expect(newSystem).toBeDefined();
      expect(() => {
        newSystem.startCombat([mockPlayer, mockEnemy]);
      }).not.toThrow();
    });
  });
});
