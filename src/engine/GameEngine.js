// MIT License
// Gorstan Game v2.3.2
// © 2025 Geoff Webster
// GameEngine.js – Core game state and transition handler.

import { rooms } from "./rooms";
import { storyProgress } from "./storyProgress";
import { NPCs } from "./npcs";

/**
 * The main engine class for managing the game state, room transitions, and interactions.
 */
export default class GameEngine {
  constructor({ startRoom, setCurrentRoom, addToOutput, getState, updateScore, playSound }) {
    this.room = startRoom;
    this.setCurrentRoom = setCurrentRoom;
    this.addToOutput = addToOutput;
    this.getState = getState;
    this.updateScore = updateScore || (() => {});
    this.playSound = playSound || (() => {}); // Optional sound trigger

    this.debugMode = false;
  }

  /**
   * Enables debug features like trap visibility.
   */
  enableDebug() {
    this.debugMode = true;
    this.enableTrapMode(true);
    this.addToOutput("🛠️ DEBUG MODE ENABLED");
  }

  /**
   * Lists active traps for debugging.
   */
  listTraps() {
    if (!this.debugMode) {
      this.addToOutput("🔒 Trap listing only available in debug mode.");
      return;
    }
    const traps = this.getState().traps || [];
    if (traps.length === 0) {
      this.addToOutput("✅ No traps detected.");
    } else {
      this.addToOutput("⚠️ Active trap rooms: " + traps.join(", "));
    }
  }

  /**
   * Transitions to a new room, updating state and triggering room effects.
   */
  enterRoom(roomId) {
    if (!rooms[roomId]) {
      this.addToOutput(`❌ Unknown room: ${roomId}`);
      return;
    }
    this.room = roomId;
    this.setCurrentRoom(roomId);

    // Optional onEnter handler
    if (typeof rooms[roomId].onEnter === "function") {
      rooms[roomId].onEnter(this);
    }
  }

  /**
   * Sends a message to the console.
   */
  say(message) {
    this.addToOutput(message);
  }
}
