// /src/engine/GameEngine.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// GameEngine Class
// This class serves as the core of the Gorstan game engine, managing game state, player actions, inventory, rooms, puzzles, NPC interactions, and more.
// It provides methods for processing commands, saving/loading the game, and interacting with the game world.

import { addItem, removeItem, hasItem, listInventory, clearInventory } from './inventory';
import { puzzles } from './puzzles';
import { rooms } from './rooms';
import { getNpcDialogue, talkToNpc, adjustNpcMood } from './npcSupportSystem';
import { getHelpAdvice } from './aylaHelp';
import { parseCommand } from './commandParser';

export class GameEngine {
  constructor() {
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
    this.quitGame = null;
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
    const exits = typeof currentRoomData.exits === 'function' ? currentRoomData.exits(this) : currentRoomData.exits || {};
    if (exits[direction]) {
      this.currentRoom = exits[direction];
      if (rooms[this.currentRoom].onEnter) {
        rooms[this.currentRoom].onEnter(this);
      }
      return { success: true, message: this.describeCurrentRoom() };
    } else {
      return { success: false, message: 'You cannot go that way.' };
    }
  }

  /**
   * Interprets a 'throw' command. If coffee is thrown in the right location, unlock secret.
   * @param {string} item
   * @returns {{success: boolean, message: string}}
   */
  throwItem(item) {
    if (item === 'coffee') {
      if (this.inventory.includes('coffee')) {
        removeItem('coffee');
        this.output('You hurl the steaming coffee. It splashes across the wall, revealing a shimmering outline...');
        if (!this.storyFlags.has('secretDoorUnlocked')) {
          this.storyFlags.add('secretDoorUnlocked');
        }
        return { success: true, message: 'A secret passage reveals itself.' };
      } else {
        return { success: false, message: "You don't have any coffee to throw." };
      }
    } else {
      return { success: false, message: `Throwing ${item} achieves nothing.` };
    }
  }

  processCommand(command) {
    return parseCommand(command, this);
  }

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

  handleLookCommand(currentRoom, roomsData) {
    return roomsData[currentRoom]?.description || 'There is nothing much to see.';
  }

  handleUseCommand(command, currentRoom) {
    return `You try to use that, but nothing happens.`;
  }

  handleSecretsCommand() {
    return 'You sense there are secrets waiting to be uncovered.';
  }
  goToRoom(roomName) {
    if (!rooms[roomName]) {
      this.output(`⚠️ Room "${roomName}" does not exist.`);
      return;
    }
    this.currentRoom = roomName;
    const room = rooms[roomName];
    if (typeof room.onEnter === 'function') {
      room.onEnter(this);
    }
    if (this.outputHandler) {
      this.outputHandler([this.describeCurrentRoom()]);
    }
  }
}

