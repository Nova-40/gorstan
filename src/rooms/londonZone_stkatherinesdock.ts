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

// St Katherine's Dock - London Zone Landing Point

import { Room } from '../types/Room';

const stkatherinesdock: Room = {
  id: 'stkatherinesdock',
  zone: 'londonZone',
  title: 'St Katherine\'s Dock',
  description: [
    'You stand on the historic cobblestones of St Katherine\'s Dock, where the Thames flows past centuries of maritime history. The old warehouse buildings have been converted into modern apartments and restaurants, but the dock retains its Victorian charm.',
    'Elegant yachts and canal boats bob gently in the marina, their masts creating a forest of rigging against the London sky. The sound of water lapping against hulls mingles with the distant hum of Tower Bridge traffic.',
    'The imposing Tower of London looms nearby, its ancient stones holding a thousand stories. Modern glass buildings reflect in the water, creating a striking contrast between old and new London.',
    'A peculiar shimmering in the air near the water\'s edge suggests this place is more than it appears - perhaps a gateway between worlds, where travelers from other realms might arrive.',
  ],
  image: 'londonZone_stkatherinesdock.png',
  ambientAudio: 'london_dock_atmosphere.mp3',

  consoleIntro: [
    '>> ST KATHERINE\'S DOCK - LONDON ZONE LANDING POINT',
    '>> Historical significance: HIGH - Medieval dock, Victorian renovation',
    '>> Current status: ACTIVE MARINA - Modern recreational facility',
    '>> Dimensional stability: STABLE - Secure arrival point confirmed',
    '>> Tourist accessibility: EXCELLENT - Central London location',
    '>> Transportation: MULTIPLE - Tube, bus, river, dimensional',
    '>> Security level: MODERATE - CCTV and dock security present',
    '>> Weather: VARIABLE - Typical London maritime climate',
    '>> Notable features: Tower Bridge proximity, historic warehouses',
    '>> Welcome to London - Mind the gap between realities',
  ],

  exits: {
    north: 'londonZone_towerbridge',
    south: 'londonZone_londonhub',
    east: 'londonZone_towerhill',
    west: 'londonZone_citycentre',
    enter_cafe: 'londonZone_cafeoffice',
    take_boat: 'londonZone_thamesriver',
    
    // Exception route - direct to NYC
    portal_nyc: 'newyorkZone_timessquare',
    
    // Return to dimensional crossing
    dimensional_return: 'introZone_crossing',
  },

  items: [
    'dock_rope',
    'london_tourist_map',
    'thames_water_sample',
    'victorian_brick_fragment',
    'marina_key',
    'london_oyster_card',
    'dock_worker_badge',
    'tower_bridge_postcard',
  ],

  interactables: {
    'historic_warehouses': {
      description: 'Beautifully converted Victorian warehouses that once stored goods from around the Empire.',
      actions: ['examine', 'admire_architecture', 'read_plaques', 'enter'],
      requires: [],
    },
    'marina_boats': {
      description: 'A collection of elegant yachts, narrow boats, and sailing vessels moored in the historic dock.',
      actions: ['examine', 'board', 'admire', 'charter'],
      requires: ['marina_access'],
    },
    'thames_water': {
      description: 'The historic River Thames, flowing past this dock for over a thousand years.',
      actions: ['observe', 'touch', 'take_sample', 'listen_to_waves'],
      requires: [],
    },
    'tower_bridge_view': {
      description: 'The iconic Tower Bridge spans the Thames nearby, its Victorian Gothic towers majestic against the sky.',
      actions: ['admire', 'photograph', 'watch_bridge_opening', 'study_engineering'],
      requires: [],
    },
    'dimensional_shimmer': {
      description: 'A subtle distortion in the air near the water that seems to pulse with otherworldly energy.',
      actions: ['examine', 'touch', 'activate', 'study'],
      requires: ['dimensional_sensitivity'],
    },
    'cobblestone_path': {
      description: 'Original Victorian cobblestones worn smooth by centuries of dock workers and visitors.',
      actions: ['walk_on', 'examine', 'feel_history', 'count_stones'],
      requires: [],
    },
    'dock_cranes': {
      description: 'Restored Victorian cranes that once loaded and unloaded ships from around the world.',
      actions: ['examine', 'operate', 'climb', 'appreciate_engineering'],
      requires: ['crane_operator_license'],
    },
  },

  npcs: [
    'dock_master',
    'london_tour_guide',
    'yacht_owner',
    'street_artist',
    'dimensional_traveler',
    'tower_bridge_operator',
    'thames_pilot',
  ],

  events: {
    onEnter: ['showLondonWelcome', 'hearThamesWater', 'smellMaritimeAir'],
    onExit: ['londonFarewell', 'rememberDockAtmosphere'],
    onInteract: {
      historic_warehouses: ['revealVictorianHistory', 'showArchitecturalDetails'],
      marina_boats: ['meetBoatOwners', 'learnMaritimeTraditions'],
      tower_bridge_view: ['witnessIconicLandmark', 'hearBridgeHistory'],
      dimensional_shimmer: ['detectOtherworldlyPresence', 'enableDimensionalTravel'],
    },
  },

  flags: {
    londonDiscovered: true,
    dockExplored: false,
    boatChartered: false,
    dimensionalGatewayFound: false,
    towerBridgeViewed: false,
    historicalKnowledgeGained: false,
    maritimeExperienceGained: false,
  },

  quests: {
    main: 'Explore London\'s Historic Waterfront',
    optional: [
      'Learn the History of St Katherine\'s Dock',
      'Charter a Boat on the Thames',
      'Photograph Tower Bridge',
      'Meet Local Dock Workers and Boat Owners',
      'Discover the Dimensional Gateway',
      'Explore Victorian Architecture',
    ],
  },

  environmental: {
    lighting: 'natural_london_daylight_with_water_reflections',
    temperature: 'mild_maritime_climate',
    airQuality: 'fresh_river_air_with_urban_traces',
    soundscape: ['water_lapping', 'boat_rigging_chiming', 'distant_traffic', 'seagull_calls'],
    hazards: ['slippery_wet_cobblestones', 'strong_river_currents', 'busy_tourist_areas'],
  },

  security: {
    level: 'moderate_urban_security',
    accessRequirements: ['public_access'],
    alarmTriggers: ['boat_theft', 'vandalism', 'unauthorized_crane_operation'],
    surveillanceActive: true,
    surveillanceType: 'cctv_and_dock_security',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '10-18 minutes',
    keyFeatures: [
      'Historic London dock atmosphere',
      'Victorian maritime heritage',
      'Modern marina lifestyle',
      'Dimensional gateway access',
      'Tower Bridge proximity',
    ],
  },

  secrets: {
    hiddenDocumentCache: {
      description: 'Victorian shipping records hidden in the old warehouse foundations',
      requirements: ['examine historic_warehouses thoroughly', 'gain dock_master trust', 'historical_research_skills'],
      rewards: ['maritime_history_knowledge', 'hidden_treasure_map'],
    },
    dimensionalAnchor: {
      description: 'A permanent anchor point for dimensional travel hidden beneath the dock',
      requirements: ['activate dimensional_shimmer', 'dimensional_sensitivity', 'prove_worthy_intentions'],
      rewards: ['stable_dimensional_travel', 'london_anchor_access'],
    },
    smugglersPassage: {
      description: 'A secret tunnel system used by Victorian smugglers',
      requirements: ['befriend dock_master', 'prove_trustworthiness', 'historical_knowledge'],
      rewards: ['access_to_hidden_passages', 'smuggler_route_map'],
    },
  },

  customActions: {
    'thames_boat_tour': {
      description: 'Take a traditional Thames boat tour to see London from the water',
      requirements: ['london_oyster_card', 'boat_tour_ticket', 'good_weather'],
      effects: ['gain_london_river_knowledge', 'unlock_thames_locations'],
    },
    'historical_research': {
      description: 'Study the Victorian history of the dock using local archives',
      requirements: ['dock_worker_badge', 'research_skills', 'time_investment'],
      effects: ['deep_historical_knowledge', 'unlock_hidden_stories'],
    },
    'dimensional_calibration': {
      description: 'Fine-tune the dimensional gateway for stable inter-zone travel',
      requirements: ['dimensional_sensitivity', 'technical_knowledge', 'gateway_access'],
      effects: ['improve_travel_stability', 'unlock_advanced_destinations'],
    },
  },

  // London cultural elements
  londonCulture: {
    historicalPeriod: 'Victorian_to_Modern',
    architecturalStyle: 'Victorian_Gothic_with_Modern_conversion',
    socialClass: 'Mixed_tourist_and_local',
    economicActivity: 'Tourism_and_marina_services',
  },

  // Maritime heritage
  maritimeHeritage: {
    dockHistory: 'Medieval_origins_Victorian_expansion',
    shipTypes: 'Historic_cargo_modern_pleasure_craft',
    tradeConnections: 'Former_Empire_routes',
    modernUse: 'Recreational_marina_and_tourism',
  },
};

export default stkatherinesdock;
