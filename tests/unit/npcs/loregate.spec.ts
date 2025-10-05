import { describe, it, expect } from 'vitest';
import { LoreGate } from '../../../src/core/npcs/LoreGate';
import path from 'path';

describe('LoreGate', () => {
  it('vetoes responses that contain many unknown words', () => {
    const lg = new LoreGate(path.resolve(process.cwd(), 'lore', 'index.json'));
    const bad = 'xqzplm qwerzty unknownstuff anotherthing';
    const v = lg.vet(bad);
    expect(v.allowed).toBe(false);
    expect(v.fallbackText).toContain('hesitates');
  });

  it('allows canonical snippets', () => {
    const lg = new LoreGate(path.resolve(process.cwd(), 'lore', 'index.json'));
    const ok = 'Ayla ponders the lattice and speaks softly of memory.';
    const v = lg.vet(ok);
    expect(v.allowed).toBe(true);
  });
});
