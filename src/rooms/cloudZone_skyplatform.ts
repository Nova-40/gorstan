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

// Sky Platform - Cloud Zone Landing Point

import { Room } from '../types/Room';

const skyplatform: Room = {
  id: 'skyplatform',
  zone: 'cloudZone',
  title: 'Sky Platform',
  description: [
    'You emerge onto a magnificent floating platform suspended impossibly high in a realm of endless sky. The platform itself appears to be made of crystallized cloud material - solid enough to support your weight yet translucent enough to see the spectacular vista of clouds stretching infinitely in all directions below.',
    'Wisps of luminous clouds drift past at eye level, occasionally coalescing into temporary shapes and structures before dissolving back into ethereal mist. The air is pure and crisp, filled with the essence of freedom and limitless possibility. Gentle winds carry the sounds of distant wind chimes and the whispered songs of sky spirits.',
    'Above, the sky shifts through a breathtaking spectrum of colors - from deep azure to soft pastels, with hints of aurora dancing at the edges of perception. The light here seems to come from everywhere and nowhere, creating a dreamlike atmosphere where shadows are soft and everything has a gentle, otherworldly glow.',
    'A series of smaller floating platforms drift nearby, connected by bridges of solidified air and rainbow light. Each platform serves a different purpose - some hold gardens of cloud flowers, others contain viewing areas with crystal telescopes for observing the celestial realm.',
    'The platform\'s edge is bordered by a railing of crystallized wind, perfectly safe yet allowing an unobstructed view of the cloud realm\'s majesty. Portal vortexes swirl gently at various points around the platform, offering transportation to other sky realms and dimensions.',
  ],
  image: 'cloudZone_skyplatform.png',
  ambientAudio: 'sky_platform_atmosphere.mp3',

  consoleIntro: [
    '>> SKY PLATFORM - CLOUD ZONE LANDING POINT',
    '>> Altitude: INFINITE - Suspended in dimensional sky realm',
    '>> Platform stability: EXCELLENT - Crystallized cloud construction',
    '>> Atmospheric conditions: OPTIMAL - Pure air with enhanced properties',
    '>> Sky visibility: UNLIMITED - Panoramic view of cloud realm',
    '>> Transportation: PORTAL NETWORK - Multiple dimensional connections',
    '>> Wind conditions: GENTLE - Controlled atmospheric currents',
    '>> Sky spirit activity: MODERATE - Benevolent ethereal beings present',
    '>> Aurora phenomena: VISIBLE - Dimensional light displays active',
    '>> "Where Earth Meets Heaven"',
  ],

  exits: {
    // Connection from library zone
    library_portal: 'libraryZone_entrance',
    
    // Cloud zone navigation
    north_wind_bridge: 'cloudZone_northwindspire',
    south_breeze_bridge: 'cloudZone_southbreezegardens',
    east_aurora_bridge: 'cloudZone_auroraobservatory',
    west_storm_bridge: 'cloudZone_stormwatchpost',
    
    // Central cloud hub
    central_vortex: 'cloudZone_hub',
    
    // Special sky destinations
    rainbow_bridge: 'cloudZone_rainbowpalace',
    star_bridge: 'spaceZone_stellarstation',
    
    // Portal connections
    crystal_wind_portal: 'labrynthZone_crystalcave',
    ocean_mist_portal: 'underwaterZone_mistyshores',
    
    // Zone progression
    next_zone: 'underwaterZone_entrance',
    emergency_descent: 'introZone_crossing',
  },

  items: [
    'crystallized_cloud_fragment',
    'sky_spirit_whistle',
    'aurora_capture_crystal',
    'wind_direction_compass',
    'cloud_flower_seeds',
    'atmospheric_purity_detector',
    'floating_platform_anchor',
    'celestial_navigation_chart',
  ],

  interactables: {
    'crystallized_cloud_platform': {
      description: 'The main platform made of solidified cloud material, perfectly stable yet beautifully translucent.',
      actions: ['examine_construction', 'test_solidity', 'study_crystallization', 'appreciate_craftsmanship'],
      requires: [],
    },
    'portal_vortexes': {
      description: 'Swirling energy gateways providing transportation to other realms.',
      actions: ['examine_portals', 'activate_transport', 'study_vortex_patterns', 'navigate_destinations'],
      requires: ['portal_navigation_skills'],
    },
    'sky_spirit_manifestations': {
      description: 'Ethereal beings that occasionally materialize from the surrounding clouds.',
      actions: ['communicate_with_spirits', 'learn_sky_wisdom', 'receive_blessings', 'understand_sky_realm'],
      requires: ['spiritual_sensitivity'],
    },
    'aurora_phenomena': {
      description: 'Dancing lights at the edge of perception that respond to emotion and thought.',
      actions: ['watch_aurora', 'influence_colors', 'decode_patterns', 'capture_essence'],
      requires: ['aurora_sensitivity'],
    },
    'wind_crystalline_railings': {
      description: 'Safety railings made of solidified wind energy, perfectly transparent yet completely solid.',
      actions: ['lean_against_railing', 'study_wind_crystallization', 'test_transparency', 'feel_safety'],
      requires: [],
    },
    'cloud_flower_gardens': {
      description: 'Floating gardens containing flowers that bloom from cloud essence.',
      actions: ['tend_flowers', 'harvest_cloud_nectar', 'plant_seeds', 'commune_with_nature'],
      requires: ['botanical_knowledge'],
    },
    'celestial_telescopes': {
      description: 'Crystal viewing devices for observing distant sky realms and celestial phenomena.',
      actions: ['observe_sky_realms', 'track_celestial_movements', 'discover_new_worlds', 'map_sky_territories'],
      requires: ['astronomical_knowledge'],
    },
  },

  npcs: [
    'sky_platform_guardian',
    'wind_spirit_guide',
    'aurora_dancer',
    'cloud_gardener',
    'celestial_observer',
    'portal_navigator',
  ],

  events: {
    onEnter: ['showSkyMajesty', 'feelInfiniteSpace', 'hearSkySpirits'],
    onExit: ['skyPlatformFarewell', 'retainSkyWisdom'],
    onInteract: {
      portal_vortexes: ['masterSkyNavigation', 'unlockRealmTravel'],
      sky_spirit_manifestations: ['gainSkyWisdom', 'receiveSpiritualGuidance'],
      aurora_phenomena: ['connectWithCelestialForces', 'gainAuroraManipulation'],
      cloud_flower_gardens: ['understandSkyNature', 'gainBotanicalMagic'],
    },
  },

  flags: {
    skyPlatformDiscovered: true,
    portalNavigationLearned: false,
    skySpiritsContacted: false,
    auroraPatternStudied: false,
    cloudGardensExplored: false,
    celestialObservationDone: false,
    windCrystallizationUnderstood: false,
    skyRealmMapped: false,
  },

  quests: {
    main: 'Explore the Sky Realm from the Platform',
    optional: [
      'Learn to Navigate Portal Vortexes',
      'Communicate with Sky Spirits',
      'Study Aurora Pattern Phenomena',
      'Cultivate Cloud Flower Gardens',
      'Map Distant Sky Territories',
      'Master Wind Crystallization Technology',
    ],
  },

  environmental: {
    lighting: 'ethereal_omnidirectional_sky_glow',
    temperature: 'perfectly_balanced_celestial_climate',
    airQuality: 'pure_with_life_enhancing_properties',
    soundscape: ['wind_chimes', 'sky_spirit_songs', 'gentle_wind', 'aurora_harmonics'],
    hazards: ['altitude_adjustment', 'portal_disorientation', 'infinite_sky_awe'],
  },

  security: {
    level: 'sky_realm_natural_protection',
    accessRequirements: ['sky_affinity', 'altitude_tolerance'],
    alarmTriggers: ['sky_spirit_disturbance', 'platform_damage', 'unauthorized_portal_use'],
    surveillanceActive: true,
    surveillanceType: 'sky_spirit_observation_and_wind_current_monitoring',
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
      'Floating crystallized cloud platform',
      'Portal vortex transportation',
      'Sky spirit interactions',
      'Aurora phenomena observation',
      'Cloud flower gardens',
    ],
  },

  secrets: {
    skyMastery: {
      description: 'Complete understanding and control over sky realm phenomena',
      requirements: ['sky_spirit_communion', 'aurora_manipulation', 'wind_crystallization_mastery'],
      rewards: ['sky_realm_mastery', 'atmospheric_control_abilities'],
    },
    portalNetworkMastery: {
      description: 'Expert navigation of all portal vortexes and dimensional connections',
      requirements: ['portal_navigation_expertise', 'dimensional_understanding', 'vortex_pattern_recognition'],
      rewards: ['portal_mastery', 'interdimensional_travel_efficiency'],
    },
    cloudCrystallizationSecrets: {
      description: 'Knowledge of how to create and manipulate crystallized cloud matter',
      requirements: ['cloud_crystallization_study', 'atmospheric_science', 'material_manipulation'],
      rewards: ['cloud_crystallization_abilities', 'sky_architecture_skills'],
    },
  },

  customActions: {
    'sky_spirit_communion': {
      description: 'Establish deep communication with sky spirits for guidance and wisdom',
      requirements: ['spiritual_sensitivity', 'sky_affinity', 'respectful_approach'],
      effects: ['sky_spirit_alliance', 'sky_realm_wisdom'],
    },
    'aurora_manipulation': {
      description: 'Learn to influence and direct aurora phenomena through emotional and mental focus',
      requirements: ['aurora_sensitivity', 'emotional_control', 'mental_focus'],
      effects: ['aurora_control_abilities', 'celestial_light_mastery'],
    },
    'cloud_garden_mastery': {
      description: 'Become expert in cultivating and maintaining cloud flower gardens',
      requirements: ['botanical_knowledge', 'sky_affinity', 'nurturing_spirit'],
      effects: ['cloud_gardening_mastery', 'sky_nature_connection'],
    },
  },

  // Sky realm characteristics
  skyRealmProperties: {
    platformMaterial: 'crystallized_cloud_with_translucent_solidity',
    atmosphericConditions: 'pure_air_with_life_enhancing_properties',
    transportationMethod: 'portal_vortexes_and_wind_bridges',
    spiritualPresence: 'sky_spirits_and_aurora_consciousness',
  },

  // Portal system
  portalNetwork: {
    vortexCount: 'multiple_swirling_energy_gateways',
    destinations: 'other_sky_realms_and_dimensional_connections',
    navigationMethod: 'vortex_pattern_recognition_and_spirit_guidance',
    accessibility: 'open_to_those_with_sky_affinity',
  },

  // Cloud technology
  cloudTechnology: {
    crystallization: 'cloud_matter_solidification_for_construction',
    windSolidification: 'atmospheric_energy_crystallization',
    portalGeneration: 'vortex_creation_and_dimensional_gateway_maintenance',
    gardenCultivation: 'cloud_essence_botanical_systems',
  },
};

export default skyplatform;
