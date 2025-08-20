/**
 * Mock game state data for testing
 */

import type { LocalGameState } from '../state/gameState';
import { STAGES } from '../state/gameState';

export const mockPlayer = {
  id: 'test-player',
  name: 'TestPlayer',
  health: 100,
  score: 0,
  inventory: ['test-item'],
  traits: [],
  flags: {},
  npcRelationships: {},
  reputation: {},
  currentRoom: 'test-room',
  visitedRooms: ['test-room'],
  playTime: 0,
  lastSave: '',
  level: 1,
  experience: 0,
};

export const mockGameState: LocalGameState = {
  stage: STAGES.GAME,
  transition: null,
  player: mockPlayer,
  history: [],
  currentRoomId: 'test-room',
  previousRoomId: undefined,
  roomMap: {},
  miniquestState: {},
  flags: {},
  npcsInRoom: [],
  roomVisitCount: {},
  gameTime: {
    day: 1,
    hour: 8,
    minute: 0,
    startTime: Date.now(),
    currentTime: Date.now(),
    timeScale: 1,
  },
  settings: {
    soundEnabled: true,
    fullscreen: false,
    cheatMode: false,
    difficulty: 'normal',
    autoSave: true,
    autoSaveInterval: 300000,
    musicEnabled: true,
    animationsEnabled: true,
    textSpeed: 50,
    fontSize: 'medium',
    theme: 'auto',
    debugMode: false,
  },
  metadata: {
    resetCount: 0,
    version: '1.0.0',
    lastSaved: null,
    playTime: 0,
    achievements: [],
    codexEntries: {},
  },
  messages: [],
  inventory: [],
  conversations: {},
  overhearNPCBanter: false,
  quests: [],
  combat: undefined,
  playerName: 'TestPlayer',
  visitedRooms: ['test-room'],
  achievements: [],
  resetCount: 0,
  progress: {
    questsCompleted: 0,
    achievementsUnlocked: 0,
    totalScore: 0,
    totalPlayTime: 0,
    roomsVisited: 1,
    secretsFound: 0,
    characterInteractions: 0,
    storylineProgress: {},
  },
};

export const createMockGameState = (overrides: Partial<LocalGameState> = {}): LocalGameState => ({
  ...mockGameState,
  ...overrides,
});
