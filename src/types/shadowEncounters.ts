/**
 * Shadow Encounters Type Definitions
 * Defines types for dynamic shadow entities and encounter mechanics
 */

import { type RouteId } from './routes';
import { type QuantumElement, type QuantumArtifact } from './quantumMagic';

// Shadow Entity Types
export type ShadowEntityType = 
  | 'whisper'      // Weak, fleeting shadows
  | 'wraith'       // Medium-strength, persistent shadows
  | 'shade'        // Strong, territorial shadows
  | 'umbral'       // Elite shadows with special abilities
  | 'void_spawn';  // Legendary shadow entities

export type ShadowBehavior = 
  | 'passive'      // Observes but doesn't interact
  | 'curious'      // Approaches player cautiously
  | 'territorial'  // Guards specific areas
  | 'aggressive'   // Actively pursues player
  | 'mimic'        // Copies player actions/speech
  | 'phase'        // Appears/disappears unpredictably
  | 'collective';  // Multiple entities acting as one

export type ShadowWeakness = 
  | 'light'        // Vulnerable to light sources
  | 'quantum'      // Affected by quantum artifacts
  | 'sound'        // Disrupted by loud noises
  | 'movement'     // Weakened when player moves
  | 'time'         // Fades with time passage
  | 'artifacts'    // Specific artifact vulnerability
  | 'resonance';   // Quantum resonance disruption

export interface ShadowEntityStats {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  manifestation: number; // How solid/visible (0-100)
  aggression: number;    // How hostile (0-100)
  awareness: number;     // Detection ability (0-100)
  speed: number;         // Movement/action speed
}

export interface ShadowAbility {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  cooldown: number; // milliseconds
  lastUsed?: number;
  effect: {
    type: 'drain' | 'phase' | 'mimic' | 'multiply' | 'teleport' | 'corrupt' | 'silence';
    duration?: number;
    intensity: number;
    target?: 'player' | 'environment' | 'artifacts' | 'self';
  };
}

export interface ShadowEntity {
  id: string;
  type: ShadowEntityType;
  name: string;
  description: string;
  stats: ShadowEntityStats;
  behavior: ShadowBehavior;
  weaknesses: ShadowWeakness[];
  abilities: string[]; // References to ability IDs
  spawnConditions: {
    timeInRoom?: number;
    playerActions?: string[];
    quantumLevel?: number;
    artifactPresence?: string[];
    routeSpecific?: RouteId[];
  };
  manifestationTriggers: {
    lowLight?: boolean;
    playerStress?: boolean;
    quantumActivity?: boolean;
    timeThreshold?: number;
  };
  rewards?: {
    experience: number;
    quantumElement?: QuantumElement;
    artifactDiscoveryBonus?: number;
  };
}

// Encounter System Types
export interface ShadowEncounter {
  id: string;
  entityId: string;
  startTime: number;
  duration?: number;
  roomId: string;
  encounterType: 'observation' | 'interaction' | 'challenge' | 'chase' | 'stealth';
  difficulty: number; // 1-10 scale
  playerActions: string[];
  outcome?: 'success' | 'failure' | 'escape' | 'ongoing';
  rewards?: {
    experienceGained: number;
    artifactsDiscovered: string[];
    quantumBonus: number;
  };
}

export interface EncounterState {
  activeEncounters: Map<string, ShadowEncounter>;
  encounterHistory: ShadowEncounter[];
  playerStress: number; // 0-100, affects shadow manifestation
  environmentalFear: number; // Room-specific fear level
  quantumStability: number; // How quantum artifacts affect shadows
  totalEncounters: number;
  successfulEncounters: number;
  escapeEncounters: number;
}

export interface EncounterDifficulty {
  baseSpawnRate: number;
  difficultyMultiplier: number;
  maxConcurrentEncounters: number;
  stressDecayRate: number;
  quantumInterference: number;
}

// Shadow Interaction Types
export type ShadowInteractionType = 
  | 'observe'      // Watch shadow behavior
  | 'approach'     // Move closer to shadow
  | 'retreat'      // Move away from shadow
  | 'activate'     // Use quantum artifact
  | 'communicate'  // Attempt to interact
  | 'hide'         // Try to avoid detection
  | 'banish'       // Use light or artifact to dispel
  | 'study';       // Learn about shadow behavior

export interface ShadowInteraction {
  type: ShadowInteractionType;
  entityId: string;
  timestamp: number;
  result: {
    success: boolean;
    effect: string;
    stressChange: number;
    entityResponse: string;
    experienceGained: number;
    artifactEffectiveness?: number;
  };
}

// Quantum Integration Types
export interface QuantumShadowEffect {
  artifactId: string;
  effectType: 'repel' | 'reveal' | 'communicate' | 'weaken' | 'banish' | 'study';
  effectiveness: number; // 0-100%
  duration: number; // milliseconds
  energyCost: number;
  description: string;
}

export interface ShadowGameState {
  encounterState: EncounterState;
  activeEntities: Map<string, ShadowEntity>;
  discoveredEntities: string[];
  interactionHistory: ShadowInteraction[];
  difficultySettings: EncounterDifficulty;
  quantumEffects: Map<string, QuantumShadowEffect>;
  playerFearLevel: number;
  adaptiveDifficulty: {
    currentLevel: number;
    successRate: number;
    adjustmentFactor: number;
  };
}

// Event Types for Shadow System
export interface ShadowEvent {
  type: 'spawn' | 'manifest' | 'interact' | 'banish' | 'escape' | 'victory';
  entityId: string;
  timestamp: number;
  details: {
    roomId: string;
    playerAction?: string;
    quantumArtifacts?: QuantumArtifact[];
    outcome?: string;
    experienceGained?: number;
  };
}

// Configuration Types
export interface ShadowSystemConfig {
  enabled: boolean;
  spawnRate: number; // Base spawn probability per minute
  maxEntitiesPerRoom: number;
  difficultyScaling: boolean;
  quantumIntegration: boolean;
  adaptiveDifficulty: boolean;
  fearSystem: boolean;
  persistentEncounters: boolean;
  encounterTimeout: number; // Auto-resolve time in milliseconds
}

export interface RouteSpecificShadowConfig {
  routeId: RouteId;
  allowedEntityTypes: ShadowEntityType[];
  spawnRateModifier: number;
  difficultyModifier: number;
  specialConditions?: {
    timeBasedSpawns?: boolean;
    progressionGated?: boolean;
    quantumRequired?: boolean;
  };
}
