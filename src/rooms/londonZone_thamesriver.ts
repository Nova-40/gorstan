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

// Thames River - London's Historic Waterway

import { Room } from '../types/Room';

const thamesriver: Room = {
  id: 'thamesriver',
  zone: 'londonZone',
  title: 'Thames River',
  description: [
    'You find yourself on the historic Thames, London\'s liquid highway that has carried the dreams and commerce of the city for over two millennia. The gentle current flows past you, carrying whispers of Roman galleys, Viking longships, Tudor barges, and modern pleasure craft.',
    'From your vantage point on the water, London reveals itself in a completely different perspective. The city\'s great landmarks line the banks like ancient guardians - Tower Bridge spanning majestically overhead, the Tower of London\'s formidable walls rising from the waterline, and the gleaming spires of the City reaching toward the sky.',
    'The river traffic is a fascinating mix of past and present: sleek Thames Clippers ferry commuters at speed, while traditional wooden vessels offer leisurely cruises. Rowers from ancient rowing clubs slice through the water with practiced precision, their oars creating perfect ripples in the ancient current.',
    'The Thames at this point is tidal, and you can feel the ancient rhythm of the sea mixing with the river\'s flow. This is London\'s most fundamental geography - the reason the city exists, the highway that built an empire.',
  ],
  image: 'londonZone_thamesriver.png',
  ambientAudio: 'london_river_atmosphere.mp3',

  consoleIntro: [
    '>> RIVER THAMES - LONDON\'S HISTORIC WATERWAY',
    '>> Length: 346 km total - 64 km tidal section through London',
    '>> Historical significance: MAXIMUM - Roman trade route, royal highway',
    '>> Current location: CENTRAL LONDON - Pool of London area',
    '>> Tidal range: 7 metres at London Bridge',
    '>> Navigation: ACTIVE - Commercial, recreational, emergency services',
    '>> Water quality: IMPROVING - Fish populations recovering',
    '>> Bridge count: 35+ bridges in Greater London',
    '>> Cultural impact: IMMEASURABLE - Heart of London for 2000+ years',
    '>> Safety note: Strong tides and currents - respect the river',
  ],

  exits: {
    dock_stkatherines: 'londonZone_stkatherinesdock',
    tower_bridge_base: 'londonZone_towerbridge',
    tower_hill_shore: 'londonZone_towerhill',
    city_embankment: 'londonZone_citycentre',
    
    // River navigation
    upstream: 'londonZone_westminster',
    downstream: 'londonZone_canarywharf',
    
    // Boat destinations
    river_cruise: 'londonZone_tourist_boat',
    water_taxi: 'londonZone_thames_clipper',
    rowing_club: 'londonZone_rowing_club',
    
    // Emergency exits
    emergency_stairs: 'londonZone_river_stairs',
    life_boat_station: 'londonZone_rnli_station',
  },

  items: [
    'thames_water_sample',
    'river_navigation_chart',
    'life_jacket',
    'boat_ticket',
    'thames_driftwood',
    'river_stone',
    'vintage_boat_hook',
    'thames_river_map',
  ],

  interactables: {
    'river_current': {
      description: 'The powerful tidal current of the Thames, influenced by the sea and carrying the history of London.',
      actions: ['feel_current', 'study_flow', 'observe_tide_changes', 'respect_power'],
      requires: [],
    },
    'historic_bridges': {
      description: 'The magnificent bridges spanning the Thames, each telling a story of London\'s growth and engineering.',
      actions: ['admire', 'photograph', 'count_arches', 'study_engineering'],
      requires: [],
    },
    'river_traffic': {
      description: 'The bustling mix of boats, barges, and ships that ply the Thames in the modern era.',
      actions: ['observe', 'wave_to_passengers', 'identify_vessels', 'photograph'],
      requires: [],
    },
    'riverbank_wildlife': {
      description: 'Surprising wildlife that thrives along London\'s river, from seals to numerous bird species.',
      actions: ['observe', 'photograph', 'identify_species', 'appreciate_nature'],
      requires: [],
    },
    'historic_wharfs': {
      description: 'Ancient loading points where generations of dock workers loaded and unloaded the wealth of an empire.',
      actions: ['examine', 'imagine_history', 'photograph', 'study_construction'],
      requires: [],
    },
    'river_police_boat': {
      description: 'The Thames Police, who patrol this historic waterway and have done so since 1798.',
      actions: ['observe', 'wave', 'request_assistance', 'learn_about_duties'],
      requires: [],
    },
    'pleasure_craft': {
      description: 'Modern pleasure boats and yachts that now share the river with commercial traffic.',
      actions: ['admire', 'photograph', 'charter', 'observe_leisure_use'],
      requires: ['boat_license'],
    },
  },

  npcs: [
    'boat_captain',
    'thames_pilot',
    'river_police_officer',
    'dock_worker',
    'tourist_guide',
    'rowing_coach',
    'marine_biologist',
  ],

  events: {
    onEnter: ['feelRiverFlow', 'hearWaterLapping', 'smellRiverAir'],
    onExit: ['riverFarewell', 'rememberWaterway'],
    onInteract: {
      river_current: ['understandTidalPower', 'respectNature'],
      historic_bridges: ['appreciateEngineering', 'learnHistory'],
      river_traffic: ['observeModernCommerce', 'understandRiverUse'],
      riverbank_wildlife: ['discoverNature', 'appreciateBiodiversity'],
    },
  },

  flags: {
    riverExplored: false,
    tidesUnderstood: false,
    wildlifeSpotted: false,
    bridgesAdmired: false,
    riverHistoryLearned: false,
    navigationKnowledgeGained: false,
    waterSafetyUnderstood: false,
  },

  quests: {
    main: 'Navigate London\'s Historic River',
    optional: [
      'Understand the Thames Tidal System',
      'Spot Thames Wildlife',
      'Learn River Navigation',
      'Study Historic Bridges',
      'Meet Thames Workers',
      'Appreciate River Ecology',
      'Experience River Transportation',
    ],
  },

  environmental: {
    lighting: 'natural_river_light_with_bridge_shadows',
    temperature: 'cool_river_climate_with_water_breeze',
    airQuality: 'fresh_river_air_with_city_traces',
    soundscape: ['water_flowing', 'boat_engines', 'seagull_calls', 'bridge_traffic', 'river_workers'],
    hazards: ['strong_tidal_currents', 'boat_traffic', 'slippery_surfaces', 'changing_weather'],
  },

  security: {
    level: 'moderate_river_security',
    accessRequirements: ['water_safety_awareness', 'appropriate_vessel'],
    alarmTriggers: ['person_overboard', 'vessel_collision', 'security_incident'],
    surveillanceActive: true,
    surveillanceType: 'river_police_cctv_traffic_control',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'medium',
    estimatedPlayTime: '15-25 minutes',
    keyFeatures: [
      'Historic river navigation',
      'Tidal waterway experience',
      'River wildlife observation',
      'Maritime London culture',
      'Bridge and architecture viewing',
    ],
  },

  secrets: {
    submergedRomanDock: {
      description: 'Ancient Roman docking structures visible at extreme low tide',
      requirements: ['perfect_low_tide_timing', 'marine_archaeology_knowledge', 'waterproof_exploration_gear'],
      rewards: ['roman_artifacts', 'archaeological_discovery', 'historical_insights'],
    },
    riverTreasure: {
      description: 'Valuable items lost overboard through centuries of Thames traffic',
      requirements: ['metal_detection_equipment', 'diving_skills', 'treasure_hunting_permit'],
      rewards: ['historical_artifacts', 'valuable_finds', 'mudlark_status'],
    },
    hiddenRiverTunnel: {
      description: 'A forgotten Victorian tunnel beneath the Thames, used for emergency access',
      requirements: ['river_authority_access', 'tunnel_exploration_gear', 'historical_research'],
      rewards: ['underground_london_access', 'victorian_engineering_secrets'],
    },
  },

  customActions: {
    'mudlark_exploration': {
      description: 'Search the Thames foreshore for historical artifacts and treasures at low tide',
      requirements: ['mudlarking_permit', 'low_tide_timing', 'metal_detector'],
      effects: ['discover_historical_artifacts', 'mudlark_knowledge'],
    },
    'river_navigation': {
      description: 'Navigate the Thames using traditional river pilot techniques',
      requirements: ['boat_license', 'navigation_skills', 'tide_table_knowledge'],
      effects: ['master_river_navigation', 'thames_pilot_skills'],
    },
    'wildlife_survey': {
      description: 'Conduct a comprehensive survey of Thames river wildlife and ecology',
      requirements: ['biology_knowledge', 'survey_equipment', 'patience'],
      effects: ['thames_ecology_expertise', 'wildlife_conservation_awareness'],
    },
  },

  // London cultural elements
  londonCulture: {
    historicalPeriod: 'Roman_to_Modern_continuous_river_use',
    architecturalStyle: 'Riverside_architecture_and_bridge_engineering',
    socialClass: 'Maritime_workers_to_leisure_boaters',
    economicActivity: 'Historic_trade_route_modern_transport_tourism',
  },

  // Maritime heritage
  maritimeHeritage: {
    significance: 'Londons_highway_for_2000_years',
    historicalUse: 'Roman_trade_Medieval_commerce_Imperial_gateway',
    modernRole: 'Transport_recreation_flood_management',
    ecology: 'Recovering_wildlife_improved_water_quality',
  },
};

export default thamesriver;
