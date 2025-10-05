import type { DialogueContext, DialogueProvider, DialogueResult } from './types';
import { LoreGate } from './LoreGate';

export interface INPCDialogueEngine {
  prompt(npcId: string, ctx: DialogueContext): Promise<DialogueResult>;
}

export class DialogueEngine implements INPCDialogueEngine {
  providers: DialogueProvider[];
  loreGate: LoreGate;

  constructor(providers: DialogueProvider[], loreGate: LoreGate) {
    this.providers = providers;
    this.loreGate = loreGate;
  }

  async prompt(npcId: string, ctx: DialogueContext): Promise<DialogueResult> {
    // Ask providers in order until one returns a non-empty reply
    for (const p of this.providers) {
      try {
        const res = await p.generate(npcId, ctx);
        if (!res || !res.text) continue;
        // Validate with lore gate
        const vetted = this.loreGate.vet(res.text);
        if (!vetted.allowed) {
          return { text: vetted.fallbackText, source: 'loregate' };
        }
        return res.metadata
          ? { text: res.text, metadata: res.metadata, source: p.name }
          : { text: res.text, source: p.name };
      } catch (err) {
        // Continue to next provider on errors
        // eslint-disable-next-line no-console
        console.warn('Dialogue provider error', p.name, err);
        continue;
      }
    }

    // Nothing returned; neutral fallback
    return { text: `${ctx.npcName} hesitates, uncertain of the truth.`, source: 'fallback' };
  }
}
