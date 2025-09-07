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

// Manhattan Hub - New York Zone Hub with Crossing Hub Exception

import { Room } from '../types/Room';

const manhattanhub: Room = {
  id: 'manhattanhub',
  zone: 'newyorkZone',
  title: 'Manhattan Hub',
  description: [
    'You stand in an extraordinary dimensional nexus disguised as a sleek modern Manhattan office building lobby. Soaring glass walls offer breathtaking views of the Manhattan skyline while concealing the building\'s true nature as an interdimensional transportation hub.',
    'The polished marble floors reflect not just the ceiling lights, but occasional glimpses of other dimensions flickering like mirages. High-tech elevators line the walls, but their destination panels show mysterious symbols alongside floor numbers - coordinates for worlds beyond this reality.',
    'Business people in sharp suits move purposefully through the space, some carrying briefcases that shimmer with otherworldly energy. The air hums with barely perceptible dimensional frequency, creating a sense that this place exists simultaneously in multiple realities.',
    'At the center of the lobby stands an imposing security desk with monitors displaying both building surveillance and interdimensional traffic control. Behind the guards, a massive digital directory lists not just companies, but entire universes accessible through this sophisticated portal network.',
    'The crossing hub portal gleams with special significance - a direct express route to the Off-Multiverse Zone that bypasses all normal dimensional restrictions.'
  ],
  image: 'newyorkZone_manhattanhub.png',
  ambientAudio: 'manhattan_hub_ambience.mp3',

  consoleIntro: [
    '>> MANHATTAN HUB - NYC DIMENSIONAL NEXUS',
    '>> Building status: ACTIVE - 47-story dimensional facility',
    '>> Elevator system: INTERDIMENSIONAL - Multi-reality transport enabled',
    '>> Security clearance: CORPORATE LEVEL - Authorized dimensional personnel only',
    '>> Portal network: FULLY OPERATIONAL - 8 active dimensional gateways',
    '>> Traffic control: MANHATTAN CENTRAL - Monitoring all NYC zone transits',
    '>> CROSSING HUB EXCEPTION: Direct route to Off-Multiverse Zone activated',
    '>> Business hours: 24/7 - Dimensional commerce never sleeps',
    '>> Current occupancy: 2,847 beings across 12 dimensions',
    '>> "Welcome to Manhattan Interdimensional Corporate Headquarters"',
  ],

  exits: {
    north: 'newyorkZone_timessquare',
    south: 'newyorkZone_brooklynbridge',
    east: 'newyorkZone_eastside',
    west: 'newyorkZone_westside',
    
    // Standard zone progression
    up: 'newyorkZone_skyscraper_top',
    down: 'newyorkZone_subway_system',
    
    // NYC zone connections
    elevator_express: 'newyorkZone_centralpark',
    elevator_local: 'newyorkZone_burgerjoint',
    elevator_service: 'newyorkZone_storeroom',
    
    // Zone progression
    next_zone: 'labrynthZone_entrance',
    previous_zone: 'londonZone_londonhub',
    
    // CROSSING HUB EXCEPTION ROUTE - Direct to Off-Multiverse Zone
    crossing_hub_portal: 'offmultiverseZone_hub',
    
    // Return routes
    dimensional_return: 'introZone_crossing',
    emergency_exit: 'gorstanZone_gorstanhub',
    
    // Hidden jump portal to crossing
    hidden_elevator_shaft: 'introZone_crossing',
  },

  items: [
    'corporate_id_badge',
    'dimensional_business_card',
    'elevator_access_key',
    'manhattan_skyline_photo',
    'interdimensional_briefcase',
    'portal_frequency_scanner',
    'nyc_corporate_directory',
    'security_clearance_pass',
  ],

  interactables: {
    'dimensional_elevators': {
      description: 'High-tech elevators with panels showing both floor numbers and dimensional coordinates.',
      actions: ['ride', 'study_controls', 'access_hidden_floors', 'calibrate_dimensional_settings'],
      requires: ['elevator_access_key'],
    },
    'security_desk': {
      description: 'Advanced security station monitoring both building and interdimensional traffic.',
      actions: ['speak_with_guards', 'view_monitors', 'request_access', 'check_directory'],
      requires: [],
    },
    'dimensional_directory': {
      description: 'Massive digital display listing companies, floors, and dimensional coordinates.',
      actions: ['search_listings', 'find_destination', 'decode_coordinates', 'access_archives'],
      requires: [],
    },
    'manhattan_skyline_windows': {
      description: 'Floor-to-ceiling windows offering spectacular views of Manhattan.',
      actions: ['admire_view', 'photograph', 'spot_landmarks', 'detect_dimensional_overlays'],
      requires: [],
    },
    'corporate_reception': {
      description: 'Elegant reception area serving both mundane business and dimensional travelers.',
      actions: ['get_information', 'schedule_appointment', 'register_visit', 'request_assistance'],
      requires: [],
    },
    'crossing_hub_portal': {
      description: 'A special express portal with unusual blue energy, leading directly to the Off-Multiverse Zone.',
      actions: ['examine_portal', 'activate_crossing_route', 'study_energy_signature', 'enter_off_multiverse'],
      requires: ['crossing_hub_clearance'],
    },
    'business_travelers': {
      description: 'Suited professionals moving between realities with practiced efficiency.',
      actions: ['observe', 'network', 'exchange_cards', 'learn_routes'],
      requires: ['corporate_attire'],
    },
    'hidden_elevator_shaft': {
      description: 'A sleek corporate elevator shaft that opened in the marble floor, its digital display showing "CROSSING - EXECUTIVE LEVEL". The shaft descends into pure white space with holographic destination displays floating around the entrance.',
      actions: ['examine', 'enter', 'step_into_shaft'],
      requires: ['has_jumped_in_hub'],
    },
  },

  npcs: [
    'security_chief_martinez',
    'dimensional_receptionist',
    'corporate_executive_dimensional',
    'elevator_operator_jenkins',
    'interdimensional_businessman',
    'portal_technician',
    'crossing_hub_specialist',
  ],

  events: {
    onEnter: ['showManhattanHub', 'detectDimensionalFrequency', 'receiveCorporateWelcome'],
    onExit: ['manhattanHubFarewell', 'clearSecurityProtocols', 'clearTemporaryPortal'],
    onInteract: {
      dimensional_elevators: ['experienceAdvancedTransport', 'learnDimensionalNavigation'],
      crossing_hub_portal: ['discoverExpressRoute', 'enableOffMultiverseAccess'],
      security_desk: ['establishClearance', 'gainBuildingAccess'],
      dimensional_directory: ['exploreUniversalListings', 'mapDimensionalNetwork'],
      hidden_elevator_shaft: ['enterCrossingPortal', 'stabilizeReality'],
    },
  },

  flags: {
    manhattanHubDiscovered: true,
    elevatorAccessGranted: false,
    directorySearched: false,
    skylineViewed: false,
    crossingHubPortalFound: false,
    securityClearanceObtained: false,
    corporateNetworkingDone: false,
    has_jumped_in_hub: false,
  },

  quests: {
    main: 'Navigate the Manhattan Dimensional Hub',
    optional: [
      'Obtain Security Clearance for Elevator Access',
      'Map the Dimensional Directory Network',
      'Establish Corporate Connections',
      'Discover the Crossing Hub Portal Route',
      'Experience Manhattan Skyline Views',
      'Learn Interdimensional Business Protocols',
    ],
  },

  environmental: {
    lighting: 'professional_corporate_with_dimensional_shimmer',
    temperature: 'climate_controlled_perfect_comfort',
    airQuality: 'filtered_air_with_dimensional_ionization',
    soundscape: ['elevator_chimes', 'business_conversations', 'portal_humming', 'city_ambience'],
    hazards: ['dimensional_instability_minor', 'corporate_security_protocols'],
  },

  security: {
    level: 'corporate_high_security',
    accessRequirements: ['business_justification', 'dimensional_clearance'],
    alarmTriggers: ['unauthorized_elevator_access', 'portal_tampering', 'security_breach'],
    surveillanceActive: true,
    surveillanceType: 'advanced_multidimensional_monitoring',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate_to_challenging',
    estimatedPlayTime: '20-30 minutes',
    keyFeatures: [
      'Corporate dimensional nexus',
      'Crossing hub exception route',
      'Manhattan business atmosphere',
      'Advanced elevator system',
      'Direct Off-Multiverse access',
    ],
  },

  secrets: {
    corporateConspiracy: {
      description: 'Evidence of a massive interdimensional corporate conspiracy',
      requirements: ['executive_clearance', 'access_secret_files', 'decode_corporate_communications'],
      rewards: ['conspiracy_knowledge', 'corporate_insider_access'],
    },
    dimensionalElevatorOverride: {
      description: 'Master access codes to override all elevator dimensional restrictions',
      requirements: ['technician_tools', 'elevator_engineering_knowledge', 'security_override_codes'],
      rewards: ['unlimited_elevator_access', 'dimensional_transport_mastery'],
    },
    manhattanUnderground: {
      description: 'Secret tunnels beneath Manhattan connecting to ancient dimensional networks',
      requirements: ['underground_access', 'historical_research', 'tunnel_navigation_skills'],
      rewards: ['access_to_ancient_portals', 'manhattan_underground_knowledge'],
    },
  },

  customActions: {
    'corporate_networking': {
      description: 'Establish business connections across multiple dimensions',
      requirements: ['corporate_attire', 'business_cards', 'social_skills'],
      effects: ['interdimensional_contacts', 'business_opportunities'],
    },
    'elevator_mastery': {
      description: 'Learn to navigate the complex dimensional elevator system',
      requirements: ['elevator_access_key', 'dimensional_coordinates_knowledge', 'technical_aptitude'],
      effects: ['elevator_expertise', 'dimensional_navigation_skills'],
    },
    'skyline_documentation': {
      description: 'Create comprehensive documentation of Manhattan\'s dimensional overlays',
      requirements: ['professional_camera', 'dimensional_detection_equipment', 'analytical_skills'],
      effects: ['manhattan_dimensional_map', 'architectural_analysis'],
    },
    'jump': {
      description: 'Jump to disturb the dimensional fabric and reveal hidden portals',
      effect: 'You leap upward with corporate efficiency. Your sudden vertical displacement causes the polished marble floor to pulse with hidden energy signatures. A section of the floor slides away with a smooth mechanical hum, revealing a sleek elevator shaft descending into brilliant white space. Digital displays appear around the opening, showing "CROSSING - EXECUTIVE LEVEL".',
      flags: { has_jumped_in_hub: true },
      cooldown: 30000, // Portal visible for 30 seconds
      energyCost: 0,
    },
  },

  // Crossing Hub Exception Implementation
  crossingHubException: {
    directRoute: 'offmultiverseZone_hub',
    requirements: ['crossing_hub_clearance'],
    description: 'Express portal bypassing normal dimensional restrictions',
    activationMethod: 'crossing_hub_portal',
  },

  // Manhattan corporate culture
  corporateCulture: {
    businessStyle: 'high_powered_multidimensional_commerce',
    networkingOpportunities: 'extensive_interdimensional_contacts',
    professionalLevel: 'executive_corporate_environment',
    innovationFocus: 'dimensional_technology_and_transport',
  },
};

export default manhattanhub;
