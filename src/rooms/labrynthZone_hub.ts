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

// Labyrinth Hub - Central Navigation Chamber

import { Room } from '../types/Room';

const hub: Room = {
  id: 'hub',
  zone: 'labrynthZone',
  title: 'Labyrinth Central Hub',
  description: [
    'You emerge into a magnificent circular chamber at the heart of the ancient labyrinth. The domed ceiling soars overhead, decorated with an intricate star map that seems to move and shift as you watch. Eight perfectly carved archways lead off in different directions, each marked with distinct symbols that pulse with otherworldly energy.',
    'At the center of the chamber stands an impressive stone pedestal holding a crystalline navigation orb that hovers slightly above its surface, rotating slowly and emanating a soft, harmonious hum. The orb appears to be the central control mechanism for the entire labyrinth\'s navigation system.',
    'The walls are covered in mathematical equations, geometric patterns, and astronomical charts carved with incredible precision. Ancient braziers burn with eternal flames that cast no smoke, providing perfect illumination that reveals every detail of this remarkable architectural achievement.',
    'Water flows in perfectly engineered channels around the chamber\'s perimeter, creating a soothing soundtrack while maintaining the ancient ventilation system. This is clearly the masterwork of an advanced civilization, designed to be both functional and beautiful.',
    'Each archway bears different symbols: Crystal, Library, Cloud, Water, Star, Mirror, Shadow, and Portal - suggesting connections to different realms or dimensions accessible through this central nexus.',
  ],
  image: 'labrynthZone_hub.png',
  ambientAudio: 'labyrinth_hub_ambience.mp3',

  consoleIntro: [
    '>> LABYRINTH CENTRAL HUB - NAVIGATION NEXUS',
    '>> Chamber type: CIRCULAR CONTROL CENTER - 8 directional archways',
    '>> Navigation orb: ACTIVE - Central coordination system operational',
    '>> Archway status: ALL FUNCTIONAL - 8 dimensional connections verified',
    '>> Star map: DYNAMIC - Celestial navigation system active',
    '>> Illumination: ETERNAL FLAMES - No fuel consumption detected',
    '>> Water systems: OPERATIONAL - Ancient hydraulic engineering',
    '>> Architectural style: ADVANCED ANCIENT - Mathematical precision',
    '>> Hub function: INTERDIMENSIONAL NEXUS - Multiple realm access',
    '>> "The Center of All Paths"',
  ],

  exits: {
    // Back to entrance
    entrance_passage: 'labrynthZone_entrance',
    
    // Eight hub connections
    crystal_archway: 'labrynthZone_crystalcave',
    library_archway: 'libraryZone_entrance',
    cloud_archway: 'cloudZone_entrance',
    water_archway: 'underwaterZone_entrance',
    star_archway: 'spaceZone_entrance',
    mirror_archway: 'labrynthZone_mirrorchamber',
    shadow_archway: 'labrynthZone_shadowrealm',
    portal_archway: 'offmultiverseZone_entrance',
    
    // New Lattice Zone connection (after maze completion)
    mathematical_gateway: 'primeconfluence',
    
    // Standard zone progression
    next_zone: 'libraryZone_entrance',
    previous_zone: 'newyorkZone_manhattanhub',
    
    // Emergency routes
    surface_emergency: 'introZone_crossing',
    dimensional_emergency: 'gorstanZone_gorstanhub',
    
    // Hidden jump portal to crossing
    hidden_ancient_gateway: 'introZone_crossing',
  },

  items: [
    'navigation_orb_fragment',
    'star_map_coordinates',
    'eternal_flame_crystal',
    'labyrinth_master_key',
    'dimensional_compass',
    'water_channel_sample',
    'archway_symbol_rubbing',
    'ancient_calculation_tablet',
  ],

  interactables: {
    'navigation_orb': {
      description: 'A hovering crystalline orb that serves as the central navigation control for the entire labyrinth.',
      actions: ['examine_orb', 'activate_navigation', 'read_coordinates', 'adjust_pathways'],
      requires: ['labyrinth_attunement'],
    },
    'star_map_ceiling': {
      description: 'Dynamic stellar cartography showing celestial navigation patterns across multiple dimensions.',
      actions: ['study_constellations', 'track_movement', 'identify_coordinates', 'predict_alignments'],
      requires: ['astronomical_knowledge'],
    },
    'dimensional_archways': {
      description: 'Eight perfectly carved archways, each leading to different realms and dimensions.',
      actions: ['examine_symbols', 'test_connections', 'activate_portals', 'map_destinations'],
      requires: [],
    },
    'eternal_flames': {
      description: 'Mystical braziers that burn without fuel, providing perfect illumination.',
      actions: ['study_flames', 'test_properties', 'collect_energy', 'understand_mechanism'],
      requires: ['fire_magic_knowledge'],
    },
    'water_channels': {
      description: 'Precisely engineered water flows that maintain the chamber\'s atmosphere and function.',
      actions: ['trace_flow', 'test_water', 'study_engineering', 'activate_hydraulics'],
      requires: ['engineering_understanding'],
    },
    'mathematical_carvings': {
      description: 'Complex equations and geometric patterns covering the chamber walls.',
      actions: ['solve_equations', 'trace_patterns', 'decode_mathematics', 'understand_principles'],
      requires: ['mathematical_expertise'],
    },
    'central_pedestal': {
      description: 'The ornate stone pedestal supporting the navigation orb and hub controls.',
      actions: ['examine_construction', 'access_controls', 'read_inscriptions', 'operate_systems'],
      requires: ['hub_access_authorization'],
    },
    'hidden_ancient_gateway': {
      description: 'An ancient gateway that materialized from the labyrinth walls, inscribed with mathematical symbols that describe the path to the Crossing. Eternal flames dance around its archway, and water channels seem to flow upward into its glowing portal.',
      actions: ['examine', 'enter', 'step_through'],
      requires: ['has_jumped_in_hub'],
    },
  },

  npcs: [
    'hub_master_spirit',
    'ancient_mathematician_ghost',
    'navigation_orb_guardian',
    'labyrinth_architect_echo',
    'dimensional_guide_construct',
    'star_map_interpreter',
  ],

  events: {
    onEnter: ['showHubMajesty', 'activateNavigationOrb', 'hearHarmonicResonance'],
    onExit: ['hubFarewell', 'recordDestinationChoice', 'clearTemporaryPortal'],
    onInteract: {
      navigation_orb: ['masterNavigationSystem', 'unlockAdvancedNavigation'],
      star_map_ceiling: ['learnCelestialNavigation', 'gainAstronomicalKnowledge'],
      dimensional_archways: ['accessMultipleRealms', 'expandTravelOptions'],
      mathematical_carvings: ['understandAncientMathematics', 'gainAdvancedKnowledge'],
      hidden_ancient_gateway: ['enterCrossingPortal', 'stabilizeReality'],
    },
  },

  flags: {
    labyrinthHubDiscovered: true,
    navigationOrbActivated: false,
    starMapStudied: false,
    archwaysExplored: false,
    mathematicsDecoded: false,
    eternalFlamesUnderstood: false,
    waterSystemsMapped: false,
    hubMasteryAchieved: false,
    has_jumped_in_hub: false,
  },

  quests: {
    main: 'Master the Labyrinth Central Hub',
    optional: [
      'Activate the Navigation Orb System',
      'Decode the Mathematical Wall Carvings',
      'Map All Eight Dimensional Archways',
      'Study the Dynamic Star Map System',
      'Understand the Eternal Flame Technology',
      'Master the Ancient Hydraulic Engineering',
    ],
  },

  environmental: {
    lighting: 'perfect_eternal_flame_illumination',
    temperature: 'precisely_controlled_optimal',
    airQuality: 'pure_with_harmonic_resonance',
    soundscape: ['water_flowing', 'orb_humming', 'harmonic_resonance', 'dimensional_whispers'],
    hazards: ['dimensional_instability_minor', 'navigation_complexity'],
  },

  security: {
    level: 'ancient_master_level_protection',
    accessRequirements: ['labyrinth_navigation_skills', 'dimensional_understanding'],
    alarmTriggers: ['orb_tampering', 'archway_misuse', 'system_disruption'],
    surveillanceActive: true,
    surveillanceType: 'navigation_orb_monitoring_and_guardian_spirits',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'challenging',
    estimatedPlayTime: '25-40 minutes',
    keyFeatures: [
      'Central navigation nexus',
      'Eight dimensional archways',
      'Navigation orb control system',
      'Dynamic star map ceiling',
      'Advanced ancient engineering',
    ],
  },

  secrets: {
    orbMastery: {
      description: 'Complete control over the navigation orb and labyrinth systems',
      requirements: ['navigation_expertise', 'dimensional_understanding', 'ancient_attunement'],
      rewards: ['labyrinth_mastery', 'dimensional_navigation_control'],
    },
    starMapSecrets: {
      description: 'Hidden astronomical knowledge encoded in the ceiling map',
      requirements: ['astronomical_expertise', 'pattern_recognition', 'celestial_calculation'],
      rewards: ['advanced_stellar_navigation', 'cosmic_coordinate_system'],
    },
    ancientMathematicsDecoded: {
      description: 'Understanding of the advanced mathematical principles governing the labyrinth',
      requirements: ['mathematical_genius', 'pattern_analysis', 'ancient_language_skills'],
      rewards: ['mathematical_mastery', 'dimensional_equation_understanding'],
    },
  },

  customActions: {
    'navigation_orb_mastery': {
      description: 'Achieve complete mastery over the central navigation orb system',
      requirements: ['labyrinth_attunement', 'dimensional_sensitivity', 'navigation_expertise'],
      effects: ['orb_control_mastery', 'enhanced_dimensional_navigation'],
    },
    'dimensional_archway_mapping': {
      description: 'Create comprehensive map of all eight archway destinations',
      requirements: ['dimensional_travel_experience', 'mapping_skills', 'archway_symbol_knowledge'],
      effects: ['complete_archway_map', 'dimensional_travel_efficiency'],
    },
    'ancient_engineering_study': {
      description: 'Study and understand all the advanced engineering systems in the hub',
      requirements: ['engineering_knowledge', 'ancient_technology_understanding', 'analytical_skills'],
      effects: ['ancient_engineering_mastery', 'technological_insights'],
    },
    'jump': {
      description: 'Jump to disturb the dimensional fabric and reveal hidden portals',
      effect: 'You leap upward in the sacred space of the hub. Your movement disrupts the harmonic resonance patterns, causing the mathematical equations on the walls to glow brightly. The eternal flames flicker in unison, and suddenly an ancient gateway materializes from the stone walls, perfectly carved with navigation symbols pointing to the Crossing.',
      flags: { has_jumped_in_hub: true },
      cooldown: 30000, // Portal visible for 30 seconds
      energyCost: 0,
    },
  },

  // Central hub characteristics
  hubCharacteristics: {
    centralFunction: 'interdimensional_navigation_nexus',
    architecturalStyle: 'advanced_ancient_mathematical_precision',
    navigationSystem: 'crystalline_orb_with_harmonic_resonance',
    connectivityLevel: 'eight_dimensional_archway_connections',
  },

  // Archway system
  archwaySytem: {
    totalArchways: 8,
    destinations: [
      'crystal_realm', 'library_dimension', 'cloud_realm', 'underwater_domain',
      'stellar_space', 'mirror_dimension', 'shadow_realm', 'off_multiverse'
    ],
    activationMethod: 'symbol_recognition_and_orb_coordination',
    accessLevel: 'hub_master_authorization_required',
  },
};

export default hub;
