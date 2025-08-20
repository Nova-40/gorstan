/**
 * Route System Types
 * Defines the structure for different game routes and their configurations
 */

export type RouteId = 'demo' | 'full' | `short10_${string}` | `short30_${string}`;

export interface RouteNodeRef {
  id: string;
  type: 'logicPuzzle' | 'quest' | 'combat' | 'travel' | 'cinematic';
  required?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  pick?: 'random' | 'deterministic';
  seed?: string;
  pauseOnModal?: boolean;
}

export interface RouteManifest {
  id: RouteId;
  label: string;
  targetMinutes: 10 | 30 | 999; // 999 = full game
  description: string;
  nodes: RouteNodeRef[];
  allowedSkips?: number;
  enableFastTravel?: boolean;
  hintPolicy: 'off' | 'timed' | 'guided';
  difficulty: 'story' | 'normal' | 'veteran';
}

export interface RouteProgress {
  routeId: RouteId;
  currentNodeIndex: number;
  currentNodeId: string;
  completedNodes: string[];
  skippedNodes: string[];
  elapsedTimeMs: number;
  timeStarted: number;
  lastSaved: number;
  objectives: {
    completed: string[];
    total: string[];
  };
}

export interface RouteState {
  currentRoute: RouteManifest | null;
  progress: RouteProgress | null;
  isActive: boolean;
  timeRemaining?: number; // seconds
}
