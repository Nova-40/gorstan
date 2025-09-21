import { groqAI } from '../services/groqAI';
import { engine } from '../ai';
import { getPersona } from '../npc/personas';
import type { LocalGameState } from '../state/gameState';

export type ScriptedFallback = (npcId: string, playerInput: string, state: LocalGameState) => Promise<string | null> | string | null;

export async function generateNpcReply(
  npcId: string,
  playerInput: string,
  state: LocalGameState,
  fallback?: ScriptedFallback,
): Promise<string | null> {
  // Try the high-priority external AI first (groqAI)
  try {
    const aiResp = await groqAI.generateNPCResponse(npcId, playerInput, state);
    if (aiResp) return aiResp;
  } catch (err) {
    console.warn('[AI Adapter] groqAI failed:', err);
  }

  // Fall back to the engine
  try {
    const persona = getPersona(npcId);
    const convo = (state.flags?.npcConversations as any)?.[npcId] ?? { entries: [] };
    const convoEntries = convo?.entries ?? [];
    const mappedHistory = convoEntries.flatMap((e: any) => {
      const msgs: any[] = [];
      if (e.playerInput && e.playerInput.trim() !== '') msgs.push({ from: 'player', text: e.playerInput, timestamp: e.timestamp });
      if (e.npcResponse && e.npcResponse.trim() !== '') msgs.push({ from: 'npc', text: e.npcResponse, timestamp: e.timestamp + 1 });
      return msgs;
    });

    const reply = await engine.reply(
      { id: persona.id, role: persona.role, style: persona.speaking_style?.sentence_length as any ?? 'varied' },
      state.currentRoomId ?? 'unknown',
      `${state.player?.name ?? 'player'}-${Date.now()}`,
      mappedHistory,
      playerInput,
    );

    if (reply) return reply;
  } catch (err) {
    console.warn('[AI Adapter] engine.reply failed:', err);
  }

  // Finally, use scripted fallback if provided
  try {
    if (fallback) {
      const fb = await fallback(npcId, playerInput, state);
      if (fb) return fb;
    }
  } catch (err) {
    console.warn('[AI Adapter] scripted fallback failed:', err);
  }

  return null;
}
