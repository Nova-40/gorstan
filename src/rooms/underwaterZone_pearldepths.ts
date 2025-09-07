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

// Pearl Depths - Underwater Zone Landing Point

import { Room } from '../types/Room';

const pearldepths: Room = {
  id: 'pearldepths',
  zone: 'underwaterZone',
  title: 'Pearl Depths',
  description: [
    'You descend into the luminous depths of an underwater realm where massive pearl formations create a cathedral of iridescent beauty. The water here defies physics - you can breathe it as easily as air, and it supports your movement with gentle buoyancy while maintaining perfect clarity and warmth.',
    'Towering pearl spires reach from the sandy bottom toward the shimmering surface far above, each one glowing with internal bioluminescence that creates shifting patterns of blue, green, and silver light. Schools of translucent fish swim in perfect formations between the pearl columns, their movements creating living mandalas of light.',
    'The seafloor is carpeted with smaller pearls, sea crystals, and coral formations that pulse with their own rhythmic illumination. Ancient underwater structures can be glimpsed in the distance - ruins of an aquatic civilization that learned to work with the sea rather than against it.',
    'Currents of warm, illuminated water flow through the depths like underwater rivers, carrying nutrients, messages, and sometimes travelers between different regions of this vast oceanic realm. The water itself seems conscious, responding to thoughts and emotions with subtle changes in temperature and luminosity.',
    'At the center of this underwater cathedral sits the Great Pearl Oracle - a massive, perfect sphere that serves as both navigation beacon and wisdom keeper for all who venture into the underwater realm.',
  ],
  image: 'underwaterZone_pearldepths.png',
  ambientAudio: 'pearl_depths_ambience.mp3',

  consoleIntro: [
    '>> PEARL DEPTHS - UNDERWATER ZONE LANDING POINT',
    '>> Water properties: BREATHABLE - Aquatic atmosphere enhancement',
    '>> Depth level: ABYSSAL - 3,000 meters below dimensional sea level',
    '>> Illumination: BIOLUMINESCENT - Pearl and coral light systems',
    '>> Current patterns: NAVIGATIONAL - Intelligent water flow systems',
    '>> Marine life: ABUNDANT - Symbiotic aquatic ecosystem',
    '>> Pearl formations: MASSIVE - Ancient growth over millennia',
    '>> Oracle status: ACTIVE - Great Pearl wisdom system operational',
    '>> Pressure: NORMALIZED - Depth pressure negated by realm properties',
    '>> "Where Ocean Depths Reveal Their Treasures"',
  ],

  exits: {
    // Connection from cloud zone
    surface_ascent: 'cloudZone_skyplatform',
    
    // Underwater navigation
    north_current: 'underwaterZone_coralcity',
    south_current: 'underwaterZone_abyssal_gardens',
    east_current: 'underwaterZone_kelp_forests',
    west_current: 'underwaterZone_thermal_vents',
    
    // Central hub access
    pearl_spiral_up: 'underwaterZone_hub',
    
    // Special underwater destinations
    great_pearl_oracle: 'underwaterZone_oracle_chamber',
    crystal_grotto: 'labrynthZone_crystalcave',
    
    // Deep ocean routes
    abyssal_portal: 'underwaterZone_deep_trenches',
    pressure_lock: 'underwaterZone_pressurized_chambers',
    
    // Zone progression
    next_zone: 'spaceZone_entrance',
    emergency_surface: 'introZone_crossing',
  },

  items: [
    'luminous_pearl',
    'breathable_water_sample',
    'bioluminescent_coral',
    'current_navigation_shell',
    'aquatic_translation_device',
    'pressure_adaptation_charm',
    'sea_crystal_fragment',
    'oracle_communion_pearl',
  ],

  interactables: {
    'great_pearl_oracle': {
      description: 'Massive perfect pearl that serves as wisdom keeper and navigation beacon for the underwater realm.',
      actions: ['commune_with_oracle', 'seek_guidance', 'learn_ocean_wisdom', 'receive_navigation_help'],
      requires: ['oracle_communion_readiness'],
    },
    'pearl_formations': {
      description: 'Towering spires of iridescent pearls creating the underwater cathedral structure.',
      actions: ['study_formation', 'harvest_small_pearls', 'understand_growth_process', 'climb_spires'],
      requires: [],
    },
    'luminous_currents': {
      description: 'Intelligent water flows that transport travelers and carry information through the depths.',
      actions: ['ride_current', 'read_current_messages', 'send_water_mail', 'navigate_by_flow'],
      requires: ['current_reading_skills'],
    },
    'translucent_fish_schools': {
      description: 'Formations of beautiful transparent fish that create living light patterns.',
      actions: ['swim_with_fish', 'observe_patterns', 'learn_fish_language', 'join_formations'],
      requires: ['aquatic_communication'],
    },
    'bioluminescent_coral': {
      description: 'Living coral that pulses with rhythmic light, creating the depths\' illumination system.',
      actions: ['study_bioluminescence', 'sync_with_rhythm', 'enhance_coral_growth', 'harvest_light'],
      requires: ['marine_biology_knowledge'],
    },
    'ancient_aquatic_ruins': {
      description: 'Distant structures of an underwater civilization that mastered oceanic harmony.',
      actions: ['explore_ruins', 'study_architecture', 'decode_inscriptions', 'understand_civilization'],
      requires: ['underwater_archaeology_skills'],
    },
    'breathable_water_atmosphere': {
      description: 'The miraculous water that allows air-breathing beings to survive and thrive underwater.',
      actions: ['study_water_properties', 'enhance_breathing_efficiency', 'understand_mechanism', 'share_knowledge'],
      requires: ['aquatic_science_knowledge'],
    },
  },

  npcs: [
    'pearl_oracle_guardian',
    'aquatic_civilization_spirit',
    'current_navigation_guide',
    'bioluminescent_coral_keeper',
    'translucent_fish_speaker',
    'underwater_realm_welcomer',
  ],

  events: {
    onEnter: ['showUnderwaterMajesty', 'adaptToAquaticEnvironment', 'hearOceanSongs'],
    onExit: ['underwaterFarewell', 'retainOceanWisdom'],
    onInteract: {
      great_pearl_oracle: ['receiveOceanWisdom', 'gainUnderwaterNavigation'],
      luminous_currents: ['masterCurrentNavigation', 'learnWaterCommunication'],
      translucent_fish_schools: ['gainAquaticCommunication', 'joinMarineHarmony'],
      ancient_aquatic_ruins: ['discoverUnderwaterHistory', 'understandOceanicCivilization'],
    },
  },

  flags: {
    pearlDepthsDiscovered: true,
    oracleConsulted: false,
    currentNavigationLearned: false,
    fishCommunicationEstablished: false,
    coralRhythmsUnderstood: false,
    ruinsExplored: false,
    breathableWaterMastered: false,
    underwaterAdaptationComplete: false,
  },

  quests: {
    main: 'Adapt to and Explore the Underwater Realm',
    optional: [
      'Consult the Great Pearl Oracle',
      'Master Current Navigation Systems',
      'Establish Communication with Fish Schools',
      'Study Ancient Aquatic Civilization Ruins',
      'Understand Bioluminescent Coral Rhythms',
      'Perfect Breathable Water Adaptation',
    ],
  },

  environmental: {
    lighting: 'bioluminescent_pearl_and_coral_illumination',
    temperature: 'warm_oceanic_perfection',
    airQuality: 'breathable_water_with_enhanced_oxygen',
    soundscape: ['water_flowing', 'pearl_harmonics', 'fish_songs', 'coral_pulsing'],
    hazards: ['depth_disorientation', 'current_displacement', 'bioluminescent_overload'],
  },

  security: {
    level: 'oceanic_natural_protection',
    accessRequirements: ['aquatic_adaptation', 'ocean_respect'],
    alarmTriggers: ['pearl_damage', 'coral_disruption', 'current_contamination'],
    surveillanceActive: true,
    surveillanceType: 'oracle_monitoring_and_aquatic_spirit_observation',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate_to_challenging',
    estimatedPlayTime: '25-35 minutes',
    keyFeatures: [
      'Breathable underwater environment',
      'Great Pearl Oracle wisdom system',
      'Bioluminescent coral cathedral',
      'Intelligent current navigation',
      'Ancient aquatic civilization ruins',
    ],
  },

  secrets: {
    oracleSecrets: {
      description: 'Deep wisdom and knowledge held by the Great Pearl Oracle',
      requirements: ['oracle_communion_mastery', 'oceanic_wisdom_preparation', 'spiritual_depth'],
      rewards: ['ocean_wisdom_mastery', 'pearl_oracle_connection'],
    },
    aquaticCivilizationKnowledge: {
      description: 'Complete understanding of the ancient underwater civilization',
      requirements: ['ruins_exploration', 'aquatic_archaeology', 'underwater_linguistics'],
      rewards: ['aquatic_civilization_database', 'underwater_technology_mastery'],
    },
    currentMastery: {
      description: 'Expert ability to navigate and control underwater currents',
      requirements: ['current_navigation_expertise', 'water_flow_understanding', 'oceanic_harmony'],
      rewards: ['current_control_abilities', 'underwater_transportation_mastery'],
    },
  },

  customActions: {
    'oracle_communion': {
      description: 'Achieve deep spiritual communion with the Great Pearl Oracle',
      requirements: ['oracle_communion_readiness', 'spiritual_preparation', 'oceanic_wisdom_seeking'],
      effects: ['oracle_wisdom_gained', 'underwater_guidance_received'],
    },
    'aquatic_harmony': {
      description: 'Achieve perfect harmony with all underwater life and environment',
      requirements: ['aquatic_communication', 'ocean_respect', 'marine_empathy'],
      effects: ['underwater_harmony_mastery', 'aquatic_life_alliance'],
    },
    'pearl_formation_study': {
      description: 'Study and understand the formation process of the massive pearl structures',
      requirements: ['marine_geology_knowledge', 'pearl_formation_analysis', 'patience'],
      effects: ['pearl_formation_mastery', 'underwater_construction_knowledge'],
    },
  },

  // Underwater realm characteristics
  underwaterProperties: {
    waterType: 'breathable_with_enhanced_life_support',
    depthPressure: 'normalized_by_realm_properties',
    illumination: 'bioluminescent_pearl_and_coral_systems',
    lifeFormComplexity: 'highly_intelligent_symbiotic_ecosystem',
  },

  // Pearl oracle system
  oracleSystem: {
    function: 'wisdom_keeping_and_navigation_beacon',
    communicationMethod: 'pearl_resonance_and_oceanic_consciousness',
    wisdomScope: 'all_oceanic_knowledge_and_underwater_realm_guidance',
    accessibility: 'open_to_respectful_communion',
  },

  // Aquatic navigation
  currentNavigation: {
    currentTypes: 'warm_illuminated_intelligent_water_flows',
    navigationMethod: 'current_reading_and_flow_pattern_recognition',
    transportationCapability: 'realm_wide_underwater_travel',
    messagingSystem: 'current_carried_communication_network',
  },
};

export default pearldepths;
