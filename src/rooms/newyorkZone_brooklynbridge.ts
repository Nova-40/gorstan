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

// Brooklyn Bridge - Historic NYC Icon

import { Room } from '../types/Room';

const brooklynbridge: Room = {
  id: 'brooklynbridge',
  zone: 'newyorkZone',
  title: 'Brooklyn Bridge',
  description: [
    'You stand upon the magnificent Brooklyn Bridge, one of the oldest suspension bridges in the United States and an enduring symbol of American engineering achievement. The Gothic Revival stone towers rise majestically above the East River, their massive presence a testament to 19th-century ambition and craftsmanship.',
    'The bridge\'s famous cable-stayed design creates a web of steel that has inspired artists, photographers, and poets for over 140 years. The wooden planked promenade elevates pedestrians above the vehicle traffic, offering breathtaking views of Manhattan\'s skyline, Brooklyn\'s waterfront, and the Statue of Liberty in the distance.',
    'As you walk across this historic span, you\'re following in the footsteps of millions who have made this same journey - immigrants arriving in America, workers heading to jobs, lovers on romantic strolls, and tourists capturing the perfect photo of the New York skyline.',
    'The bridge carries stories of triumph and tragedy: the visionary John Roebling who designed it but died before construction began, his son Washington who took over but was disabled by decompression sickness, and Washington\'s wife Emily who effectively supervised the bridge\'s completion, becoming one of the first female field engineers.',
  ],
  image: 'newyorkZone_brooklynbridge.png',
  ambientAudio: 'brooklyn_bridge_atmosphere.mp3',

  consoleIntro: [
    '>> BROOKLYN BRIDGE - HISTORIC SUSPENSION BRIDGE',
    '>> Completed: 1883 - 14 years of construction',
    '>> Length: 5,989 feet total span',
    '>> Main span: 1,595 feet between towers',
    '>> Height: 276 feet above mean high water',
    '>> Daily traffic: 150,000+ vehicles, 10,000+ pedestrians',
    '>> Engineering: First steel-wire suspension bridge',
    '>> Historic significance: National Historic Landmark',
    '>> Cultural impact: Inspiration for countless works of art',
    '>> "A monument to the triumph of human ingenuity"',
  ],

  exits: {
    manhattan_side: 'newyorkZone_manhattanhub',
    brooklyn_side: 'newyorkZone_brooklyn_heights',
    
    // Bridge features
    south_tower: 'newyorkZone_bridge_south_tower',
    north_tower: 'newyorkZone_bridge_north_tower',
    center_span: 'newyorkZone_bridge_center',
    
    // Views and photo spots
    manhattan_overlook: 'newyorkZone_manhattan_view',
    brooklyn_overlook: 'newyorkZone_brooklyn_view',
    statue_of_liberty_view: 'newyorkZone_liberty_view',
    
    // Transportation connections
    subway_manhattan: 'newyorkZone_subway_system',
    subway_brooklyn: 'newyorkZone_brooklyn_subway',
    
    // Emergency exits
    bridge_maintenance: 'newyorkZone_bridge_maintenance',
  },

  items: [
    'brooklyn_bridge_postcard',
    'historical_plaque_rubbing',
    'bridge_cable_fragment',
    'vintage_construction_photo',
    'engineering_blueprint_copy',
    'emily_roebling_biography',
    'suspension_bridge_diagram',
    'nyc_skyline_photo',
  ],

  interactables: {
    'gothic_towers': {
      description: 'Massive stone towers built from limestone and granite, architectural marvels that anchor the bridge.',
      actions: ['admire', 'photograph', 'study_construction', 'measure_scale'],
      requires: [],
    },
    'suspension_cables': {
      description: 'Steel cables that support the bridge, representing cutting-edge 19th-century engineering.',
      actions: ['examine', 'feel_vibration', 'study_engineering', 'appreciate_craftsmanship'],
      requires: [],
    },
    'wooden_promenade': {
      description: 'The elevated pedestrian walkway that provides spectacular views and peaceful walking.',
      actions: ['walk', 'jog', 'bicycle', 'people_watch'],
      requires: [],
    },
    'historical_plaques': {
      description: 'Commemorative markers telling the story of the bridge\'s construction and significance.',
      actions: ['read', 'photograph', 'learn_history', 'make_rubbing'],
      requires: [],
    },
    'manhattan_skyline': {
      description: 'The iconic view of Manhattan\'s skyscrapers from the bridge, one of the world\'s most photographed vistas.',
      actions: ['admire', 'photograph', 'identify_buildings', 'appreciate_growth'],
      requires: [],
    },
    'east_river': {
      description: 'The tidal strait flowing beneath the bridge, connecting Upper New York Bay to Long Island Sound.',
      actions: ['observe', 'watch_boats', 'study_currents', 'appreciate_geography'],
      requires: [],
    },
    'bridge_vendors': {
      description: 'Artists and vendors selling souvenirs, artwork, and photographs of the bridge.',
      actions: ['browse', 'purchase', 'chat', 'commission_artwork'],
      requires: ['money'],
    },
  },

  npcs: [
    'bridge_historian',
    'tourist_photographer',
    'daily_commuter',
    'bridge_vendor',
    'jogger',
    'engineering_student',
    'emily_roebling_reenactor',
  ],

  events: {
    onEnter: ['feelHistoricalSignificance', 'hearWindThroughCables', 'senseEngineeringMarvel'],
    onExit: ['bridgeFarewell', 'rememberSkylineViews'],
    onInteract: {
      gothic_towers: ['appreciateArchitecture', 'understandScale'],
      suspension_cables: ['marvel_at_engineering', 'feel_structural_power'],
      historical_plaques: ['learnBridgeHistory', 'honorBuilders'],
      manhattan_skyline: ['captureIconicView', 'witnessUrbanEvolution'],
    },
  },

  flags: {
    bridgeWalked: false,
    historyLearned: false,
    skylinePhotographed: false,
    engineeringAppreciated: false,
    roeblingStoryHeard: false,
    viewsAdmired: false,
    bridgeSignificanceUnderstood: false,
  },

  quests: {
    main: 'Experience America\'s Greatest Bridge',
    optional: [
      'Walk the Full Length of the Bridge',
      'Learn the Roebling Family Story',
      'Photograph the Manhattan Skyline',
      'Understand 19th Century Engineering',
      'Appreciate Gothic Revival Architecture',
      'Meet Bridge Historians and Enthusiasts',
      'Experience Different Times of Day',
    ],
  },

  environmental: {
    lighting: 'natural_daylight_with_city_reflections',
    temperature: 'breezy_river_climate',
    airQuality: 'fresh_river_air_with_city_traces',
    soundscape: ['wind_through_cables', 'traffic_below', 'river_sounds', 'tourist_chatter', 'camera_clicks'],
    hazards: ['wind_exposure', 'height_vertigo', 'crowded_walkway', 'bicycle_traffic'],
  },

  security: {
    level: 'moderate_landmark_security',
    accessRequirements: ['public_pedestrian_access'],
    alarmTriggers: ['climbing_cables', 'structural_damage', 'emergency_incidents'],
    surveillanceActive: true,
    surveillanceType: 'nypd_landmark_security_traffic_monitoring',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '20-30 minutes',
    keyFeatures: [
      'Historic suspension bridge',
      'Engineering marvel',
      'Iconic NYC views',
      'Roebling family legacy',
      'Gothic Revival architecture',
    ],
  },

  secrets: {
    roeblingVault: {
      description: 'A hidden compartment in one of the towers containing original construction documents',
      requirements: ['befriend bridge_historian', 'prove_engineering_scholarship', 'special_access_permit'],
      rewards: ['original_blueprints', 'roebling_family_artifacts', 'engineering_historian_status'],
    },
    bridgeGhost: {
      description: 'The spirit of John Roebling, still watching over his greatest achievement',
      requirements: ['visit_at_dawn', 'show_deep_respect', 'understand_bridge_history'],
      rewards: ['roebling_blessing', 'engineering_inspiration', 'bridge_guardian_status'],
    },
    secretMaintenanceArea: {
      description: 'Access to the bridge\'s internal structure and maintenance facilities',
      requirements: ['befriend_bridge_engineer', 'safety_training', 'structural_engineering_knowledge'],
      rewards: ['bridge_internals_access', 'maintenance_engineering_knowledge'],
    },
  },

  customActions: {
    'bridge_engineering_study': {
      description: 'Conduct detailed study of the bridge\'s engineering and construction techniques',
      requirements: ['engineering_background', 'measurement_tools', 'academic_purpose'],
      effects: ['bridge_engineering_expertise', 'structural_analysis_skills'],
    },
    'sunrise_photography': {
      description: 'Capture the bridge and skyline during the golden hour of sunrise',
      requirements: ['professional_camera', 'early_morning_dedication', 'photography_skills'],
      effects: ['masterpiece_photograph', 'photographer_recognition'],
    },
    'historical_reenactment': {
      description: 'Participate in or organize historical reenactments of the bridge\'s opening',
      requirements: ['historical_costume', 'acting_ability', 'historical_knowledge'],
      effects: ['historical_performer_status', 'bridge_anniversary_participation'],
    },
  },

  // New York cultural elements
  newyorkCulture: {
    significance: 'Symbol_of_American_engineering_achievement',
    tourism: 'Major_international_tourist_destination',
    daily_life: 'Commuter_route_and_recreational_space',
    inspiration: 'Subject_of_countless_artistic_works',
  },

  // Bridge heritage
  bridgeHeritage: {
    engineering: 'First_steel_wire_suspension_bridge',
    construction: 'Triumph_over_19th_century_technical_challenges',
    legacy: 'Roebling_family_engineering_dynasty',
    preservation: 'Ongoing_maintenance_and_restoration',
  },
};

export default brooklynbridge;
