import { describe, it, expect } from 'vitest';
import { DialogueEngine } from '../../../src/core/npcs/DialogueEngine';
import { LoreGate } from '../../../src/core/npcs/LoreGate';

describe('DialogueEngine edge cases', () => {
  it('continues to next provider when one throws and eventually falls back', async () => {
    const bad = {
      name: 'bad',
      async generate() {
        throw new Error('boom');
      },
    } as any;

    const nuller = {
      name: 'nuller',
      async generate() {
        return null;
      },
    } as any;

    const engine = new DialogueEngine([bad, nuller], new LoreGate());
    const res = await engine.prompt('npc', { npcName: 'N' });
    // Both providers fail/return null; engine should return neutral fallback
    expect(res.text).toContain('hesitates');
  });

  it('skips providers that return empty text and uses next', async () => {
    const empty = { name: 'empty', async generate() { return { text: '' } as any; } } as any;
    const ok = { name: 'ok', async generate() { return { text: 'hello' } as any; } } as any;
  const lg = new LoreGate();
  lg.fragments = [];
  const engine = new DialogueEngine([empty, ok], lg);
  const res = await engine.prompt('npc', { npcName: 'N' });
    expect(res.text).toContain('hello');
  });
});
