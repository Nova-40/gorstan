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

// Tower Bridge - Iconic London Landmark

import { Room } from '../types/Room';

const towerbridge: Room = {
  id: 'towerbridge',
  zone: 'londonZone',
  title: 'Tower Bridge',
  description: [
    'You stand upon the magnificent Tower Bridge, one of London\'s most iconic landmarks. The Victorian Gothic towers rise majestically on either side, their stone facades telling stories of engineering triumph from the 1890s.',
    'Below you, the Thames flows through the raised bascules, carrying modern river traffic just as it has for over a century. The glass walkways offer breathtaking views of London\'s skyline, where ancient and modern architecture create a stunning tapestry.',
    'The original Victorian Engine Rooms house the massive steam engines that once powered the bridge\'s opening mechanism, now preserved as a testament to industrial ingenuity.',
    'From this vantage point, you can see the Tower of London to the west, the modern skyscrapers of Canary Wharf to the east, and St Katherine\'s Dock nestled below like a historic jewel.',
  ],
  image: 'londonZone_towerbridge.png',
  ambientAudio: 'london_bridge_atmosphere.mp3',

  consoleIntro: [
    '>> TOWER BRIDGE - VICTORIAN ENGINEERING MARVEL',
    '>> Construction: 1886-1894 - Sir Horace Jones & Sir John Wolfe Barry',
    '>> Bridge type: COMBINED BASCULE AND SUSPENSION BRIDGE',
    '>> Operational status: FULLY FUNCTIONAL - Opens ~1000 times per year',
    '>> Elevation: 42 metres above river at high tide',
    '>> Main span: 61 metres between towers',
    '>> Tourist facilities: Glass walkways, Victorian Engine Rooms',
    '>> Traffic: HEAVY - Major Thames crossing point',
    '>> Security: MONITORED - City of London Corporation',
    '>> Notable: Often mistaken for London Bridge - but far more impressive',
  ],

  exits: {
    south: 'londonZone_stkatherinesdock',
    north: 'londonZone_citycentre',
    west: 'londonZone_towerhill',
    east: 'londonZone_wapping',
    
    // Special bridge exits
    enter_tower_north: 'londonZone_bridgetower_north',
    enter_tower_south: 'londonZone_bridgetower_south',
    cross_walkway: 'londonZone_bridgewalkway',
    visit_engine_rooms: 'londonZone_enginerooms',
    
    // River level access
    descend_to_river: 'londonZone_thamesriver',
  },

  items: [
    'bridge_engineering_plans',
    'victorian_steam_gauge',
    'bridge_opening_schedule',
    'tower_bridge_postcard',
    'thames_river_stone',
    'bridge_maintenance_key',
    'london_bridge_pass',
    'vintage_bridge_photo',
  ],

  interactables: {
    'gothic_towers': {
      description: 'Twin Victorian Gothic towers built from Cornish granite and Portland stone, housing the bridge\'s lifting machinery.',
      actions: ['examine', 'admire_architecture', 'climb', 'photograph'],
      requires: [],
    },
    'glass_walkways': {
      description: 'Modern glass-floored walkways offering spectacular views of London, installed in 2014.',
      actions: ['walk_across', 'look_down', 'take_photos', 'experience_vertigo'],
      requires: ['tower_bridge_ticket'],
    },
    'bascule_mechanism': {
      description: 'The massive counterweight system that allows the bridge sections to open for tall ships.',
      actions: ['examine', 'watch_operation', 'study_engineering', 'operate'],
      requires: ['bridge_operator_permit'],
    },
    'river_thames_view': {
      description: 'Panoramic views of the Thames stretching from the Pool of London to the Tower.',
      actions: ['observe', 'photograph', 'identify_landmarks', 'watch_boats'],
      requires: [],
    },
    'suspension_cables': {
      description: 'The steel wire suspension cables that support the bridge\'s walkways and roadway.',
      actions: ['examine', 'test_tension', 'photograph', 'inspect_maintenance'],
      requires: ['bridge_inspector_badge'],
    },
    'victorian_ironwork': {
      description: 'Intricate Victorian ironwork and decorative elements throughout the bridge structure.',
      actions: ['examine', 'admire_craftsmanship', 'photograph', 'study_design'],
      requires: [],
    },
    'bridge_control_room': {
      description: 'The modern control room where bridge operators monitor river traffic and bridge operations.',
      actions: ['observe', 'request_access', 'watch_operations', 'learn_procedures'],
      requires: ['official_access'],
    },
  },

  npcs: [
    'bridge_operator',
    'tourist_guide',
    'bridge_historian',
    'maintenance_engineer',
    'river_pilot',
    'london_photographer',
    'architecture_student',
  ],

  events: {
    onEnter: ['hearBridgeAmbience', 'seeIconicLandmark', 'experienceLondonMajesty'],
    onExit: ['bridgeFarewell', 'rememberViews'],
    onInteract: {
      gothic_towers: ['learnVictorianArchitecture', 'appreciateEngineering'],
      glass_walkways: ['experienceVertigo', 'seeSpectacularViews'],
      bascule_mechanism: ['witnessEngineeringMarvel', 'understandMechanics'],
      river_thames_view: ['identifyLandmarks', 'appreciateLondonSkyline'],
    },
  },

  flags: {
    bridgeExplored: false,
    walkwayCrossed: false,
    engineRoomsVisited: false,
    bridgeOpeningWitnessed: false,
    architectureAppreciated: false,
    londonViewsAdmired: false,
    engineeringUnderstood: false,
  },

  quests: {
    main: 'Experience London\'s Most Famous Bridge',
    optional: [
      'Cross the Glass Walkways',
      'Visit the Victorian Engine Rooms',
      'Witness a Bridge Opening',
      'Learn About Victorian Engineering',
      'Photograph London from Above',
      'Meet the Bridge Operators',
    ],
  },

  environmental: {
    lighting: 'natural_london_daylight_with_river_reflections',
    temperature: 'mild_london_climate_with_river_breeze',
    airQuality: 'fresh_river_air_with_traffic_traces',
    soundscape: ['river_flowing', 'traffic_crossing', 'tourist_chatter', 'seagull_calls', 'boat_horns'],
    hazards: ['heavy_pedestrian_traffic', 'vehicle_traffic', 'height_exposure', 'weather_exposure'],
  },

  security: {
    level: 'high_tourist_attraction_security',
    accessRequirements: ['public_access', 'bridge_ticket_for_towers'],
    alarmTriggers: ['unauthorized_tower_access', 'bridge_interference', 'security_breach'],
    surveillanceActive: true,
    surveillanceType: 'cctv_and_security_personnel',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '12-20 minutes',
    keyFeatures: [
      'Iconic London landmark',
      'Victorian engineering marvel',
      'Spectacular city views',
      'Historical significance',
      'Interactive bridge mechanics',
    ],
  },

  secrets: {
    hiddenVictorianWorkshop: {
      description: 'A forgotten Victorian workshop inside the north tower with original bridge blueprints',
      requirements: ['befriend bridge_historian', 'prove_engineering_interest', 'official_access'],
      rewards: ['original_blueprints', 'victorian_tools', 'bridge_master_key'],
    },
    bridgeGhostSighting: {
      description: 'The spirit of a Victorian bridge worker who died during construction',
      requirements: ['visit_at_night', 'show_respect_for_history', 'be_alone_on_bridge'],
      rewards: ['historical_revelation', 'bridge_blessing', 'worker_memorial_badge'],
    },
    secretOperatingMechanism: {
      description: 'A hidden manual override for the bridge opening mechanism',
      requirements: ['bridge_operator_trust', 'emergency_training', 'security_clearance'],
      rewards: ['bridge_override_key', 'emergency_operator_status'],
    },
  },

  customActions: {
    'witness_bridge_opening': {
      description: 'Watch the spectacular sight of Tower Bridge opening for a tall ship',
      requirements: ['bridge_opening_schedule', 'perfect_timing', 'good_viewing_position'],
      effects: ['bridge_opening_witnessed', 'understand_engineering_marvel'],
    },
    'climb_tower': {
      description: 'Ascend one of the Gothic towers for the ultimate London view',
      requirements: ['tower_bridge_ticket', 'good_fitness', 'no_fear_of_heights'],
      effects: ['spectacular_views', 'tower_climber_achievement'],
    },
    'operate_bridge': {
      description: 'Assist in the actual operation of the bridge opening mechanism',
      requirements: ['bridge_operator_permit', 'emergency_situation', 'technical_knowledge'],
      effects: ['bridge_operator_experience', 'earn_operator_respect'],
    },
  },

  // London cultural elements
  londonCulture: {
    historicalPeriod: 'Victorian_engineering_achievement',
    architecturalStyle: 'Victorian_Gothic_with_industrial_function',
    socialClass: 'International_tourist_destination',
    economicActivity: 'Tourism_and_transportation_hub',
  },

  // Engineering heritage
  engineeringHeritage: {
    construction: 'Victorian_steam_powered_innovation',
    mechanism: 'Counterweight_bascule_system',
    materials: 'Steel_framework_stone_cladding',
    modernization: 'Hydraulic_power_glass_walkways',
  },
};

export default towerbridge;
