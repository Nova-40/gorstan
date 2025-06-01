
// inventory.js — v2.8.2
// Manages player inventory: caps, item properties, inspection, and spill mechanics

const MAX_ITEMS = 12;
let spilledItems = [];

const itemDescriptions = {
  coffee: "A steaming cup of Gorstan coffee. Somehow still hot.",
  map: "A sketch of the facility layout, drawn by a nervous hand.",
  foldedNote: "The note reads: 'It begins at the café... but ends in the lattice.'",
  goldCoin: "A shiny coin. Looks valuable but feels... hollow.",
  dirtyNapkin: "A grease-stained napkin with quantum schematics sketched on it."
};

const itemTypes = {
  coffee: "useful",
  map: "useful",
  foldedNote: "clue",
  goldCoin: "junk",
  dirtyNapkin: "treasure"
};

export const addItem = (inventory, item, dispatch) => {
  const updated = [...inventory, item];

  if (updated.length > MAX_ITEMS) {
    spilledItems = [...updated];
    dispatch({ type: "LOG", payload: "🎒 Your pockets overflow! Items spill to the floor..." });
    return [];
  }

  return updated;
};

export const inspectItem = (item) => {
  return itemDescriptions[item] || "It's unremarkable.";
};

export const getItemType = (item) => {
  return itemTypes[item] || "unknown";
};

export const getSpilledItems = () => spilledItems;

export const resetSpill = () => {
  spilledItems = [];
};
