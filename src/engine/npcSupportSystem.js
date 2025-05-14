// /src/engine/npcSupportSystem.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Full NPC Support System for Gorstan - upgraded for full integration, mood tracking, and dynamic responses
// This module manages NPC dialogue, mood tracking, and dynamic interactions with the player.

/**
 * Retrieves dialogue for a specific NPC based on their ID and context.
 * @param {string} npcId - The identifier of the NPC.
 * @param {object} context - The context for the dialogue (e.g., mood, story stage, inventory).
 * @returns {string} - The dialogue for the NPC or a default message if no dialogue is available.
 */
export function getNpcDialogue(npcId, context = {}) {
  try {
    // Validate the NPC ID
    if (!npcId || typeof npcId !== 'string') {
      throw new Error('Invalid NPC ID. Please provide a valid NPC identifier.');
    }

    // Retrieve the NPC's dialogue map
    const npcData = npcDialogueMap[npcId.toLowerCase()];
    if (!npcData) {
      console.warn(`[NPC] Dialogue for "${npcId}" not found.`);
      return `The NPC ${npcId} has nothing to say right now.`;
    }

    // Determine the mood or context for the dialogue
    const mood = context.mood || 'neutral'; // Default to 'neutral' if no mood is provided
    const dialogue = npcData[mood];

    // Return the dialogue or a fallback message
    return dialogue || `The NPC ${npcId} has nothing to say right now.`;
  } catch (err) {
    console.error('❌ Error retrieving NPC dialogueue:', err);
    return 'An error occurred while retrieving dialogueue.';
  }
}

export const npcDialogueMap = {
  chef: {
    friendly: "The chef grins. 'You got the briefcase yet? Don't waste time.'",
    neutral: "The chef wipes down the counter. 'Need something?'",
    angry: "The chef frowns. 'Order or leave.'",
  },
  morthos: {
    friendly: "Morthos nods. 'You’ve done well to come this far.'",
    neutral: "Morthos eyes you cautiously. 'You still don’t understand, do you?'",
    grumpy: "Morthos growls. 'Ask again and I’ll start charging you in memories.'",
  },
  al: {
    friendly: "Al chuckles. 'You've earned a drink. Or a disaster.'",
    neutral: "Al shrugs. 'You lost? You look it.'",
    grumpy: "Al mutters. 'You've got two ears and no brains.'",
  },
  polly: {
    neutral: "Polly paces slowly. 'Am I lying now, or were you lied to before?'",
    sarcastic: "Polly twirls a pen. 'Maybe *this* version of the truth will amuse you.'",
    mocking: "Polly sneers. 'You're fun. I hope you survive this timeline.'",
  },
  ayla: {
    lowSarcasm: "Ayla smiles warmly. 'Let's try something together.'",
    midSarcasm: "Ayla raises an eyebrow. 'You're asking... again?'",
    highSarcasm: "Ayla sighs. 'Honestly, you'd forget your own name without me.'",
  },
};

/**
 * Retrieves dialogue for a specific NPC based on their mood.
 * @param {string} npcName - The name of the NPC.
 * @param {string} moodState - The mood of the NPC (e.g., 'friendly', 'neutral', 'angry').
 * @returns {string|null} - The dialogue for the NPC or null if no dialogue is available.
 */
export function getMoodDialogue(npcName, moodState = 'neutral') {
  try {
    const entry = npcDialogueMap[npcName.toLowerCase()];
    if (!entry) {
      console.warn(`[NPC] Dialogue for "${npcName}" not found.`);
      return null;
    }
    return entry[moodState] || entry['neutral'];
  } catch (err) {
    console.error('❌ Error retrieving NPC dialogueue:', err);
    return 'An error occurred while retrieving dialogueue.';
  }
}

/**
 * Retrieves Ayla's dialogue based on sarcasm level.
 * @param {number} sarcasmLevel - The level of sarcasm (0-10).
 * @returns {string} - Ayla's dialogue based on the sarcasm level.
 */
export function getSarcasmDialogue(sarcasmLevel) {
  try {
    if (sarcasmLevel >= 10) return npcDialogueMap.ayla.highSarcasm;
    if (sarcasmLevel >= 5) return npcDialogueMap.ayla.midSarcasm;
    return npcDialogueMap.ayla.lowSarcasm;
  } catch (err) {
    console.error('❌ Error retrieving Ayla sarcasm dialogueue:', err);
    return 'Ayla seems speechless for once.';
  }
}

/**
 * Handles interaction with an NPC.
 * @param {string} npcName - The name of the NPC.
 * @param {object} game - The game state object containing NPC mood data.
 * @returns {string} - The NPC's dialogue or a default message if no dialogue is available.
 */
export function talkToNpc(npcName, game) {
  try {
    const mood = game.npcMood?.[npcName] || 'neutral';
    const dialogue = getMoodDialogue(npcName, mood);
    return dialogue || `${npcName} has nothing to say right now.`;
  } catch (err) {
    console.error('❌ Error interacting with NPC:', err);
    return 'An error occurred while talking to the NPC.';
  }
}

/**
 * Updates the mood of an NPC.
 * @param {string} npcName - The name of the NPC.
 * @param {string} newMood - The new mood to set for the NPC (e.g., 'friendly', 'angry').
 * @param {object} game - The game state object containing NPC mood data.
 */
export function updateNpcMood(npcName, newMood, game) {
  try {
    if (!game.npcMood) game.npcMood = {};
    game.npcMood[npcName] = newMood;
    console.log(`[NPC] Mood for "${npcName}" updated to "${newMood}".`);
  } catch (err) {
    console.error('❌ Error updating NPC mood:', err);
  }
}

/**
 * Retrieves the current mood of an NPC.
 * @param {string} npcName - The name of the NPC.
 * @param {object} game - The game state object containing NPC mood data.
 * @returns {string} - The current mood of the NPC or 'neutral' if no mood is set.
 */
export function getNpcMood(npcName, game) {
  try {
    return game.npcMood?.[npcName] || 'neutral';
  } catch (err) {
    console.error('❌ Error retrieving NPC mood:', err);
    return 'neutral';
  }
}

// 🧠 NPC Mood Management
const npcMoods = {}; // Persistent mood state keyed by npcId

/**
 * Adjusts the mood of an NPC by a given amount.
 * @param {string} npcId - The NPC's identifier.
 * @param {number} amount - Amount to adjust (positive or negative).
 * @returns {string} A short summary of the new mood.
 */
export function adjustNpcMood(npcId, amount) {
  if (!npcId) return "⚠️ No NPC ID provided.";
  if (!npcMoods[npcId]) npcMoods[npcId] = 0;

  npcMoods[npcId] += amount;

  // Optional clamp to range [-10, 10]
  if (npcMoods[npcId] > 10) npcMoods[npcId] = 10;
  if (npcMoods[npcId] < -10) npcMoods[npcId] = -10;

  return getMoodDescription(npcMoods[npcId]);
}

/**
 * Returns a human-readable description of mood level.
 * @param {number} moodValue
 * @returns {string}
 */
function getMoodDescription(moodValue) {
  if (moodValue >= 8) return "They beam at you.";
  if (moodValue >= 4) return "They seem pleased.";
  if (moodValue > 0) return "They nod slightly.";
  if (moodValue === 0) return "They’re neutral.";
  if (moodValue > -4) return "They eye you cautiously.";
  if (moodValue > -8) return "They seem annoyed.";
  return "They look ready to snap.";
}
