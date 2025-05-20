// Gorstan v2.2.2 – All modules validated and standardized
// debugTools.js
// Optional debug module for Gorstan game development
// Enables rapid testing, room skipping, score setting, and inventory injection.
// Safe to remove in production with no impact.
export const DebugTools = {
  enable: false, // Set to true during development or enable via console
  /**
   * Jump directly to a specific room
   * @param {string} roomId - The target room ID
   * @param {function} setRoom - The AppCore method to change room
   */
  jumpToRoom(roomId, setRoom) {
    if (!this.enable) return;
    try {
      console.log(`[Debug] Jumping to room: ${roomId}`);
      setRoom(roomId);
    } catch (err) {
      console.error("[Debug] Failed to jump to room:", err);
    }
  },
  /**
   * Set the player's score directly
   * @param {number} value - Desired score
   * @param {object} storyProgress - The storyProgress instance
   */
  setScore(value, storyProgress) {
    if (!this.enable) return;
    try {
      storyProgress.score = value;
      console.log(`[Debug] Score manually set to ${value}`);
    } catch (err) {
      console.error("[Debug] Failed to set score:", err);
    }
  },
  /**
   * Add an item to inventory
   * @param {string} itemName - Item to add
   * @param {object} inventory - useInventory instance
   */
  addItem(itemName, inventory) {
    if (!this.enable) return;
    try {
      inventory.addItem(itemName);
      console.log(`[Debug] Added item: ${itemName}`);
    } catch (err) {
      console.error("[Debug] Failed to add item:", err);
    }
  },
  /**
   * Mark a milestone as complete
   * @param {string} label
   * @param {object} storyProgress
   */
  setMilestone(label, storyProgress) {
    if (!this.enable) return;
    try {
      storyProgress.setMilestone(label);
      console.log(`[Debug] Milestone unlocked: ${label}`);
    } catch (err) {
      console.error("[Debug] Failed to set milestone:", err);
    }
  },
  /**
   * Activate god mode by enabling all keys and bypassing puzzles
   * @param {object} storyProgress
   */
  activateGodMode(storyProgress) {
    if (!this.enable) return;
    try {
      storyProgress.setMilestone("allAccess");
      storyProgress.score = 999;
      console.log("[Debug] God mode activated.");
    } catch (err) {
      console.error("[Debug] Failed to activate god mode:", err);
    }
  },
};
