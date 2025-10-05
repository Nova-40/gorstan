import { describe, it, expect } from 'vitest';
import path from 'path';
import { LoreGate } from '../../../src/core/npcs/LoreGate';

describe('LoreGate fragment-loading path', () => {
  it('loads fragments and allows canonical text', () => {
    const lg = new LoreGate(path.resolve(process.cwd(), 'lore', 'index.json'));
    const v = lg.vet('Ayla ponders the lattice and speaks softly of memory.');
    expect(v.allowed).toBe(true);
  });
});
