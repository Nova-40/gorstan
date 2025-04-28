// /src/engine/gameEngine.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0
// src/engine/GameEngine.js

import { addItem, removeItem, hasItem, listInventory, clearInventory } from './inventory';
import { puzzles } from './puzzles';
import { rooms } from './rooms';
import { getNpcDialogue, talkToNpc, adjustNpcMood } from './npcSupportSystem';
import { getHelpAdvice } from './aylaHelp';

export class GameEngine {
  constructor() {
    this.playerName = '';
    this.currentRoom = '';
    this.storyProgress = {}; // Fine-grained progress markers
    this.storyFlags = new Set(); // Big story flags (defied dome, solved maze)
    this.npcMood = {}; // Mood tracker per NPC
    this.outputLog = []; // Centralized output log
  }

  addGameLog(message) {
    this.outputLog.push(message);
    console.log(message);
  }

  setPlayerName(name) {
    this.playerName = name;
  }

  moveToRoom(direction) {
    const currentRoomData = rooms[this.currentRoom];
    if (currentRoomData && currentRoomData.exits && currentRoomData.exits[direction]) {
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

  attemptPuzzle(puzzleName, input = null) {
    const puzzle = puzzles[puzzleName];
    if (puzzle) {
      return puzzle.solve(input);
    } else {
      return 'No such puzzle found.';
    }
  }

  collectItem(itemId, itemData) {
    addItem(itemId, itemData);
    this.checkSecretTunnelMedallionAccess();
    return { success: true, message: `Collected ${itemId}.` };
  }

  dropItem(itemId) {
    removeItem(itemId);
    return { success: true, message: `Dropped ${itemId}.` };
  }

  checkInventory(itemId) {
    return hasItem(itemId);
  }

  listInventoryItems() {
    return listInventory();
  }

  resetInventory() {
    clearInventory();
  }

  talkToNpc(npcName) {
    return talkToNpc(npcName, this.storyProgress, this.npcMood);
  }

  askNpcAbout(npcName, topic) {
    return getNpcDialogue(npcName, topic, this.storyProgress, this.npcMood);
  }

  getHelp() {
    return getHelpAdvice(this.currentRoom, this.storyProgress, listInventory());
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
        inventory: listInventory()
      };
      localStorage.setItem('gorstanSave', JSON.stringify(saveData));
      return { success: true, message: 'Game saved.' };
    } catch (e) {
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
        clearInventory();
        saveData.inventory.forEach(item => addItem(item.id, item));
        return { success: true, message: 'Game loaded.' };
      } else {
        return { success: false, message: 'No save game found.' };
      }
    } catch (e) {
      return { success: false, message: 'Failed to load game.' };
    }
  }

  throwItem(itemName) {
    const itemLower = itemName.toLowerCase();

    if (itemLower === 'coffee' && this.currentRoom === 'centralpark') {
      if (!rooms.centralpark.exits['down']) {
        rooms.centralpark.exits['down'] = 'crossing2';
        this.setFlag('secretDoorOpened');
        return { success: true, message: 'You throw the coffee onto the ground. The earth trembles and a hidden hatch opens, leading downward!' };
      } else {
        return { success: false, message: 'The secret door is already open.' };
      }
    } else {
      return { success: false, message: `Throwing ${itemName} does nothing useful here.` };
    }
  }

  checkSecretTunnelMedallionAccess() {
    if (hasItem('medallion')) {
      if (!rooms.centralpark.exits['down']) {
        rooms.centralpark.exits['down'] = 'crossing2';
        this.setFlag('secretDoorOpened');
        this.addGameLog('The medallion hums in your hand... and a hidden passage opens beneath your feet!');
      }
    }
  }

  updateStoryProgress(flag) {
    this.storyProgress[flag] = true;
  }

  processCommand(input) {
    const words = input.trim().toLowerCase().split(' ');
    const command = words[0];

    switch (command) {
      case 'go':
        return this.moveToRoom(words[1]);
      case 'take':
        return this.collectItem(words[1], { description: 'Mysterious item.' });
      case 'drop':
        return this.dropItem(words[1]);
      case 'talk':
        return { success: true, message: this.talkToNpc(words.slice(2).join(' ')) };
      case 'ask':
        return { success: true, message: this.askNpcAbout(words[1], words.slice(3).join(' ')) };
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



