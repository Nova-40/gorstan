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
      
      for (const [id, entry] of loadedEntries) {
        this.addEntry(entry);
      }
      
      console.log(`Loaded ${this.entries.size} lore entries:`, Array.from(this.entries.keys()));
    } catch (error) {
      console.error('Failed to load lore entries:', error);
    }
  }

  /**
   * Parse markdown file with YAML front-matter into LoreEntry
   */
  private parseLoreEntry(filename: string, content: string): LoreEntry {
    // Simple YAML front-matter parser
    // In a real implementation, you'd use a proper YAML parser
    const lines = content.split('\n');
    let frontMatterEnd = -1;
    
  if (lines.length > 0 && lines[0] === '---') {
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '---') {
          frontMatterEnd = i;
          break;
        }
      }
    }

    if (frontMatterEnd === -1) {
      throw new Error(`No valid YAML front-matter found in ${filename}`);
    }

    const frontMatter = lines.slice(1, frontMatterEnd).join('\n');
    const markdown = lines.slice(frontMatterEnd + 1).join('\n').trim();

    // Parse YAML front-matter (simplified)
    const metadata: Partial<LoreEntry> = {};
    const yamlLines = frontMatter.split('\n');
    
    for (const line of yamlLines) {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        
        if (key === 'tags' || key === 'related') {
          // Parse array values [item1, item2, item3]
          const arrayMatch = value.match(/\[(.*)\]/);
          if (arrayMatch && arrayMatch[1] !== undefined) {
            const arrayValue = arrayMatch[1]
              .split(',')
              .map(item => item.trim().replace(/['"]/g, ''));
            (metadata as any)[key] = arrayValue;
          }
        } else {
          metadata[key as keyof LoreEntry] = value.replace(/['"]/g, '') as any;
        }
      }
    }

    return {
      id: metadata.id || filename,
      title: metadata.title || filename,
      type: metadata.type || 'research',
      tags: metadata.tags || [],
      related: metadata.related,
      discovered_by: metadata.discovered_by,
      classification: metadata.classification,
      content: markdown
    } as LoreEntry;
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
    
    for (const [id, entry] of this.entries) {
      let relevanceScore = 0;
      const matchedFields: string[] = [];
      
      // Apply filters first
      if (options.tags && options.tags.length > 0) {
        const hasMatchingTag = options.tags.some(tag => entry.tags.includes(tag));
        if (!hasMatchingTag) {continue;}
      }
      
      if (options.type && entry.type !== options.type) {
        continue;
      }
      
      if (options.related) {
        const isRelated = entry.related?.includes(options.related) || 
                         this.relationIndex.get(entry.id)?.has(options.related);
        if (!isRelated) {continue;}
      }
      
      // Score based on content matches
      const titleWords = entry.title.toLowerCase();
      const contentWords = entry.content.toLowerCase();
      const tagWords = entry.tags.join(' ').toLowerCase();
      
      for (const term of searchTerms) {
        if (titleWords.includes(term)) {
          relevanceScore += 10;
          if (!matchedFields.includes('title')) {matchedFields.push('title');}
        }
        
        if (tagWords.includes(term)) {
          relevanceScore += 5;
          if (!matchedFields.includes('tags')) {matchedFields.push('tags');}
        }
        
        if (contentWords.includes(term)) {
          relevanceScore += 1;
          if (!matchedFields.includes('content')) {matchedFields.push('content');}
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
    if (!entryIds) {return [];}
    
    return Array.from(entryIds)
      .map(id => this.entries.get(id))
      .filter((entry): entry is LoreEntry => entry !== undefined);
  }

  /**
   * Get entries by type
   */
  getByType(type: string): LoreEntry[] {
    const entryIds = this.typeIndex.get(type);
    if (!entryIds) {return [];}
    
    return Array.from(entryIds)
      .map(id => this.entries.get(id))
      .filter((entry): entry is LoreEntry => entry !== undefined);
  }

  /**
   * Get related entries
   */
  getRelated(entryId: string, limit: number = 5): LoreEntry[] {
    const entry = this.entries.get(entryId);
    if (!entry) {return [];}
    
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
      .filter((entry): entry is LoreEntry => entry !== undefined);
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
    if (entries.length === 0) {return undefined;}
    
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
    
    for (const [id, entry] of this.entries) {
      const directRelations = entry.related?.length || 0;
      const backReferences = this.relationIndex.get(id)?.size || 0;
      const totalConnections = directRelations + backReferences;
      
      if (totalConnections > maxConnections) {
        maxConnections = totalConnections;
        mostConnected = id;
      }
    }
    
    return mostConnected ? { id: mostConnected, connections: maxConnections } : undefined;
  }
}
