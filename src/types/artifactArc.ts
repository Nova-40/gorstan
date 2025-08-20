/**
 * Artifact Arc Type Definitions
 * Defines types for artifact-specific story content and discovery narratives
 */

import { type QuantumElement } from './quantumMagic';
import { type RouteId } from './routes';

// Story Arc Types
export type ArtifactStoryArc = 
  | 'origin'        // How the artifact came to exist
  | 'discovery'     // First discovery and initial use
  | 'mastery'       // Learning to use the artifact effectively
  | 'awakening'     // Artifact develops consciousness/sentience
  | 'evolution'     // Artifact transforms or upgrades
  | 'legacy'        // Long-term impact and consequences
  | 'synthesis';    // Combining with other artifacts

export type NarrativeStyle = 
  | 'historical'    // Past events, lore-heavy
  | 'personal'      // First-person experiences
  | 'mysterious'    // Cryptic, puzzle-like
  | 'scientific'    // Technical explanations
  | 'mystical'      // Spiritual/magical descriptions
  | 'cautionary'    // Warnings and consequences
  | 'prophetic';    // Future visions and possibilities

export interface ArtifactLoreEntry {
  id: string;
  artifactId: string;
  arc: ArtifactStoryArc;
  style: NarrativeStyle;
  title: string;
  content: string;
  unlockConditions: {
    artifactLevel?: number;
    experienceThreshold?: number;
    routeCompletions?: number;
    otherArtifacts?: string[];
    timeWithArtifact?: number; // milliseconds
    usageCount?: number;
  };
  metadata: {
    author?: string;
    timestamp?: string;
    location?: string;
    discoveryMethod?: string;
    significance: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface ArtifactVision {
  id: string;
  artifactId: string;
  triggerConditions: {
    quantumResonance?: number;
    playerStress?: number;
    timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
    roomType?: string;
    otherArtifactsPresent?: string[];
  };
  visionType: 'memory' | 'prophecy' | 'echo' | 'warning' | 'guidance';
  intensity: number; // 1-10, affects visual presentation
  duration: number; // milliseconds
  content: {
    narrative: string;
    imagery?: string[];
    emotions?: string[];
    symbols?: string[];
  };
  aftermath: {
    experienceGain?: number;
    stressChange?: number;
    artifactBondIncrease?: number;
    unlockedLore?: string[];
  };
  metadata?: {
    timestamp?: number;
    triggeredBy?: string;
    location?: string;
  };
}

export interface ArtifactBond {
  artifactId: string;
  playerId: string;
  bondLevel: number; // 0-100
  bondType: 'resonance' | 'mastery' | 'symbiosis' | 'transcendence';
  formationTime: number;
  lastInteraction: number;
  experiences: {
    discoveries: number;
    visions: number;
    combatUses: number;
    explorationTime: number;
    emergencyActivations: number;
  };
  personality?: {
    communicative: number; // How much the artifact "talks"
    protective: number;    // How much it protects the player
    autonomous: number;    // How much it acts independently
    mysterious: number;    // How cryptic its communications are
  };
}

export interface ArtifactCommunication {
  id: string;
  artifactId: string;
  bondLevel: number;
  communicationType: 'whisper' | 'feeling' | 'vision' | 'symbol' | 'direct';
  message: string;
  context: {
    trigger: 'discovery' | 'danger' | 'puzzle' | 'milestone' | 'random';
    playerState: 'calm' | 'stressed' | 'curious' | 'afraid' | 'excited';
    situation: string;
  };
  response?: {
    playerReaction: 'positive' | 'negative' | 'neutral' | 'confused';
    bondChange: number;
    followupActions?: string[];
  };
}

// Discovery Narrative Types
export interface DiscoveryNarrative {
  id: string;
  artifactId: string;
  routeId?: RouteId;
  circumstance: 'exploration' | 'combat' | 'puzzle' | 'social' | 'meditation' | 'accident';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  preDiscoveryHints?: string[];
  discoveryMoment: {
    description: string;
    playerActions: string[];
    environmentalFactors: string[];
    quantumSignatures: string[];
  };
  firstContact: {
    initialReaction: string;
    artifactBehavior: string;
    immediateEffects: string[];
    playerThoughts: string;
  };
  integration: {
    learningProcess: string;
    challenges: string[];
    breakthroughs: string[];
    mastery: string;
  };
}

// Artifact Evolution Types
export interface ArtifactEvolution {
  artifactId: string;
  fromTier: string;
  toTier: string;
  evolutionTrigger: 'experience' | 'resonance' | 'synthesis' | 'transcendence';
  requirements: {
    bondLevel?: number;
    experiencePoints?: number;
    otherArtifacts?: string[];
    specificActions?: string[];
    timeThreshold?: number;
  };
  evolutionProcess: {
    phases: {
      name: string;
      description: string;
      duration: number;
      effects: string[];
    }[];
    finalTransformation: string;
    newAbilities: string[];
    personalityChanges?: string[];
  };
  consequences: {
    playerImpact: string[];
    worldImpact: string[];
    relationshipChanges: string[];
  };
}

// Synthesis and Interaction Types
export interface ArtifactSynthesis {
  id: string;
  primaryArtifact: string;
  secondaryArtifacts: string[];
  synthesisType: 'temporary' | 'permanent' | 'conditional';
  conditions: {
    bondLevels: { [artifactId: string]: number };
    quantumAlignment: QuantumElement[];
    environmentalFactors: string[];
    playerState: string[];
  };
  process: {
    initiation: string;
    phases: string[];
    completion: string;
    duration: number;
  };
  results: {
    newArtifact?: string;
    enhancedAbilities: string[];
    combinedPersonality?: string;
    specialProperties: string[];
  };
  risks: {
    failureChance: number;
    failureConsequences: string[];
    irreversibleChanges: string[];
  };
}

// Archive and Repository Types
export interface ArtifactArchive {
  playerId: string;
  unlockedLore: Map<string, ArtifactLoreEntry>;
  discoveredNarratives: Map<string, DiscoveryNarrative>;
  experiencedVisions: ArtifactVision[];
  artifactBonds: Map<string, ArtifactBond>;
  communications: ArtifactCommunication[];
  evolutionHistory: ArtifactEvolution[];
  synthesisAttempts: ArtifactSynthesis[];
  personalNotes: {
    [artifactId: string]: string[];
  };
  researchProgress: {
    [topic: string]: {
      progress: number;
      discoveries: string[];
      theories: string[];
    };
  };
}

// Presentation and UI Types
export interface LorePresentation {
  entryId: string;
  presentationStyle: 'scroll' | 'book' | 'hologram' | 'vision' | 'whisper';
  backgroundMusic?: string;
  visualEffects?: string[];
  interactiveElements?: {
    type: 'choice' | 'puzzle' | 'meditation' | 'experiment';
    content: any;
  };
  unlockRewards?: {
    experience: number;
    bondIncrease: number;
    newResearchTopics: string[];
  };
}

export interface ArtifactJournal {
  playerId: string;
  entries: {
    timestamp: number;
    artifactId: string;
    entryType: 'discovery' | 'vision' | 'communication' | 'evolution' | 'synthesis' | 'research';
    title: string;
    content: string;
    attachments?: {
      images?: string[];
      recordings?: string[];
      measurements?: any;
    };
    tags: string[];
    mood: 'excited' | 'curious' | 'concerned' | 'awed' | 'confused' | 'determined';
  }[];
  bookmarks: string[];
  researchQueries: string[];
}

// Configuration Types
export interface ArtifactArcConfig {
  enabled: boolean;
  loreUnlockRate: number;
  visionFrequency: number;
  bondingSpeed: number;
  communicationChance: number;
  evolutionEnabled: boolean;
  synthesisEnabled: boolean;
  personalityDevelopment: boolean;
  narrativeDepth: 'minimal' | 'standard' | 'rich' | 'immersive';
  playerChoiceImpact: boolean;
}

// Event Types
export interface ArtifactArcEvent {
  type: 'lore_unlocked' | 'vision_triggered' | 'bond_strengthened' | 'communication' | 'evolution_began' | 'synthesis_completed';
  artifactId: string;
  timestamp: number;
  details: {
    loreEntryId?: string;
    visionId?: string;
    bondIncrease?: number;
    communicationId?: string;
    evolutionStage?: string;
    synthesisResult?: string;
  };
  playerResponse?: 'accepted' | 'rejected' | 'deferred' | 'explored';
}
