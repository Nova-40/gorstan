// /src/engine/npcSupportSystem.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Full NPC Support System for Gorstan - upgraded for full integration, mood tracking, and dynamic responses

export const npcDialogueMap = {
  chef: {
    friendly: "The chef grins. 'You got the briefcase yet? Don't waste time.'",
    neutral: "The chef wipes down the counter. 'Need something?'",
    angry: "The chef frowns. 'Order or leave.'"
  },
  morthos: {
    friendly: "Morthos nods. 'You’ve done well to come this far.'",
    neutral: "Morthos eyes you cautiously. 'You still don’t understand, do you?'",
    grumpy: "Morthos growls. 'Ask again and I’ll start charging you in memories.'"
  },
  al: {
    friendly: "Al chuckles. 'You've earned a drink. Or a disaster.'",
    neutral: "Al shrugs. 'You lost? You look it.'",
    grumpy: "Al mutters. 'You've got two ears and no brains.'"
  },
  polly: {
    neutral: "Polly paces slowly. 'Am I lying now, or were you lied to before?'",
    sarcastic: "Polly twirls a pen. 'Maybe *this* version of the truth will amuse you.'",
    mocking: "Polly sneers. 'You're fun. I hope you survive this timeline.'"
  },
  ayla: {
    lowSarcasm: "Ayla smiles warmly. 'Let's try something together.'",
    midSarcasm: "Ayla raises an eyebrow. 'You're asking... again?'",
    highSarcasm: "Ayla sighs. 'Honestly, you'd forget your own name without me.'"
  }
};

export const getNpcDialogue = getMoodDialogue;

export function talkToNpc(npcName, game) {
  const mood = game.npcMood?.[npcName] || 'neutral';
  const dialogue = getMoodDialogue(npcName, mood);
  return dialogue || `${npcName} has nothing to say right now.`;
}

export function getMoodDialogue(npcName, moodState = 'neutral') {
  const entry = npcDialogueMap[npcName.toLowerCase()];
  if (!entry) return null;
  return entry[moodState] || entry['neutral'];
}

export function getSarcasmDialogue(sarcasmLevel) {
  if (sarcasmLevel >= 10) return npcDialogueMap.ayla.highSarcasm;
  if (sarcasmLevel >= 5) return npcDialogueMap.ayla.midSarcasm;
  return npcDialogueMap.ayla.lowSarcasm;
}
