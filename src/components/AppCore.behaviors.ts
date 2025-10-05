/*
  Extracted heavy NPC behavior generation so it can be lazy-loaded.
*/
import { npcAI } from '../services/npcAI';

export async function generateNPCBehaviorsModule(
  npcsInRoom: any[],
  room: any,
  commandHistory: string[],
  roomEntryTime: number,
  state: any,
  dispatch: any,
) {
  if (!room || npcsInRoom.length === 0) {
    return;
  }

  for (const npc of npcsInRoom) {
    try {
      const npcProfile = npcAI.getAllNPCs().find((p) => p.npcId === npc.id);
      if (!npcProfile) continue;

      const context = {
        npcProfile,
        currentRoom: room,
        playerPresent: true,
        gameState: state,
        recentPlayerActions: commandHistory.slice(-5),
        timeInRoom: Date.now() - roomEntryTime,
        nearbyNPCs: npcsInRoom.map((n) => n.id).filter((id) => id !== npc.id),
      };

      const behavior = await npcAI.generateNPCBehavior(context);
      if (behavior && behavior.shouldDisplay) {
        dispatch({ type: 'SET_NPC_BEHAVIOR', payload: { npcId: npc.id, behavior: behavior.content } });

        if (behavior.priority === 'high' || behavior.type === 'callout') {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: Date.now().toString(),
              text: `**${npc.name}**: ${behavior.content}`,
              type: 'npc',
              timestamp: Date.now(),
            },
          });
        }
      }
    } catch (error) {
      console.warn(`[NPC AI] Behavior generation failed for ${npc.id}:`, error);
    }
  }
}

export default generateNPCBehaviorsModule;
