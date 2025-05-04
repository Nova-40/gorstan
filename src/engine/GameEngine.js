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
    this.currentRoom = 'intro';
    this.storyProgress = {};
    this.storyFlags = new Set();
    this.npcMood = {}; // { ayla: { mood: 0, askCount: 0 } }
    this.outputLog = [];

    this.inventory = [];
    this.codex = [];
    this.score = 0;

    this.outputHandler = null;
    this.puzzleHandler = null;
    this.sceneHandler = null;

    this.pendingRestart = false; // Flag for restart confirmation
  }

  setOutputHandler(handler) {
    this.outputHandler = handler;
  }

  setPuzzleHandler(handler) {
    this.puzzleHandler = handler;
  }

  setSceneHandler(handler) {
    this.sceneHandler = handler;
  }

  output(message) {
    this.outputLog.push(message);
    if (this.outputHandler) {
      this.outputHandler([...this.outputLog]);
    }
  }

  getRoomData() {
    const base = rooms[this.currentRoom];
    const description = typeof base.description === 'function' ? base.description(this) : base.description;
    const items = typeof base.items === 'function' ? base.items(this) : base.items || {};
    return { ...base, description, items };
  }

  describeCurrentRoom() {
    const room = this.getRoomData();
    return room?.description || 'You are somewhere undefined.';
  }

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

  addItem(itemId) {
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
    }
  }

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

  attemptPuzzle(puzzleName, input = null) {
    const puzzle = puzzles[puzzleName];
    return puzzle ? puzzle.solve(input) : 'No such puzzle found.';
  }

  collectItem(itemId, itemData) {
    this.addItem(itemId);
    this.checkSecretTunnelMedallionAccess();
    return { success: true, message: `Collected ${itemId}.` };
  }

  dropItem(itemId) {
    this.inventory = this.inventory.filter(i => i !== itemId);
    return { success: true, message: `Dropped ${itemId}.` };
  }

  checkInventory(itemId) {
    return this.inventory.includes(itemId);
  }

  listInventoryItems() {
    return this.inventory;
  }

  resetInventory() {
    this.inventory = [];
  }

  talkToNpc(npcName) {
    return talkToNpc(npcName, this.storyProgress, this.npcMood);
  }

  askNpcAbout(npcName, topic) {
    return getNpcDialogue(npcName, topic, this.storyProgress, this.npcMood);
  }

  getHelp() {
    return getHelpAdvice(this.currentRoom, this.storyProgress, this.inventory);
  }

  setFlag(flagName) {
    this.storyFlags.add(flagName);
  }

  hasFlag(flagName) {
    return this.storyFlags.has(flagName);
  }

  removeFlag(flagName) {
    this.storyFlags.delete(flagName);
  }

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

  checkSecretTunnelMedallionAccess() {
    if (this.inventory.includes('medallion') && !rooms.centralpark.exits['down']) {
      rooms.centralpark.exits['down'] = 'crossing2';
      this.setFlag('secretDoorOpened');
      this.output('The medallion hums in your hand... and a hidden passage opens beneath your feet!');
    }
  }

  updateStoryProgress(flag) {
    this.storyProgress[flag] = true;
  }

  askAyla(query) {
    const mood = this.npcMood.ayla || { mood: 0, askCount: 0 };
    mood.askCount++;
    mood.mood += 1;
    this.npcMood.ayla = mood;

    const hints = [
      `Ayla raises an eyebrow. “You always ask about ${query}, don’t you?”`,
      `She sighs softly. “You already *have* what you need. Try looking around ${this.currentRoom}.”`,
      `Her tone sharpens. “You’re stalling. Check your codex. Or throw something.”`,
    ];

    const response = mood.askCount > 5
      ? `Ayla blinks. "You've asked too many questions. Figure it out yourself."`
      : hints[mood.askCount % hints.length] || `Ayla shrugs. "Not sure how to help with '${query}'."`;

    return response;
  }

  processCommand(input) {
    const words = input.trim().toLowerCase().split(' ');
    const command = words[0];

    if (this.pendingRestart && input === 'confirm restart') {
      this.currentRoom = 'introreset';
      this.inventory = [];
      this.codex = [];
      this.score = 0;
      this.storyProgress = {};
      this.storyFlags.clear();
      this.outputLog = [];
      this.pendingRestart = false;
      return { success: true, message: 'Game has been restarted. Back at the beginning.' };
    }

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
      
      case 'quit':
        if (typeof window !== 'undefined' && window.gameState?.quitGame) {
          window.gameState.quitGame(window.gameState);
          return {
            success: true,
            message: "You step away from the simulation. Reality (or a far more elaborate simulation) is waiting.",
          };
        } else {
          return { success: false, message: "Quit not available in this context." };
        }

      case 'help':
        return { success: true, message: this.getHelp() };
      default:
        return { success: false, message: 'Unknown command.' };
    }
  }
}
