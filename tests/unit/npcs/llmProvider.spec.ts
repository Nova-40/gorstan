import { describe, it, expect } from 'vitest';
import { LLMProvider } from '../../../src/core/npcs/providers/LLMProvider';

describe('LLMProvider', () => {
  it('returns null when no api key or provider not openai', async () => {
    const p = new LLMProvider();
    // Ensure env is not set for test
    // @ts-ignore
    p.apiKey = undefined;
    // @ts-ignore
    p.provider = 'offline';
    const res = await p.generate('ayla', { recentCommands: [] });
    expect(res).toBeNull();
  });
});
