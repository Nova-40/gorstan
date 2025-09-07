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

// Nebular Station - Space Zone Landing Point

import { Room } from '../types/Room';

const nebularstation: Room = {
  id: 'nebularstation',
  zone: 'spaceZone',
  title: 'Nebular Station',
  description: [
    'You materialize aboard a breathtaking space station floating within the heart of a brilliant nebula. The station\'s transparent dome walls provide a spectacular 360-degree view of swirling cosmic gases in shades of purple, blue, pink, and gold, with newborn stars twinkling like diamonds scattered across velvet.',
    'The station itself is a marvel of advanced technology, seamlessly blending organic curves with crystalline structures that seem to grow rather than be built. Artificial gravity maintains comfortable conditions while allowing for areas of controlled zero-gravity for recreational and practical purposes.',
    'Massive viewing ports offer breathtaking vistas of nearby star systems, asteroid fields, and distant galaxies. The nebula\'s gases create an ever-changing light show as stellar winds sculpt cosmic dust into temporary sculptures of incredible beauty. Occasionally, massive space creatures glide gracefully through the nebular clouds.',
    'The station serves as a hub for interdimensional space travel, with docking bays for vessels from countless civilizations. The central command center houses a sophisticated navigation AI that can plot courses through space, time, and dimensional barriers with equal precision.',
    'Gardens of space-adapted plants provide both beauty and life support, while observation decks offer meditation spaces where visitors can contemplate the vastness of the cosmos and their place within it. The station hums with quiet efficiency and cosmic harmony.',
  ],
  image: 'spaceZone_nebularstation.png',
  ambientAudio: 'nebular_station_ambience.mp3',

  consoleIntro: [
    '>> NEBULAR STATION - SPACE ZONE INTERDIMENSIONAL HUB',
    '>> Location: HEART OF COSMIC NEBULA - Stellar nursery region',
    '>> Station integrity: EXCELLENT - Advanced crystalline construction',
    '>> Life support: OPTIMAL - Artificial gravity and atmosphere control',
    '>> Nebula status: ACTIVE - Star formation in progress',
    '>> Docking capacity: UNLIMITED - Multidimensional vessel accommodation',
    '>> Navigation AI: ONLINE - Space-time-dimension coordinate system',
    '>> Cosmic wildlife: PEACEFUL - Benevolent space creatures present',
    '>> Observatory systems: OPERATIONAL - Deep space monitoring active',
    '>> "Where Science Meets the Infinite"',
  ],

  exits: {
    // Connection from underwater zone
    dimensional_transporter: 'underwaterZone_pearldepths',
    
    // Space station areas
    north_observatory: 'spaceZone_stellarobservatory',
    south_docking_bay: 'spaceZone_dockingbay',
    east_research_labs: 'spaceZone_researchlabs',
    west_living_quarters: 'spaceZone_livingquarters',
    
    // Central space hub
    command_center: 'spaceZone_hub',
    
    // Special cosmic destinations
    nebula_core: 'spaceZone_nebulacore',
    star_nursery: 'spaceZone_starnursery',
    
    // Interdimensional travel
    wormhole_generator: 'spaceZone_wormholegenerator',
    temporal_portal: 'spaceZone_temporalresearch',
    
    // Crystal connection
    crystal_resonance_chamber: 'labrynthZone_crystalcave',
    
    // Zone progression
    next_zone: 'offmultiverseZone_entrance',
    emergency_return: 'introZone_crossing',
  },

  items: [
    'stellar_navigation_crystal',
    'nebula_gas_sample',
    'space_creature_communication_device',
    'artificial_gravity_regulator',
    'cosmic_dust_collector',
    'interdimensional_beacon',
    'space_plant_seeds',
    'stellar_cartography_data',
  ],

  interactables: {
    'navigation_ai_core': {
      description: 'Advanced artificial intelligence capable of plotting courses through space, time, and dimensions.',
      actions: ['consult_ai', 'plot_course', 'access_star_charts', 'request_navigation_assistance'],
      requires: ['navigation_clearance'],
    },
    'cosmic_viewing_domes': {
      description: 'Transparent dome walls providing spectacular views of the surrounding nebula and cosmos.',
      actions: ['observe_nebula', 'track_star_formation', 'watch_cosmic_creatures', 'meditate_on_infinity'],
      requires: [],
    },
    'space_creature_observation_deck': {
      description: 'Specialized area for watching and communicating with massive space-dwelling life forms.',
      actions: ['observe_creatures', 'attempt_communication', 'study_behavior', 'feed_space_whales'],
      requires: ['xenobiology_knowledge'],
    },
    'zero_gravity_chambers': {
      description: 'Areas of controlled weightlessness for recreation and specialized activities.',
      actions: ['experience_weightlessness', 'practice_zero_g_movement', 'conduct_experiments', 'enjoy_floating'],
      requires: ['zero_gravity_training'],
    },
    'interdimensional_docking_systems': {
      description: 'Advanced technology allowing vessels from any dimension to dock safely.',
      actions: ['observe_arriving_ships', 'study_docking_technology', 'meet_alien_visitors', 'learn_ship_designs'],
      requires: ['diplomatic_clearance'],
    },
    'cosmic_gardens': {
      description: 'Beautiful gardens of space-adapted plants that thrive in the cosmic environment.',
      actions: ['tend_space_plants', 'study_cosmic_botany', 'harvest_space_fruits', 'appreciate_beauty'],
      requires: ['space_botany_knowledge'],
    },
    'stellar_cartography_center': {
      description: 'Advanced mapping facility creating charts of stars, galaxies, and dimensional territories.',
      actions: ['study_star_maps', 'create_navigation_charts', 'discover_new_systems', 'plot_exploration_routes'],
      requires: ['cartography_skills'],
    },
  },

  npcs: [
    'station_commander_ai',
    'cosmic_navigation_specialist',
    'space_creature_researcher',
    'interdimensional_diplomat',
    'stellar_cartographer',
    'nebula_phenomena_scientist',
  ],

  events: {
    onEnter: ['showCosmicMajesty', 'adaptToSpaceEnvironment', 'hearCosmicHarmony'],
    onExit: ['spaceFarewell', 'retainCosmicPerspective'],
    onInteract: {
      navigation_ai_core: ['gainCosmicNavigation', 'unlockInterdimensionalTravel'],
      cosmic_viewing_domes: ['expandCosmicAwareness', 'gainAstronomicalKnowledge'],
      space_creature_observation_deck: ['establishXenobioContact', 'learnCosmicLifeForms'],
      zero_gravity_chambers: ['masterSpaceMovement', 'adaptToWeightlessness'],
    },
  },

  flags: {
    nebularStationDiscovered: true,
    navigationAiConsulted: false,
    spaceCreaturesObserved: false,
    zeroGravityExperienced: false,
    cosmicGardensExplored: false,
    stellarCartographyAccessed: false,
    interdimensionalDockingStudied: false,
    nebulaPhysicsUnderstood: false,
  },

  quests: {
    main: 'Explore the Cosmic Nebular Station',
    optional: [
      'Consult the Navigation AI for Cosmic Routes',
      'Observe and Communicate with Space Creatures',
      'Experience Zero Gravity Movement',
      'Study the Station\'s Interdimensional Technology',
      'Map New Star Systems and Cosmic Territories',
      'Cultivate the Cosmic Gardens',
    ],
  },

  environmental: {
    lighting: 'nebular_glow_with_stellar_illumination',
    temperature: 'perfectly_controlled_life_support',
    airQuality: 'purified_with_cosmic_energy_enhancement',
    soundscape: ['cosmic_harmonics', 'station_humming', 'space_creature_songs', 'stellar_wind'],
    hazards: ['cosmic_radiation_minimal', 'zero_gravity_disorientation', 'infinite_space_awe'],
  },

  security: {
    level: 'cosmic_diplomatic_protection',
    accessRequirements: ['space_adaptation', 'cosmic_citizenship'],
    alarmTriggers: ['station_damage', 'navigation_interference', 'diplomatic_incidents'],
    surveillanceActive: true,
    surveillanceType: 'ai_monitoring_and_cosmic_sensor_network',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'challenging',
    estimatedPlayTime: '30-40 minutes',
    keyFeatures: [
      'Nebular heart location',
      'Advanced space technology',
      'Cosmic creature observation',
      'Interdimensional docking systems',
      'Zero gravity experiences',
    ],
  },

  secrets: {
    cosmicConsciousness: {
      description: 'Deep understanding of the cosmic consciousness that permeates all space',
      requirements: ['cosmic_meditation', 'space_creature_communication', 'nebula_phenomenon_study'],
      rewards: ['cosmic_consciousness_access', 'universal_awareness'],
    },
    navigationMastery: {
      description: 'Expert-level cosmic navigation across space, time, and dimensions',
      requirements: ['navigation_ai_partnership', 'stellar_cartography_mastery', 'interdimensional_understanding'],
      rewards: ['cosmic_navigation_mastery', 'multidimensional_travel_abilities'],
    },
    spaceTechnology: {
      description: 'Complete understanding of the station\'s advanced space technology',
      requirements: ['engineering_expertise', 'interdimensional_technology_study', 'cosmic_science_mastery'],
      rewards: ['space_technology_mastery', 'cosmic_engineering_abilities'],
    },
  },

  customActions: {
    'cosmic_meditation': {
      description: 'Achieve deep meditation while contemplating the infinite cosmos',
      requirements: ['meditation_skills', 'cosmic_viewing_access', 'spiritual_openness'],
      effects: ['cosmic_awareness_gained', 'universal_perspective'],
    },
    'space_creature_communion': {
      description: 'Establish communication and friendship with cosmic life forms',
      requirements: ['xenobiology_knowledge', 'space_creature_communication_device', 'empathetic_approach'],
      effects: ['space_creature_alliance', 'cosmic_life_understanding'],
    },
    'interdimensional_navigation_mastery': {
      description: 'Master the complex art of navigation across multiple dimensions',
      requirements: ['navigation_clearance', 'dimensional_understanding', 'stellar_cartography_skills'],
      effects: ['navigation_mastery', 'interdimensional_travel_expertise'],
    },
  },

  // Space station characteristics
  stationProperties: {
    location: 'heart_of_stellar_nursery_nebula',
    construction: 'organic_crystalline_advanced_technology',
    capacity: 'unlimited_multidimensional_vessel_accommodation',
    purpose: 'interdimensional_space_travel_hub_and_research',
  },

  // Cosmic environment
  cosmicEnvironment: {
    nebulaType: 'active_star_forming_region',
    stellarActivity: 'ongoing_star_birth_and_cosmic_sculpting',
    lifeforms: 'peaceful_space_dwelling_creatures',
    phenomena: 'cosmic_gas_flows_and_stellar_wind_art',
  },

  // Advanced technology systems
  technologySystems: {
    navigation: 'ai_controlled_space_time_dimension_plotting',
    lifesupport: 'artificial_gravity_and_atmosphere_control',
    docking: 'multidimensional_vessel_accommodation',
    research: 'cosmic_phenomena_and_xenobiology_study',
  },
};

export default nebularstation;
