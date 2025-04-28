// /src/engine/npcSupportSystem.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Full NPC Support System for Gorstan - upgraded for full integration, mood tracking, and dynamic responses

// src/engine/npcSupportSystem.js

const npcDatabase = {
  chef: {
    friendly: "The chef grins. 'You got the briefcase yet? Don't waste time.'",
    neutral: "The chef wipes down the counter. 'Need something?'",
    angry: "The chef frowns. 'Order or leave.'"
  },
  morthos: {
    friendly: "Morthos claps you on the shoulder. 'You're learning, mortal.'",
    neutral: "Morthos eyes you warily. 'Another meddler... interesting.'",
    angry: "Morthos growls. 'You've wasted my time, little one.'"
  },
  polly: {
    friendly: "Polly smirks. 'Still alive? How disappointing.'",
    neutral: "Polly tilts her head. 'Lost already? Figures.'",
    angry: "Polly snarls. 'I told you once. I won't again.'"
  }
};

export function talkToNpc(npcName, storyProgress, npcMood = {}) {
  const mood = npcMood[npcName] || 'neutral';
  if (npcDatabase[npcName]) {
    return npcDatabase[npcName][mood];
  } else {
    return "There's no one here by that name.";
  }
}

export function getNpcDialogue(npcName, topic, storyProgress, npcMood = {}) {
  const topicLower = topic.toLowerCase();

  if (npcName === 'chef') {
    if (topicLower.includes('burger') || topicLower.includes('food')) {
      return "The chef flips a patty without looking. 'Best burger this side of the dimensions.'";
    }
    if (topicLower.includes('warehouse') || topicLower.includes('briefcase')) {
      return "The chef leans in. 'Get that briefcase. You don't want to miss what's inside.'";
    }
  }

  if (npcName === 'morthos') {
    if (topicLower.includes('coffee')) {
      return "Morthos chuckles darkly. 'Gorstan coffee... potent enough to wake the dead.'";
    }
    if (topicLower.includes('glitch')) {
      return "Morthos scowls. 'Reality breaks where fools tamper. Beware.'";
    }
  }

  if (npcName === 'polly') {
    if (topicLower.includes('truth')) {
      return "Polly smiles thinly. 'The truth? You couldn't survive it.'";
    }
    if (topicLower.includes('reset')) {
      return "Polly laughs. 'Push the button. I dare you.'";
    }
  }

  return "They don't seem to know anything about that.";
}

export function adjustNpcMood(npcName, npcMood, adjustment) {
  const moodOrder = ['angry', 'neutral', 'friendly'];
  let current = npcMood[npcName] || 'neutral';
  let index = moodOrder.indexOf(current);

  if (adjustment === 'friendlier' && index < moodOrder.length - 1) {
    npcMood[npcName] = moodOrder[index + 1];
  }
  if (adjustment === 'angrier' && index > 0) {
    npcMood[npcName] = moodOrder[index - 1];
  }

  return npcMood;
}

// Usage inside GameEngine:
// - talking positively to NPCs can call adjustNpcMood(npcName, this.npcMood, 'friendlier')
// - being rude or failing tasks can call adjustNpcMood(npcName, this.npcMood, 'angrier')
