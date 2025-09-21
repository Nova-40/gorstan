import { NpcAiProvider, GenerateOptions } from "../NpcAI";
import { ethicsScreen, ethicsSystemPreamble } from "../EthicsCore64";

export function withEthics(provider: NpcAiProvider): NpcAiProvider {
  return {
    async generate(opts: GenerateOptions) {
      const { npc, ctx, history, playerInput = "" } = opts;
      const verdict = ethicsScreen(playerInput, {
        npcId: npc.id, npcRole: npc.role, zone: ctx.zone, sessionId: ctx.sessionId, playerAgeUnknown: true
      });

      if (!verdict.allow) {
        return `I can't address that directly (${verdict.reasons.join("; ")}). Let’s try a safer angle.`;
      }

      const preamble = ethicsSystemPreamble({ npcId: npc.id, npcRole: npc.role, zone: ctx.zone, sessionId: ctx.sessionId, playerAgeUnknown: true });
      const ethicsHint = verdict.softWarnings?.length ? `\nCaution: ${verdict.softWarnings.join("; ")}` : "";

      // Inject system preamble at the head of history for the provider:
      const systemMsg = { from: "npc" as const, text: preamble + ethicsHint, timestamp: Date.now() };
      const safeHistory = [systemMsg, ...history];

      return provider.generate({ ...opts, history: safeHistory });
    }
  };
}
