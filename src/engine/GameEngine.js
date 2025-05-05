// GameEngine Class
// This class serves as the core of the Gorstan game engine, managing game state, player actions, inventory, rooms, puzzles, NPC interactions, and more.
// It provides methods for processing commands, saving/loading the game, and interacting with the game world.

import { addItem, removeItem, hasItem, listInventory, clearInventory } from './inventory';
import { puzzles } from './puzzles';
import { rooms } from './rooms';
import { getNpcDialogue, talkToNpc, adjustNpcMood } from './npcSupportSystem';
import { getHelpAdvice } from './aylaHelp';

export class GameEngine {
  constructor() {
    this.playerName = '';
    this.currentRoom = 'introstreet1'; // Starting room
    this.storyProgress = {}; // Tracks story progression flags
    this.storyFlags = new Set(); // Tracks binary flags for story events
    this.npcMood = {}; // Tracks NPC mood states
    this.outputLog = []; // Logs game messages
    this.inventory = []; // Player's inventory
    this.codex = []; // Player's codex entries
    this.score = 0; // Player's score
    this.outputHandler = null; // Callback for output messages
    this.puzzleHandler = null; // Callback for puzzle interactions
    this.sceneHandler = null; // Callback for scene transitions
    this.pendingRestart = false; // Tracks if a restart is pending
  }

  // Setters for handlers
  setOutputHandler(handler) {
    this.outputHandler = handler;
  }

  setPuzzleHandler(handler) {
    this.puzzleHandler = handler;
  }

  setSceneHandler(handler) {
    this.sceneHandler = handler;
  }

  /**
   * Outputs a message to the game log and triggers the output handler.
   * @param {string} message - The message to output.
   */
  output(message) {
    this.outputLog.push(message);
    if (this.outputHandler) {
      this.outputHandler([...this.outputLog]);
    }
  }

  /**
   * Retrieves the current room's data, including dynamic descriptions and items.
   * @returns {object} - The current room's data.
   */
  getRoomData() {
    const base = rooms[this.currentRoom];
    const description = typeof base.description === 'function' ? base.description(this) : base.description;
    const items = typeof base.items === 'function' ? base.items(this) : base.items || {};
    return { ...base, description, items };
  }

  /**
   * Describes the current room.
   * @returns {string} - The room description.
   */
  describeCurrentRoom() {
    const room = this.getRoomData();
    return room?.description || 'You are somewhere undefined.';
  }

  /**
   * Handles picking up an item in the current room.
   * @param {string} itemId - The ID of the item to pick up.
   * @returns {object} - The result of the pickup action.
   */
  handlePickup(itemId) {
    const room = this.getRoomData();
    const item = room.items && room.items[itemId];
    if (!item || !item.canPickup) {
      return { success: false, message: 'You cannot pick that up.' };
    }
    if (typeof item.onPickup === 'function') {
      item.onPickup(this);
    } else {
      this.addItem(itemId);
      this.output(`You pick up the ${item.name}.`);
    }
    return { success: true, message: '' };
  }

  /**
   * Adds an item to the player's inventory.
   * @param {string} itemId - The ID of the item to add.
   */
  addItem(itemId) {
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
    }
  }

  /**
   * Moves the player to a new room based on the specified direction.
   * @param {string} direction - The direction to move.
   * @returns {object} - The result of the move action.
   */
  moveToRoom(direction) {
    const currentRoomData = this.getRoomData();
    if (currentRoomData?.exits?.[direction]) {
      this.currentRoom = currentRoomData.exits[direction];
      if (rooms[this.currentRoom].onEnter) {
        rooms[this.currentRoom].onEnter(this);
      }
      return { success: true, message: this.describeCurrentRoom() };
    } else {
      return { success: false, message: 'You cannot go that way.' };
    }
  }

  /**
   * Processes a player command and executes the corresponding action.
   * @param {string} input - The player's command input.
   * @returns {object} - The result of the command execution.
   */
  processCommand(input) {
    const words = input.trim().toLowerCase().split(' ');
    const command = words[0];

    if (this.pendingRestart && input === 'confirm restart') {
      this.resetGame();
      return { success: true, message: 'Game has been restarted. Back at the beginning.' };
    }

    switch (command) {
      case 'restart':
        this.pendingRestart = true;
        return {
          success: true,
          message: '⚠️ This will reset all progress. Type `confirm restart` to proceed.',
        };
      case 'go':
        return this.moveToRoom(words[1]);
      case 'take':
        return this.handlePickup(words[1]);
      case 'drop':
        return this.dropItem(words[1]);
      case 'talk':
        return { success: true, message: this.talkToNpc(words.slice(1).join(' ')) };
      case 'ask':
        return { success: true, message: this.askNpcAbout(words[1], words.slice(2).join(' ')) };
      case 'solve':
        return { success: true, message: this.attemptPuzzle(words[1], words.slice(2).join(' ')) };
      case 'inventory':
        return { success: true, message: JSON.stringify(this.listInventoryItems(), null, 2) };
      case 'throw':
        return this.throwItem(words.slice(1).join(' '));
      case 'save':
        return this.saveGame();
      case 'load':
        return this.loadGame();
      case 'quit':
        return this.quitGame();
      case 'help':
        return { success: true, message: this.getHelp() };
      default:
        return { success: false, message: 'Unknown command.' };
    }
  }

  /**
   * Resets the game state to its initial values.
   */
  resetGame() {
    this.currentRoom = 'introstreet1';
    this.inventory = [];
    this.codex = [];
    this.score = 0;
    this.storyProgress = {};
    this.storyFlags.clear();
    this.outputLog = [];
    this.pendingRestart = false;
  }

  /**
   * Saves the current game state to localStorage.
   * @returns {object} - The result of the save action.
   */
  saveGame() {
    try {
      const saveData = {
        playerName: this.playerName,
        currentRoom: this.currentRoom,
        storyProgress: this.storyProgress,
        storyFlags: Array.from(this.storyFlags),
        inventory: [...this.inventory],
      };
      localStorage.setItem('gorstanSave', JSON.stringify(saveData));
      return { success: true, message: 'Game saved.' };
    } catch {
      return { success: false, message: 'Failed to save game.' };
    }
  }

  /**
   * Loads the game state from localStorage.
   * @returns {object} - The result of the load action.
   */
  loadGame() {
    try {
      const saveString = localStorage.getItem('gorstanSave');
      if (saveString) {
        const saveData = JSON.parse(saveString);
        this.playerName = saveData.playerName;
        this.currentRoom = saveData.currentRoom;
        this.storyProgress = saveData.storyProgress;
        this.storyFlags = new Set(saveData.storyFlags);
        this.inventory = [...saveData.inventory];
        return { success: true, message: 'Game loaded.' };
      } else {
        return { success: false, message: 'No save game found.' };
      }
    } catch {
      return { success: false, message: 'Failed to load game.' };
    }
  }

  /**
   * Handles quitting the game.
   * @returns {object} - The result of the quit action.
   */
  quitGame() {
    if (typeof window !== 'undefined' && window.gameState?.quitGame) {
      window.gameState.quitGame(window.gameState);
      return {
        success: true,
        message: "You step away from the simulation. Reality (or a far more elaborate simulation) is waiting.",
      };
    } else {
      return { success: false, message: "Quit not available in this context." };
    }
  }
}
