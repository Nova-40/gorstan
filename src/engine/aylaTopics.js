// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// aylaTopics.js — Predefined topic-based responses for Ayla NPC

/**
 * topics
 * Maps keywords to Ayla's canned responses.
 * @type {Object.<string, string>}
 */
const topics = {
  "dale": "Dale has always had a knack for breaking rules... and protocols.",
  "lattice": "The Lattice isn’t just a network — it’s a memory. A construct of constructs.",
  "what do I do": "Try exploring the nearby exits. Sometimes answers lie where the light doesn’t shine.",
  "secret room": "Secret doors hide in plain sight. Perhaps something you carry is the key.",
  "key": "Keys take many forms. Some are literal. Others... emotional."
};

/**
 * getAylaResponse
 * Returns Ayla's response for a given player query.
 * If no topic matches, returns a default fallback.
 * @param {string} query - The player's question or topic.
 * @returns {string} Ayla's response string.
 */
export const getAylaResponse = (query) => {
  if (typeof query !== "string" || !query.trim()) {
    // Defensive: handle empty or invalid input
    return "Could you clarify your question?";
  }
  const q = query.toLowerCase();
  const match = Object.keys(topics).find(key => q.includes(key));
  return match ? topics[match] : "I’m not sure. Could you ask about something else?";
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for object, function, parameters, and returns.
- ✅ Defensive error handling for invalid/empty queries.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Consider making topics extensible or localizable for future content.
*/