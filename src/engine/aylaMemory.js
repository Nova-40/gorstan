// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// aylaMemory.js — Tracks past interactions with Ayla

/**
 * aylaMemory
 * Tracks the player's questions to Ayla and her frustration level.
 * @type {{
 *   questionsAsked: string[],
 *   frustrationLevel: number,
 *   addQuestion: (q: string) => void,
 *   reset: () => void
 * }}
 */
const aylaMemory = {
  /** Array of all questions asked to Ayla (in order) */
  questionsAsked: [],
  /** Frustration level (0–5), increases with repeated questions */
  frustrationLevel: 0,

  /**
   * Adds a question to Ayla's memory and updates frustration level.
   * @param {string} q - The question asked.
   */
  addQuestion(q) {
    this.questionsAsked.push(q);
    // Count how many times this question has been asked
    const repeats = this.questionsAsked.filter(x => x === q).length;
    // Frustration increases with repeats, max 5
    this.frustrationLevel = Math.min(5, repeats);
    // TODO: Consider adding a timestamp or limiting memory size for performance.
  },

  /**
   * Resets Ayla's memory and frustration level.
   */
  reset() {
    this.questionsAsked = [];
    this.frustrationLevel = 0;
  }
};

export default aylaMemory;

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for object, methods, and parameters.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Consider adding timestamps or limiting memory for future extensibility.
*/