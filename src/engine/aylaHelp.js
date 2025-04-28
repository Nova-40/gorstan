// /src/engine/aylaHelp.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Clean Ayla Help System for Gorstan - ONLY Ayla contextual help, no gameplay logic

// src/engine/aylaHelp.js

export function getHelpAdvice(currentRoom, storyProgress, inventoryList) {
  const inventoryIds = inventoryList.map(item => item.id);
  const hints = [];

  // Early game London hints
  if (!storyProgress.gotRunbag) {
    hints.push("You probably shouldn't leave London without your runbag. Maybe check your apartment?");
  } else if (!storyProgress.hadFlatWhite) {
    hints.push("A flat white from Findlater's might give you the boost you need.");
  } else if (!storyProgress.bookedFirstClass) {
    hints.push("Think first class — and think St Katherine's Dock.");
  } else if (currentRoom === 'centralpark' && !inventoryIds.includes('briefcase')) {
    hints.push("Sitting quietly sometimes brings clarity. The park seems restful enough...");
  }

  // Midgame hints
  if (inventoryIds.includes('greasyNapkin') && !inventoryIds.includes('briefcase')) {
    hints.push("Have you spoken properly to the Chef? Maybe you need to go somewhere secure after.");
  }

  if (inventoryIds.includes('briefcase') && !inventoryIds.includes('medallion')) {
    hints.push("The briefcase seems strange. Maybe it isn't just for carrying things.");
  }

  // Secret tunnel hints
  if (currentRoom === 'centralpark' && !inventoryIds.includes('medallion')) {
    hints.push("The park hides more than just joggers and squirrels. Maybe throwing something would reveal it?");
  }

  // After getting the medallion
  if (inventoryIds.includes('medallion')) {
    hints.push("You've got power in your hands now. Some barriers might not stop you anymore.");
  }

  // Reset Room hint
  if (currentRoom === 'resetroom') {
    hints.push("Pushing buttons is generally a bad idea. Especially *that* one.");
  }

  // Glitchroom hints
  if (currentRoom === 'glitchroom' || currentRoom === 'glitchrealm') {
    hints.push("Reality here is fragile. Maybe some actions elsewhere caused this...");
  }

  // Final catch-all
  if (hints.length === 0) {
    hints.push("Honestly? I'd just explore. And maybe don't poke the obvious traps.");
  }

  // Sassify Ayla's voice randomly
  const sass = [
    "Don't make me spell it out.",
    "You're smarter than this, probably.",
    "If you need more help, maybe ask the chef. He seems lonely.",
    "Try not to break *everything*.",
    "Would a reset help? Kidding. Probably."
  ];

  const randomSass = sass[Math.floor(Math.random() * sass.length)];

  return `Ayla says: ${hints[0]} ${randomSass}`;
}

// (No gameplay logic mixed in. Ayla module is now clean.)
