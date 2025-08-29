/**
 * React hooks for Beta3 AI and content services
 * Provides easy integration of NPCs and lore in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { gameServices } from '../ai/serviceManager';
import type { NPCResponse, LoreEntry, NPCPersona } from '../types/npc';

/**
 * Hook for NPC conversations
 */
export function useNPCConversation(npcId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<NPCResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<NPCPersona | null>(null);

  // Load persona information on mount
  useEffect(() => {
    const loadPersona = async () => {
      try {
        const npcPersona = await gameServices.getNPCPersona(npcId);
        setPersona(npcPersona || null);
      } catch (err) {
        console.warn(`Failed to load persona for ${npcId}:`, err);
      }
    };

    loadPersona();
  }, [npcId]);

  const sendMessage = useCallback(async (
    message: string,
    context?: { zone?: string; sessionId?: string }
  ) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await gameServices.getNPCResponse(npcId, message, context);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get NPC response';
      setError(errorMessage);
      console.error('NPC conversation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [npcId]);

  const clearHistory = useCallback(async () => {
    try {
      await gameServices.clearNPCHistory(npcId);
    } catch (err) {
      console.warn(`Failed to clear history for ${npcId}:`, err);
    }
  }, [npcId]);

  return {
    persona,
    lastResponse,
    isLoading,
    error,
    sendMessage,
    clearHistory
  };
}

/**
 * Hook for lore discovery and search
 */
export function useLore() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [randomEntry, setRandomEntry] = useState<LoreEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    query: string,
    options?: { tags?: string[]; type?: string; limit?: number }
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await gameServices.searchLore(query, options);
      setSearchResults(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lore search failed';
      setError(errorMessage);
      console.error('Lore search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEntry = useCallback(async (id: string) => {
    try {
      return await gameServices.getLoreEntry(id);
    } catch (err) {
      console.error('Failed to get lore entry:', err);
      return undefined;
    }
  }, []);

  const getRandomEntry = useCallback(async () => {
    setIsLoading(true);
    try {
      const entry = await gameServices.getRandomLore();
      setRandomEntry(entry || null);
      return entry;
    } catch (err) {
      console.error('Failed to get random lore:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getByTag = useCallback(async (tag: string) => {
    try {
      return await gameServices.getLoreByTag(tag);
    } catch (err) {
      console.error('Failed to get lore by tag:', err);
      return [];
    }
  }, []);

  const getRelated = useCallback(async (entryId: string, limit = 5) => {
    try {
      return await gameServices.getRelatedLore(entryId, limit);
    } catch (err) {
      console.error('Failed to get related lore:', err);
      return [];
    }
  }, []);

  return {
    searchResults,
    randomEntry,
    isLoading,
    error,
    search,
    getEntry,
    getRandomEntry,
    getByTag,
    getRelated
  };
}

/**
 * Hook for service management and system status
 */
export function useGameServices() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableNPCs, setAvailableNPCs] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const initializeRef = useRef(false);

  // Initialize services on mount
  useEffect(() => {
    const initialize = async () => {
      if (initializeRef.current) return;
      initializeRef.current = true;

      try {
        await gameServices.initialize();
        
        const [npcs, serviceStats] = await Promise.all([
          gameServices.getAvailableNPCs(),
          gameServices.getStats()
        ]);

        setAvailableNPCs(npcs);
        setStats(serviceStats);
        setIsAIAvailable(gameServices.isAIAvailable());
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize game services:', err);
      }
    };

    initialize();
  }, []);

  const configureAI = useCallback((
    provider: 'groq' | 'openai' | 'anthropic' | 'local',
    apiKey: string,
    model?: string
  ) => {
    gameServices.setAIProvider(provider, apiKey, model);
    setIsAIAvailable(true);
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      await gameServices.refreshContent();
      const newStats = await gameServices.getStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to refresh content:', err);
    }
  }, []);

  return {
    isInitialized,
    availableNPCs,
    stats,
    isAIAvailable,
    configureAI,
    refreshContent
  };
}

/**
 * Hook for enhanced NPC interaction with zone context
 */
export function useZoneNPC(npcId: string, zone: string) {
  const conversation = useNPCConversation(npcId);
  
  const sendZoneMessage = useCallback((message: string, sessionId?: string) => {
    // Build options without setting undefined explicitly to satisfy exactOptionalPropertyTypes
    const opts: any = {};
    if (zone) opts.zone = zone;
    if (sessionId !== undefined) opts.sessionId = sessionId;
    return conversation.sendMessage(message, opts as { zone?: string; sessionId?: string });
  }, [conversation.sendMessage, zone]);

  return {
    ...conversation,
    sendMessage: sendZoneMessage,
    zone
  };
}

/**
 * Hook for lore discovery with context awareness
 */
export function useContextualLore(zone?: string, tags?: string[]) {
  const lore = useLore();
  const [contextualEntries, setContextualEntries] = useState<LoreEntry[]>([]);

  useEffect(() => {
    const loadContextualLore = async () => {
      if (!zone && !tags?.length) return;

      try {
        let entries: LoreEntry[] = [];

        if (tags?.length) {
          for (const tag of tags) {
            const tagEntries = await lore.getByTag(tag);
            entries = [...entries, ...tagEntries];
          }
        }

        // Remove duplicates
        const uniqueEntries = entries.filter((entry, index, self) => 
          self.findIndex(e => e.id === entry.id) === index
        );

        setContextualEntries(uniqueEntries);
      } catch (err) {
        console.error('Failed to load contextual lore:', err);
      }
    };

    loadContextualLore();
  }, [zone, tags, lore.getByTag]);

  return {
    ...lore,
    contextualEntries
  };
}
