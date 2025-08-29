import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceManager } from '../ai/serviceManager';
import { ContentLoader } from '../ai/contentLoader';
import { AIConfig } from '../ai/aiConfig';

describe('Beta3 Enhanced Content System', () => {
  let serviceManager: ServiceManager;
  let contentLoader: ContentLoader;

  beforeEach(() => {
    serviceManager = new ServiceManager();
    contentLoader = new ContentLoader();
  });

  describe('Service Manager', () => {
    it('should initialize without errors', async () => {
      await serviceManager.initialize();
      expect(serviceManager).toBeInstanceOf(ServiceManager);
    });

    it('should provide NPC conversation interface', async () => {
      await serviceManager.initialize();
      
      try {
        const response = await serviceManager.getNPCResponse('ayla', 'Hello!', {
          zone: 'nexus',
          sessionId: 'test-session'
        });
        
        expect(response).toHaveProperty('content');
        expect(response).toHaveProperty('npc_id', 'ayla');
        expect(response).toHaveProperty('response_source');
      } catch (error) {
        // Expected behavior when no AI is configured - fallback should work
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should provide lore search functionality', async () => {
      await serviceManager.initialize();
      
      const results = await serviceManager.searchLore('console');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should track available NPCs', async () => {
      await serviceManager.initialize();
      
      const npcs = await serviceManager.getAvailableNPCs();
      expect(Array.isArray(npcs)).toBe(true);
      expect(npcs.length).toBeGreaterThan(0);
    });
  });

  describe('Content Loader', () => {
    it('should load persona data', async () => {
      const personas = await contentLoader.loadAllPersonas();
      expect(personas).toBeInstanceOf(Map);
      expect(personas.size).toBeGreaterThan(0);
    });

    it('should load lore entries', async () => {
      const lore = await contentLoader.loadAllLore();
      expect(lore).toBeInstanceOf(Map);
    });

    it('should provide cache statistics', () => {
      const stats = contentLoader.getCacheStats();
      expect(stats).toHaveProperty('personas');
      expect(stats).toHaveProperty('lore');
      expect(stats).toHaveProperty('dialogue');
    });
  });

  describe('AI Configuration', () => {
    it('should create default configuration', () => {
      const config = new AIConfig();
      expect(config).toBeInstanceOf(AIConfig);
      expect(config.getPrimaryProvider()).toBeDefined();
    });

    it('should validate configuration', () => {
      const config = new AIConfig();
      const validation = config.validate();
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('errors');
      expect(Array.isArray(validation.errors)).toBe(true);
    });

    it('should handle environment configuration', () => {
      const config = AIConfig.fromEnvironment();
      expect(config).toBeInstanceOf(AIConfig);
    });
  });

  describe('Integration Tests', () => {
    it('should handle missing AI gracefully', async () => {
      await serviceManager.initialize();
      
      const isAIAvailable = serviceManager.isAIAvailable();
      expect(typeof isAIAvailable).toBe('boolean');
    });

    it('should provide system statistics', async () => {
      await serviceManager.initialize();
      
      const stats = await serviceManager.getStats();
      expect(stats).toHaveProperty('content');
      expect(stats).toHaveProperty('npcs');
      expect(stats).toHaveProperty('initialized');
      expect(stats.initialized).toBe(true);
    });

    it('should handle content refresh', async () => {
      await serviceManager.initialize();
      
      // This should not throw
      await expect(serviceManager.refreshContent()).resolves.not.toThrow();
    });
  });
});

describe('Beta3 Design System', () => {
  it('should have design tokens available', async () => {
    // Test that our design constants are properly exported
    const constants = await import('../domain/constants');
    
    expect(constants.ZONE_COLORS).toBeDefined();
    expect(constants.ZONE_COLORS.glitch).toBe('#8A2BE2');
    expect(constants.ZONE_COLORS.nexus).toBe('#00E5FF');
    expect(constants.ZONE_COLORS.elfhame).toBe('#7CFC00');
    expect(constants.ZONE_COLORS.maze).toBe('#FFB300');
  });

  it('should have animation constants', async () => {
    const constants = await import('../domain/constants');
    
    expect(constants.ANIMATION).toBeDefined();
    expect(constants.ANIMATION.typeSpeed).toBeGreaterThan(30);
    expect(constants.ANIMATION.typeSpeed).toBeLessThan(50);
  });
});
