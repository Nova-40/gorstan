import { describe, it, expect } from 'vitest';
import { OfflineTreeProvider } from '../../../src/core/npcs/providers/OfflineTreeProvider';

describe('OfflineTreeProvider default and keyword-less rules', () => {
  it('returns the npc-specific first reply when rules exist but none match', async () => {
    const rules: any = { someNpc: [{ keywords: ['x'], reply: 'nope' }], default: [{ reply: 'fallback' }] };
    const p = new OfflineTreeProvider(rules);
    const res = await p.generate('someNpc', { recentCommands: ['nothing'] });
    expect(res?.text).toContain('nope');
  });

  it('uses keyword-less rule first when present', async () => {
    const rules: any = { someNpc: [{ reply: 'always' }, { keywords: ['x'], reply: 'nope' }] };
    const p = new OfflineTreeProvider(rules);
    const res = await p.generate('someNpc', { recentCommands: [] });
    expect(res?.text).toBe('always');
  });
});
