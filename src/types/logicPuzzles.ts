/**
 * Logic Puzzle Type Definitions
 * Defines types for procedurally generated logic puzzles integrated with quantum artifacts
 */

import { type QuantumElement } from './quantumMagic';
import { type RouteId } from './routes';

// Core Puzzle Types
export type PuzzleType = 
  | 'sequence'      // Pattern recognition and completion
  | 'grid'          // Spatial arrangement puzzles
  | 'logic'         // Deductive reasoning puzzles
  | 'cipher'        // Encryption/decryption challenges
  | 'quantum'       // Quantum mechanics based puzzles
  | 'artifact'      // Artifact-specific interaction puzzles
  | 'hybrid';       // Multi-type combined puzzles

export type PuzzleDifficulty = 
  | 'trivial'       // 1-2 steps, immediate solution
  | 'easy'          // 3-4 steps, basic logic
  | 'medium'        // 5-7 steps, multiple concepts
  | 'hard'          // 8-12 steps, complex reasoning
  | 'expert'        // 13+ steps, advanced patterns
  | 'quantum';      // Requires quantum artifact assistance

export type PuzzleCategory =
  | 'tutorial'      // Teaching basic concepts
  | 'exploration'   // Found during room exploration
  | 'progression'   // Required for story advancement
  | 'optional'      // Bonus content with rewards
  | 'artifact'      // Unlocked by artifact interaction
  | 'seasonal'      // Time-limited special puzzles
  | 'master';       // Ultimate challenge puzzles

// Puzzle Structure
export interface LogicPuzzle {
  id: string;
  type: PuzzleType;
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  title: string;
  description: string;
  
  // Core puzzle data
  puzzle: {
    data: any;           // Puzzle-specific data structure
    solution: any;       // Expected solution
    hints: string[];     // Progressive hint system
    explanation: string; // Solution explanation
  };
  
  // Generation parameters
  generation: {
    seed: string;        // Reproducible generation
    algorithm: string;   // Generator algorithm used
    parameters: any;     // Algorithm-specific parameters
    complexity: number;  // Computed complexity score
  };
  
  // Quantum integration
  quantumAspects?: {
    requiredArtifacts: string[];     // Artifacts needed to solve
    quantumElements: QuantumElement[]; // Elements involved
    resonanceRequired: number;       // Minimum resonance level
    artifactInteractions: {
      artifactId: string;
      interactionType: 'analyze' | 'resonate' | 'channel' | 'combine';
      effect: string;
    }[];
  };
  
  // Progression and rewards
  progression: {
    prerequisites: {
      completedPuzzles?: string[];
      routeAccess?: RouteId[];
      artifactLevels?: { [artifactId: string]: number };
      playerStats?: { [stat: string]: number };
    };
    rewards: {
      experience: number;
      quantumResonance?: number;
      artifactProgression?: { [artifactId: string]: number };
      unlockedContent?: {
        routes?: RouteId[];
        puzzles?: string[];
        lore?: string[];
      };
      items?: string[];
    };
    timeConstraints?: {
      timeLimit?: number;      // milliseconds
      optimalTime?: number;    // for bonus rewards
      penaltyThreshold?: number;
    };
  };
  
  // Analytics and learning
  analytics: {
    attempts: number;
    completions: number;
    averageTime: number;
    commonMistakes: string[];
    hintUsage: number[];
    difficultyRating?: number; // Player feedback
  };
  
  // Metadata
  metadata: {
    created: number;
    lastModified: number;
    version: string;
    tags: string[];
    author?: 'system' | 'procedural' | 'custom';
    validatedBy?: string[];
  };
}

// Specific Puzzle Types
export interface SequencePuzzle {
  sequence: (number | string | symbol)[];
  pattern: {
    type: 'arithmetic' | 'geometric' | 'fibonacci' | 'prime' | 'custom';
    rule: string;
    complexity: number;
  };
  missingElements: number[]; // Indices of missing elements
}

export interface GridPuzzle {
  grid: {
    width: number;
    height: number;
    cells: any[][];
    constraints: {
      rows?: any[];
      columns?: any[];
      regions?: { cells: [number, number][]; constraint: any }[];
    };
  };
  rules: string[];
  objective: string;
}

export interface LogicDeductionPuzzle {
  entities: string[];
  properties: { [property: string]: string[] };
  clues: {
    id: string;
    statement: string;
    type: 'positive' | 'negative' | 'conditional' | 'comparative';
    entities: string[];
    properties: string[];
  }[];
  solution: { [entity: string]: { [property: string]: string } };
}

export interface CipherPuzzle {
  cipher: {
    type: 'caesar' | 'substitution' | 'vigenere' | 'quantum' | 'artifact';
    key?: string | number;
    encoded: string;
    decoded: string;
  };
  hints: {
    keyHints?: string[];
    patternHints?: string[];
    contextHints?: string[];
  };
}

export interface QuantumPuzzle {
  quantumState: {
    superposition: boolean;
    entanglement: string[];
    measurement: {
      basis: QuantumElement;
      outcome: any;
    };
  };
  quantumGates: {
    available: string[];
    sequence: string[];
    target: any;
  };
  artifactChanneling: {
    primaryArtifact: string;
    supportingArtifacts?: string[];
    resonancePattern: number[];
  };
}

// Puzzle Generation System
export interface PuzzleGenerator {
  id: string;
  name: string;
  description: string;
  supportedTypes: PuzzleType[];
  supportedDifficulties: PuzzleDifficulty[];
  
  configuration: {
    randomization: number;     // 0-1, how much randomness
    coherence: number;         // 0-1, logical consistency
    accessibility: number;     // 0-1, how approachable
    innovation: number;        // 0-1, use novel patterns
  };
  
  algorithms: {
    [difficulty: string]: {
      name: string;
      complexity: number;
      parameters: any;
      weights: { [aspect: string]: number };
    };
  };
}

export interface PuzzleTemplate {
  id: string;
  name: string;
  type: PuzzleType;
  baseStructure: any;
  variables: {
    [key: string]: {
      type: 'number' | 'string' | 'array' | 'object';
      range?: any;
      options?: any[];
      constraints?: any;
    };
  };
  validation: {
    solvable: boolean;
    unique: boolean;
    difficulty: PuzzleDifficulty;
  };
}

// Puzzle Session and Progress
export interface PuzzleSession {
  puzzleId: string;
  playerId: string;
  startTime: number;
  endTime?: number;
  
  progress: {
    currentState: any;
    moves: {
      timestamp: number;
      action: string;
      data: any;
      valid: boolean;
    }[];
    hintsUsed: number[];
    mistakes: number;
  };
  
  result?: {
    solved: boolean;
    timeToSolve?: number;
    score: number;
    efficiency: number;    // Solution optimality
    creativity: number;    // Non-standard approach
    artifacts: {
      used: string[];
      effectiveness: { [artifactId: string]: number };
    };
  };
  
  quantumInteractions?: {
    artifactActivations: {
      artifactId: string;
      timestamp: number;
      effect: string;
      success: boolean;
    }[];
    resonanceEvents: {
      timestamp: number;
      elements: QuantumElement[];
      strength: number;
      outcome: string;
    }[];
  };
}

export interface PuzzleCollection {
  id: string;
  name: string;
  description: string;
  theme: string;
  
  puzzles: string[]; // Puzzle IDs
  ordering: 'sequential' | 'branching' | 'open' | 'adaptive';
  
  progression: {
    unlockConditions: any;
    completionRewards: any;
    masteryRequirements: {
      minimumScore: number;
      timeRequirements?: number;
      noHints?: boolean;
      artifactMastery?: { [artifactId: string]: number };
    };
  };
  
  analytics: {
    totalAttempts: number;
    completionRate: number;
    averageTime: number;
    difficultyProgression: number[];
    playerFeedback: {
      rating: number;
      comments: string[];
      difficultyVotes: { [difficulty: string]: number };
    };
  };
}

// Adaptive Difficulty System
export interface AdaptiveDifficulty {
  playerId: string;
  currentLevel: number;        // 0-100 skill level
  confidence: number;          // Confidence in level assessment
  
  performance: {
    recentSolves: {
      puzzleId: string;
      difficulty: PuzzleDifficulty;
      timeToSolve: number;
      hintsUsed: number;
      score: number;
      timestamp: number;
    }[];
    
    trends: {
      improvementRate: number;
      consistencyScore: number;
      preferredTypes: PuzzleType[];
      struggleAreas: string[];
    };
  };
  
  recommendations: {
    nextDifficulty: PuzzleDifficulty;
    suggestedTypes: PuzzleType[];
    skillGaps: string[];
    practiceAreas: string[];
  };
  
  quantumAptitude: {
    artifactSynergy: { [artifactId: string]: number };
    elementalAffinity: { [element: string]: number };
    resonanceStability: number;
    innovativeThinking: number;
  };
}

// Integration with Game Systems
export interface PuzzleIntegration {
  roomIntegration: {
    [routeId: string]: {
      environmentalPuzzles: string[];
      contextualHints: string[];
      atmosphericElements: string[];
    };
  };
  
  storyIntegration: {
    narrativePuzzles: {
      puzzleId: string;
      storyContext: string;
      characterInvolvement: string[];
      plotRelevance: 'minor' | 'major' | 'critical';
    }[];
    
    characterReactions: {
      [characterId: string]: {
        onPuzzleStart: string[];
        onPuzzleProgress: string[];
        onPuzzleComplete: string[];
        onPuzzleFail: string[];
      };
    };
  };
  
  artifactEvolution: {
    puzzleInfluence: {
      [puzzleId: string]: {
        artifactGrowth: { [artifactId: string]: number };
        newAbilities: string[];
        personalityChanges: string[];
      };
    };
  };
}

// Configuration and Settings
export interface PuzzleSystemConfig {
  enabled: boolean;
  difficulty: {
    adaptiveSystem: boolean;
    manualOverride: boolean;
    difficultyRange: [PuzzleDifficulty, PuzzleDifficulty];
    progressionRate: number;
  };
  
  generation: {
    proceduralGeneration: boolean;
    templateVariation: number;
    quantumIntegration: boolean;
    customPuzzleSupport: boolean;
  };
  
  presentation: {
    animationSpeed: number;
    hintSystem: boolean;
    progressIndicators: boolean;
    accessibilityMode: boolean;
  };
  
  analytics: {
    trackPerformance: boolean;
    collectFeedback: boolean;
    adaptiveLearning: boolean;
    anonymizeData: boolean;
  };
}

// Events and Notifications
export interface PuzzleEvent {
  type: 'started' | 'progress' | 'hint_used' | 'mistake' | 'solved' | 'abandoned' | 'quantum_interaction';
  puzzleId: string;
  playerId: string;
  timestamp: number;
  
  data: {
    sessionId?: string;
    currentState?: any;
    timeElapsed?: number;
    hintsUsed?: number;
    artifacts?: string[];
    quantumEvent?: {
      type: string;
      artifact: string;
      effect: string;
    };
  };
}

export interface PuzzleNotification {
  id: string;
  type: 'new_puzzle' | 'collection_complete' | 'milestone' | 'difficulty_adjusted' | 'artifact_synergy';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  
  actions?: {
    label: string;
    action: string;
    data?: any;
  }[];
  
  metadata: {
    puzzleId?: string;
    collectionId?: string;
    artifactId?: string;
    achievement?: string;
  };
}
