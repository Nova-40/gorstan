// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// aylaHelp.js
// Ayla Help System for Gorstan
// Provides contextual hints, summaries, and motivational messages from Ayla
// based on the player's current room, story progress, and inventory.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Naming is clear and consistent.
     - No unused variables or logic.
     - Defensive: All input types are checked.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports all helpers for use in engine and UI.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for advice, summary, and motivation logic.
     - Could memoize for performance, but not needed for typical use.
*/

// Constants for static messages
export const SASS_REMARKS = [
  "Don't make me spell it out.",
  "You're smarter than this, probably.",
  "If you need more help, maybe ask the chef. He seems lonely.",
  "Try not to break *everything*.",
  "Would a reset help? Kidding. Probably.",
  "You know, I could just solve this for you. But where's the fun in that?",
  "If I had a coin for every time you asked for help... I'd have a lot of coins.",
];

export const MOTIVATIONAL_MESSAGES = [
  "You're closer than you think. Keep going!",
  "Even the darkest paths lead somewhere. Trust yourself.",
  "You're doing better than you realise. Don't give up.",
  "Every step forward is progress. Even the small ones.",
  "Remember: the journey matters as much as the destination.",
  "You've got this. Ayla believes in you.",
];

/**
 * Provides contextual hints based on the player's current room, story progress, and inventory.
 * @param {string} currentRoom - The player's current room.
 * @param {object} storyProgress - The player's current story progress.
 * @param {Array} inventoryList - The player's inventory.
 * @returns {string} - A contextual hint from Ayla.
 */
export function getHelpAdvice(currentRoom, storyProgress = {}, inventoryList = []) {
  try {
    // Defensive: Validate input types
    if (typeof currentRoom !== "string") {
      console.warn("⚠️ getHelpAdvice: currentRoom should be a string.", currentRoom);
    }
    if (typeof storyProgress !== "object" || storyProgress === null) {
      console.warn("⚠️ getHelpAdvice: storyProgress should be an object.", storyProgress);
      storyProgress = {};
    }
    if (!Array.isArray(inventoryList)) {
      console.warn("⚠️ getHelpAdvice: inventoryList should be an array.", inventoryList);
      inventoryList = [];
    }
    const inventoryIds = inventoryList.map(item => (item && item.id ? item.id : item)).filter(Boolean);
    const hints = [];
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
    // Coffee portal hint
    if (
      (currentRoom === 'controlnexus' || currentRoom === 'controlnexusreturned') &&
      inventoryIds.includes('coffee') &&
      !(storyProgress.portalFromNexus || storyProgress.portalFromReturned)
    ) {
      hints.push("That coffee you're holding… maybe it’s more useful airborne. Try throwing it?");
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
    // Combine the first hint with a random sassy remark
    const randomSass = SASS_REMARKS[Math.floor(Math.random() * SASS_REMARKS.length)];
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
export function getAylaSummary(storyProgress = {}) {
  try {
    if (typeof storyProgress !== "object" || storyProgress === null) {
      console.warn("⚠️ getAylaSummary: storyProgress should be an object.", storyProgress);
      storyProgress = {};
    }
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
    if (!Array.isArray(MOTIVATIONAL_MESSAGES) || MOTIVATIONAL_MESSAGES.length === 0) {
      throw new Error("MOTIVATIONAL_MESSAGES array is missing or empty.");
    }
    const randomMotivation = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    return `Ayla says: ${randomMotivation}`;
  } catch (err) {
    console.error('❌ Error generating Ayla motivation:', err);
    return "Ayla says: 'Keep going. You're doing fine. Probably.'";
  }
}

/*
  === Change Commentary ===
  - Updated version to 2.4.0 and ensured MIT license is present.
  - Defensive: Added type checks for all input parameters.
  - All syntax validated and ready for use in the Gorstan game.
  - Comments improved for maintainability and clarity.
  - Module is correctly wired for import and use in the game engine and UI.
*/
