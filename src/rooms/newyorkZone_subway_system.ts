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

// NYC Subway System - The Veins of the City

import { Room } from '../types/Room';

const subwaysystem: Room = {
  id: 'subwaysystem',
  zone: 'newyorkZone',
  title: 'NYC Subway System',
  description: [
    'You descend into the vast underground network that is the NYC subway system, one of the world\'s most extensive and complex urban transit networks. The platforms buzz with the constant flow of millions of New Yorkers navigating their daily lives through these underground arteries.',
    'The iconic subway tiles, some dating back over a century, tell the story of the city\'s growth and evolution. Express trains thunder past local stops while passengers wait with practiced patience, each absorbed in their own private world despite being surrounded by humanity.',
    'The subway is a democratic space where all of New York converges - Wall Street executives stand next to artists, tourists clutch maps while locals navigate by muscle memory, and street musicians fill the tunnels with echoing melodies that compete with the screech of brakes and rumble of wheels on tracks.',
    'Despite its challenges, there\'s something almost magical about this underground city - the way it connects every corner of the five boroughs, the unwritten rules of subway etiquette, and the shared experience of millions of people moving through the same tunnels in pursuit of their dreams.',
  ],
  image: 'newyorkZone_subway.png',
  ambientAudio: 'nyc_subway_atmosphere.mp3',

  consoleIntro: [
    '>> NYC SUBWAY SYSTEM - UNDERGROUND TRANSIT NETWORK',
    '>> System size: 472 stations across 26 lines',
    '>> Daily ridership: 5.5+ million passengers',
    '>> Track miles: 665 miles of revenue track',
    '>> Operating authority: MTA (Metropolitan Transportation Authority)',
    '>> Service hours: 24/7 - Limited service during overnight hours',
    '>> Annual ridership: 1.7+ billion passenger trips',
    '>> Historic significance: Opened 1904, continuous expansion',
    '>> Accessibility: Ongoing improvements for disability access',
    '>> "Stand clear of the closing doors, please"',
  ],

  exits: {
    // Major stations/destinations
    times_square_station: 'newyorkZone_timessquare',
    central_park_station: 'newyorkZone_centralpark',
    broadway_station: 'newyorkZone_broadway',
    manhattan_hub_station: 'newyorkZone_manhattanhub',
    
    // Transit connections
    express_uptown: 'newyorkZone_upperwestside',
    express_downtown: 'newyorkZone_downtown',
    local_crosstown: 'newyorkZone_hellskitchen',
    brooklyn_bridge: 'newyorkZone_brooklynbridge',
    
    // Service areas
    train_yard: 'newyorkZone_subway_yard',
    control_center: 'newyorkZone_transit_control',
    lost_and_found: 'newyorkZone_subway_lost_found',
    
    // Emergency exits
    emergency_surface: 'newyorkZone_timessquare',
    maintenance_tunnel: 'newyorkZone_subway_maintenance',
  },

  items: [
    'metro_card',
    'subway_map',
    'train_schedule',
    'emergency_contact_card',
    'dropped_wallet',
    'musician_cd',
    'subway_token_vintage',
    'mta_employee_badge',
  ],

  interactables: {
    'subway_trains': {
      description: 'The iconic subway cars that carry millions of passengers through the underground network.',
      actions: ['board', 'observe', 'listen_to_announcements', 'people_watch'],
      requires: ['metro_card'],
    },
    'platform_musicians': {
      description: 'Talented performers who bring music to the underground tunnels.',
      actions: ['listen', 'tip', 'request_song', 'appreciate_talent'],
      requires: [],
    },
    'subway_map': {
      description: 'Complex diagram showing the intricate web of subway lines throughout NYC.',
      actions: ['study', 'plan_route', 'photograph', 'get_directions'],
      requires: [],
    },
    'turnstiles': {
      description: 'The entry gates that control access to the subway system.',
      actions: ['swipe_card', 'observe_flow', 'help_tourist', 'count_passengers'],
      requires: ['metro_card'],
    },
    'emergency_call_boxes': {
      description: 'Safety communication devices placed throughout the subway system.',
      actions: ['examine', 'test_connection', 'report_incident', 'learn_procedures'],
      requires: ['emergency_situation'],
    },
    'subway_tiles': {
      description: 'Historic ceramic tiles that line many stations, some over 100 years old.',
      actions: ['admire', 'photograph', 'study_history', 'trace_patterns'],
      requires: [],
    },
    'train_conductor': {
      description: 'MTA employees who operate the trains and ensure passenger safety.',
      actions: ['ask_directions', 'report_issues', 'learn_about_job', 'appreciate_service'],
      requires: [],
    },
  },

  npcs: [
    'train_conductor',
    'mta_worker',
    'subway_musician',
    'commuter',
    'tourist_with_map',
    'station_agent',
    'transit_police_officer',
  ],

  events: {
    onEnter: ['hearTrainApproaching', 'feelUndergroundEnergy', 'experienceNYCPulse'],
    onExit: ['subwayFarewell', 'returnToSurface'],
    onInteract: {
      subway_trains: ['experienceNYCTransit', 'observeUrbanLife'],
      platform_musicians: ['appreciateStreetArt', 'supportUndergroundCulture'],
      subway_map: ['navigateComplexity', 'understandUrbanGeography'],
      turnstiles: ['participateInFlow', 'becomePartOfSystem'],
    },
  },

  flags: {
    subwayNavigated: false,
    musicianEncountered: false,
    mapStudied: false,
    commuterExperienceGained: false,
    emergencyProceduresLearned: false,
    historicalTilesAppreciated: false,
    transitSystemUnderstood: false,
  },

  quests: {
    main: 'Navigate NYC\'s Underground Transit System',
    optional: [
      'Master the Subway Map',
      'Experience Rush Hour Commuting',
      'Appreciate Platform Musicians',
      'Learn Subway History',
      'Help a Lost Tourist',
      'Understand Transit Operations',
      'Explore Different Subway Lines',
    ],
  },

  environmental: {
    lighting: 'fluorescent_underground_with_train_lights',
    temperature: 'cool_underground_with_train_heat',
    airQuality: 'recycled_underground_air_with_exhaust',
    soundscape: ['train_rumbling', 'brake_screeching', 'announcements', 'footsteps', 'conversations'],
    hazards: ['moving_trains', 'platform_gaps', 'crowded_conditions', 'occasional_service_delays'],
  },

  security: {
    level: 'high_transit_security',
    accessRequirements: ['metro_card_payment'],
    alarmTriggers: ['fare_evasion', 'safety_incidents', 'suspicious_activity'],
    surveillanceActive: true,
    surveillanceType: 'mta_police_cctv_emergency_systems',
  },

  metadata: {
    created: '2025-09-07',
    lastModified: '2025-09-07',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'medium',
    estimatedPlayTime: '15-20 minutes',
    keyFeatures: [
      'NYC transit system',
      'Underground urban culture',
      'Complex navigation',
      'Diverse passenger experience',
      'Historic infrastructure',
    ],
  },

  secrets: {
    abandonedStation: {
      description: 'A forgotten subway station that was closed decades ago but still exists',
      requirements: ['mta_worker_connection', 'urban_exploration_permit', 'historical_research'],
      rewards: ['abandoned_station_access', 'subway_history_artifacts', 'urban_explorer_status'],
    },
    ghostTrain: {
      description: 'Late-night maintenance trains that run mysterious routes through unused tunnels',
      requirements: ['overnight_subway_access', 'mta_insider_knowledge', 'brave_exploration'],
      rewards: ['ghost_train_sighting', 'hidden_tunnel_knowledge'],
    },
    transitMasterKey: {
      description: 'A master key that provides access to restricted areas of the subway system',
      requirements: ['senior_mta_employee_trust', 'prove_system_knowledge', 'security_clearance'],
      rewards: ['restricted_area_access', 'subway_master_knowledge'],
    },
  },

  customActions: {
    'subway_photography': {
      description: 'Document the artistic and cultural aspects of the subway system',
      requirements: ['photography_permit', 'artistic_eye', 'patience'],
      effects: ['subway_photography_portfolio', 'underground_art_appreciation'],
    },
    'rush_hour_survival': {
      description: 'Successfully navigate the subway during peak rush hour periods',
      requirements: ['patience', 'crowd_navigation_skills', 'stress_tolerance'],
      effects: ['rush_hour_veteran_status', 'NYC_commuter_credibility'],
    },
    'busking_performance': {
      description: 'Perform music in the subway stations (with proper permits)',
      requirements: ['musical_talent', 'performance_permit', 'thick_skin'],
      effects: ['subway_busker_status', 'underground_performer_experience'],
    },
  },

  // New York cultural elements
  newyorkCulture: {
    significance: 'Democratic_transit_all_social_classes',
    efficiency: 'Critical_infrastructure_city_function',
    diversity: 'Microcosm_of_NYC_population',
    character: 'Gritty_authentic_New_York_experience',
  },

  // Transit heritage
  transitHeritage: {
    history: 'Over_century_of_continuous_operation',
    engineering: 'Marvel_of_urban_infrastructure',
    culture: 'Unique_subway_etiquette_and_traditions',
    evolution: 'Constant_modernization_and_expansion',
  },
};

export default subwaysystem;
