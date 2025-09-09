/**
 * Quantum Magic Types
 * Defines the quantum magic system with artifacts, skills, and progression
 */

// Base quantum elements
export type QuantumElement = 'void' | 'flux' | 'resonance' | 'entropy' | 'nexus';

// Artifact tiers based on route difficulty and length
export type ArtifactTier = 'shard' | 'relic' | 'nexus' | 'legendary';

// Skill categories for progression trees
export type SkillCategory = 'manipulation' | 'perception' | 'protection' | 'traversal' | 'mastery';

// Artifact interface
export interface QuantumArtifact {
  id: string;
  name: string;
  tier: ArtifactTier;
  element: QuantumElement;
  description: string;
  lore: string;
  discoveryLocation?: string; // Node ID where discovered
  discoveryRoute?: string; // Route ID where first found

  // Mechanical effects
  effects: ArtifactEffect[];
  requirements?: SkillRequirement[];
  synergies?: string[]; // Other artifact IDs that enhance this one

  // Progression data
  experience: number;
  level: number;
  maxLevel: number;
  isActive: boolean;
}

export interface ArtifactEffect {
  type: 'skill_unlock' | 'ability_enhance' | 'resistance' | 'detection' | 'traversal';
  target: string; // Skill ID, ability name, or system affected
  value: number | string;
  description: string;
}

// Skill system
export interface QuantumSkill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  element: QuantumElement;

  // Progression
  currentLevel: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;

  // Requirements and unlocks
  requirements: SkillRequirement[];
  unlockedBy: string[]; // Artifact IDs that can unlock this skill
  unlocks: string[]; // Skill IDs this unlocks

  // Effects at current level
  effects: SkillEffect[];

  // Route availability
  availableInRoutes: ('demo' | 'short10' | 'short30' | 'full')[];
}

export interface SkillRequirement {
  type: 'artifact' | 'skill' | 'route_completion' | 'discovery';
  target: string; // ID of required item/skill/route
  level?: number; // Minimum level if applicable
}

export interface SkillEffect {
  type: 'puzzle_hint' | 'combat_bonus' | 'detection_range' | 'skip_unlock' | 'fast_travel';
  description: string;
  value: number | string;
  conditions?: string[]; // When this effect applies
}

// Player progression state
export interface QuantumProgression {
  playerId: string;
  totalExperience: number;
  quantumLevel: number; // Overall mastery level

  // Collections
  artifacts: Map<string, QuantumArtifact>;
  skills: Map<string, QuantumSkill>;
  discoveries: string[]; // Discovered location/lore IDs

  // Route-specific progression
  routeCompletions: {
    demo: number;
    short10: string[]; // Completed route IDs
    short30: string[]; // Completed route IDs
    full: number;
  };

  // Active loadout for current adventure
  activeArtifacts: string[]; // Max 3 active at once

  // Preferences
  preferredElement: QuantumElement;
  autoActivateNewArtifacts: boolean;
}

// Discovery events
export interface QuantumDiscovery {
  id: string;
  type: 'artifact' | 'lore' | 'skill_unlock' | 'synergy';
  routeId: string;
  nodeId: string;
  timestamp: number;

  // What was discovered
  artifactId?: string;
  skillId?: string;
  loreText?: string;
  synergyPartners?: string[]; // Artifact IDs

  // Presentation
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  element: QuantumElement;
}

// Experience gain sources
export interface ExperienceGain {
  source: 'puzzle_solved' | 'combat_won' | 'discovery' | 'route_completed' | 'synergy_activated';
  amount: number;
  multiplier?: number; // From artifacts/skills
  artifactId?: string; // Which artifact gains XP
  skillIds?: string[]; // Which skills gain XP
}

// Magic system integration with existing game
export interface QuantumGameState {
  progression: QuantumProgression;
  currentRoute?: string;
  currentNode?: string;

  // Active effects affecting gameplay
  activePuzzleHints: string[];
  activeCombatBonuses: SkillEffect[];
  activeDetectionBoosts: SkillEffect[];
  availableSkips: number; // Modified by progression

  // Discovery state
  pendingDiscoveries: QuantumDiscovery[];
  discoverySequence: number; // For unique discovery ordering
}
