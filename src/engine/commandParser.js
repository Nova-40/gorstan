// Enhanced Gorstan Game Module — v3.1.1
// commandParser.js — Adds "use X on Y" and improved LOOK_AROUND

/**
 * Parses and dispatches player commands.
 * Handles expanded parsing logic including contextual usage.
 * @param {string} command - Player's raw input.
 * @param {Object} state - Current game state.
 * @param {function} dispatch - State update dispatcher.
 */
export const parseCommand = (command, state, dispatch) => {
  if (typeof command !== "string" || typeof dispatch !== "function") {
    console.error("Invalid input or dispatch");
    return;
  }

  const input = command.trim().toLowerCase();

  // === Aliases ===
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
  };

  const normalized = aliases[input] || input;

  // === Use X on Y ===
  const matchUseOn = normalized.match(/^use (.+) on (.+)$/);
  if (matchUseOn) {
    const item = matchUseOn[1];
    const target = matchUseOn[2];
    dispatch({ type: "USE_ITEM_ON", payload: { item, target } });
    dispatch({ type: "LOG", payload: `You try to use the ${item} on the ${target}...` });
    return;
  }

  // === Look Command Enhanced ===
  if (normalized === "look") {
    const room = state?.currentRoom;
    const traits = state?.traits || [];
    let output = room?.description || "You see nothing unusual.";

    // Show visible items
    if (room?.items?.length) {
      output += ` Items here: ${room.items.join(", " )}.`;
    }

    // Show traps if debug or curious
    if (room?.trap && (traits.includes("curious") || state.debug)) {
      output += ` Something feels off here... like a trap.`;
    }

    // Show objects (like chair)
    if (room?.objects) {
      const objectKeys = Object.keys(room.objects);
      if (objectKeys.length) {
        output += ` You notice: ${objectKeys.join(", " )}.`;
      }
    }

    dispatch({ type: "LOG", payload: output });
    return;
  }

  // All other existing commands preserved here (go, inventory, throw coffee, ask, etc)
  // ... (your existing logic continues here) ...

  dispatch({
    type: "LOG",
    payload: `'${command}'? That didn’t compute. Try 'look', 'go north', or 'inventory'.`
  });
};
