export type DialogueContext = {
  playerId?: string;
  npcId?: string;
  npcName?: string;
  questState?: Record<string, any>;
  flags?: Record<string, boolean>;
  recentCommands?: string[];
};

export type DialogueResult = {
  text: string;
  metadata?: Record<string, any>;
  source?: string;
};

export interface DialogueProvider {
  name: string;
  generate(npcId: string, ctx: DialogueContext): Promise<DialogueResult | null>;
}
