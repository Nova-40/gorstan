/**
 * Dynamic content loader for Beta3 NPC personas and lore entries
 * Handles YAML parsing and markdown processing for runtime content loading
 */

import type { NPCPersona, LoreEntry } from '../types/npc';

interface ContentManifest {
  personas: string[];
  lore: string[];
  dialogue: string[];
  lastUpdated: number;
}

// Simple YAML parser for front-matter and content
class SimpleYAMLParser {
  static parse(content: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      
      // Handle different value types
      if (value.startsWith('[') && value.endsWith(']')) {
        // Array value
        const arrayContent = value.slice(1, -1);
        result[key] = arrayContent
          .split(',')
          .map(item => item.trim().replace(/['"]/g, ''))
          .filter(item => item.length > 0);
      } else if (value.match(/^\d+$/)) {
        // Number value
        result[key] = parseInt(value, 10);
      } else if (value === 'true' || value === 'false') {
        // Boolean value
        result[key] = value === 'true';
      } else {
        // String value
        result[key] = value.replace(/['"]/g, '');
      }
    }
    
    return result;
  }

  static parseMarkdownWithFrontMatter(content: string): { frontMatter: Record<string, any>; markdown: string } {
    const lines = content.split('\n');
    let frontMatterEnd = -1;
    
  // Guard first element access for strict noUncheckedIndexedAccess
  if (lines.length > 0 && lines[0] === '---') {
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '---') {
          frontMatterEnd = i;
          break;
        }
      }
    }

    if (frontMatterEnd === -1) {
      return { frontMatter: {}, markdown: content };
    }

    const frontMatterContent = lines.slice(1, frontMatterEnd).join('\n');
    const markdownContent = lines.slice(frontMatterEnd + 1).join('\n').trim();

    return {
      frontMatter: this.parse(frontMatterContent),
      markdown: markdownContent
    };
  }
}

export class ContentLoader {
  private personaCache = new Map<string, NPCPersona>();
  private loreCache = new Map<string, LoreEntry>();
  private dialogueCache = new Map<string, string[]>();
  private manifest: ContentManifest | null = null;

  constructor() {
    this.loadContentManifest();
  }

  /**
   * Load content manifest (in a real app, this would be generated at build time)
   */
  private async loadContentManifest(): Promise<void> {
    // For now, use the hardcoded list from our created files
    this.manifest = {
      personas: ['ayla', 'dominic', 'polly', 'albie', 'mr_wendell', 'librarian'],
      lore: ['console-terminus', 'zone-fragments', 'creators-children'],
      dialogue: ['librarian_opening', 'dominic_quips', 'polly_hints'],
      lastUpdated: Date.now()
    };
  }

  /**
   * Load a single persona from YAML content
   */
  async loadPersona(id: string): Promise<NPCPersona | null> {
    if (this.personaCache.has(id)) {
      return this.personaCache.get(id)!;
    }

    try {
      // In production, this would fetch from the actual file system or API
      // For now, return a mock persona to demonstrate the structure
      const mockPersona = this.createMockPersona(id);
      if (mockPersona) {
        this.personaCache.set(id, mockPersona);
        return mockPersona;
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to load persona ${id}:`, error);
      return null;
    }
  }

  /**
   * Load all available personas
   */
  async loadAllPersonas(): Promise<Map<string, NPCPersona>> {
    if (!this.manifest) {
      await this.loadContentManifest();
    }

    const personas = new Map<string, NPCPersona>();
    
    for (const personaId of this.manifest!.personas) {
      const persona = await this.loadPersona(personaId);
      if (persona) {
        personas.set(personaId, persona);
      }
    }
    
    return personas;
  }

  /**
   * Load a lore entry from markdown with YAML front-matter
   */
  async loadLoreEntry(id: string): Promise<LoreEntry | null> {
    if (this.loreCache.has(id)) {
      return this.loreCache.get(id)!;
    }

    try {
      // Mock lore entry for demonstration
      const mockEntry = this.createMockLoreEntry(id);
      if (mockEntry) {
        this.loreCache.set(id, mockEntry);
        return mockEntry;
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to load lore entry ${id}:`, error);
      return null;
    }
  }

  /**
   * Load all available lore entries
   */
  async loadAllLore(): Promise<Map<string, LoreEntry>> {
    if (!this.manifest) {
      await this.loadContentManifest();
    }

    const lore = new Map<string, LoreEntry>();
    
    for (const loreId of this.manifest!.lore) {
      const entry = await this.loadLoreEntry(loreId);
      if (entry) {
        lore.set(loreId, entry);
      }
    }
    
    return lore;
  }

  /**
   * Load dialogue content for an NPC
   */
  async loadDialogue(id: string): Promise<string[] | null> {
    if (this.dialogueCache.has(id)) {
      return this.dialogueCache.get(id)!;
    }

    try {
      // Mock dialogue for demonstration
      const mockDialogue = this.createMockDialogue(id);
      if (mockDialogue) {
        this.dialogueCache.set(id, mockDialogue);
        return mockDialogue;
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to load dialogue ${id}:`, error);
      return null;
    }
  }

  /**
   * Create mock persona for testing (replace with real YAML loading in production)
   */
  private createMockPersona(id: string): NPCPersona | null {
    const personas: Record<string, NPCPersona> = {
      ayla: {
        id: 'ayla',
        name: 'Ayla',
        style: { tone: 'compassionate, direct', max_sentences: 2 },
        personality: 'Ethics-first mentor who asks challenging questions about moral implications.',
        constraints: ['never narrate player actions', 'focus on ethical implications'],
        fallbacks: { offline: ['Ethics matter most when no one is watching.'] },
        memory_length: 15,
        ethical_stance: 'Consequentialist with care ethics influence',
        traits: ['wise', 'challenging', 'supportive'],
        quirks: ['Always asks "But is it kind?"']
      },
      dominic: {
        id: 'dominic',
        name: 'Dominic',
        style: { tone: 'meta, forgetful', max_sentences: 1 },
        personality: 'Cheerful NPC with 10-second memory that resets mid-conversation.',
        constraints: ['memory resets every 10 seconds', 'always friendly'],
        fallbacks: { offline: ['Oh! Hello there! Have we met?'] },
        memory_length: 1,
        ethical_stance: 'Optimistic nihilism',
        traits: ['forgetful', 'cheerful', 'meta-aware'],
        quirks: ['Constant introductions', 'Memory reset gag']
      },
      librarian: {
        id: 'librarian',
        name: 'The Librarian',
        style: { tone: 'analytical, wry', max_sentences: 3 },
        personality: 'Ancient archivist who believes creators returned as infants.',
        constraints: ['offers patterns not conclusions', 'references creators motif'],
        fallbacks: { offline: ['The stacks are quiet. Consult intuition.'] },
        memory_length: 25,
        ethical_stance: 'Archivist neutrality',
        traits: ['wise', 'patient', 'pattern-focused'],
        quirks: ['References "the stacks"', 'Creators-as-infants theme']
      }
    };

    return personas[id] || null;
  }

  /**
   * Create mock lore entry for testing
   */
  private createMockLoreEntry(id: string): LoreEntry | null {
    const entries: Record<string, LoreEntry> = {
      'console-terminus': {
        id: 'console-terminus',
        title: 'The Console Terminus',
        type: 'location',
        tags: ['architecture', 'technology', 'mystery'],
        related: ['void-navigation', 'glitch-protocols'],
        discovered_by: 'early_explorers',
        classification: 'interactive_artifact',
        content: 'The Console Terminus stands at the heart of the digital realm...'
      }
    };

    return entries[id] || null;
  }

  /**
   * Create mock dialogue for testing
   */
  private createMockDialogue(id: string): string[] | null {
    const dialogue: Record<string, string[]> = {
      librarian_opening: [
        'The stacks contain infinite questions. You appear to have several.',
        'Pattern recognized: another seeker arrives.',
        'I catalogue what is, not what should be.'
      ]
    };

    return dialogue[id] || null;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.personaCache.clear();
    this.loreCache.clear();
    this.dialogueCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      personas: this.personaCache.size,
      lore: this.loreCache.size,
      dialogue: this.dialogueCache.size,
      manifest: this.manifest
    };
  }
}
