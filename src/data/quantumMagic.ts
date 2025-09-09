/**
 * Quantum Magic Data
 * Defines all artifacts, skills, and their relationships
 */

import {
  type QuantumArtifact,
  type QuantumSkill,
  type ArtifactTier,
  type QuantumElement,
  type SkillCategory,
} from '../types/quantumMagic';

// Artifact definitions by tier and element
export const quantumArtifacts: Record<string, QuantumArtifact> = {
  // SHARD TIER - Found in Demo and Short routes
  void_fragment: {
    id: 'void_fragment',
    name: 'Void Fragment',
    tier: 'shard',
    element: 'void',
    description: 'A small shard that seems to absorb light around its edges.',
    lore: 'These fragments are remnants of the original quantum breach. Each one holds a whisper of the void between realities.',
    effects: [
      {
        type: 'skill_unlock',
        target: 'shadow_sight',
        value: 1,
        description: 'Unlocks basic shadow detection abilities',
      },
    ],
    experience: 0,
    level: 1,
    maxLevel: 3,
    isActive: false,
  },

  flux_crystal: {
    id: 'flux_crystal',
    name: 'Flux Crystal',
    tier: 'shard',
    element: 'flux',
    description: 'A crystalline structure that pulses with unstable energy.',
    lore: 'Flux crystals form where quantum instabilities create temporary pockets of pure possibility.',
    effects: [
      {
        type: 'ability_enhance',
        target: 'puzzle_solving',
        value: 10,
        description: 'Provides hints for logic puzzles',
      },
    ],
    experience: 0,
    level: 1,
    maxLevel: 3,
    isActive: false,
  },

  resonance_tuner: {
    id: 'resonance_tuner',
    name: 'Resonance Tuner',
    tier: 'shard',
    element: 'resonance',
    description: 'A small device that hums when near other quantum artifacts.',
    lore: 'Created by early quantum researchers to detect resonant frequencies between artifacts.',
    effects: [
      {
        type: 'detection',
        target: 'artifacts',
        value: 'nearby',
        description: 'Reveals nearby hidden artifacts and quantum signatures',
      },
    ],
    experience: 0,
    level: 1,
    maxLevel: 3,
    isActive: false,
  },

  // RELIC TIER - Found in 30-minute routes and rare 10-minute discoveries
  entropy_lens: {
    id: 'entropy_lens',
    name: 'Entropy Lens',
    tier: 'relic',
    element: 'entropy',
    description: 'A lens that reveals the decay patterns of reality itself.',
    lore: 'Through this lens, one can see how the fabric of existence frays and reforms. Master researchers used these to map quantum instabilities.',
    effects: [
      {
        type: 'skill_unlock',
        target: 'temporal_perception',
        value: 1,
        description: 'Unlocks ability to perceive temporal anomalies',
      },
      {
        type: 'ability_enhance',
        target: 'combat_strategy',
        value: 20,
        description: 'Predicts enemy movement patterns',
      },
    ],
    requirements: [
      {
        type: 'skill',
        target: 'shadow_sight',
        level: 2,
      },
    ],
    synergies: ['void_fragment'],
    experience: 0,
    level: 1,
    maxLevel: 5,
    isActive: false,
  },

  nexus_stabilizer: {
    id: 'nexus_stabilizer',
    name: 'Nexus Stabilizer',
    tier: 'relic',
    element: 'nexus',
    description: 'A complex device that can temporarily stabilize quantum fluctuations.',
    lore: 'The pinnacle of pre-breach technology, these devices were meant to prevent the quantum catastrophe. Ironically, they now help navigate its aftermath.',
    effects: [
      {
        type: 'traversal',
        target: 'fast_travel',
        value: 'enabled',
        description: 'Enables fast travel between discovered locations',
      },
      {
        type: 'skill_unlock',
        target: 'quantum_mastery',
        value: 1,
        description: 'Unlocks advanced quantum manipulation',
      },
    ],
    requirements: [
      {
        type: 'route_completion',
        target: 'short30',
        level: 1,
      },
    ],
    synergies: ['flux_crystal', 'resonance_tuner'],
    experience: 0,
    level: 1,
    maxLevel: 5,
    isActive: false,
  },

  // NEXUS TIER - Found in full game with special discovery conditions
  reality_anchor: {
    id: 'reality_anchor',
    name: 'Reality Anchor',
    tier: 'nexus',
    element: 'nexus',
    description: 'A massive artifact that seems to hold reality itself in place.',
    lore: 'These anchors were the last desperate attempt to prevent the breach. Though they failed in their original purpose, they now serve as beacons of stability in an chaotic quantum landscape.',
    effects: [
      {
        type: 'ability_enhance',
        target: 'all_skills',
        value: 25,
        description: 'Enhances all quantum abilities significantly',
      },
      {
        type: 'resistance',
        target: 'quantum_interference',
        value: 80,
        description: 'Provides strong resistance to hostile quantum effects',
      },
    ],
    requirements: [
      {
        type: 'artifact',
        target: 'nexus_stabilizer',
        level: 3,
      },
      {
        type: 'route_completion',
        target: 'full',
        level: 1,
      },
    ],
    synergies: ['entropy_lens', 'nexus_stabilizer'],
    experience: 0,
    level: 1,
    maxLevel: 7,
    isActive: false,
  },

  // LEGENDARY TIER - Ultimate discoveries requiring deep progression
  quantum_core: {
    id: 'quantum_core',
    name: 'Quantum Core',
    tier: 'legendary',
    element: 'void',
    description: 'The heart of quantum power itself, pulsing with infinite possibility.',
    lore: 'Legends speak of cores that existed before the breach, seeds of pure quantum potential. This may be a fragment of the original quantum engine that started it all.',
    effects: [
      {
        type: 'skill_unlock',
        target: 'reality_manipulation',
        value: 1,
        description: 'Unlocks the ultimate quantum mastery skills',
      },
      {
        type: 'ability_enhance',
        target: 'discovery_rate',
        value: 100,
        description: 'Dramatically increases discovery chances',
      },
    ],
    requirements: [
      {
        type: 'artifact',
        target: 'reality_anchor',
        level: 5,
      },
      {
        type: 'discovery',
        target: 'all_quantum_lore',
        level: 1,
      },
    ],
    synergies: ['void_fragment', 'entropy_lens', 'reality_anchor'],
    experience: 0,
    level: 1,
    maxLevel: 10,
    isActive: false,
  },
};

// Skill tree definitions
export const quantumSkills: Record<string, QuantumSkill> = {
  // PERCEPTION SKILLS
  shadow_sight: {
    id: 'shadow_sight',
    name: 'Shadow Sight',
    category: 'perception',
    description: 'Ability to perceive quantum shadows and hidden pathways.',
    element: 'void',
    currentLevel: 0,
    maxLevel: 5,
    experience: 0,
    experienceToNext: 100,
    requirements: [
      {
        type: 'artifact',
        target: 'void_fragment',
      },
    ],
    unlockedBy: ['void_fragment'],
    unlocks: ['temporal_perception'],
    effects: [
      {
        type: 'detection_range',
        description: 'Reveals hidden passages and quantum anomalies',
        value: 20,
        conditions: ['in_dark_areas'],
      },
    ],
    availableInRoutes: ['demo', 'short10', 'short30', 'full'],
  },

  temporal_perception: {
    id: 'temporal_perception',
    name: 'Temporal Perception',
    category: 'perception',
    description: 'Enhanced awareness of temporal flows and quantum time distortions.',
    element: 'entropy',
    currentLevel: 0,
    maxLevel: 7,
    experience: 0,
    experienceToNext: 250,
    requirements: [
      {
        type: 'skill',
        target: 'shadow_sight',
        level: 2,
      },
      {
        type: 'artifact',
        target: 'entropy_lens',
      },
    ],
    unlockedBy: ['entropy_lens'],
    unlocks: ['quantum_mastery'],
    effects: [
      {
        type: 'puzzle_hint',
        description: 'Provides advanced timing-based puzzle hints',
        value: 15,
        conditions: ['time_pressure'],
      },
    ],
    availableInRoutes: ['short30', 'full'],
  },

  // MANIPULATION SKILLS
  quantum_mastery: {
    id: 'quantum_mastery',
    name: 'Quantum Mastery',
    category: 'mastery',
    description: 'Advanced control over quantum forces and reality manipulation.',
    element: 'nexus',
    currentLevel: 0,
    maxLevel: 10,
    experience: 0,
    experienceToNext: 500,
    requirements: [
      {
        type: 'skill',
        target: 'temporal_perception',
        level: 3,
      },
      {
        type: 'artifact',
        target: 'nexus_stabilizer',
      },
    ],
    unlockedBy: ['nexus_stabilizer'],
    unlocks: ['reality_manipulation'],
    effects: [
      {
        type: 'skip_unlock',
        description: 'Grants additional skip opportunities',
        value: 1,
        conditions: ['quantum_puzzle'],
      },
      {
        type: 'fast_travel',
        description: 'Enables quantum tunneling between locations',
        value: 'unlimited',
        conditions: ['stabilizer_active'],
      },
    ],
    availableInRoutes: ['full'],
  },

  reality_manipulation: {
    id: 'reality_manipulation',
    name: 'Reality Manipulation',
    category: 'mastery',
    description: 'The ultimate quantum skill - direct manipulation of reality itself.',
    element: 'void',
    currentLevel: 0,
    maxLevel: 15,
    experience: 0,
    experienceToNext: 1000,
    requirements: [
      {
        type: 'skill',
        target: 'quantum_mastery',
        level: 5,
      },
      {
        type: 'artifact',
        target: 'quantum_core',
      },
    ],
    unlockedBy: ['quantum_core'],
    unlocks: [],
    effects: [
      {
        type: 'puzzle_hint',
        description: 'Can bypass most puzzle mechanics',
        value: 90,
        conditions: ['reality_unstable'],
      },
      {
        type: 'combat_bonus',
        description: 'Overwhelming advantage in quantum combat',
        value: 50,
        conditions: ['quantum_entities'],
      },
    ],
    availableInRoutes: ['full'],
  },
};

// Discovery progression data - which artifacts/skills are available in which routes
export const routeDiscoveryPools = {
  demo: {
    guaranteedArtifacts: ['void_fragment'],
    possibleArtifacts: ['flux_crystal'],
    maxDiscoveries: 2,
    experienceMultiplier: 1.5, // Bonus for new players
  },

  short10: {
    guaranteedArtifacts: [],
    possibleArtifacts: ['void_fragment', 'flux_crystal', 'resonance_tuner'],
    rareArtifacts: ['entropy_lens'], // 10% chance
    maxDiscoveries: 3,
    experienceMultiplier: 1.2,
  },

  short30: {
    guaranteedArtifacts: ['entropy_lens'], // One guaranteed relic
    possibleArtifacts: ['void_fragment', 'flux_crystal', 'resonance_tuner', 'nexus_stabilizer'],
    rareArtifacts: ['reality_anchor'], // 5% chance
    maxDiscoveries: 4,
    experienceMultiplier: 1.0,
  },

  full: {
    guaranteedArtifacts: ['reality_anchor'],
    possibleArtifacts: Object.keys(quantumArtifacts),
    legendaryArtifacts: ['quantum_core'], // Special discovery conditions
    maxDiscoveries: 10,
    experienceMultiplier: 1.0,
  },
};

// Experience values for different activities
export const experienceValues = {
  puzzleSolved: {
    easy: 50,
    medium: 100,
    hard: 200,
    expert: 350,
  },

  combatWon: {
    easy: 75,
    medium: 150,
    hard: 300,
    expert: 500,
  },

  discovery: {
    artifact: 200,
    lore: 50,
    synergy: 300,
    location: 100,
  },

  routeCompleted: {
    demo: 300,
    short10: 500,
    short30: 1000,
    full: 2500,
  },
};

// Helper functions for progression calculation
export function calculateQuantumLevel(totalExperience: number): number {
  // Exponential scaling: level = floor(sqrt(totalExp / 100))
  return Math.floor(Math.sqrt(totalExperience / 100));
}

export function getExperienceForLevel(level: number): number {
  return level * level * 100;
}

export function getArtifactsByTier(tier: ArtifactTier): QuantumArtifact[] {
  return Object.values(quantumArtifacts).filter((artifact) => artifact.tier === tier);
}

export function getSkillsByCategory(category: SkillCategory): QuantumSkill[] {
  return Object.values(quantumSkills).filter((skill) => skill.category === category);
}

export function getSkillsByElement(element: QuantumElement): QuantumSkill[] {
  return Object.values(quantumSkills).filter((skill) => skill.element === element);
}
