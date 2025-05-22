// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// Polly Character Module
// This module defines the behavior and dialogue for the character Polly.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Naming is clear and consistent.
     - No unused variables or logic.
     - Defensive: All dialogue conditions are functions.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports a single Polly NPC object for use in the engine.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add a getDialogue(engine) utility for easier dialogue selection.
     - Could add unit tests for dialogue condition logic.
*/

// Polly NPC definition
export const polly = {
  id: "polly",
  name: "Polly",
  location: "interrogationbay",
  mood: 0,
  dialogue: [
    {
      condition: (engine) => !engine.hasSpokenTo("polly"),
      text: "Oh joy. Another hero with coffee stains and no clue."
    },
    {
      condition: (engine) => engine.hasMilestone("alResetsDiscussed") && !engine.hasItem("briefcase"),
      text: "Did Al tell you the resets could stop? Ha! He still believes in mercy."
    },
    {
      condition: (engine) => engine.hasItem("briefcase") && !engine.hasMilestone("briefcaseSolved"),
      text: "You're *carrying* the briefcase? What is this, a fashion statement?"
    },
    {
      condition: (engine) => engine.hasItem("briefcase") && engine.hasMilestone("briefcaseSolved"),
      text: "Wow. You *actually* solved the briefcase. That's… worrying."
    },
    {
      condition: (engine) => engine.hasTrait("curious"),
      text: "You ask too many questions. That’s a compliment… probably."
    },
    {
      condition: () => true,
      text: "Still here? Still wrong."
    }
  ]
};

/**
 * Utility: Get Polly's current dialogue line based on engine state.
 * Returns the first matching dialogue text.
 * @param {object} engine - The game engine/context.
 * @returns {string}
 */
export function getPollyDialogue(engine) {
  if (!engine || typeof engine !== "object") return "Polly is silent.";
  const entry = polly.dialogue.find(d => typeof d.condition === "function" && d.condition(engine));
  return entry ? entry.text : "Polly is silent.";
}
