// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// characters.js
// Gorstan Chronicles - NPC character lore crosslinked to book series.
// Provides character lore for tooltips, codex, and narrative crosslinks.

/**
 * characterLore
 * Maps NPC names to their book of origin and lore description.
 * Used for in-game tooltips, codex, and narrative crosslinks.
 * @type {Object.<string, {book: string, description: string}>}
 */
export const characterLore = {
  Ayla: {
    book: "The Last Veil",
    description: "Ayla is a non-linear entity who assists players across dimensions. She lies, but only when necessary. Created by the Builders as an interface being."
  },
  Morthos: {
    book: "Quantum Lattice",
    description: "Morthos is a guardian of the lattice and a reluctant prophet. He senses multiversal instability before others do."
  },
  Al: {
    book: "Findlater’s Corner",
    description: "Al was a technician who maintained the original Lattice dome. Cynical but loyal, he often tries to prevent disasters after they start."
  },
  Polly: {
    book: "The Last Veil",
    description: "Polly appears to help, but never tells the truth. Her sarcasm masks deep understanding of what's to come."
  },
  Librarian: {
    book: "Quantum Lattice",
    description: "A sentient archivist guarding the legacy of the Lattice. Responds only to chosen players who carry traces of Dale."
  }
};

/**
 * Utility: Get lore for a given character name.
 * @param {string} name - The character's name.
 * @returns {{book: string, description: string}|undefined}
 */
export function getCharacterLore(name) {
  if (typeof name !== "string") return undefined;
  return characterLore[name];
}

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Version updated to 2.4.0.
     - Added getCharacterLore utility for code reuse.
     - Improved comments and JSDoc for maintainability.
     - Ensured only lore and utility are exported.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports are safe for use in UI, codex, and tooltips.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for getCharacterLore.
     - Could memoize for large character sets, but not needed for current use.
*/
