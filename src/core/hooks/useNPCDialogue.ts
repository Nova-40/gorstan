import { useCallback } from 'react';
import type { DialogueContext } from '../npcs/types';
import { DialogueEngine } from '../npcs/DialogueEngine';
import { LoreGate } from '../npcs/LoreGate';
import { OfflineTreeProvider } from '../npcs/providers/OfflineTreeProvider';
import { LLMProvider } from '../npcs/providers/LLMProvider';

// Simple singleton engine instance for hooks
const providers = [new LLMProvider(), new OfflineTreeProvider()];
const loreGate = new LoreGate();
const engine = new DialogueEngine(providers, loreGate);

export function useNPCDialogue(npcId: string, npcName?: string) {
  const prompt = useCallback(async (ctx: DialogueContext) => {
    const full: DialogueContext = { ...ctx, npcId } as DialogueContext;
    if (npcName !== undefined) {
      // Only set npcName when defined to satisfy exactOptionalPropertyTypes
      // @ts-ignore-next-line
      full.npcName = npcName;
    }
    return engine.prompt(npcId, full);
  }, [npcId, npcName]);

  return { prompt };
}
