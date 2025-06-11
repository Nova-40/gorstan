// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// ethicsScroll.js — Defines the Scroll of the Lattice Accord item

/**
 * ethicsScroll
 * Represents the Scroll of the Lattice Accord item in the Gorstan game.
 * This item is readable and may be referenced by inventory, room, or action logic.
 *
 * @type {Object}
 * @property {string} id - Unique identifier for the item.
 * @property {string} name - Display name of the item.
 * @property {string} description - Description shown to the player.
 * @property {boolean} readable - Whether the item can be read.
 */
export const ethicsScroll = {
  id: "ethicsScroll",
  name: "Scroll of the Lattice Accord",
  description: "A faded parchment bearing the Lattice Accord — unreadable to most.",
  readable: true
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for the item and its properties.
- ✅ No unnecessary logic or redundant checks.
- ✅ Ready for use in inventory, room, or action logic in the Gorstan engine.
*/