/**
 * Service manager for Beta3 AI and content systems
 * Provides unified access to NPC router, lore service, and configuration
 */

import { NPCAiRouter } from './npcAiRouter';
import { LoreService } from './loreService';
import { AIConfig } from './aiConfig';
import { ContentLoader } from './contentLoader';
import type { NPCResponse, LoreEntry, NPCPersona } from '../types/npc';

interface ServiceManagerConfig {
  aiProvider?: 'groq' | 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  enableLogging?: boolean;
}

export class ServiceManager {
  private npcRouter: NPCAiRouter;
  private loreService: LoreService;
  private contentLoader: ContentLoader;
  private config: ServiceManagerConfig;
  private initialized = false;

  constructor(config: ServiceManagerConfig = {}) {
    this.config = config;
    this.contentLoader = new ContentLoader();
    this.npcRouter = new NPCAiRouter();
    this.loreService = new LoreService();
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    if (this.initialized) {return;}

    try {
      // Configure AI if credentials provided
      if (this.config.aiProvider && this.config.apiKey) {
        this.npcRouter.setAIProvider(
          this.config.aiProvider,
          this.config.apiKey,
          this.config.model
        );
      }

      // Wait for content to load
      await this.waitForContentLoad();

      this.initialized = true;

      if (this.config.enableLogging) {
        console.log('ServiceManager initialized successfully');
        console.log('Cache stats:', this.contentLoader.getCacheStats());
      }
    } catch (error) {
      console.error('Failed to initialize ServiceManager:', error);
      throw error;
    }
  }

  /**
   * Wait for content to finish loading
   */
  private async waitForContentLoad(): Promise<void> {
    // Give services time to load content
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Get NPC response with AI or fallback
   */
  async getNPCResponse(
    npcId: string,
    userInput: string,
    context?: {
      zone?: string;
      sessionId?: string;
      userId?: string;
    }
  ): Promise<NPCResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const conversationContext: any = {
      zone: context?.zone || 'unknown',
      session_id: context?.sessionId || 'default'
    };
    
    if (context?.userId !== undefined) {
      conversationContext.user_id = context.userId;
    }
    
    return this.npcRouter.getNPCResponse(npcId, userInput, conversationContext);
  }

  /**
   * Search lore entries
   */
  async searchLore(query: string, options?: {
    tags?: string[];
    type?: string;
    limit?: number;
  }) {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.loreService.search(query, options);
  }

  /**
   * Get specific lore entry
   */
  async getLoreEntry(id: string): Promise<LoreEntry | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.loreService.getEntry(id);
  }

  /**
   * Get available NPCs
   */
  async getAvailableNPCs(): Promise<string[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.npcRouter.getAvailableNPCs();
  }

  /**
   * Get NPC persona information
   */
  async getNPCPersona(npcId: string): Promise<NPCPersona | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.npcRouter.getPersona(npcId);
  }

  /**
   * Get lore entries by tag
   */
  async getLoreByTag(tag: string): Promise<LoreEntry[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.loreService.getByTag(tag);
  }

  /**
   * Get lore entries by type
   */
  async getLoreByType(type: string): Promise<LoreEntry[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.loreService.getByType(type);
  }

  /**
   * Get related lore entries
   */
  async getRelatedLore(entryId: string, limit = 5): Promise<LoreEntry[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.loreService.getRelated(entryId, limit);
  }

  /**
   * Clear NPC conversation history
   */
  async clearNPCHistory(npcId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    this.npcRouter.clearHistory(npcId);
  }

  /**
   * Get random lore entry for discovery
   */
  async getRandomLore(): Promise<LoreEntry | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.loreService.getRandomEntry();
  }

  /**
   * Get system statistics
   */
  async getStats() {
    if (!this.initialized) {
      await this.initialize();
    }

    return {
      content: this.contentLoader.getCacheStats(),
      lore: this.loreService.getStats(),
      npcs: this.npcRouter.getAvailableNPCs(),
      initialized: this.initialized
    };
  }

  /**
   * Configure AI provider at runtime
   */
  setAIProvider(
    provider: 'groq' | 'openai' | 'anthropic' | 'local',
    apiKey: string,
    model?: string
  ): void {
    this.config.aiProvider = provider;
    this.config.apiKey = apiKey;
    if (model !== undefined) {
      this.config.model = model;
    }

    this.npcRouter.setAIProvider(provider, apiKey, model);

    if (this.config.enableLogging) {
      console.log(`AI provider configured: ${provider}`);
    }
  }

  /**
   * Check if AI is configured and available
   */
  isAIAvailable(): boolean {
    return Boolean(this.config.apiKey);
  }

  /**
   * Refresh content cache
   */
  async refreshContent(): Promise<void> {
    this.contentLoader.clearCache();
    await this.waitForContentLoad();

    if (this.config.enableLogging) {
      console.log('Content cache refreshed');
    }
  }
}

// Export singleton instance for easy use
export const gameServices = new ServiceManager({
  enableLogging: process.env.NODE_ENV === 'development'
});
