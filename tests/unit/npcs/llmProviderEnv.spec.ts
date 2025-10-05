import { describe, it, expect } from 'vitest';
import { LLMProvider } from '../../../src/core/npcs/providers/LLMProvider';

describe('LLMProvider env handling', () => {
  it('returns null when no api key present', async () => {
    const p = new LLMProvider();
    // simulate missing key
    // @ts-ignore
    p.apiKey = undefined;
    // @ts-ignore
    p.provider = 'openai';
    const res = await p.generate('npc', {} as any);
    expect(res).toBeNull();
  });

  it('respects provider setting and model default', () => {
    const p = new LLMProvider();
    // provider default should be offline
    // @ts-ignore
    expect(p.provider).toBeDefined();
    // @ts-ignore
    expect(p.model).toBeDefined();
  });
});
