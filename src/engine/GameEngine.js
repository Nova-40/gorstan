// GameEngine.js
// Gorstan Game Engine – Core logic handler
// MIT License – 2025 Geoff Webster
// Gorstan v2.1.5

import { rooms } from "./rooms";

export default class GameEngine {
  constructor({ startRoom, setCurrentRoom, addToOutput, getState, updateScore, setInventory }) {
    this.currentRoom = startRoom;
    this.setCurrentRoom = setCurrentRoom;
    this.addToOutput = addToOutput;
    this.getState = getState;
    this.setInventory = setInventory;
    this.updateScore = updateScore || (() => {});
    this.storyFlags = new Set();
    this.inventory = [];
    this.codex = [];
  }

  start() {
    try {
      this.enterRoom(this.currentRoom);
    } catch (err) {
      console.error("❌ Error starting the game engine:", err);
      this.addToOutput("🚨 Critical error: Unable to start the game.");
    }
  }

  enterRoom(roomId) {
    const room = rooms[roomId];
    if (!room) {
      console.error(`⚠️ Unknown room: "${roomId}".`);
      this.addToOutput(`⚠️ Unknown room: ${roomId}`);
      return;
    }

    this.currentRoom = roomId;
    this.setCurrentRoom(roomId);

    if (typeof room.onEnter === "function") {
      try {
        room.onEnter(this);
      } catch (err) {
        console.error(`❌ Error in onEnter for room "${roomId}":`, err);
        this.addToOutput(`⚠️ Something went wrong when entering ${roomId}.`);
      }
    } else {
      this.addToOutput(room.description || `You enter ${roomId}.`);
    }
  }

  handleCommand(command) {
    const trimmed = command.trim().toLowerCase();
    if (!trimmed) return;

    const room = rooms[this.currentRoom];
    if (room?.onCommand) {
      try {
        room.onCommand(trimmed, this);
      } catch (err) {
        console.error("❌ Command error:", err);
        this.addToOutput("⚠️ Something went wrong while processing your command.");
      }
      return;
    }

    this.addToOutput(`🗨️ You said: "${command}"`);
  }

  output(text) {
    this.addToOutput(text);
  }

  moveTo(roomId) {
    this.enterRoom(roomId);
  }

  moveToDirection(direction) {
    const room = rooms[this.currentRoom];
    if (!room || !room.exits) {
      this.addToOutput("🚪 There's nowhere to go from here.");
      return;
    }

    const exits = typeof room.exits === "function" ? room.exits(this.getState?.()) : room.exits;

    if (exits[direction]) {
      this.enterRoom(exits[direction]);
    } else {
      this.addToOutput(`🚫 You can't go ${direction} from here.`);
    }
  }

  setFlag(flag) {
    this.storyFlags.add(flag);
  }

  getFlag(flag) {
    return this.storyFlags.has(flag);
  }

  hasItem(itemId) {
    return this.inventory.includes(itemId);
  }

  addItem(itemId) {
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
      this.setInventory([...this.inventory]);
      this.addToOutput(`You picked up ${itemId}.`);
    }
  }

  removeItem(itemId) {
    this.inventory = this.inventory.filter((item) => item !== itemId);
    this.setInventory([...this.inventory]);
  }

  increaseScore(points) {
    try {
      this.updateScore(points);
      this.addToOutput(`🎯 Score increased by ${points}!`);
    } catch (err) {
      console.error("❌ Error updating score:", err);
      this.addToOutput("⚠️ Unable to update score.");
    }
  }
}
