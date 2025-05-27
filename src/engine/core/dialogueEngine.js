// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: dialogueEngine.js – v2.4.1

// MIT License © 2025 Geoff Webster
// Gorstan Game v2.4.x
// dialogueEngine.js – Handles NPC memory, mood, and contextual responses

export const npcMemory = {};

export function rememberInteraction(npc, key, value) {
  if (!npcMemory[npc]) npcMemory[npc] = {};
  npcMemory[npc][key] = value;
}

export function getMemory(npc, key) {
  return npcMemory[npc]?.[key];
}

export function getAylaResponse(topic, roomId = "", progress = {}) {
  const memory = npcMemory["ayla"] || {};
  if (topic.includes("dale")) {
    return memory.metDale
      ? "You already know what you need about Dale. You just haven’t accepted it."
      : "Dale? You'll know him when you're ready.";
  }

  if (roomId === "controlroom" && !progress.coffeeThrown) {
    return "The coffee may not be drinkable… have you tried throwing it?";
  }

  return "I'm still processing that. Try again in another context.";
}
