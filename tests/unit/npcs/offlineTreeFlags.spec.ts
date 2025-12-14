import { describe, it, expect } from 'vitest';
import { OfflineTreeProvider } from '../../../src/core/npcs/providers/OfflineTreeProvider';

describe('OfflineTreeProvider flags and deterministic output', () => {
  it('selects reply based on flags', async () => {
    const rules: any = {
      ayla: [
        { keywords: ['book'], reply: 'book reply' },
        { keywords: ['quest'], reply: 'quest reply' },
      ],
    };
    const p = new OfflineTreeProvider(rules);
    const r1 = await p.generate('ayla', { recentCommands: ['open book'] });
    expect(r1?.text).toContain('book');
    const r2 = await p.generate('ayla', { recentCommands: ['start quest'] });
    expect(r2?.text).toContain('quest');
  });

  it('is deterministic for same input', async () => {
    const p = new OfflineTreeProvider();
    const a = await p.generate('default', { recentCommands: [] });
    const b = await p.generate('default', { recentCommands: [] });
    expect(a?.text).toBe(b?.text);
  });
});
