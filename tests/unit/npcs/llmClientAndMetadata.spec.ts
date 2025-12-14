import { describe, it, expect } from 'vitest';
import { DialogueEngine } from '../../../src/core/npcs/DialogueEngine';
import { LoreGate } from '../../../src/core/npcs/LoreGate';

describe('DialogueEngine metadata and provider stub behaviour', () => {
  it('returns metadata when provider supplies it', async () => {
    const prov = {
      name: 'withmeta',
      async generate() {
        return { text: 'ok', metadata: { mood: 'calm' } } as any;
      },
    } as any;
  const lg = new LoreGate();
  // Make permissive for this unit test so provider output isn't vetoed
  lg.fragments = [];
  const engine = new DialogueEngine([prov], lg);
    const res = await engine.prompt('npc', { npcName: 'N' });
    expect(res.metadata).toBeDefined();
  });

  it('allows LLMProvider when mocked enabled', async () => {
    // Minimal LLM stub
    const p = {
      name: 'llm',
      async generate() {
        return { text: 'llm reply' } as any;
      },
    } as any;
  const lg2 = new LoreGate();
  lg2.fragments = [];
  const engine = new DialogueEngine([p], lg2);
  const r = await engine.prompt('npc', { npcName: 'N' });
    expect(r.text).toContain('llm');
  });
});
