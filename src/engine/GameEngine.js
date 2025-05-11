// /src/engine/GameEngine.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

// GameEngine Class
// This class serves as the core of the Gorstan game engine, managing game state, player actions, inventory, rooms, puzzles, NPC interactions, and more.

import { addItem, removeItem, hasItem, listInventory, clearInventory } from './inventory';
import { puzzles } from './puzzles';
import { rooms } from './rooms';
import { parseCommand } from './commandParser';

export class GameEngine {
  constructor() {
    this.aylaActive = true;
    this.playerName = '';
    this.currentRoom = 'introstreet1';
    this.storyProgress = {};
    this.storyFlags = new Set();
    this.npcMood = {};
    this.outputLog = [];
    this.inventory = [];
    this.codex = [];
    this.score = 0;
    this.outputHandler = null;
    this.puzzleHandler = null;
    this.sceneHandler = null;
    this.pendingRestart = false;
  }

  // --- Handlers ---

  /**
   * Sets the output handler for displaying messages.
   * @param {function} handler - The function to handle output messages.
   */
  setOutputHandler(handler) {
    if (typeof handler !== 'function') {
      console.error('❌ Invalid output handler provided.');
      return;
    }
    this.outputHandler = handler;
  }

  /**
   * Sets the scene handler for updating the visible room.
   * @param {function} handler - The function to handle scene changes.
   */
  setSceneHandler(handler) {
    if (typeof handler !== 'function') {
      console.error('❌ Invalid scene handler provided.');
      return;
    }
    this.sceneHandler = handler;
  }

  // --- Output and Logging ---

  /**
   * Outputs a message to the game log and triggers the output handler.
   * Limits the size of the output log to prevent memory bloat.
   * @param {string} message - The message to output.
   */
  output(message) {
    if (typeof message !== 'string') {
      console.error('❌ Invalid message type. Expected a string.');
      return;
    }
    this.outputLog.push(message);
    if (this.outputLog.length > 50) {
      this.outputLog = this.outputLog.slice(-50); // Retain only the last 50 messages
    }
    if (typeof this.outputHandler === 'function') {
      try {
        this.outputHandler([...this.outputLog]);
      } catch (err) {
        console.error('❌ Error in output handler:', err);
      }
    }
  }

  // --- Room Management ---

  /**
   * Retrieves data for the current room, including its description and items.
   * @returns {object} The room data.
   */
  getRoomData() {
    try {
      const base = rooms[this.currentRoom];
      if (!base) {
        throw new Error(`Room "${this.currentRoom}" does not exist.`);
      }
      const description = typeof base.description === 'function' ? base.description(this) : base.description;
      const items = typeof base.items === 'function' ? base.items(this) : base.items || {};
      return { ...base, description, items };
    } catch (err) {
      console.error('❌ Error retrieving room data:', err);
      return { description: 'An undefined space.', items: {} };
    }
  }

  /**
   * Moves the player to a specific room by name.
   * @param {string} roomName - The name of the room to move to.
   */
  goToRoom(roomName) {
    try {
      if (!rooms[roomName]) {
        this.output(`⚠️ Room "${roomName}" does not exist.`);
        return;
      }
      this.currentRoom = roomName;
      const room = rooms[roomName];
      if (typeof room.onEnter === 'function') {
        room.onEnter(this);
      }
      this.output(this.describeCurrentRoom());
    } catch (err) {
      console.error('❌ Error moving to room:', err);
    }
  }

  /**
   * Moves the player to a new room based on the specified direction.
   * @param {string} direction - The direction to move.
   * @returns {object} The result of the move action.
   */
  moveToRoom(direction) {
    try {
      const currentRoomData = this.getRoomData();
      const exits = typeof currentRoomData.exits === 'function' ? currentRoomData.exits(this) : currentRoomData.exits || {};
      if (exits[direction]) {
        this.goToRoom(exits[direction]);
        return { success: true, message: this.describeCurrentRoom() };
      } else {
        return { success: false, message: 'You cannot go that way.' };
      }
    } catch (err) {
      console.error('❌ Error moving to room:', err);
      return { success: false, message: 'An error occurred while moving to the room.' };
    }
  }

  // --- Inventory Management ---

  /**
   * Adds an item to the player's inventory.
   * Validates that the item exists in the game world before adding it.
   * @param {string} itemId - The ID of the item to add.
   */
  addItem(itemId) {
    if (!itemId || typeof itemId !== 'string') {
      console.error('❌ Invalid item ID provided.');
      return;
    }
    const roomData = this.getRoomData();
    if (!roomData.items[itemId]) {
      this.output(`⚠️ Item "${itemId}" does not exist in the current room.`);
      return;
    }
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
      this.output(`✅ You picked up: ${roomData.items[itemId].name}`);
    }
  }

  // --- Command Processing ---

  /**
   * Processes a player command using the command parser.
   * @param {string} command - The command to process.
   * @returns {object} The result of the command.
   */
  processCommand(command) {
    try {
      const result = parseCommand(command, this);
      if (this.outputHandler && result) {
        const lines = Array.isArray(result) ? result : [result];
        this.outputHandler(lines);
      }
      return result;
    } catch (err) {
      console.error('❌ Error processing command:', err);
      return { success: false, message: 'An error occurred while processing the command.' };
    }
  }
}