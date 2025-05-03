// GameEngine Class
// This class serves as the core of the Gorstan game engine, managing game state, player actions, inventory, rooms, puzzles, NPC interactions, and more.
// It provides methods for processing commands, saving/loading the game, and interacting with the game world.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { addItem, removeItem, hasItem, listInventory, clearInventory } from './inventory';
import { puzzles } from './puzzles';
import { rooms } from './rooms';
import { getNpcDialogue, talkToNpc, adjustNpcMood } from './npcSupportSystem';
import { getHelpAdvice } from './aylaHelp';

export class GameEngine {
  constructor() {
    // Player-related properties
    this.playerName = ''; // The player's name
    this.currentRoom = 'intro'; // The current room the player is in
    this.storyProgress = {}; // Fine-grained progress markers
    this.storyFlags = new Set(); // Big story flags (e.g., "defied dome", "solved maze")
    this.npcMood = {}; // Mood tracker for NPCs
    this.outputLog = []; // Centralized output log for game messages

    // Handlers for output, puzzles, and scenes
    this.outputHandler = null;
    this.puzzleHandler = null;
    this.sceneHandler = null;
  }

  // Set the output handler for game messages
  setOutputHandler(handler) {
    this.outputHandler = handler;
  }

  // Set the puzzle handler
  setPuzzleHandler(handler) {
    this.puzzleHandler = handler;
  }

  // Set the scene handler
  setSceneHandler(handler) {
    this.sceneHandler = handler;
  }

  // Output a message to the log and call the output handler
  output(message) {
    this.outputLog.push(message);
    if (this.outputHandler) {
      this.outputHandler([...this.outputLog]);
    }
  }

  // Retrieve data for the current room, including dynamic descriptions and items
  getRoomData() {
    const base = rooms[this.currentRoom];
    const description = typeof base.description === 'function' ? base.description(this) : base.description;
    const items = typeof base.items === 'function' ? base.items(this) : base.items || {};
    return { ...base, description, items };
  }

  // Describe the current room
  describeCurrentRoom() {
  const room = this.getRoomData();
  if (!room) return '❌ No such room.';
  if (typeof room.description === 'function') {
    return room.description(this);
  }
  return room.description || 'You are somewhere undefined.';
}

  // Handle picking up an item in the current room
  handlePickup(itemId) {
    const room = this.getRoomData();
    const item = room.items && room.items[itemId];
    if (!item || !item.canPickup) {
      return { success: false, message: 'You cannot pick that up.' };
    }
    if (typeof item.onPickup === 'function') {
      item.onPickup(this);
    } else {
      addItem(itemId);
      this.output(`You pick up the ${item.name}.`);
    }
    return { success: true, message: '' };
  }

  // Move the player to a new room in the specified direction
  moveToRoom(direction) {
    const currentRoomData = this.getRoomData();
    if (currentRoomData?.exits?.[direction]) {
      this.currentRoom = currentRoomData.exits[direction];
      let output = `Moved to ${this.currentRoom}.`;
      if (rooms[this.currentRoom].description) {
        output += `\n${rooms[this.currentRoom].description}`;
      }
      if (rooms[this.currentRoom].onEnter) {
        rooms[this.currentRoom].onEnter(this);
      }
      return { success: true, message: output };
    } else {
      return { success: false, message: 'You cannot go that way.' };
    }
  }

  // Attempt to solve a puzzle
  attemptPuzzle(puzzleName, input = null) {
    const puzzle = puzzles[puzzleName];
    if (puzzle) {
      return puzzle.solve(input);
    } else {
      return 'No such puzzle found.';
    }
  }

  // Collect an item and add it to the inventory
  collectItem(itemId, itemData) {
    addItem(itemId, itemData);
    this.checkSecretTunnelMedallionAccess();
    return { success: true, message: `Collected ${itemId}.` };
  }

  // Drop an item from the inventory
  dropItem(itemId) {
    removeItem(itemId);
    return { success: true, message: `Dropped ${itemId}.` };
  }

  // Check if an item exists in the inventory
  checkInventory(itemId) {
    return hasItem(itemId);
  }

  // List all items in the inventory
  listInventoryItems() {
    return listInventory();
  }

  // Reset the inventory
  resetInventory() {
    clearInventory();
  }

  // Interact with an NPC
  talkToNpc(npcName) {
    return talkToNpc(npcName, this.storyProgress, this.npcMood);
  }

  // Ask an NPC about a specific topic
  askNpcAbout(npcName, topic) {
    return getNpcDialogue(npcName, topic, this.storyProgress, this.npcMood);
  }

  // Get help or advice from Ayla
  getHelp() {
    return getHelpAdvice(this.currentRoom, this.storyProgress, listInventory());
  }

  // Set a story flag
  setFlag(flagName) {
    this.storyFlags.add(flagName);
  }

  // Check if a story flag is set
  hasFlag(flagName) {
    return this.storyFlags.has(flagName);
  }

  // Remove a story flag
  removeFlag(flagName) {
    this.storyFlags.delete(flagName);
  }

  // Save the game state to localStorage
  saveGame() {
    try {
      const saveData = {
        playerName: this.playerName,
        currentRoom: this.currentRoom,
        storyProgress: this.storyProgress,
        storyFlags: Array.from(this.storyFlags),
        inventory: listInventory(),
      };
      localStorage.setItem('gorstanSave', JSON.stringify(saveData));
      return { success: true, message: 'Game saved.' };
    } catch (e) {
      return { success: false, message: 'Failed to save game.' };
    }
  }

  // Load the game state from localStorage
  loadGame() {
    try {
      const saveString = localStorage.getItem('gorstanSave');
      if (saveString) {
        const saveData = JSON.parse(saveString);
        this.playerName = saveData.playerName;
        this.currentRoom = saveData.currentRoom;
        this.storyProgress = saveData.storyProgress;
        this.storyFlags = new Set(saveData.storyFlags);
        clearInventory();
        saveData.inventory.forEach((item) => addItem(item.id, item));
        return { success: true, message: 'Game loaded.' };
      } else {
        return { success: false, message: 'No save game found.' };
      }
    } catch (e) {
      return { success: false, message: 'Failed to load game.' };
    }
  }

  // Handle throwing an item
  throwItem(itemName) {
    const itemLower = itemName.toLowerCase();

    if (itemLower === 'coffee' && this.currentRoom === 'centralpark') {
      if (!rooms.centralpark.exits['down']) {
        rooms.centralpark.exits['down'] = 'crossing2';
        this.setFlag('secretDoorOpened');
        return {
          success: true,
          message: 'You throw the coffee onto the ground. The earth trembles and a hidden hatch opens, leading downward!',
        };
      } else {
        return { success: false, message: 'The secret door is already open.' };
      }
    } else {
      return { success: false, message: `Throwing ${itemName} does nothing useful here.` };
    }
  }

  // Check if the medallion grants access to the secret tunnel
  checkSecretTunnelMedallionAccess() {
    if (hasItem('medallion')) {
      if (!rooms.centralpark.exits['down']) {
        rooms.centralpark.exits['down'] = 'crossing2';
        this.setFlag('secretDoorOpened');
        this.output('The medallion hums in your hand... and a hidden passage opens beneath your feet!');
      }
    }
  }

  // Update story progress with a specific flag
  updateStoryProgress(flag) {
    this.storyProgress[flag] = true;
  }

  // Process a player command
  processCommand(input) {
    const words = input.trim().toLowerCase().split(' ');
    const command = words[0];

    // Special handling for the intro room
    if (this.currentRoom === 'intro') {
      if (command === 'jump') {
        this.currentRoom = 'controlnexus';
        return {
          success: true,
          message:
            'You dive through the shimmering portal just as the truck blazes past. Reality twists... You land heavily inside the Control Nexus.',
        };
      } else {
        return { success: false, message: 'The truck barrels toward you. You must JUMP!' };
      }
    }

    // General command processing
    switch (command) {
      case 'go':
        return this.moveToRoom(words[1]);
      case 'take':
        return this.collectItem(words[1], { description: 'Mysterious item.' });
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
      case 'help':
        return { success: true, message: this.getHelp() };
      default:
        return { success: false, message: 'Unknown command.' };
    }
  }
}










