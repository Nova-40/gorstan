import fs from 'fs';
import path from 'path';

type VetResult = { allowed: boolean; fallbackText: string };

export class LoreGate {
  loreIndexPath: string;
  fragments: string[] = [];

  constructor(loreIndexPath?: string) {
    this.loreIndexPath = loreIndexPath || path.resolve(process.cwd(), 'lore', 'index.json');
    try {
      const raw = fs.readFileSync(this.loreIndexPath, 'utf8');
      // index.json structure: { fragments: [ 'intro.md' ] }
      const parsed = JSON.parse(raw) as { fragments?: string[] };
      this.fragments = parsed.fragments || [];
    } catch (err) {
      // If lore index missing, operate permissively but warn
      // eslint-disable-next-line no-console
      console.warn('LoreGate: failed to load lore index', this.loreIndexPath, err);
      this.fragments = [];
    }
  }

  vet(candidate: string): VetResult {
    // If there are no canonical fragments available, allow permissively (graceful fallback)
    if (!this.fragments || this.fragments.length === 0) {
      return { allowed: true, fallbackText: '' };
    }

    // Very simple heuristic: ensure candidate contains at least one canonical keyword
    // Load canonical fragments and extract lowercased words as allowed tokens
    const allowedTokens = new Set<string>();
    for (const f of this.fragments) {
      try {
        const p = path.resolve(process.cwd(), 'lore', 'fragments', f);
        const txt = fs.readFileSync(p, 'utf8');
        txt
          .toLowerCase()
          .replace(/[^a-z\s]/g, ' ')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 500)
          .forEach((w) => allowedTokens.add(w));
      } catch (err) {
        // ignore fragment read errors
        // eslint-disable-next-line no-console
        console.warn('LoreGate: failed to load fragment', f, err);
      }
    }

    const candidateWords = candidate
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 200);

    // If any candidate word is unknown and appears to be a direct contradiction (simple heuristic):
    const unknown = candidateWords.filter((w) => !allowedTokens.has(w));

    // If more than half of candidate words are unknown, veto
    if (unknown.length > candidateWords.length / 2) {
      return { allowed: false, fallbackText: 'Ayla hesitates, uncertain of the truth.' };
    }

    return { allowed: true, fallbackText: '' };
  }
}
