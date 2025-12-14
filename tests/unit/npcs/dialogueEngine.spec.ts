import { describe, it, expect } from 'vitest';
import { DialogueEngine } from '../../../src/core/npcs/DialogueEngine';
import { OfflineTreeProvider } from '../../../src/core/npcs/providers/OfflineTreeProvider';
import { LLMProvider } from '../../../src/core/npcs/providers/LLMProvider';
import { LoreGate } from '../../../src/core/npcs/LoreGate';

describe('DialogueEngine', () => {
  it('falls back to offline provider when LLMProvider returns null', async () => {
    const llm = new LLMProvider();
    // Ensure offline behavior
    // @ts-ignore
    llm.apiKey = undefined;
    // @ts-ignore
    llm.provider = 'offline';

    const offline = new OfflineTreeProvider({ ayla: [{ reply: 'offline ayla' }], default: [{ reply: 'def' }] } as any);
    const lore = new LoreGate();
    const engine = new DialogueEngine([llm, offline], lore);

    const res = await engine.prompt('ayla', { npcName: 'Ayla', recentCommands: ['read'] });
    expect(res.text).toContain('offline');
  });

  it('returns loregate fallback when provider returns contradictory text', async () => {
    const p = {
      name: 'badprov',
      async generate() {
        return { text: 'xqzplm yzunknown', metadata: {} } as any;
      },
    } as any;
    const lore = new LoreGate();
    const engine = new DialogueEngine([p], lore);
    const res = await engine.prompt('npc1', { npcName: 'Test', recentCommands: [] });
    expect(res.text).toContain('hesitates');
  });
});
