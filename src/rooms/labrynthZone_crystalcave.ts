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

// Crystal Cave - Labyrinth Zone Crystal Chamber

import { Room } from '../types/Room';

const crystalcave: Room = {
  id: 'crystalcave',
  zone: 'labrynthZone',
  title: 'Crystal Cave',
  description: [
    'You enter a breathtaking underground cavern where massive crystal formations create a natural cathedral of light and color. Towering amethyst, quartz, and unknown mineral specimens reach from floor to ceiling, their faceted surfaces catching and amplifying even the faintest illumination into spectacular prismatic displays.',
    'The crystals emit their own gentle luminescence, creating an otherworldly atmosphere that shifts between purple, blue, and silver tones. Each crystal cluster seems to resonate with a different harmonic frequency, creating a subtle symphony of crystalline music that harmonizes with your heartbeat.',
    'Ancient formations have grown in perfect geometric patterns that suggest both natural processes and intelligent design. Some crystals are clearly natural geological wonders, while others show signs of careful cultivation by unknown hands - perhaps the same civilization that built the labyrinth itself.',
    'A small underground stream flows through the chamber, its water perfectly clear and charged with mineral content that makes it sparkle with internal light. The stream creates natural pools where crystal formations continue to grow, suggesting this cave is still geologically active.',
    'The largest crystal formation at the chamber\'s center pulses with energy that seems connected to the labyrinth\'s navigation system - possibly serving as a power source or communication relay for the ancient infrastructure.',
  ],
  image: 'labrynthZone_crystalcave.png',
  ambientAudio: 'crystal_cave_harmonics.mp3',

  consoleIntro: [
    '>> CRYSTAL CAVE - LABYRINTH POWER SOURCE',
    '>> Crystal types: MULTIPLE - Amethyst, quartz, unknown minerals',
    '>> Luminescence: ACTIVE - Natural crystal light emission',
    '>> Harmonic frequency: RESONANT - Crystal musical harmonization',
    '>> Geological activity: ONGOING - Active crystal growth detected',
    '>> Water source: MINERAL SPRING - High purity crystalline water',
    '>> Energy readings: SIGNIFICANT - Power source for labyrinth systems',
    '>> Formation patterns: HYBRID - Natural and artificially guided growth',
    '>> Atmospheric conditions: OPTIMAL - Enhanced by crystal properties',
    '>> "Where Earth\'s Power Meets Ancient Wisdom"',
  ],

  exits: {
    // Back to hub and entrance
    main_passage: 'labrynthZone_hub',
    entrance_tunnel: 'labrynthZone_entrance',
    
    // Crystal-powered passages
    amethyst_tunnel: 'labrynthZone_amethyst_chamber',
    quartz_passage: 'labrynthZone_quartz_gallery',
    
    // Hidden crystal routes
    crystal_portal: 'cloudZone_crystalplatform',
    mineral_spring_passage: 'underwaterZone_crystalgrotto',
    
    // Energy connections
    power_conduit: 'labrynthZone_power_chamber',
    resonance_tunnel: 'spaceZone_crystal_station',
    
    // Emergency routes
    surface_crystal_shaft: 'introZone_hiddenlab',
  },

  items: [
    'resonance_crystal',
    'amethyst_fragment',
    'crystalline_water_sample',
    'harmonic_tuning_fork',
    'crystal_growth_seed',
    'mineral_analysis_kit',
    'energy_collection_prism',
    'crystalline_navigation_tool',
  ],

  interactables: {
    'central_crystal_formation': {
      description: 'Massive crystal cluster serving as the power source for the labyrinth\'s systems.',
      actions: ['examine_energy', 'attune_frequency', 'collect_power', 'communicate_with_system'],
      requires: ['crystal_sensitivity'],
    },
    'amethyst_towers': {
      description: 'Towering purple crystal formations that emit calming frequencies.',
      actions: ['meditate_near', 'harvest_fragments', 'study_growth', 'tune_frequency'],
      requires: [],
    },
    'quartz_clusters': {
      description: 'Clear crystal formations that amplify and focus energy and light.',
      actions: ['focus_energy', 'amplify_light', 'store_power', 'create_lens'],
      requires: ['crystal_manipulation_skills'],
    },
    'crystalline_stream': {
      description: 'Mineral-rich water flowing through the cave, charged with crystal energy.',
      actions: ['drink_water', 'collect_sample', 'trace_source', 'test_properties'],
      requires: [],
    },
    'harmonic_crystals': {
      description: 'Special crystals that produce musical tones when touched or exposed to energy.',
      actions: ['play_music', 'tune_harmonics', 'record_frequencies', 'compose_crystal_song'],
      requires: ['musical_sensitivity'],
    },
    'growth_chambers': {
      description: 'Natural alcoves where new crystals are actively forming and growing.',
      actions: ['observe_growth', 'plant_crystal_seeds', 'accelerate_formation', 'study_process'],
      requires: ['geological_knowledge'],
    },
    'energy_conduits': {
      description: 'Crystal formations that channel power to other parts of the labyrinth.',
      actions: ['trace_energy_flow', 'monitor_power', 'redirect_energy', 'enhance_conductivity'],
      requires: ['energy_manipulation_skills'],
    },
  },

  npcs: [
    'crystal_keeper_spirit',
    'harmonic_resonance_entity',
    'ancient_geologist_ghost',
    'crystal_growth_guardian',
    'mineral_spring_nymph',
    'energy_conduit_maintenance_construct',
  ],

  events: {
    onEnter: ['showCrystalMajesty', 'hearHarmonicResonance', 'feelEnergyFlow'],
    onExit: ['crystalCaveFarewell', 'retainCrystalAttunement'],
    onInteract: {
      central_crystal_formation: ['connectToLabyrinthPower', 'gainEnergyManipulation'],
      harmonic_crystals: ['learnCrystalMusic', 'gainHarmonicSensitivity'],
      crystalline_stream: ['enhanceVitality', 'gainMineralKnowledge'],
      growth_chambers: ['understandCrystalFormation', 'gainGeologicalInsight'],
    },
  },

  flags: {
    crystalCaveDiscovered: true,
    centralCrystalAttuned: false,
    harmonicsLearned: false,
    waterSampled: false,
    growthProcessUnderstood: false,
    energyConduitsMapped: false,
    crystalMusicComposed: false,
    powerSourceConnected: false,
  },

  quests: {
    main: 'Understand the Crystal Cave Power System',
    optional: [
      'Attune to the Central Crystal Formation',
      'Learn the Language of Crystal Harmonics',
      'Map All Energy Conduits and Power Flows',
      'Study the Natural Crystal Growth Process',
      'Compose Music Using the Harmonic Crystals',
      'Connect to the Labyrinth\'s Power Network',
    ],
  },

  environmental: {
    lighting: 'natural_crystal_luminescence_with_prismatic_effects',
    temperature: 'cool_stable_underground_with_crystal_warmth',
    airQuality: 'pure_with_beneficial_crystal_ionization',
    soundscape: ['crystal_harmonics', 'water_flowing', 'energy_humming', 'harmonic_resonance'],
    hazards: ['crystal_shard_falling', 'energy_overload_potential', 'harmonic_dissonance'],
  },

  security: {
    level: 'natural_crystal_protection',
    accessRequirements: ['crystal_sensitivity', 'harmonic_attunement'],
    alarmTriggers: ['crystal_damage', 'energy_theft', 'harmonic_disruption'],
    surveillanceActive: true,
    surveillanceType: 'crystal_energy_monitoring_and_guardian_spirits',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '20-30 minutes',
    keyFeatures: [
      'Natural crystal formations',
      'Harmonic resonance system',
      'Labyrinth power source',
      'Crystal growth chambers',
      'Energy manipulation',
    ],
  },

  secrets: {
    crystalMastery: {
      description: 'Complete understanding and control over all crystal formations',
      requirements: ['crystal_attunement', 'harmonic_mastery', 'energy_manipulation'],
      rewards: ['crystal_manipulation_powers', 'enhanced_energy_abilities'],
    },
    ancientCrystalTechnology: {
      description: 'Knowledge of how the ancient civilization cultivated and used crystals',
      requirements: ['archaeological_research', 'crystal_analysis', 'ancient_technology_study'],
      rewards: ['crystal_cultivation_techniques', 'ancient_technology_understanding'],
    },
    harmonicCommunication: {
      description: 'Ability to communicate through crystal harmonic frequencies',
      requirements: ['musical_expertise', 'crystal_sensitivity', 'harmonic_theory'],
      rewards: ['crystal_communication_ability', 'harmonic_language_mastery'],
    },
  },

  customActions: {
    'crystal_attunement': {
      description: 'Achieve harmonic attunement with the central crystal formation',
      requirements: ['crystal_sensitivity', 'meditation_skills', 'energy_awareness'],
      effects: ['crystal_power_connection', 'enhanced_energy_sensitivity'],
    },
    'harmonic_composition': {
      description: 'Compose complex music using the cave\'s harmonic crystals',
      requirements: ['musical_ability', 'harmonic_understanding', 'creative_skills'],
      effects: ['unique_crystal_music', 'harmonic_mastery'],
    },
    'energy_network_mapping': {
      description: 'Map the complete energy flow network throughout the labyrinth',
      requirements: ['energy_detection', 'mapping_skills', 'technical_analysis'],
      effects: ['complete_energy_map', 'power_system_understanding'],
    },
  },

  // Crystal cave characteristics
  crystalFormations: {
    naturalCrystals: 'amethyst_quartz_and_unknown_minerals',
    artificialEnhancements: 'ancient_civilization_cultivation',
    energyProperties: 'power_generation_and_harmonic_resonance',
    growthStatus: 'ongoing_geological_activity',
  },

  // Power system integration
  powerSystem: {
    function: 'primary_energy_source_for_labyrinth',
    energyType: 'crystalline_harmonic_resonance',
    distributionMethod: 'crystal_conduit_network',
    controlInterface: 'central_crystal_formation',
  },

  // Harmonic properties
  harmonicSystem: {
    frequency: 'multi_tonal_crystal_resonance',
    musicalCapabilities: 'full_spectrum_harmonic_composition',
    communicationPotential: 'crystal_based_language_system',
    therapeuticEffects: 'enhanced_vitality_and_mental_clarity',
  },
};

export default crystalcave;
