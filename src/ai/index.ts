import { NpcDialogueEngine } from "./NpcDialogueEngine";
import { OpenAIProvider } from "./providers/OpenAIProvider";
import { groqAI } from "../services/groqAI";
import { NpcAiProvider } from "./NpcAI";

// Simple makeCall wrapper that reuses groqAI.generateAIResponse as a fallback network call
async function makeCall(prompt: string): Promise<string> {
  // groqAI has a generateAIResponse method for generic prompts
  try {
    // gameState is not available here; pass empty objects where required — provider implementations should be robust
    const result = await groqAI.generateAIResponse(prompt, "npc-prompt", { currentRoomId: "unknown" } as any, 150);
    return result ?? "";
  } catch (e) {
    console.warn('[AI Index] makeCall failed:', e);
    return "";
  }
}

const provider: NpcAiProvider = OpenAIProvider(makeCall);

export const engine = new NpcDialogueEngine(provider);
