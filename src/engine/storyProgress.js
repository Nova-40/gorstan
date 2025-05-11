// /src/engine/storyProgress.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

// Central game progress and scoring system
// This module manages the player's progress, score, milestones, and story state.
// It also handles interactions with Erebos, saving/loading progress, and narrative branching.

class StoryProgress {
  constructor() {
    this.score = 0; // Player's current score
    this.milestones = new Set(); // Set of achieved milestones
    this.storyStage = 1; // Current stage of the story
    this.erebosActive = false; // Whether Erebos is active
    this.currentRoom = "Nexus"; // Player's current room
    this.trackedEvents = {
      resetTriggered: false,
      coffeeThrown: false,
      briefcaseSolved: false,
      tunnelEntered: false,
      librarianSpoken: false,
      erebosEncountered: false,
    };
    this.lastErebosMessage = ""; // Last message from Erebos interactions
  }

  // --- Score Management ---

  /**
   * Adds points to the player's score.
   * @param {number} amount - The number of points to add.
   * @param {string} [reason] - Optional reason for the score increase.
   */
  addScore(amount, reason = "") {
    this.score += amount;
    if (reason) console.log(`[Score +${amount}] ${reason}`);
    this.updateHighScore(); // Automatically update high score
  }

  /**
   * Deducts points from the player's score, ensuring it doesn't drop below 0.
   * If the score reaches 0 and Erebos is active, the player is teleported to the Control Nexus.
   * @param {number} amount - The number of points to deduct.
   * @param {string} [reason] - Optional reason for the score decrease.
   */
  decayScore(amount, reason = "") {
    this.score = Math.max(0, this.score - amount);
    if (reason) console.log(`[Score -${amount}] ${reason}`);
    if (this.score === 0 && this.erebosActive) {
      console.warn("[Erebos] Score reduced to 0 — teleporting player to Control Nexus.");
      this.lastErebosMessage =
        "Your mind fractures. You awake in the Control Nexus. The air tastes of static.";
      this.currentRoom = "controlnexus";
      this.erebosActive = false;
    }
  }

  /**
   * Retrieves the player's current score.
   * @returns {number} - The player's score.
   */
  getScore() {
    return this.score;
  }

  // --- Milestone Management ---

  /**
   * Marks a milestone as achieved.
   * @param {string} label - The milestone label.
   */
  setMilestone(label) {
    if (!this.milestones.has(label)) {
      this.milestones.add(label);
      console.log(`[Milestone] ${label} achieved.`);
    }
  }

  /**
   * Checks if a milestone has been achieved.
   * @param {string} label - The milestone label.
   * @returns {boolean} - Whether the milestone has been achieved.
   */
  hasMilestone(label) {
    return this.milestones.has(label);
  }

  // --- Story Stage Management ---

  /**
   * Updates the story stage to the specified value, ensuring it doesn't regress.
   * @param {number} stage - The new story stage.
   */
  updateStoryStage(stage) {
    this.storyStage = Math.max(this.storyStage, stage);
    console.log(`[Story Stage] Updated to ${this.storyStage}`);
  }

  /**
   * Retrieves the current story stage.
   * @returns {number} - The current story stage.
   */
  getStoryStage() {
    return this.storyStage;
  }

  // --- Event Tracking ---

  /**
   * Tracks an event by marking it as completed.
   * @param {string} eventKey - The event key to track.
   */
  trackEvent(eventKey) {
    if (eventKey in this.trackedEvents) {
      this.trackedEvents[eventKey] = true;
      console.log(`[Event] ${eventKey} tracked.`);
    } else {
      console.warn(`[Event] Unknown event key: ${eventKey}`);
    }
  }

  // --- Progress Management ---

  /**
   * Retrieves a summary of the player's progress.
   * @returns {object} - An object containing the player's progress data.
   */
  getProgressSummary() {
    return {
      score: this.score,
      storyStage: this.storyStage,
      currentRoom: this.currentRoom,
      erebosActive: this.erebosActive,
      milestones: Array.from(this.milestones),
      trackedEvents: { ...this.trackedEvents },
    };
  }

  /**
   * Saves the player's progress to localStorage.
   */
  saveProgress() {
    try {
      const saveData = JSON.stringify(this.getProgressSummary());
      localStorage.setItem("gorstan_save", saveData);
      console.log("[Save] Progress saved to localStorage.");
      this.updateHighScore();
    } catch (err) {
      console.error("[Save] Failed to save progress:", err);
    }
  }

  /**
   * Loads the player's progress from localStorage.
   */
  loadProgress() {
    try {
      const data = localStorage.getItem("gorstan_save");
      if (data) {
        const parsed = JSON.parse(data);
        this.score = parsed.score || 0;
        this.storyStage = parsed.storyStage || 1;
        this.currentRoom = parsed.currentRoom || "Nexus";
        this.erebosActive = parsed.erebosActive || false;
        this.milestones = new Set(parsed.milestones || []);
        Object.assign(this.trackedEvents, parsed.trackedEvents || {});
        console.log("[Load] Progress loaded from localStorage.");
      }
    } catch (err) {
      console.warn("[Load] Failed to parse saved progress:", err);
    }
  }

  // --- Erebos Management ---

  /**
   * Activates Erebos, triggering its effects.
   */
  activateErebos() {
    this.erebosActive = true;
    console.log("[Erebos] Erebos has begun to ooze through the rooms...");
    document.body.classList.add("erebos-loading");
  }

  /**
   * Deactivates Erebos, halting its effects.
   */
  deactivateErebos() {
    this.erebosActive = false;
    console.log("[Erebos] Erebos has dissipated.");
    document.body.classList.remove("erebos-loading");
  }

  /**
   * Retrieves the last Erebos message.
   * @returns {string} - The last Erebos message.
   */
  getErebosMessage() {
    return this.lastErebosMessage;
  }

  // --- High Score Management ---

  /**
   * Updates the player's high score in localStorage.
   */
  updateHighScore() {
    try {
      const previous = parseInt(localStorage.getItem("gorstan_highscore"), 10) || 0;
      if (this.score > previous) {
        localStorage.setItem("gorstan_highscore", this.score);
        console.log(`[High Score] New personal best: ${this.score}`);
      }
    } catch (err) {
      console.error("[High Score] Failed to update high score:", err);
    }
  }

  /**
   * Retrieves the player's high score from localStorage.
   * @returns {number} - The player's high score.
   */
  getHighScore() {
    try {
      return parseInt(localStorage.getItem("gorstan_highscore"), 10) || 0;
    } catch (err) {
      console.error("[High Score] Failed to retrieve high score:", err);
      return 0;
    }
  }
}

// Export an instance of the StoryProgress class and specific methods
export const storyProgress = new StoryProgress();
export const { addScore, setMilestone } = storyProgress;


