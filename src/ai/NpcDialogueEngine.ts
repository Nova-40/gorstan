import { NpcAiProvider, NpcPersona, NpcMessage } from "./NpcAI";
import { withEthics } from "./providers/ProviderFactory";

export class NpcDialogueEngine {
  constructor(private provider: NpcAiProvider) {
    this.provider = withEthics(provider);
  }

  async reply(npc: NpcPersona, zone: string, sessionId: string, history: NpcMessage[], playerInput: string) {
    const opts = { npc, ctx: { zone, sessionId }, history, playerInput };
    return this.provider.generate(opts as any);
  }

  async npcToNpc(npcA: NpcPersona, npcB: NpcPersona, zone: string, sessionId: string, topic: string) {
    const history: NpcMessage[] = [
      { from: "npc", text: `${npcA.id} opens: ${topic}`, timestamp: Date.now() }
    ];
    const a = await this.reply(npcA, zone, sessionId, history, topic);
    const b = await this.reply(npcB, zone, sessionId, [{ from: "npc", text: a, timestamp: Date.now() }], a);
    return { a, b };
  }
}
