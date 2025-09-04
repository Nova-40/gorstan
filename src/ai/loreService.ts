import type { LoreEntry } from '../types/npc';
import { ContentLoader } from './contentLoader';

interface LoreSearchOptions {
  tags?: string[];
  type?: string;
  related?: string;
  limit?: number;
  fuzzy?: boolean;
}

interface LoreSearchResult {
  entry: LoreEntry;
  relevance_score: number;
  matched_fields: string[];
}

export class LoreService {
  private entries: Map<string, LoreEntry> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private typeIndex: Map<string, Set<string>> = new Map();
  private relationIndex: Map<string, Set<string>> = new Map();
  private contentLoader: ContentLoader;

  constructor() {
    this.contentLoader = new ContentLoader();
    this.loadLoreEntries();
  }

  /**
   * Load all lore entries using the dynamic content loader
   */
  private async loadLoreEntries(): Promise<void> {
    try {
      const loadedEntries = await this.contentLoader.loadAllLore();
      
      for (const entry of loadedEntries.values()) {
        this.addEntry(entry);
      }
      
      console.log(`Loaded ${this.entries.size} lore entries:`, Array.from(this.entries.keys()));
    } catch (error) {
      console.error('Failed to load lore entries:', error);
    }
  }

  /**
   * Add a lore entry to the service
   */
  private addEntry(entry: LoreEntry): void {
    this.entries.set(entry.id, entry);
    
    // Update indexes
    for (const tag of entry.tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(entry.id);
    }
    
    if (!this.typeIndex.has(entry.type)) {
      this.typeIndex.set(entry.type, new Set());
    }
    this.typeIndex.get(entry.type)!.add(entry.id);
    
    if (entry.related) {
      for (const relatedId of entry.related) {
        if (!this.relationIndex.has(relatedId)) {
          this.relationIndex.set(relatedId, new Set());
        }
        this.relationIndex.get(relatedId)!.add(entry.id);
      }
    }
  }

  /**
   * Get a specific lore entry by ID
   */
  getEntry(id: string): LoreEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Search lore entries
   */
  search(query: string, options: LoreSearchOptions = {}): LoreSearchResult[] {
    const results: LoreSearchResult[] = [];
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    for (const entry of this.entries.values()) {
      let relevanceScore = 0;
      const matchedFields: string[] = [];
      
      // Apply filters first
      if (options.tags?.length) {
        if (!options.tags.some(tag => entry.tags.includes(tag))) continue;
      }
      
      if (options.type && entry.type !== options.type) {
        continue;
      }
      
      if (options.related) {
        const isRelated = entry.related?.includes(options.related) || 
                         this.relationIndex.get(entry.id)?.has(options.related);
        if (!isRelated) continue;
      }
      
      // Score based on content matches
      const titleWords = entry.title.toLowerCase();
      const contentWords = entry.content.toLowerCase();
      const tagWords = entry.tags.join(' ').toLowerCase();
      
      for (const term of searchTerms) {
        if (titleWords.includes(term)) {
          relevanceScore += 10;
          if (!matchedFields.includes('title')) matchedFields.push('title');
        }
        
        if (tagWords.includes(term)) {
          relevanceScore += 5;
          if (!matchedFields.includes('tags')) matchedFields.push('tags');
        }
        
        if (contentWords.includes(term)) {
          relevanceScore += 1;
          if (!matchedFields.includes('content')) matchedFields.push('content');
        }
      }
      
      if (relevanceScore > 0 || searchTerms.length === 0) {
        results.push({
          entry,
          relevance_score: relevanceScore,
          matched_fields: matchedFields
        });
      }
    }
    
    // Sort by relevance
    results.sort((a, b) => b.relevance_score - a.relevance_score);
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      return results.slice(0, options.limit);
    }
    
    return results;
  }

  /**
   * Get entries by tag
   */
  getByTag(tag: string): LoreEntry[] {
    const entryIds = this.tagIndex.get(tag);
    if (!entryIds) return [];
    
    return Array.from(entryIds)
      .map(id => this.entries.get(id))
      .filter((e): e is LoreEntry => e !== undefined);
  }

  /**
   * Get entries by type
   */
  getByType(type: string): LoreEntry[] {
    const entryIds = this.typeIndex.get(type);
    if (!entryIds) return [];
    
    return Array.from(entryIds)
      .map(id => this.entries.get(id))
      .filter((e): e is LoreEntry => e !== undefined);
  }

  /**
   * Get related entries
   */
  getRelated(entryId: string, limit: number = 5): LoreEntry[] {
    const entry = this.entries.get(entryId);
    if (!entry) return [];
    
    const relatedIds = new Set<string>();
    
    // Add directly related entries
    if (entry.related) {
      for (const relatedId of entry.related) {
        relatedIds.add(relatedId);
      }
    }
    
    // Add entries that reference this one
    const referencingIds = this.relationIndex.get(entryId);
    if (referencingIds) {
      for (const refId of referencingIds) {
        relatedIds.add(refId);
      }
    }
    
    // Add entries with similar tags
    for (const tag of entry.tags) {
      const taggedIds = this.tagIndex.get(tag);
      if (taggedIds) {
        for (const taggedId of taggedIds) {
          if (taggedId !== entryId) {
            relatedIds.add(taggedId);
          }
        }
      }
    }
    
    return Array.from(relatedIds)
      .slice(0, limit)
      .map(id => this.entries.get(id))
      .filter((e): e is LoreEntry => e !== undefined);
  }

  /**
   * Get all available tags
   */
  getAllTags(): string[] {
    return Array.from(this.tagIndex.keys()).sort();
  }

  /**
   * Get all available types
   */
  getAllTypes(): string[] {
    return Array.from(this.typeIndex.keys()).sort();
  }

  /**
   * Get random entry for discovery
   */
  getRandomEntry(): LoreEntry | undefined {
    const entries = Array.from(this.entries.values());
    if (entries.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
  }

  /**
   * Get summary statistics
   */
  getStats() {
    return {
      total_entries: this.entries.size,
      types: this.getAllTypes(),
      tags: this.getAllTags(),
      most_connected: this.getMostConnectedEntry()
    };
  }

  /**
   * Find the most connected entry (most relations)
   */
  private getMostConnectedEntry(): { id: string; connections: number } | undefined {
    let maxConnections = 0;
    let mostConnected: string | undefined;
    
    for (const entry of this.entries.values()) {
      const directRelations = entry.related?.length || 0;
      const backReferences = this.relationIndex.get(entry.id)?.size || 0;
      const totalConnections = directRelations + backReferences;
      
      if (totalConnections > maxConnections) {
        maxConnections = totalConnections;
        mostConnected = entry.id;
      }
    }
    
    return mostConnected ? { id: mostConnected, connections: maxConnections } : undefined;
  }
}
