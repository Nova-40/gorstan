// GameEngine.js
// Gorstan Game Engine – Core logic handler
// MIT License – 2025 Geoff Webster
// Gorstan v2.1.5

import { rooms } from "./rooms";

export default class GameEngine {
  constructor({ startRoom, setCurrentRoom, addToOutput, getState, updateScore, setInventory }) {
    this.startRoom = startRoom;
    this.setCurrentRoom = setCurrentRoom;
    this.addToOutput = addToOutput;
    this.getState = getState;
    this.updateScore = updateScore || (() => {});
    this.setInventory = setInventory;

    this.currentRoom = startRoom;
    this.buttonPressCount = 0;
    this.resetTimeout = null;
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

    // Special internal command
    if (trimmed === "press button") {
      this.handleResetButtonPress();
      return;
    }

    this.addToOutput(`🗨️ You said: "${command}"`);
  }

  handleResetButtonPress() {
    this.buttonPressCount++;

    if (this.buttonPressCount === 1) {
      this.enterRoom("buttonpressed");
      this.addToOutput("You press the button. A low hum fills the room...");

      this.resetTimeout = setTimeout(() => {
        this.enterRoom("resetroom");
        this.addToOutput("You're back in the reset room. The button pulses faintly.");
        this.buttonPressCount = 0;
      }, 6000);

    } else if (this.buttonPressCount === 2) {
      clearTimeout(this.resetTimeout);
      this.addToOutput("⚠️ MULTIVERSE RESETTING ⚠️");
      this.enterRoom("introreset");
      this.buttonPressCount = 0;
    }
  }

  output(text) {
    this.addToOutput(text);
  }

  moveTo(roomId) {
    this.enterRoom(roomId);
  }

  moveToDirection(dir) {
    const room = rooms[this.currentRoom];
    const exits = typeof room.exits === "function" ? room.exits(this) : room.exits;
    const destination = exits?.[dir];

    if (destination) {
      this.setCurrentRoom(destination);
      this.addToOutput(`You head ${dir} to ${destination}.`);
    } else {
      this.addToOutput(`You can't go ${dir} from here.`);
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
