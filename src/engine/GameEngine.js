// GameEngine.js
// Core game engine for the Gorstan application.
// MIT License
// Copyright (c) 2025 Geoff Webster

export default class GameEngine {
  constructor() {
    this.currentRoom = null;
    this.inventory = [];
    this.codex = [];
    this.score = 0;
    this.storyFlags = new Set();
  }

  setOutputHandler(handler) {
    this.outputHandler = handler;
  }

  setSceneHandler(handler) {
    this.sceneHandler = handler;
  }

  describeCurrentRoom() {
    return `You are in ${this.currentRoom}.`;
  }

  addItem(item) {
    if (!this.inventory.includes(item)) {
      this.inventory.push(item);
    }
  }

  processCommand(command) {
    // Basic command processing logic
    return { message: `You executed: ${command}` };
  }
}
