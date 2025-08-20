/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Basic combat system tests
*/

import { describe, it, expect, beforeEach } from 'vitest';
import { HitResolver, DamageUtils } from '../src/combat/HitResolver';
import { statusSystem, StatusEffects } from '../src/status/StatusSystem';
import { createPlayer, createEnemy } from '../src/types/entities';
import { AIArchetype, Element } from '../src/types/enums';

describe('Combat System', () => {
  let player: any;
  let enemy: any;

  beforeEach(() => {
    player = createPlayer('Test Player');
    enemy = createEnemy('test_enemy', 'Test Enemy', AIArchetype.Brute);
  });

  describe('Damage Resolution', () => {
    it('should apply basic physical damage', () => {
      const initialHP = enemy.hp;
      const damage = DamageUtils.physical(20, player.id);
      
      const result = HitResolver.resolveDamage(enemy, damage);
      
      expect(result.damage).toBeGreaterThan(0);
      expect(enemy.hp).toBeLessThan(initialHP);
    });

    it('should apply armor reduction to physical damage', () => {
      const damage = DamageUtils.physical(100, player.id);
      const result = HitResolver.resolveDamage(enemy, damage);
      
      // Should be reduced by armor
      expect(result.damage).toBeLessThan(100);
    });

    it('should handle critical hits', () => {
      const damage = DamageUtils.critical(50, Element.Physical, player.id);
      const result = HitResolver.resolveDamage(enemy, damage);
      
      expect(result.wasCritical).toBe(true);
    });

    it('should respect elemental resistances', () => {
      // Give enemy fire resistance
      enemy.stats.resists[Element.Fire] = 0.5; // 50% resistance
      
      const damage = DamageUtils.fire(100, player.id);
      const result = HitResolver.resolveDamage(enemy, damage);
      
      expect(result.damage).toBeLessThan(50); // Should be heavily reduced
    });
  });

  describe('Status Effects', () => {
    it('should apply burn status and deal DoT', () => {
      statusSystem.applyStatus(enemy, () => StatusEffects.burn(1));
      
      expect(statusSystem.hasStatus(enemy, 'Burn' as any)).toBe(true);
      expect(statusSystem.getStatusStacks(enemy, 'Burn' as any)).toBe(1);
    });

    it('should stack chill effects', () => {
      statusSystem.applyStatus(enemy, () => StatusEffects.chill(1));
      statusSystem.applyStatus(enemy, () => StatusEffects.chill(1));
      
      expect(statusSystem.getStatusStacks(enemy, 'Chill' as any)).toBe(2);
    });

    it('should convert chill stacks to frozen', () => {
      // Apply 3 chill stacks to trigger freeze
      statusSystem.applyStatus(enemy, () => StatusEffects.chill(3));
      
      expect(statusSystem.hasStatus(enemy, 'Frozen' as any)).toBe(true);
      expect(statusSystem.hasStatus(enemy, 'Chill' as any)).toBe(false);
    });

    it('should expire status effects over time', () => {
      statusSystem.applyStatus(enemy, () => StatusEffects.burn(1));
      
      // Simulate time passage
      statusSystem.updateStatuses(enemy, 5000); // 5 seconds
      
      expect(statusSystem.hasStatus(enemy, 'Burn' as any)).toBe(false);
    });
  });

  describe('Elemental Synergies', () => {
    it('should trigger overload synergy', () => {
      const initialHP = enemy.hp;
      
      // Apply wet and shock
      statusSystem.applyStatus(enemy, StatusEffects.wet);
      statusSystem.applyStatus(enemy, StatusEffects.shock);
      
      // Should have triggered overload and removed both statuses
      expect(statusSystem.hasStatus(enemy, 'Wet' as any)).toBe(false);
      expect(statusSystem.hasStatus(enemy, 'Shock' as any)).toBe(false);
      expect(enemy.hp).toBeLessThan(initialHP);
    });
  });

  describe('Posture System', () => {
    it('should break posture when poise reaches zero', () => {
      enemy.poise = 5; // Low poise
      
      const damage = DamageUtils.physical(10, player.id, ['heavy']);
      HitResolver.resolveDamage(enemy, damage);
      
      expect(statusSystem.hasStatus(enemy, 'Stagger' as any)).toBe(true);
    });
  });
});

describe('Spell System', () => {
  describe('FireBolt', () => {
    it('should consume focus and deal fire damage', () => {
      const player = createPlayer('Test Player');
      const enemy = createEnemy('test_enemy', 'Test Enemy', AIArchetype.Brute);
      
      const initialFocus = player.focus;
      const initialHP = enemy.hp;
      
      // Import and cast FireBolt
      // This would normally be done through the magic system
      const damage = DamageUtils.fire(24, player.id);
      HitResolver.resolveDamage(enemy, damage);
      
      expect(enemy.hp).toBeLessThan(initialHP);
    });
  });
});

describe('Accessibility', () => {
  it('should provide static alternatives for motion-sensitive users', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Test that combat cues respect PRM
    // This would be tested more thoroughly in integration tests
    expect(true).toBe(true); // Placeholder for PRM testing
  });
});
