
// dialogueEngine.js — v2.8.2
// Handles NPC dialogue with memory, mood, and topic parsing

const npcState = {};

export const getNPCState = (npcId) => {
  if (!npcState[npcId]) {
    npcState[npcId] = {
      mood: 0,
      trust: 0,
      history: [],
      responses: []
    };
  }
  return npcState[npcId];
};

export const handleDialogue = (npcId, input, playerState) => {
  const state = getNPCState(npcId);
  const cleanInput = input.trim().toLowerCase();

  const keywords = cleanInput.split(" ");
  const topic = keywords.includes("about") ? keywords[keywords.indexOf("about") + 1] : keywords[keywords.length - 1];

  let reply = "I don't have much to say about that.";

  if (npcId === "morthos") {
    if (topic === "coffee") {
      reply = state.trust > 1
        ? "Ah, the sacred brew. You're learning."
        : "You may not be ready for what the coffee reveals.";
    } else if (topic === "dale") {
      reply = playerState.flags?.daleSeen
        ? "He's been through here. But not unchanged."
        : "Dale? The name stirs something, but I can't place it.";
    }
  }

  if (state.history.length > 5) {
    state.mood++;
  }

  if (state.mood >= 3) {
    reply += " (Morthos looks annoyed by your persistence.)";
  }

  state.history.push({ input, reply });
  state.responses.push(reply);

  return {
    reply,
    mood: state.mood,
    trust: state.trust
  };
};
