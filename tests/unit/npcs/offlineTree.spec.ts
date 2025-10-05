import { describe, it, expect } from 'vitest';
import { OfflineTreeProvider } from '../../../src/core/npcs/providers/OfflineTreeProvider';

describe('OfflineTreeProvider', () => {
  it('returns deterministic reply based on recent commands', async () => {
    const rules = {
      ayla: [{ keywords: ['lattice'], reply: 'Ayla speaks of the lattice.' }],
      default: [{ reply: 'generic' }],
    };
    const p = new OfflineTreeProvider(rules as any);
    const res = await p.generate('ayla', { recentCommands: ['search lattice'] });
    expect(res).not.toBeNull();
    expect(res?.text).toContain('lattice');
  });

  it('works offline with no network calls', async () => {
    const p = new OfflineTreeProvider();
    const res = await p.generate('somebody', { recentCommands: [] });
    expect(res).not.toBeNull();
    expect(typeof res?.text).toBe('string');
  });
});
