
// npcManager.js – Visibility logic using NPC traits, items, and story progress
import { NPCs } from "./npcs";
import { storyProgress } from "./storyProgress";
import { inventory } from "./inventory";

export class NPCManager {
  constructor() {
    this.cache = new Map();
  }

  getVisible(roomId, engine) {
    if (this.cache.has(roomId)) return this.cache.get(roomId);

    const state = engine?.getState?.() || {};
    const traits = engine?.getTraits?.() || {};
    const playerInv = inventory.getAll();

    const visible = Object.entries(NPCs).filter(([id, npc]) => {
      if (npc.visibleInRooms?.includes?.(roomId)) return true;

      if (npc.triggers?.requiresTrait && traits[npc.triggers.requiresTrait]) return true;
      if (npc.triggers?.requiresItem && playerInv.includes(npc.triggers.requiresItem)) return true;
      if (npc.triggers?.requiresProgress && storyProgress.has(npc.triggers.requiresProgress)) return true;

      return false;
    }).map(([name]) => name);

    this.cache.set(roomId, visible);
    return visible;
  }

  invalidate(roomId) {
    this.cache.delete(roomId);
  }
}

export const npcManager = new NPCManager();
