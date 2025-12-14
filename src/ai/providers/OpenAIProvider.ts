import { NpcAiProvider, GenerateOptions } from "../NpcAI";

export function OpenAIProvider(makeCall: (prompt: string) => Promise<string>): NpcAiProvider {
  return {
    async generate({ npc, history, playerInput = "" }: GenerateOptions) {
      const persona = `Persona:\n- ID: ${npc.id}\n- Role: ${npc.role}\n- Style: ${npc.style}`;
      const transcript = history.map(h => `${h.from.toUpperCase()}: ${h.text}`).join("\n");
      const prompt = `${persona}\n\nTranscript:\n${transcript}\n\nPlayer said: "${playerInput}"\n\nReply as ${npc.id} in-character, concise, helpful, with light humour when appropriate.`;

      // Here we call the provided HTTP wrapper — the caller should provide network implementation.
      return makeCall(prompt);
    }
  };
}
