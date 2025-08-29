// Core domain types for Gorstan Beta3

export type Zone = 'glitch' | 'nexus' | 'elfhame' | 'maze' | 'default';

export type TeleportOverlay = 'fractal' | 'trek';

export interface TeleportOptions {
  overlay?: TeleportOverlay;
  skipCeremony?: boolean;
  silent?: boolean;
}

export interface NPCPersona {
  id: string;
  name: string;
  personality: string;
  conversationStyle: string;
  memoryLength: number;
  defaultResponses: string[];
  traits: string[];
  ethical_stance?: string;
  quirks?: string[];
}

export interface ConsoleMessage {
  id: string;
  content: string;
  type: 'system' | 'player' | 'npc' | 'narration' | 'error';
  timestamp: number;
  skipTyping?: boolean;
  npcId?: string;
}

export interface ConsoleTerminalProps {
  messages: ConsoleMessage[];
  onSkipTyping?: () => void;
  onComplete?: () => void;
  className?: string;
}

export interface GameTask {
  id: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface GameState {
  currentRoom: string;
  tasks: GameTask[];
  inventory: string[];
  flags: Record<string, boolean>;
  npcMemories: Record<string, string[]>;
  collections: {
    registerPages: string[];
    glitchPostcards: string[];
    stingers: string[];
  };
  lastRecap?: string;
}

export interface AudioSettings {
  globalMute: boolean;
  sfxVolume: number;
  ambientVolume: number;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
  verboseDescriptions: boolean;
}

export interface PreloadEntry {
  url: string;
  type: 'image' | 'audio';
  priority: 'high' | 'medium' | 'low';
  preloaded: boolean;
}

// Helper type for withGorstanSnark function
export type GorstanSnarker = (message: string) => string;
