/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// Void Chamber - Off-Multiverse Zone Landing Point

import { Room } from '../types/Room';

const voidchamber: Room = {
  id: 'voidchamber',
  zone: 'offmultiverseZone',
  title: 'Void Chamber',
  description: [
    'You enter a realm that exists beyond the boundaries of conventional reality - the Void Chamber, where the concept of space itself becomes fluid and negotiable. The chamber appears to be simultaneously infinite and intimate, vast beyond comprehension yet somehow containing only what you need to perceive at any given moment.',
    'The walls, if they can be called walls, shift between complete transparency and absolute opacity, revealing glimpses of other realities, parallel dimensions, and universes that never were. The floor beneath your feet feels solid yet you sense you could walk in any direction - up, down, sideways through dimensions that have no names.',
    'Floating geometric forms drift through the space: impossible polyhedra, self-intersecting spheres, and mathematical structures that hurt to look at directly but convey profound meaning when perceived peripherally. These are the building blocks of reality itself, the fundamental forms from which all existence is constructed.',
    'At the center of this non-space hovers the Nexus Core - a sphere of pure potential that contains every possible variation of every possible reality. It pulses with a rhythm that matches the heartbeat of the multiverse itself, coordinating the flow of existence across infinite dimensions.',
    'Here, in this place that is not a place, you begin to understand that you have moved beyond the multiverse itself into the foundational layer of reality - the space between spaces where the rules that govern all existence are written and rewritten.',
  ],
  image: 'offmultiverseZone_voidchamber.png',
  ambientAudio: 'void_chamber_resonance.mp3',

  consoleIntro: [
    '>> VOID CHAMBER - OFF-MULTIVERSE ZONE FOUNDATION LAYER',
    '>> Reality status: BEYOND CONVENTIONAL PHYSICS - Meta-dimensional space',
    '>> Spatial properties: FLUID - Negotiable geometry and dimensional orientation',
    '>> Nexus Core: ACTIVE - Multiverse coordination system operational',
    '>> Reality glimpses: INFINITE - Parallel dimension observation windows',
    '>> Mathematical structures: VISIBLE - Fundamental existence building blocks',
    '>> Temporal flow: NON-LINEAR - Time operates by consciousness rather than physics',
    '>> Access level: TRANSCENDENT - Beyond normal dimensional clearance',
    '>> Warning: ONTOLOGICAL HAZARD - Reality perception may be permanently altered',
    '>> "Beyond the Multiverse: Where Existence Itself is Mutable"',
  ],

  exits: {
    // Crossing hub exception route (direct from Manhattan Hub)
    crossing_hub_return: 'newyorkZone_manhattanhub',
    
    // Connection from space zone
    space_transcendence: 'spaceZone_nebularstation',
    
    // Off-multiverse realm areas
    nexus_core_access: 'offmultiverseZone_nexuscore',
    reality_observatory: 'offmultiverseZone_realityobservatory',
    dimensional_forge: 'offmultiverseZone_dimensionalforge',
    existence_laboratory: 'offmultiverseZone_existencelaboratory',
    
    // Hub access
    off_multiverse_hub: 'offmultiverseZone_hub',
    
    // Reality manipulation chambers
    parallel_reality_viewer: 'offmultiverseZone_parallelviewer',
    timeline_editor: 'offmultiverseZone_timelineeditor',
    
    // Meta-dimensional exits
    reality_creation_workshop: 'offmultiverseZone_realitycreation',
    multiverse_oversight: 'offmultiverseZone_multiverseoversight',
    
    // Emergency reality anchor
    emergency_reality_return: 'introZone_crossing',
  },

  items: [
    'reality_fragment',
    'dimensional_existence_key',
    'nexus_core_resonator',
    'parallel_reality_scanner',
    'mathematical_structure_crystal',
    'void_navigation_compass',
    'existence_probability_calculator',
    'multiverse_coordination_device',
  ],

  interactables: {
    'nexus_core': {
      description: 'Sphere of pure potential containing every possible variation of every possible reality.',
      actions: ['commune_with_nexus', 'observe_reality_variations', 'understand_existence_coordination', 'access_pure_potential'],
      requires: ['transcendent_consciousness'],
    },
    'floating_mathematical_structures': {
      description: 'Impossible geometric forms that are the building blocks of all reality.',
      actions: ['study_fundamental_forms', 'interact_with_structures', 'understand_reality_construction', 'manipulate_existence_building_blocks'],
      requires: ['mathematical_transcendence'],
    },
    'reality_glimpse_windows': {
      description: 'Transparent sections revealing other realities, parallel dimensions, and universes that never were.',
      actions: ['observe_parallel_realities', 'study_alternate_existences', 'compare_reality_variations', 'understand_infinite_possibilities'],
      requires: ['dimensional_perception'],
    },
    'fluid_spatial_boundaries': {
      description: 'Walls and surfaces that shift between states and allow movement in impossible directions.',
      actions: ['test_spatial_fluidity', 'navigate_impossible_directions', 'understand_negotiable_geometry', 'transcend_spatial_limitations'],
      requires: ['spatial_transcendence'],
    },
    'void_atmosphere': {
      description: 'The fundamental medium of existence that permeates the space between all realities.',
      actions: ['breathe_pure_existence', 'understand_fundamental_medium', 'harmonize_with_void', 'access_between_space_knowledge'],
      requires: ['void_adaptation'],
    },
    'existence_resonance_fields': {
      description: 'Energy patterns that coordinate the flow of existence across infinite dimensions.',
      actions: ['attune_to_resonance', 'understand_existence_coordination', 'manipulate_reality_flows', 'harmonize_with_multiverse'],
      requires: ['existence_manipulation_clearance'],
    },
  },

  npcs: [
    'void_chamber_guardian',
    'nexus_core_consciousness',
    'reality_architect_entity',
    'existence_coordinator',
    'mathematical_structure_intelligence',
    'multiverse_overseer',
  ],

  events: {
    onEnter: ['showVoidMajesty', 'transcendDimensionalLimitations', 'accessFoundationalReality'],
    onExit: ['voidChamberFarewell', 'retainTranscendentKnowledge'],
    onInteract: {
      nexus_core: ['accessPurePotential', 'gainRealityManipulation'],
      floating_mathematical_structures: ['understandFundamentalReality', 'gainExistenceBuildingKnowledge'],
      reality_glimpse_windows: ['expandRealityPerception', 'gainParallelDimensionAwareness'],
      fluid_spatial_boundaries: ['transcendSpatialLimitations', 'gainDimensionalFreedom'],
    },
  },

  flags: {
    voidChamberDiscovered: true,
    nexusCoreContacted: false,
    mathematicalStructuresUnderstood: false,
    realityGlimpsesStudied: false,
    spatialFluidityMastered: false,
    voidAtmosphereAdapted: false,
    existenceResonanceAttuned: false,
    transcendentConsciousnessAchieved: false,
  },

  quests: {
    main: 'Transcend the Boundaries of Conventional Reality',
    optional: [
      'Commune with the Nexus Core of Pure Potential',
      'Understand the Mathematical Structures of Existence',
      'Study Infinite Parallel Reality Variations',
      'Master Fluid Spatial Navigation',
      'Attune to Existence Resonance Fields',
      'Achieve Transcendent Consciousness State',
    ],
  },

  environmental: {
    lighting: 'existence_illumination_beyond_conventional_light',
    temperature: 'consciousness_dependent_comfort_regulation',
    airQuality: 'pure_existence_medium_breathable_by_consciousness',
    soundscape: ['nexus_core_heartbeat', 'reality_harmonics', 'existence_resonance', 'void_silence'],
    hazards: ['ontological_disorientation', 'reality_perception_alteration', 'consciousness_expansion_shock'],
  },

  security: {
    level: 'transcendent_existence_protection',
    accessRequirements: ['transcendent_consciousness', 'multiverse_clearance', 'reality_manipulation_authorization'],
    alarmTriggers: ['reality_destabilization', 'existence_manipulation_violations', 'consciousness_contamination'],
    surveillanceActive: true,
    surveillanceType: 'nexus_core_monitoring_and_existence_coordination_oversight',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'transcendent',
    estimatedPlayTime: '45-60 minutes',
    keyFeatures: [
      'Beyond multiverse foundation layer',
      'Nexus Core pure potential access',
      'Mathematical reality structures',
      'Infinite parallel reality observation',
      'Transcendent consciousness requirements',
    ],
  },

  secrets: {
    realityArchitecture: {
      description: 'Complete understanding of how realities are constructed and maintained',
      requirements: ['transcendent_consciousness', 'mathematical_structure_mastery', 'nexus_core_communion'],
      rewards: ['reality_construction_abilities', 'existence_architecture_mastery'],
    },
    multiverseOversight: {
      description: 'Access to the oversight systems that coordinate all existence across infinite dimensions',
      requirements: ['multiverse_clearance', 'existence_coordination_training', 'consciousness_transcendence'],
      rewards: ['multiverse_oversight_access', 'existence_coordination_abilities'],
    },
    voidMastery: {
      description: 'Complete mastery over the void space between realities',
      requirements: ['void_adaptation', 'spatial_transcendence', 'dimensional_freedom'],
      rewards: ['void_navigation_mastery', 'between_space_travel_abilities'],
    },
  },

  customActions: {
    'consciousness_transcendence': {
      description: 'Achieve transcendent consciousness capable of perceiving and manipulating fundamental reality',
      requirements: ['spiritual_preparation', 'dimensional_experience', 'reality_understanding'],
      effects: ['transcendent_consciousness_achieved', 'reality_manipulation_abilities'],
    },
    'nexus_core_communion': {
      description: 'Establish direct communication with the Nexus Core of pure potential',
      requirements: ['transcendent_consciousness', 'nexus_core_resonator', 'pure_potential_understanding'],
      effects: ['nexus_core_connection', 'pure_potential_access'],
    },
    'reality_architecture_study': {
      description: 'Study and understand the fundamental architecture of all existence',
      requirements: ['mathematical_transcendence', 'existence_building_block_knowledge', 'reality_construction_understanding'],
      effects: ['reality_architecture_mastery', 'existence_construction_abilities'],
    },
  },

  // Off-multiverse characteristics
  voidProperties: {
    spatialNature: 'fluid_negotiable_geometry_beyond_conventional_physics',
    existenceLayer: 'foundational_reality_construction_level',
    consciousnessRequirement: 'transcendent_awareness_for_navigation',
    realityAccess: 'infinite_parallel_dimension_observation',
  },

  // Nexus Core system
  nexusCoreSystem: {
    function: 'pure_potential_storage_and_reality_coordination',
    scope: 'every_possible_variation_of_every_possible_reality',
    accessMethod: 'transcendent_consciousness_communion',
    coordination: 'multiverse_heartbeat_synchronization',
  },

  // Transcendence requirements
  transcendenceSystem: {
    consciousnessLevel: 'beyond_conventional_awareness',
    realityPerception: 'mathematical_structure_recognition',
    spatialNavigation: 'impossible_direction_movement',
    existenceManipulation: 'fundamental_reality_building_block_interaction',
  },
};

export default voidchamber;
