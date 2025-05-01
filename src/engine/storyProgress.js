// /src/engine/storyProgress.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// Central game progress and scoring system

let score = 0;
let milestones = new Set();
let storyStage = 1;
let erebosActive = false;
let currentRoom = 'Nexus';

const trackedEvents = {
  resetTriggered: false,
  coffeeThrown: false,
  briefcaseSolved: false,
  tunnelEntered: false,
  librarianSpoken: false,
  erebosEncountered: false
};

let lastErebosMessage = '';

export function addScore(amount, reason = '') {
  score += amount;
  if (reason) console.log(`[Score +${amount}] ${reason}`);
}

export function decayScore(amount, reason = '') {
  score = Math.max(0, score - amount);
  if (reason) console.log(`[Score -${amount}] ${reason}`);
  if (score === 0 && erebosActive) {
    console.warn('[Erebos] Score reduced to 0 — teleporting player to controlnexus.');
    lastErebosMessage = 'Your mind fractures. You awake in the Control Nexus. The air tastes of static.';
    currentRoom = 'controlnexus';
    erebosActive = false;
  }
}

export function getErebosMessage() {
  return lastErebosMessage;
}

export function markMilestone(label) {
  if (!milestones.has(label)) {
    milestones.add(label);
    console.log(`[Milestone] ${label} achieved.`);
  }
}

export function hasMilestone(label) {
  return milestones.has(label);
}

export function updateStoryStage(stage) {
  storyStage = Math.max(storyStage, stage);
}

export function getStoryStage() {
  return storyStage;
}

export function getScore() {
  return score;
}

export function getProgressSummary() {
  return {
    score,
    storyStage,
    currentRoom,
    erebosActive,
    milestones: Array.from(milestones),
    trackedEvents: { ...trackedEvents }
  };
}

export function trackEvent(eventKey) {
  if (eventKey in trackedEvents) trackedEvents[eventKey] = true;
}

export function saveProgress() {
  const saveData = JSON.stringify(getProgressSummary());
  localStorage.setItem('gorstan_save', saveData);
  console.log('[Save] Progress saved to localStorage.');
  updateHighScore();
}

export function loadProgress() {
  const data = localStorage.getItem('gorstan_save');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      score = parsed.score || 0;
      storyStage = parsed.storyStage || 1;
      currentRoom = parsed.currentRoom || 'Nexus';
      erebosActive = parsed.erebosActive || false;
      milestones = new Set(parsed.milestones || []);
      Object.assign(trackedEvents, parsed.trackedEvents || {});
      console.log('[Load] Progress loaded from localStorage.');
    } catch (e) {
      console.warn('[Load] Failed to parse saved progress.', e);
    }
  }
}

export function getNarrativeBranch() {
  if (storyStage >= 5) return 'late';
  if (storyStage >= 3) return 'mid';
  return 'early';
}

export function activateErebos() {
  erebosActive = true;
  console.log('[Erebos] Erebos has begun to ooze through the rooms...');
  document.body.classList.add('erebos-loading');
}

export function deactivateErebos() {
  erebosActive = false;
  console.log('[Erebos] Erebos has dissipated.');
  document.body.classList.remove('erebos-loading');
}

export function updateCurrentRoom(roomName) {
  currentRoom = roomName;
  if (erebosActive) {
    console.log(`[Erebos] Player escaped to ${roomName}, halting Erebos attack.`);
    deactivateErebos();
  }
}

export function updateHighScore() {
  const previous = parseInt(localStorage.getItem('gorstan_highscore'), 10) || 0;
  if (score > previous) {
    localStorage.setItem('gorstan_highscore', score);
    console.log(`[High Score] New personal best: ${score}`);
  }
}

export function getHighScore() {
  return parseInt(localStorage.getItem('gorstan_highscore'), 10) || 0;
}

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
  getErebosMessage
};

