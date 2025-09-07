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

// London Hub - London Zone Exit Point with Crossing Hub Exception

import { Room } from '../types/Room';

const londonhub: Room = {
  id: 'londonhub',
  zone: 'londonZone',
  title: 'London Hub',
  description: [
    'You find yourself in a magnificent Victorian railway terminus that has been transformed into an interdimensional travel hub. The soaring iron and glass roof stretches overhead like a cathedral of travel, while ornate clock faces show times from different zones.',
    'Traditional British telephone boxes have been converted into portal booths, their red paint gleaming under the gaslight-style illumination. Each booth hums with dimensional energy and displays destination information in glowing text.',
    'The grand departure board, styled like those at St Pancras or King\'s Cross, lists destinations that span multiple realities. Platform announcements echo through the space in a crisp BBC accent, directing travelers to various dimensional departures.',
    'Comfortable leather armchairs and wooden benches provide seating for inter-zone travelers, while a traditional tea trolley serves refreshments to those awaiting their next connection.',
  ],
  image: 'londonZone_londonhub.png',
  ambientAudio: 'victorian_railway_station.mp3',

  consoleIntro: [
    '>> LONDON HUB - INTERDIMENSIONAL TERMINUS',
    '>> Status: ACTIVE TRANSIT HUB - All platforms operational',
    '>> Portal network: STABLE - Multiple destination access confirmed',
    '>> Victorian infrastructure: RESTORED - Heritage systems integrated',
    '>> Passenger services: FULL - Tea service and information available',
    '>> Time synchronization: MULTI-ZONE - Displays show universal time',
    '>> Safety protocols: BRITISH STANDARDS - Queue properly and mind the gap',
    '>> Staff services: AVAILABLE - Uniformed portal conductors on duty',
    '>> Next departures: Regular service to all connected zones',
    '>> "Stand clear of the closing doors, next stop: Other Realities"',
  ],

  exits: {
    north: 'londonZone_stkatherinesdock',
    platform_1: 'newyorkZone_timessquare',
    platform_2: 'elfhameZone_elfhame',
    platform_3: 'mazeZone_mazeroom',
    
    // EXCEPTION: Crossing Hub rule - direct to offmultiverseZone hub
    crossing_hub_portal: 'offmultiverseZone_hub',
    
    // Standard next zone progression  
    standard_exit: 'newyorkZone_timessquare',
    
    // Return to London zone areas
    local_exit: 'londonZone_citycentre',
    dimensional_return: 'introZone_crossing',
    
    // Hidden jump portal to crossing
    hidden_dimensional_tear: 'introZone_crossing',
  },

  items: [
    'platform_ticket',
    'interdimensional_timetable',
    'london_tea_blend',
    'portal_booth_token',
    'victorian_pocket_watch',
    'dimensional_compass',
    'travel_documentation',
    'zone_transfer_pass',
  ],

  interactables: {
    'departure_board': {
      description: 'A magnificent Victorian-style board displaying departures to various dimensional zones.',
      actions: ['read', 'check_times', 'plan_journey', 'study_destinations'],
      requires: [],
    },
    'portal_telephone_boxes': {
      description: 'Classic red British telephone boxes converted into dimensional travel portals.',
      actions: ['examine', 'enter', 'operate', 'select_destination'],
      requires: ['platform_ticket'],
    },
    'station_clock': {
      description: 'An ornate Victorian clock showing times across multiple dimensional zones.',
      actions: ['read_time', 'synchronize_watch', 'study_time_zones', 'appreciate_craftsmanship'],
      requires: [],
    },
    'tea_trolley': {
      description: 'A traditional British tea service trolley offering refreshments to travelers.',
      actions: ['order_tea', 'buy_biscuits', 'chat_with_attendant', 'enjoy_refreshments'],
      requires: ['london_currency'],
    },
    'information_booth': {
      description: 'A staffed information booth with uniformed portal conductors ready to assist travelers.',
      actions: ['ask_directions', 'get_travel_advice', 'purchase_tickets', 'report_issues'],
      requires: [],
    },
    'platform_benches': {
      description: 'Comfortable wooden benches where travelers wait for their dimensional connections.',
      actions: ['sit', 'rest', 'observe_travelers', 'read_timetable'],
      requires: [],
    },
    'crossing_hub_portal': {
      description: 'A special portal marked "Crossing Hub Express" that bypasses normal zone progression.',
      actions: ['examine', 'activate', 'use_express_service'],
      requires: ['crossing_hub_authorization'],
    },
    'hidden_dimensional_tear': {
      description: 'A Victorian-era dimensional tear in the station wall, revealing the infinite space of the Crossing through ornate brass framing. The portal shimmers with gaslight-style illumination and shows glimpses of the white chair beyond.',
      actions: ['examine', 'enter', 'step_through'],
      requires: ['has_jumped_in_hub'],
    },
  },

  npcs: [
    'portal_conductor',
    'station_master',
    'tea_trolley_attendant',
    'dimensional_traveler',
    'british_tourist_information',
    'platform_guard',
    'clock_maintenance_engineer',
  ],

  events: {
    onEnter: ['showHubWelcome', 'announceArrivals', 'playStationMusic'],
    onExit: ['farewellAnnouncement', 'validateTickets', 'wishSafeJourney', 'clearTemporaryPortal'],
    onInteract: {
      departure_board: ['showAvailableDestinations', 'updateTravelInformation'],
      portal_telephone_boxes: ['initiateDimensionalTravel', 'selectDestinationZone'],
      tea_trolley: ['experienceBritishHospitality', 'gainTravelEnergy'],
      crossing_hub_portal: ['offerExpressService', 'explainCrossingHubRoute'],
      hidden_dimensional_tear: ['enterCrossingPortal', 'stabilizeReality'],
    },
  },

  flags: {
    hubDiscovered: true,
    timetableStudied: false,
    teaServiceUsed: false,
    portalTicketPurchased: false,
    crossingHubAccessGranted: false,
    stationMasterMet: false,
    allDestinationsExplored: false,
    has_jumped_in_hub: false,
  },

  quests: {
    main: 'Navigate the Interdimensional Transit System',
    optional: [
      'Study All Available Destinations',
      'Experience Traditional British Tea Service',
      'Meet Fellow Dimensional Travelers',
      'Obtain Crossing Hub Authorization',
      'Help Other Travelers with Directions',
      'Learn About Portal Technology',
    ],
  },

  environmental: {
    lighting: 'warm_gaslight_style_with_natural_skylight',
    temperature: 'comfortable_heated_station_atmosphere',
    airQuality: 'clean_with_hints_of_tea_and_coal_smoke',
    soundscape: ['station_announcements', 'platform_bustle', 'portal_humming', 'tea_service_clinking'],
    hazards: ['platform_edge_safety', 'portal_energy_exposure', 'dimensional_disorientation'],
  },

  security: {
    level: 'high_transit_security',
    accessRequirements: ['valid_travel_documentation'],
    alarmTriggers: ['unauthorized_portal_access', 'platform_safety_violations', 'ticket_fraud'],
    surveillanceActive: true,
    surveillanceType: 'station_staff_and_automated_monitoring',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '12-20 minutes',
    keyFeatures: [
      'Victorian railway terminal atmosphere',
      'Interdimensional travel hub',
      'British cultural elements',
      'Crossing Hub exception route',
      'Multiple destination access',
    ],
  },

  secrets: {
    stationMasterOffice: {
      description: 'The private office of the Station Master with sensitive travel documents',
      requirements: ['gain station_master trust', 'prove_travel_authority', 'station_access_key'],
      rewards: ['master_timetable_access', 'priority_travel_privileges'],
    },
    crossingHubDirectAccess: {
      description: 'Special authorization to use the express Crossing Hub portal',
      requirements: ['complete_zone_mapping_quest', 'demonstrate_dimensional_knowledge', 'official_recommendation'],
      rewards: ['crossing_hub_authorization', 'unlimited_express_access'],
    },
    victorianTimeKeeping: {
      description: 'Understanding the complex temporal mechanics of the station clock',
      requirements: ['study station_clock extensively', 'befriend clock_maintenance_engineer', 'temporal_sensitivity'],
      rewards: ['time_synchronization_abilities', 'temporal_navigation_skills'],
    },
  },

  customActions: {
    'british_tea_ceremony': {
      description: 'Participate in a proper British tea service with fellow travelers',
      requirements: ['london_tea_blend', 'social_etiquette', 'tea_trolley_access'],
      effects: ['cultural_appreciation', 'traveler_connections'],
    },
    'platform_announcement': {
      description: 'Make an official platform announcement to help lost travelers',
      requirements: ['station_authority', 'public_speaking_skills', 'travel_knowledge'],
      effects: ['gain_station_staff_respect', 'unlock_announcement_privileges'],
    },
    'dimensional_coordination': {
      description: 'Help coordinate complex multi-zone travel itineraries',
      requirements: ['interdimensional_timetable', 'coordination_skills', 'portal_conductor_training'],
      effects: ['become_travel_coordinator', 'unlock_advanced_routing'],
    },
    'jump': {
      description: 'Jump to disturb the dimensional fabric and reveal hidden portals',
      effect: 'You leap upward with surprising force. The sudden displacement of your body through space causes a ripple in the dimensional fabric of the station. The Victorian ironwork groans slightly, and suddenly a shimmering tear appears in the far wall - an ornate brass-framed portal showing glimpses of the infinite white space of the Crossing.',
      flags: { has_jumped_in_hub: true },
      cooldown: 30000, // Portal visible for 30 seconds
      energyCost: 0,
    },
  },

  // British railway culture
  railwayCulture: {
    historicalPeriod: 'Victorian_Golden_Age_of_Railways',
    serviceStandards: 'British_punctuality_and_courtesy',
    announcements: 'BBC_standard_pronunciation',
    amenities: 'Traditional_tea_service_and_comfort',
  },

  // Zone connection rules
  zoneConnections: {
    standardProgression: 'newyorkZone_timessquare',
    crossingHubException: 'offmultiverseZone_hub',
    emergencyReturn: 'introZone_crossing',
    localTravel: 'londonZone_stkatherinesdock',
  },

  // Portal system configuration
  portalSystem: {
    portalCount: 6,
    maxSimultaneousUsers: 12,
    energyRequirement: 'stable_moderate',
    safetyProtocols: 'British_health_and_safety_standards',
  },
};

export default londonhub;
