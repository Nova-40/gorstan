/**
 * Shadow Encounters Data
 * Definitions for shadow entities, abilities, and encounter configurations
 */

import { 
  type ShadowEntity, 
  type ShadowAbility, 
  type ShadowSystemConfig,
  type RouteSpecificShadowConfig,
  type EncounterDifficulty,
  type QuantumShadowEffect
} from '../types/shadowEncounters';

// Shadow Ability Definitions
export const SHADOW_ABILITIES: Record<string, ShadowAbility> = {
  // Whisper abilities (weak shadows)
  whisper_fade: {
    id: 'whisper_fade',
    name: 'Ethereal Fade',
    description: 'Becomes nearly invisible, harder to detect',
    energyCost: 10,
    cooldown: 15000,
    effect: {
      type: 'phase',
      duration: 8000,
      intensity: 70,
      target: 'self'
    }
  },

  whisper_echo: {
    id: 'whisper_echo',
    name: 'Memory Echo',
    description: 'Repeats the player\'s last action as a ghostly echo',
    energyCost: 15,
    cooldown: 20000,
    effect: {
      type: 'mimic',
      duration: 5000,
      intensity: 30,
      target: 'player'
    }
  },

  // Wraith abilities (medium shadows)
  wraith_drain: {
    id: 'wraith_drain',
    name: 'Energy Siphon',
    description: 'Slowly drains player focus and quantum artifact energy',
    energyCost: 25,
    cooldown: 30000,
    effect: {
      type: 'drain',
      duration: 15000,
      intensity: 45,
      target: 'artifacts'
    }
  },

  wraith_phase: {
    id: 'wraith_phase',
    name: 'Phase Walk',
    description: 'Moves through walls and objects',
    energyCost: 20,
    cooldown: 25000,
    effect: {
      type: 'teleport',
      duration: 3000,
      intensity: 60,
      target: 'self'
    }
  },

  // Shade abilities (strong shadows)
  shade_manifest: {
    id: 'shade_manifest',
    name: 'Solid Manifestation',
    description: 'Becomes fully physical, can manipulate environment',
    energyCost: 40,
    cooldown: 45000,
    effect: {
      type: 'corrupt',
      duration: 20000,
      intensity: 75,
      target: 'environment'
    }
  },

  shade_multiply: {
    id: 'shade_multiply',
    name: 'Shadow Split',
    description: 'Creates multiple shadow copies',
    energyCost: 50,
    cooldown: 60000,
    effect: {
      type: 'multiply',
      duration: 25000,
      intensity: 80,
      target: 'self'
    }
  },

  // Umbral abilities (elite shadows)
  umbral_silence: {
    id: 'umbral_silence',
    name: 'Void Silence',
    description: 'Suppresses all sound and quantum resonance in area',
    energyCost: 60,
    cooldown: 75000,
    effect: {
      type: 'silence',
      duration: 30000,
      intensity: 90,
      target: 'environment'
    }
  },

  umbral_corrupt: {
    id: 'umbral_corrupt',
    name: 'Reality Corruption',
    description: 'Warps the environment, making navigation difficult',
    energyCost: 70,
    cooldown: 90000,
    effect: {
      type: 'corrupt',
      duration: 40000,
      intensity: 95,
      target: 'environment'
    }
  },

  // Void Spawn abilities (legendary shadows)
  void_spawn_reality_tear: {
    id: 'void_spawn_reality_tear',
    name: 'Reality Tear',
    description: 'Creates rifts in space-time, unpredictable effects',
    energyCost: 100,
    cooldown: 120000,
    effect: {
      type: 'corrupt',
      duration: 60000,
      intensity: 100,
      target: 'environment'
    }
  }
};

// Shadow Entity Definitions
export const SHADOW_ENTITIES: Record<string, ShadowEntity> = {
  // Whisper Entities (Tier 1)
  memory_whisper: {
    id: 'memory_whisper',
    type: 'whisper',
    name: 'Memory Whisper',
    description: 'A faint echo of forgotten moments, barely visible in peripheral vision',
    stats: {
      health: 25,
      maxHealth: 25,
      energy: 50,
      maxEnergy: 50,
      manifestation: 15,
      aggression: 10,
      awareness: 30,
      speed: 40
    },
    behavior: 'curious',
    weaknesses: ['light', 'sound', 'movement'],
    abilities: ['whisper_fade', 'whisper_echo'],
    spawnConditions: {
      timeInRoom: 30000, // 30 seconds
      playerActions: ['look', 'examine', 'think'],
      quantumLevel: 0
    },
    manifestationTriggers: {
      timeThreshold: 45000,
      playerStress: false
    },
    rewards: {
      experience: 25,
      quantumElement: 'void'
    }
  },

  lost_whisper: {
    id: 'lost_whisper',
    type: 'whisper',
    name: 'Lost Whisper',
    description: 'The remnant of a conversation that never finished',
    stats: {
      health: 30,
      maxHealth: 30,
      energy: 60,
      maxEnergy: 60,
      manifestation: 20,
      aggression: 5,
      awareness: 25,
      speed: 35
    },
    behavior: 'passive',
    weaknesses: ['light', 'time', 'resonance'],
    abilities: ['whisper_echo'],
    spawnConditions: {
      timeInRoom: 60000,
      playerActions: ['say', 'tell', 'ask'],
      quantumLevel: 0
    },
    manifestationTriggers: {
      timeThreshold: 90000
    },
    rewards: {
      experience: 20
    }
  },

  // Wraith Entities (Tier 2)
  wandering_wraith: {
    id: 'wandering_wraith',
    type: 'wraith',
    name: 'Wandering Wraith',
    description: 'A restless spirit that phases in and out of reality',
    stats: {
      health: 75,
      maxHealth: 75,
      energy: 100,
      maxEnergy: 100,
      manifestation: 45,
      aggression: 30,
      awareness: 50,
      speed: 60
    },
    behavior: 'curious',
    weaknesses: ['quantum', 'artifacts', 'resonance'],
    abilities: ['wraith_phase', 'wraith_drain'],
    spawnConditions: {
      timeInRoom: 120000,
      quantumLevel: 2,
      artifactPresence: ['void_fragment', 'flux_crystal']
    },
    manifestationTriggers: {
      quantumActivity: true,
      playerStress: true
    },
    rewards: {
      experience: 60,
      quantumElement: 'flux',
      artifactDiscoveryBonus: 10
    }
  },

  echo_wraith: {
    id: 'echo_wraith',
    type: 'wraith',
    name: 'Echo Wraith',
    description: 'Mirrors the player\'s actions with spectral precision',
    stats: {
      health: 60,
      maxHealth: 60,
      energy: 120,
      maxEnergy: 120,
      manifestation: 50,
      aggression: 20,
      awareness: 70,
      speed: 55
    },
    behavior: 'mimic',
    weaknesses: ['movement', 'artifacts'],
    abilities: ['wraith_drain', 'whisper_echo'],
    spawnConditions: {
      timeInRoom: 90000,
      playerActions: ['move', 'go', 'walk'],
      quantumLevel: 1
    },
    manifestationTriggers: {
      playerStress: true
    },
    rewards: {
      experience: 50,
      quantumElement: 'resonance'
    }
  },

  // Shade Entities (Tier 3)
  territorial_shade: {
    id: 'territorial_shade',
    type: 'shade',
    name: 'Territorial Shade',
    description: 'A powerful shadow that claims dominion over specific locations',
    stats: {
      health: 150,
      maxHealth: 150,
      energy: 180,
      maxEnergy: 180,
      manifestation: 75,
      aggression: 60,
      awareness: 80,
      speed: 45
    },
    behavior: 'territorial',
    weaknesses: ['light', 'quantum'],
    abilities: ['shade_manifest', 'wraith_drain'],
    spawnConditions: {
      timeInRoom: 300000, // 5 minutes
      quantumLevel: 5,
      routeSpecific: ['short30_mystery', 'short30_puzzle', 'full']
    },
    manifestationTriggers: {
      timeThreshold: 180000,
      quantumActivity: true,
      lowLight: true
    },
    rewards: {
      experience: 120,
      quantumElement: 'entropy',
      artifactDiscoveryBonus: 25
    }
  },

  collective_shade: {
    id: 'collective_shade',
    type: 'shade',
    name: 'Collective Shade',
    description: 'Multiple shadow fragments acting as one consciousness',
    stats: {
      health: 200,
      maxHealth: 200,
      energy: 150,
      maxEnergy: 150,
      manifestation: 60,
      aggression: 45,
      awareness: 90,
      speed: 70
    },
    behavior: 'collective',
    weaknesses: ['resonance', 'artifacts'],
    abilities: ['shade_multiply', 'wraith_phase'],
    spawnConditions: {
      timeInRoom: 240000,
      quantumLevel: 4,
      artifactPresence: ['resonance_tuner', 'entropy_lens']
    },
    manifestationTriggers: {
      quantumActivity: true,
      playerStress: true
    },
    rewards: {
      experience: 100,
      quantumElement: 'nexus',
      artifactDiscoveryBonus: 20
    }
  },

  // Umbral Entities (Tier 4)
  void_umbral: {
    id: 'void_umbral',
    type: 'umbral',
    name: 'Void Umbral',
    description: 'An elite shadow entity from the spaces between realities',
    stats: {
      health: 300,
      maxHealth: 300,
      energy: 250,
      maxEnergy: 250,
      manifestation: 90,
      aggression: 80,
      awareness: 95,
      speed: 80
    },
    behavior: 'aggressive',
    weaknesses: ['artifacts'],
    abilities: ['umbral_silence', 'shade_manifest', 'wraith_drain'],
    spawnConditions: {
      timeInRoom: 600000, // 10 minutes
      quantumLevel: 8,
      artifactPresence: ['nexus_stabilizer', 'reality_anchor'],
      routeSpecific: ['full']
    },
    manifestationTriggers: {
      quantumActivity: true,
      lowLight: true,
      playerStress: true
    },
    rewards: {
      experience: 250,
      quantumElement: 'void',
      artifactDiscoveryBonus: 50
    }
  },

  // Void Spawn Entities (Tier 5)
  primordial_void_spawn: {
    id: 'primordial_void_spawn',
    type: 'void_spawn',
    name: 'Primordial Void Spawn',
    description: 'An ancient shadow entity from the dawn of darkness itself',
    stats: {
      health: 500,
      maxHealth: 500,
      energy: 400,
      maxEnergy: 400,
      manifestation: 100,
      aggression: 95,
      awareness: 100,
      speed: 60
    },
    behavior: 'phase',
    weaknesses: ['artifacts', 'quantum'],
    abilities: ['void_spawn_reality_tear', 'umbral_corrupt', 'shade_multiply'],
    spawnConditions: {
      timeInRoom: 1200000, // 20 minutes
      quantumLevel: 15,
      artifactPresence: ['quantum_core'],
      routeSpecific: ['full']
    },
    manifestationTriggers: {
      quantumActivity: true,
      lowLight: true,
      playerStress: true,
      timeThreshold: 900000
    },
    rewards: {
      experience: 500,
      quantumElement: 'nexus',
      artifactDiscoveryBonus: 100
    }
  }
};

// Default Shadow System Configuration
export const DEFAULT_SHADOW_CONFIG: ShadowSystemConfig = {
  enabled: true,
  spawnRate: 0.1, // 10% chance per minute
  maxEntitiesPerRoom: 2,
  difficultyScaling: true,
  quantumIntegration: true,
  adaptiveDifficulty: true,
  fearSystem: true,
  persistentEncounters: true,
  encounterTimeout: 300000 // 5 minutes
};

// Route-Specific Shadow Configurations
export const ROUTE_SHADOW_CONFIGS: RouteSpecificShadowConfig[] = [
  {
    routeId: 'demo',
    allowedEntityTypes: ['whisper'],
    spawnRateModifier: 1.5, // More frequent for learning
    difficultyModifier: 0.7, // Easier encounters
    specialConditions: {
      timeBasedSpawns: true,
      progressionGated: false,
      quantumRequired: false
    }
  },
  {
    routeId: 'short10_adventure',
    allowedEntityTypes: ['whisper', 'wraith'],
    spawnRateModifier: 1.2,
    difficultyModifier: 0.9,
    specialConditions: {
      timeBasedSpawns: true,
      quantumRequired: false
    }
  },
  {
    routeId: 'short10_mystery',
    allowedEntityTypes: ['whisper', 'wraith'],
    spawnRateModifier: 1.0,
    difficultyModifier: 1.0,
    specialConditions: {
      timeBasedSpawns: true,
      quantumRequired: true
    }
  },
  {
    routeId: 'short30_adventure',
    allowedEntityTypes: ['whisper', 'wraith', 'shade'],
    spawnRateModifier: 1.1,
    difficultyModifier: 1.1,
    specialConditions: {
      timeBasedSpawns: true,
      progressionGated: true,
      quantumRequired: true
    }
  },
  {
    routeId: 'short30_mystery',
    allowedEntityTypes: ['whisper', 'wraith', 'shade'],
    spawnRateModifier: 0.9,
    difficultyModifier: 1.2,
    specialConditions: {
      timeBasedSpawns: true,
      progressionGated: true,
      quantumRequired: true
    }
  },
  {
    routeId: 'short30_puzzle',
    allowedEntityTypes: ['wraith', 'shade'],
    spawnRateModifier: 0.8,
    difficultyModifier: 1.3,
    specialConditions: {
      timeBasedSpawns: false,
      progressionGated: true,
      quantumRequired: true
    }
  },
  {
    routeId: 'full',
    allowedEntityTypes: ['whisper', 'wraith', 'shade', 'umbral', 'void_spawn'],
    spawnRateModifier: 1.0,
    difficultyModifier: 1.0,
    specialConditions: {
      timeBasedSpawns: true,
      progressionGated: true,
      quantumRequired: true
    }
  }
];

// Difficulty Scaling Configurations
export const DIFFICULTY_CONFIGS: Record<string, EncounterDifficulty> = {
  beginner: {
    baseSpawnRate: 0.05,
    difficultyMultiplier: 0.6,
    maxConcurrentEncounters: 1,
    stressDecayRate: 2.0,
    quantumInterference: 0.8
  },
  normal: {
    baseSpawnRate: 0.1,
    difficultyMultiplier: 1.0,
    maxConcurrentEncounters: 2,
    stressDecayRate: 1.0,
    quantumInterference: 1.0
  },
  challenging: {
    baseSpawnRate: 0.15,
    difficultyMultiplier: 1.4,
    maxConcurrentEncounters: 3,
    stressDecayRate: 0.7,
    quantumInterference: 1.2
  },
  expert: {
    baseSpawnRate: 0.2,
    difficultyMultiplier: 1.8,
    maxConcurrentEncounters: 4,
    stressDecayRate: 0.5,
    quantumInterference: 1.5
  }
};

// Quantum Artifact Effects on Shadows
export const QUANTUM_SHADOW_EFFECTS: Record<string, QuantumShadowEffect> = {
  void_fragment_repel: {
    artifactId: 'void_fragment',
    effectType: 'repel',
    effectiveness: 30,
    duration: 15000,
    energyCost: 10,
    description: 'Creates a small void field that makes shadows uncomfortable'
  },
  flux_crystal_reveal: {
    artifactId: 'flux_crystal',
    effectType: 'reveal',
    effectiveness: 50,
    duration: 20000,
    energyCost: 15,
    description: 'Flux energy illuminates hidden shadow entities'
  },
  resonance_tuner_communicate: {
    artifactId: 'resonance_tuner',
    effectType: 'communicate',
    effectiveness: 60,
    duration: 30000,
    energyCost: 20,
    description: 'Enables limited communication with shadow entities'
  },
  entropy_lens_study: {
    artifactId: 'entropy_lens',
    effectType: 'study',
    effectiveness: 70,
    duration: 25000,
    energyCost: 25,
    description: 'Reveals shadow weaknesses and behavioral patterns'
  },
  nexus_stabilizer_weaken: {
    artifactId: 'nexus_stabilizer',
    effectType: 'weaken',
    effectiveness: 80,
    duration: 40000,
    energyCost: 35,
    description: 'Disrupts shadow manifestation and reduces their power'
  },
  reality_anchor_banish: {
    artifactId: 'reality_anchor',
    effectType: 'banish',
    effectiveness: 90,
    duration: 60000,
    energyCost: 50,
    description: 'Anchors reality, making it impossible for shadows to manifest'
  },
  quantum_core_banish: {
    artifactId: 'quantum_core',
    effectType: 'banish',
    effectiveness: 100,
    duration: 120000,
    energyCost: 75,
    description: 'Creates a quantum field that completely banishes all shadow entities'
  }
};
