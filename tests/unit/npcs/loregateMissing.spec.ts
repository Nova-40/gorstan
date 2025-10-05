import { describe, it, expect } from 'vitest';
import { LoreGate } from '../../../src/core/npcs/LoreGate';
import path from 'path';

describe('LoreGate missing/empty index handling', () => {
  it('allows permissively when no fragments loaded', () => {
    const lg = new LoreGate(path.resolve(process.cwd(), 'lore', 'nonexistent-index.json'));
    const v = lg.vet('random words that are not in lore');
    expect(v.allowed).toBe(true);
  });
});
