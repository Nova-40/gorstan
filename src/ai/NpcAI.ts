export type NpcMessage = { from: "player"|"npc"; text: string; timestamp: number };
export type NpcPersona = { id: string; role: string; style: string; memoryKey?: string; };
export type AiBackend = "openai"|"groq"|"ollama"|"azure"|"local";

export type NpcAiConfig = {
  backend: AiBackend;
  model: string;
  temperature: number;
  maxTokens: number;
  rateLimitPerMin: number;
  allowNpcToNpc: boolean;
};

export type GenerateOptions = {
  npc: NpcPersona;
  ctx: { zone: string; sessionId: string };
  history: NpcMessage[];
  playerInput?: string;
};

export interface NpcAiProvider {
  generate(opts: GenerateOptions): Promise<string>;
}

export interface MemoryStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export interface CacheStore {
  get(hash: string): Promise<string | null>;
  set(hash: string, value: string, ttlSec: number): Promise<void>;
}
