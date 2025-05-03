// /src/engine/storyProgress.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Central game progress and scoring system
// This module manages the player's progress, score, milestones, and story state.
// It also handles interactions with Erebos, saving/loading progress, and narrative branching.

let score = 0; // Player's current score
let milestones = new Set(); // Set of achieved milestones
let storyStage = 1; // Current stage of the story
let erebosActive = false; // Whether Erebos is active
let currentRoom = 'Nexus'; // Player's current room

const trackedEvents = {
  resetTriggered: false,
  coffeeThrown: false,
  briefcaseSolved: false,
  tunnelEntered: false,
  librarianSpoken: false,
  erebosEncountered: false,
};

let lastErebosMessage = ''; // Last message from Erebos interactions

/**
 * Adds points to the player's score.
 * @param {number} amount - The number of points to add.
 * @param {string} [reason] - Optional reason for the score increase.
 */
export function addScore(amount, reason = '') {
  score += amount;
  if (reason) console.log(`[Score +${amount}] ${reason}`);
}

/**
 * Deducts points from the player's score, ensuring it doesn't drop below 0.
 * If the score reaches 0 and Erebos is active, the player is teleported to the Control Nexus.
 * @param {number} amount - The number of points to deduct.
 * @param {string} [reason] - Optional reason for the score decrease.
 */
export function decayScore(amount, reason = '') {
  score = Math.max(0, score - amount);
  if (reason) console.log(`[Score -${amount}] ${reason}`);
  if (score === 0 && erebosActive) {
    console.warn('[Erebos] Score reduced to 0 — teleporting player to Control Nexus.');
    lastErebosMessage = 'Your mind fractures. You awake in the Control Nexus. The air tastes of static.';
    currentRoom = 'controlnexus';
    erebosActive = false;
  }
}

/**
 * Retrieves the last Erebos message.
 * @returns {string} - The last Erebos message.
 */
export function getErebosMessage() {
  return lastErebosMessage;
}

/**
 * Marks a milestone as achieved.
 * @param {string} label - The milestone label.
 */
export function markMilestone(label) {
  if (!milestones.has(label)) {
    milestones.add(label);
    console.log(`[Milestone] ${label} achieved.`);
  }
}

/**
 * Checks if a milestone has been achieved.
 * @param {string} label - The milestone label.
 * @returns {boolean} - Whether the milestone has been achieved.
 */
export function hasMilestone(label) {
  return milestones.has(label);
}

/**
 * Updates the story stage to the specified value, ensuring it doesn't regress.
 * @param {number} stage - The new story stage.
 */
export function updateStoryStage(stage) {
  storyStage = Math.max(storyStage, stage);
}

/**
 * Retrieves the current story stage.
 * @returns {number} - The current story stage.
 */
export function getStoryStage() {
  return storyStage;
}

/**
 * Retrieves the player's current score.
 * @returns {number} - The player's score.
 */
export function getScore() {
  return score;
}

/**
 * Retrieves a summary of the player's progress.
 * @returns {object} - An object containing the player's progress data.
 */
export function getProgressSummary() {
  return {
    score,
    storyStage,
    currentRoom,
    erebosActive,
    milestones: Array.from(milestones),
    trackedEvents: { ...trackedEvents },
  };
}

/**
 * Tracks an event by marking it as completed.
 * @param {string} eventKey - The event key to track.
 */
export function trackEvent(eventKey) {
  if (eventKey in trackedEvents) trackedEvents[eventKey] = true;
}

/**
 * Saves the player's progress to localStorage.
 */
export function saveProgress() {
  try {
    const saveData = JSON.stringify(getProgressSummary());
    localStorage.setItem('gorstan_save', saveData);
    console.log('[Save] Progress saved to localStorage.');
    updateHighScore();
  } catch (err) {
    console.error('[Save] Failed to save progress:', err);
  }
}

/**
 * Loads the player's progress from localStorage.
 */
export function loadProgress() {
  try {
    const data = localStorage.getItem('gorstan_save');
    if (data) {
      const parsed = JSON.parse(data);
      score = parsed.score || 0;
      storyStage = parsed.storyStage || 1;
      currentRoom = parsed.currentRoom || 'Nexus';
      erebosActive = parsed.erebosActive || false;
      milestones = new Set(parsed.milestones || []);
      Object.assign(trackedEvents, parsed.trackedEvents || {});
      console.log('[Load] Progress loaded from localStorage.');
    }
  } catch (err) {
    console.warn('[Load] Failed to parse saved progress:', err);
  }
}

/**
 * Determines the current narrative branch based on the story stage.
 * @returns {string} - The narrative branch ('early', 'mid', or 'late').
 */
export function getNarrativeBranch() {
  if (storyStage >= 5) return 'late';
  if (storyStage >= 3) return 'mid';
  return 'early';
}

/**
 * Activates Erebos, triggering its effects.
 */
export function activateErebos() {
  erebosActive = true;
  console.log('[Erebos] Erebos has begun to ooze through the rooms...');
  document.body.classList.add('erebos-loading');
}

/**
 * Deactivates Erebos, halting its effects.
 */
export function deactivateErebos() {
  erebosActive = false;
  console.log('[Erebos] Erebos has dissipated.');
  document.body.classList.remove('erebos-loading');
}

/**
 * Updates the player's current room.
 * If Erebos is active, it is deactivated when the player escapes.
 * @param {string} roomName - The name of the new room.
 */
export function updateCurrentRoom(roomName) {
  currentRoom = roomName;
  if (erebosActive) {
    console.log(`[Erebos] Player escaped to ${roomName}, halting Erebos attack.`);
    deactivateErebos();
  }
}

/**
 * Updates the player's high score in localStorage.
 */
export function updateHighScore() {
  try {
    const previous = parseInt(localStorage.getItem('gorstan_highscore'), 10) || 0;
    if (score > previous) {
      localStorage.setItem('gorstan_highscore', score);
      console.log(`[High Score] New personal best: ${score}`);
    }
  } catch (err) {
    console.error('[High Score] Failed to update high score:', err);
  }
}

/**
 * Retrieves the player's high score from localStorage.
 * @returns {number} - The player's high score.
 */
export function getHighScore() {
  try {
    return parseInt(localStorage.getItem('gorstan_highscore'), 10) || 0;
  } catch (err) {
    console.error('[High Score] Failed to retrieve high score:', err);
    return 0;
  }
}

// Export all functions as part of the storyProgress object
export const storyProgress = {
  addScore,
  decayScore,
  markMilestone,
  hasMilestone,
  updateStoryStage,
  getStoryStage,
  getScore,
  getProgressSummary,
  trackEvent,
  saveProgress,
  loadProgress,
  getNarrativeBranch,
  activateErebos,
  deactivateErebos,
  updateCurrentRoom,
  updateHighScore,
  getHighScore,
  getErebosMessage,
};


