import create from 'zustand';

const useGameStore = create((set) => ({
  currentRoom: 'introstart',
  score: 0,
  inventory: [],  // Change from Set to array
  npcStates: {},  // Track NPC states dynamically
  storyProgress: {},

  // Setters
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setScore: (score) => set({ score }),
  
  // Inventory management (use array instead of Set)
  addItem: (item) => set((state) => {
    const newInventory = [...state.inventory, item];  // Use array to add item
    return { inventory: newInventory };
  }),
  removeItem: (item) => set((state) => {
    const newInventory = state.inventory.filter(i => i !== item);  // Use array to remove item
    return { inventory: newInventory };
  }),

  // Add other actions and properties as needed
}));

export default useGameStore;
