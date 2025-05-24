// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// npcs.js — Memory-driven NPC system with evolving mood and interaction

const npcState = {
  Morthos: {
    memory: [],
    mood: "neutral",
    traits: ["pragmatic"],
  },
  Al: {
    memory: [],
    mood: "friendly",
    traits: ["loyal"],
  },
  Polly: {
    memory: [],
    mood: "sarcastic",
    traits: ["unpredictable", "liar"],
  },
};
export const NPCs = Object.keys(npcState);
export function remember(npcName, entry) {
  const npc = npcState[npcName];
  if (!npc) return;
  npc.memory.push(entry);

  const lower = entry.toLowerCase();
  if (lower.includes("thank")) npc.mood = "grateful";
  else if (lower.includes("insult") || lower.includes("rude")) npc.mood = "annoyed";
  else if (lower.includes("help")) npc.mood = "encouraged";
}

export function getMood(npcName) {
  return npcState[npcName]?.mood || "unknown";
}

export function getMemory(npcName) {
  return npcState[npcName]?.memory || [];
}

export function getTraits(npcName) {
  return npcState[npcName]?.traits || [];
}

export function resetNPC(npcName) {
  const npc = npcState[npcName];
  if (npc) {
    npc.memory = [];
    npc.mood = "neutral";
  }
}

export function npcRespond(npcName, playerAction) {
  const mood = getMood(npcName);
  switch (npcName) {
    case "Morthos":
      return mood === "grateful"
        ? "I owe you one. Let’s move."
        : "You really want to do this now?";
    case "Al":
      return mood === "friendly"
        ? "Alright mate, let’s make this quick."
        : "You sure about that?";
    case "Polly":
      return mood === "sarcastic"
        ? "Oh sure. That'll totally work. 🙄"
        : "Wouldn't you like to know.";
    default:
      return "The NPC blinks, uncertain.";
  }
}
