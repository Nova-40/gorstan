import type { DialogueContext, DialogueProvider, DialogueResult } from '../types';

type OfflineRules = {
  keywords?: string[];
  reply: string;
};

export class OfflineTreeProvider implements DialogueProvider {
  name = 'offline-tree';
  rules: Record<string, OfflineRules[]>;

  constructor(rules?: Record<string, OfflineRules[]>) {
    // Default rules: simple canned replies for Ayla and generic NPCs
    const base =
      rules ||
      ({
        ayla: [
          { keywords: ['book', 'lattice'], reply: 'Ayla ponders the lattice and speaks softly of memory.' },
          { reply: 'Ayla hums, the words like threads of the multiverse.' },
        ],
        default: [{ reply: "They don't have much to say right now." }],
      } as Record<string, OfflineRules[]>);

    // Normalize keys to lowercase so lookup is case-insensitive
    this.rules = {} as Record<string, OfflineRules[]>;
    for (const [k, v] of Object.entries(base)) {
      this.rules[k.toLowerCase()] = v;
    }
  }

  async generate(npcId: string, ctx: DialogueContext): Promise<DialogueResult | null> {
    const key = (ctx.npcName || npcId || 'default').toLowerCase();
    const rules = this.rules[key] || this.rules.default || [];

    // Simple deterministic selection: match keyword against recentCommands/flags
    for (const r of rules) {
      if (!r.keywords || r.keywords.length === 0) return { text: r.reply, source: this.name };
      const hay = ((ctx.recentCommands || []) as string[]).join(' ').toLowerCase();
      for (const kw of r.keywords) {
        if (hay.includes(kw)) return { text: r.reply, source: this.name };
      }
    }

    return { text: rules[0]?.reply || "They don't have much to say.", source: this.name };
  }
}
