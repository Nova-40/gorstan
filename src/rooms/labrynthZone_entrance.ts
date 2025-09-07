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

// Labyrinth Entrance - Labyrinth Zone Landing Point

import { Room } from '../types/Room';

const entrance: Room = {
  id: 'entrance',
  zone: 'labrynthZone',
  title: 'Labyrinth Entrance',
  description: [
    'You stand before the imposing entrance to an ancient labyrinth carved deep into living rock. Massive stone archways tower overhead, inscribed with geometric patterns that seem to shift and change when viewed peripherally. The air carries the scent of old stone, moss, and something mysteriously metallic.',
    'Torchlight flickers from iron sconces mounted on weathered pillars, casting dancing shadows that create the illusion of movement in the carved reliefs. The entrance corridor stretches ahead into darkness, with side passages branching off at irregular intervals - the beginning of what promises to be an intricate maze.',
    'Ancient symbols glow faintly along the walls, pulsing with a soft blue-green light that seems to respond to your presence. These markings appear to be some form of navigation system, though their meaning remains unclear. The sound of distant water droplets echoes from the depths, creating an atmospheric rhythm.',
    'The threshold itself bears an inscription in multiple languages, including some that seem otherworldly: "Those who enter seeking wisdom shall find paths unknown. Those who enter seeking power shall find themselves lost." The labyrinth awaits, promising both challenge and discovery.',
  ],
  image: 'labrynthZone_entrance.png',
  ambientAudio: 'labyrinth_entrance_ambience.mp3',

  consoleIntro: [
    '>> LABYRINTH ENTRANCE - ANCIENT UNDERGROUND MAZE SYSTEM',
    '>> Structure age: ESTIMATED 3,000+ years - Pre-Roman construction',
    '>> Navigation complexity: EXTREME - Multi-level maze system',
    '>> Light sources: TORCHLIGHT - Ancient illumination system active',
    '>> Air quality: GOOD - Natural ventilation through stone channels',
    '>> Mystical activity: MODERATE - Glowing symbols and energy readings',
    '>> Path mapping: ADVISED - Easy to become lost without navigation aids',
    '>> Archaeological significance: HIGH - Unexplored ancient civilization',
    '>> Safety protocols: CAUTION - Stay on marked paths, carry light source',
    '>> "Enter with Purpose, Navigate with Wisdom"',
  ],

  exits: {
    // Connection from NYC zone
    entrance_from_nyc: 'newyorkZone_manhattanhub',
    
    // Main labyrinth passages
    north_passage: 'labrynthZone_northcorridor',
    south_passage: 'labrynthZone_southcorridor',
    east_passage: 'labrynthZone_eastcorridor',
    west_passage: 'labrynthZone_westcorridor',
    
    // Central route to hub
    center_path: 'labrynthZone_hub',
    
    // Hidden passages
    secret_passage: 'labrynthZone_hiddenchamber',
    crystal_tunnel: 'labrynthZone_crystalcave',
    
    // Emergency exit
    surface_exit: 'introZone_crossing',
    
    // Zone progression
    next_zone: 'libraryZone_entrance',
  },

  items: [
    'ancient_torch',
    'labyrinth_map_fragment',
    'navigation_crystal',
    'carved_stone_tablet',
    'moss_sample',
    'echo_chamber_resonator',
    'path_marking_chalk',
    'underground_compass',
  ],

  interactables: {
    'entrance_archway': {
      description: 'Massive stone archway with shifting geometric patterns and ancient inscriptions.',
      actions: ['examine_patterns', 'read_inscriptions', 'trace_symbols', 'decode_languages'],
      requires: [],
    },
    'glowing_symbols': {
      description: 'Ancient navigation symbols that pulse with blue-green light along the walls.',
      actions: ['study_symbols', 'activate_navigation', 'decode_meaning', 'map_pattern'],
      requires: ['symbol_knowledge'],
    },
    'torch_sconces': {
      description: 'Iron torch holders mounted on stone pillars, providing flickering illumination.',
      actions: ['light_torch', 'examine_mechanism', 'check_fuel', 'adjust_flame'],
      requires: ['fire_source'],
    },
    'threshold_inscription': {
      description: 'Multi-lingual warning and welcome carved into the entrance threshold.',
      actions: ['read_warning', 'translate_languages', 'interpret_meaning', 'photograph'],
      requires: [],
    },
    'passage_entrances': {
      description: 'Multiple corridor entrances leading deeper into the labyrinth maze.',
      actions: ['scout_passages', 'map_entrances', 'test_echoes', 'mark_paths'],
      requires: ['exploration_tools'],
    },
    'ancient_ventilation': {
      description: 'Sophisticated stone channels providing air circulation throughout the labyrinth.',
      actions: ['examine_engineering', 'test_airflow', 'map_ventilation', 'study_construction'],
      requires: ['engineering_knowledge'],
    },
  },

  npcs: [
    'labyrinth_guardian_spirit',
    'ancient_architect_echo',
    'lost_explorer_ghost',
    'navigation_guide_construct',
    'stone_carver_apparition',
    'maze_keeper',
  ],

  events: {
    onEnter: ['showLabyrinthWelcome', 'activateGlowingSymbols', 'hearAncientEchoes'],
    onExit: ['labyrinthFarewell', 'recordPathTaken'],
    onInteract: {
      glowing_symbols: ['learnNavigationSystem', 'activateWayfinding'],
      entrance_archway: ['discoverAncientHistory', 'understandPurpose'],
      passage_entrances: ['mapMazeStructure', 'planExplorationRoute'],
      threshold_inscription: ['receiveAncientWisdom', 'understandLabyrinthRules'],
    },
  },

  flags: {
    labyrinthEntranceDiscovered: true,
    symbolsDecoded: false,
    navigationSystemActivated: false,
    passagesMapped: false,
    inscriptionTranslated: false,
    torchLit: false,
    mazeRulesUnderstood: false,
  },

  quests: {
    main: 'Navigate the Ancient Labyrinth System',
    optional: [
      'Decode the Ancient Navigation Symbols',
      'Map All Passage Entrances',
      'Translate the Threshold Inscriptions',
      'Discover the Labyrinth\'s Original Purpose',
      'Find Hidden Chambers and Secrets',
      'Master the Ancient Wayfinding System',
    ],
  },

  environmental: {
    lighting: 'flickering_torchlight_with_glowing_symbols',
    temperature: 'cool_underground_stable',
    airQuality: 'fresh_with_stone_and_moss_scents',
    soundscape: ['water_drips', 'torch_crackling', 'distant_echoes', 'stone_settling'],
    hazards: ['maze_confusion', 'low_visibility', 'ancient_traps_possible'],
  },

  security: {
    level: 'ancient_mystical_protection',
    accessRequirements: ['archaeological_respect', 'navigation_preparation'],
    alarmTriggers: ['vandalism', 'desecration', 'reckless_exploration'],
    surveillanceActive: true,
    surveillanceType: 'ancient_guardian_spirits_and_mystical_monitoring',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate_to_challenging',
    estimatedPlayTime: '20-30 minutes',
    keyFeatures: [
      'Ancient labyrinth entrance',
      'Navigation symbol system',
      'Multiple passage options',
      'Archaeological mystery',
      'Underground exploration',
    ],
  },

  secrets: {
    ancientArchitectSecrets: {
      description: 'Hidden knowledge about the labyrinth\'s original builders and purpose',
      requirements: ['archaeological_expertise', 'symbol_translation', 'historical_research'],
      rewards: ['ancient_civilization_knowledge', 'labyrinth_construction_secrets'],
    },
    navigationMastery: {
      description: 'Complete understanding of the ancient wayfinding system',
      requirements: ['symbol_decoding', 'passage_mapping', 'navigation_crystal_activation'],
      rewards: ['labyrinth_navigation_mastery', 'never_get_lost_ability'],
    },
    hiddenChamberAccess: {
      description: 'Secret entrances to chambers not shown on any map',
      requirements: ['keen_observation', 'pattern_recognition', 'ancient_key_discovery'],
      rewards: ['access_to_secret_chambers', 'hidden_labyrinth_knowledge'],
    },
  },

  customActions: {
    'symbol_navigation': {
      description: 'Use the glowing symbols to navigate the labyrinth safely',
      requirements: ['navigation_crystal', 'symbol_knowledge', 'wayfinding_skills'],
      effects: ['navigation_enhancement', 'maze_mastery'],
    },
    'archaeological_study': {
      description: 'Conduct detailed study of the labyrinth\'s construction and purpose',
      requirements: ['archaeological_tools', 'academic_knowledge', 'documentation_skills'],
      effects: ['ancient_knowledge_gained', 'archaeological_expertise'],
    },
    'passage_exploration': {
      description: 'Systematically explore and map all available passages',
      requirements: ['exploration_equipment', 'mapping_tools', 'stamina'],
      effects: ['complete_passage_map', 'labyrinth_familiarity'],
    },
  },

  // Ancient labyrinth characteristics
  ancientLabyrinth: {
    constructionPeriod: 'pre_roman_ancient_civilization',
    purpose: 'wisdom_testing_and_spiritual_journey',
    navigationSystem: 'glowing_symbol_wayfinding',
    complexity: 'multi_level_maze_with_hidden_chambers',
  },

  // Navigation system
  navigationSystem: {
    symbolType: 'ancient_glowing_waymarkers',
    activationMethod: 'proximity_and_crystal_resonance',
    guidance: 'path_illumination_and_direction_indication',
    reliability: 'ancient_but_still_functional',
  },
};

export default entrance;
