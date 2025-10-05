import type { DialogueContext, DialogueProvider, DialogueResult } from '../types';

export class LLMProvider implements DialogueProvider {
  name = 'llm';

  apiKey: string | undefined;
  provider: string;
  model: string;

  constructor() {
    this.apiKey = process.env.GORSTAN_AI_API_KEY || undefined;
    this.provider = process.env.GORSTAN_AI_PROVIDER || 'offline';
    this.model = process.env.GORSTAN_AI_MODEL || 'gpt-5';
  }

  async generate(npcId: string, ctx: DialogueContext): Promise<DialogueResult | null> {
    // Respect privacy setting: no network calls if no apiKey or provider not 'openai'
    if (!this.apiKey || this.provider !== 'openai') return null;

    // Minimal network call wrapper — callers should mock this in tests
    const prompt = `You are roleplaying ${ctx.npcName || npcId}. Stay canonical to the Gorstan lore.`;

    // Do not implement real network calls here — this module is a thin adaptor.
    // Integration with real LLMs should be implemented in a separate service file.
    return { text: `${ctx.npcName || npcId} says something thoughtful.`, source: this.name };
  }
}
