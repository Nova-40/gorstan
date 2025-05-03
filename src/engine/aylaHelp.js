// /src/engine/aylaHelp.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Ayla Help System
// This module provides contextual hints and advice from Ayla based on the player's current room, story progress, and inventory.
// It ensures Ayla's responses are dynamic, helpful, and occasionally sassy.

export function getHelpAdvice(currentRoom, storyProgress, inventoryList) {
  try {
    const inventoryIds = inventoryList.map(item => item.id); // Extract item IDs from the inventory
    const hints = []; // Array to store contextual hints

    // Early game hints
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

    // Final catch-all hint
    if (hints.length === 0) {
      hints.push("Honestly? I'd just explore. And maybe don't poke the obvious traps.");
    }

    // Sassify Ayla's voice randomly
    const sass = [
      "Don't make me spell it out.",
      "You're smarter than this, probably.",
      "If you need more help, maybe ask the chef. He seems lonely.",
      "Try not to break *everything*.",
      "Would a reset help? Kidding. Probably.",
      "You know, I could just solve this for you. But where's the fun in that?",
      "If I had a coin for every time you asked for help... I'd have a lot of coins.",
    ];

    const randomSass = sass[Math.floor(Math.random() * sass.length)];

    // Combine the first hint with a random sassy remark
    return `Ayla says: ${hints[0]} ${randomSass}`;
  } catch (err) {
    console.error('❌ Error generating Ayla help advice:', err);
    return "Ayla says: 'Something went wrong. Maybe try again later? Or don't. Your call.'";
  }
}

/**
 * Provides a summary of Ayla's advice based on the player's progress.
 * @param {object} storyProgress - The player's current story progress.
 * @returns {string} - A summary of Ayla's advice.
 */
export function getAylaSummary(storyProgress) {
  try {
    if (!storyProgress.gotRunbag) {
      return "Ayla says: 'Your runbag is still missing. Maybe check your apartment?'";
    }
    if (!storyProgress.hadFlatWhite) {
      return "Ayla says: 'A flat white might help. Findlater's Café is calling.'";
    }
    if (!storyProgress.bookedFirstClass) {
      return "Ayla says: 'You need to book first class. St Katherine's Dock is the key.'";
    }
    return "Ayla says: 'You're doing great. Keep exploring and trust your instincts.'";
  } catch (err) {
    console.error('❌ Error generating Ayla summary:', err);
    return "Ayla says: 'Something went wrong while summarizing your progress. Maybe just keep going?'";
  }
}

/**
 * Generates a motivational message from Ayla.
 * @returns {string} - A motivational message.
 */
export function getAylaMotivation() {
  try {
    const motivations = [
      "You're closer than you think. Keep going!",
      "Even the darkest paths lead somewhere. Trust yourself.",
      "You're doing better than you realize. Don't give up.",
      "Every step forward is progress. Even the small ones.",
      "Remember: the journey matters as much as the destination.",
      "You've got this. Ayla believes in you.",
    ];

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    return `Ayla says: ${randomMotivation}`;
  } catch (err) {
    console.error('❌ Error generating Ayla motivation:', err);
    return "Ayla says: 'Keep going. You're doing fine. Probably.'";
  }
}
