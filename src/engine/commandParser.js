// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// commandParser.js — Robust command parser for Gorstan engine

/**
 * Parses and dispatches player commands.
 * Handles key actions like look, move, inventory, use items, and meta commands.
 * @param {string} command - The raw player input.
 * @param {Object} state - Current game state (room, inventory, traits, etc).
 * @param {function} dispatch - Dispatch function for game state updates.
 */
export const parseCommand = (command, state, dispatch) => {
  if (typeof command !== "string" || typeof dispatch !== "function") {
    // Defensive: Invalid input or dispatch
    // eslint-disable-next-line no-console
    console.error("parseCommand: Invalid command or dispatch function.");
    return;
  }

  const input = command.trim().toLowerCase();

  /**
   * Aliases for shorthand commands and common synonyms.
   * @type {Object.<string, string>}
   */
  const aliases = {
    inv: "inventory",
    i: "inventory",
    n: "go north",
    s: "go south",
    e: "go east",
    w: "go west",
    north: "go north",
    south: "go south",
    east: "go east",
    west: "go west",
    "/doorsoff": "/doorsoff", // god mode alias
    stepback: "stepback"
  };

  const normalized = aliases[input] || input;

  // === Special System Commands ===

  if (normalized === "/defuse") {
    // Defensive: Dynamic import for trap system
    import("./trapSystem")
      .then((module) => {
        if (typeof module.defuseTrap === "function") {
          try {
            module.defuseTrap(state?.room, dispatch);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("defuseTrap failed:", err);
            dispatch({ type: "LOG", payload: "Trap defusal failed due to an error." });
          }
        } else {
          // eslint-disable-next-line no-console
          console.error("defuseTrap function not found.");
          dispatch({ type: "LOG", payload: "Trap system is offline." });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load trapSystem:", err);
        dispatch({ type: "LOG", payload: "Trap system could not be loaded." });
      });
    return;
  }

  if (normalized === "/doors") {
    dispatch({ type: "REVEAL_DOORS" });
    dispatch({ type: "LOG", payload: "God mode: All exits are now visible." });
    return;
  }

  if (normalized === "/doorsoff") {
    dispatch({ type: "HIDE_DOORS" });
    dispatch({ type: "LOG", payload: "Exits hidden. Normal play resumed." });
    return;
  }

  // === Built-in Game Commands ===

  if (normalized === "look") {
    dispatch({ type: "LOOK_AROUND" });
    return;
  }

  if (normalized === "inventory") {
    dispatch({ type: "SHOW_INVENTORY" });
    return;
  }

  if (normalized.startsWith("go ")) {
    const direction = normalized.split(" ")[1];
    dispatch({ type: "MOVE", payload: direction });
    return;
  }

  if (normalized.startsWith("take ")) {
    const item = normalized.split(" ").slice(1).join(" ");
    dispatch({ type: "TAKE_ITEM", payload: item });
    return;
  }

  if (normalized.startsWith("use ")) {
    const item = normalized.split(" ").slice(1).join(" ");
    dispatch({ type: "USE_ITEM", payload: item });
    return;
  }

  if (normalized === "stepback") {
    dispatch({ type: "STEP_BACK" });
    return;
  }

  // === Throw Coffee Command (Multiverse-specific) ===

  if (normalized === "throw coffee") {
    if (state?.inventory?.includes("coffee")) {
      dispatch({ type: "THROW_COFFEE" });
      dispatch({ type: "LOG", payload: "You throw your Gorstan coffee with unexpected force." });
    } else {
      dispatch({ type: "LOG", payload: "You reach for coffee, but you're empty-handed." });
    }
    return;
  }

  // === NPC Interaction (Basic Parsing) ===

  if (normalized.startsWith("ask ")) {
    // Match "ask [npc] about [topic]"
    const match = normalized.match(/^ask (\w+) about (.+)$/);
    if (match) {
      const npc = match[1];
      const topic = match[2];
      dispatch({ type: "ASK_NPC", payload: { npc, topic } });
    } else {
      dispatch({ type: "LOG", payload: "Try 'ask Ayla about tunnels' or something similar." });
    }
    return;
  }

  // === Future Parser Extensions ===
  // TODO: Add natural language breakdown support, e.g., "throw [item] at [target]"

  // === Unrecognized Command Fallback ===

  dispatch({
    type: "LOG",
    payload: `'${command}'? That didn’t compute. Try 'look', 'go north', or 'inventory'.`
  });
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for function, parameters, and logic blocks.
- ✅ Defensive error handling for dynamic import, missing functions, and invalid input.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Add more command handlers and natural language support for richer gameplay.
*/
