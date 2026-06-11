export declare function interactWithNPC(npcId: string): Promise<void>;

export function npcReact(npcId: string, message: string, state: any): void {
  // Stub implementation for NPC reactions
  console.log(`NPC ${npcId} reacts to: ${message}`, state);
}
