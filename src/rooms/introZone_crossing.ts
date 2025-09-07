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

// The Crossing - introZone HUB room for inter-zone travel

import { Room } from '../types/Room';

const crossing: Room = {
  id: 'crossing',
  zone: 'introZone',
  title: 'The Crossing',
  description: [
    'You find yourself in an infinite white space that stretches endlessly in all directions. The silence here is profound, broken only by the subtle whisper of shifting realities and the gentle hum of dimensional energies.',
    'A single white chair sits in the center of this vast emptiness, its simple form somehow radiating purpose and power. This chair appears to be the key to navigating between realities.',
    'Doors of various styles rotate slowly around you at a distance - some appear ancient and wooden, others modern and metallic, still others seem to be made of pure energy. Each door leads to a different realm or reality.',
    'Strange symbols and destination codes occasionally flicker in the air near the chair, suggesting this is some kind of dimensional transport hub. The very air here feels charged with possibility.',
    'Strangely, if you survived a particularly dramatic arrival here, you might find a cup of impossibly intact quantum coffee steaming nearby, and perhaps even notice a familiar apartment door among the rotating possibilities.',
  ],
  image: 'introZone_crossing.png',
  ambientAudio: 'infinite_whispers.mp3',

  consoleIntro: [
    '>> REALITY CROSSING - DIMENSIONAL NEXUS POINT',
    '>> Location status: OUTSIDE NORMAL SPACE-TIME',
    '>> Dimensional coordinates: INFINITE/VARIABLE',
    '>> Portal matrix: ACTIVE - Unlimited destinations available',
    '>> Chair interface: NAVIGATION SYSTEM - Ready for input',
    '>> WARNING: Extended exposure may cause temporal displacement',
    '>> Reality anchor: STABLE - Safe zone established',
    '>> Navigation protocols: ACTIVE - Choose destination carefully',
    '>> Exit options: UNLIMITED - All realities accessible',
    '>> Recommend selecting destination from available stable portals',
  ],

  exits: {
    // Core introZone connections
    'chair_default': 'mystery_trent_park', // Default destination without remote control
    'door1': 'controlnexus',
    'door2': 'introreset',
    'door3': 'hiddenlab',
    
    'apartment_door': 'dalesapartment',
    
    // Inter-zone portals (HUB function) - ZONES_ORDER progression
    'portal_london': 'londonZone_stkatherinesdock', // Next zone landing
    
    // Remote control portals (conditional on remote_control in inventory)
    // When player has remote_control, these become available via modal menu
    'chair_remote_controlnexus': 'controlnexus',
    'chair_remote_controlroom': 'controlroom',
    'chair_remote_hiddenlab': 'hiddenlab',
    'chair_remote_introreset': 'introreset',
    'chair_remote_gorstanhub': 'gorstanZone_gorstanhub',
    'chair_remote_carronspire': 'gorstanZone_carronspire',
    'chair_remote_torridon': 'gorstanZone_torridon',
    'chair_remote_torridoninn': 'gorstanZone_torridoninn',
    'chair_remote_gorstanvillage': 'gorstanZone_gorstanvillage',
    'chair_remote_ravenchamber': 'glitchZone_ravenchamber',
    'chair_remote_datavoid': 'glitchZone_datavoid',
    'chair_remote_glitchinguniverse': 'glitchZone_glitchinguniverse',
    'chair_remote_failure': 'glitchZone_failure',
    'chair_remote_stkatherinesdock': 'londonZone_stkatherinesdock',
    'chair_remote_londonhub': 'londonZone_londonhub',
    'chair_remote_cafeoffice': 'londonZone_cafeoffice',
    'chair_remote_timessquare': 'newyorkZone_timessquare',
    'chair_remote_manhattanhub': 'newyorkZone_manhattanhub',
    'chair_remote_burgerjoint': 'newyorkZone_burgerjoint',
    'chair_remote_storeroom': 'newyorkZone_storeroom',
    'chair_remote_labrynthhub': 'labrynthZone_hub',
    'chair_remote_crystalcave': 'labrynthZone_crystalcave',
    'chair_remote_labyrinthentrance': 'labrynthZone_entrance',
    'chair_remote_libraryentrance': 'libraryZone_entrance',
    'chair_remote_ancientarchives': 'libraryZone_ancientarchives',
    'chair_remote_skyplatform': 'cloudZone_skyplatform',
    'chair_remote_pearldepths': 'underwaterZone_pearldepths',
    'chair_remote_nebularstation': 'spaceZone_nebularstation',
    'chair_remote_voidchamber': 'offmultiverseZone_voidchamber',
    'chair_remote_offmultiversehub': 'offmultiverseZone_hub',
    'chair_remote_trentpark': 'mystery_trent_park',
    'chair_remote_dalesapartment': 'dalesapartment',
  },

  items: [
    'navigation_crystal',
    'reality_compass',
    'dimensional_map_fragment',
    'portal_stabilizer',
    'quantum_coffee',
    'dales_apartment_key',
    'remote_control', // Key item for unlocking all hub portals
  ],

  interactables: {
    'chair': {
      description: 'A simple white chair that radiates a sense of purpose. Sitting in it would transport you away from this infinite space.',
      actions: ['examine', 'sit', 'touch'],
      requires: [],
      conditionalBehavior: {
        withRemoteControl: {
          description: 'The chair glows with enhanced power. With the remote control, you can choose any destination you\'ve previously visited.',
          actions: ['examine', 'sit_with_remote', 'show_destination_menu', 'touch'],
          effect: 'opens_modal_menu_with_visited_rooms'
        },
        withoutRemoteControl: {
          description: 'The chair offers only a single destination without the remote control.',
          actions: ['examine', 'sit_basic', 'touch'],
          effect: 'transports_to_trent_park_only'
        }
      }
    },
    'remote_control': {
      description: 'A sleek dimensional remote control that unlocks the chair\'s full navigation capabilities.',
      actions: ['examine', 'hold', 'activate', 'use_with_chair'],
      requires: [],
      special: 'unlocks_modal_destination_menu'
    },
    'control_panel': {
      description: 'A sleek crystalline control panel materializes near the chair when you approach. Its surface glows with teleportation symbols and destination codes.',
      actions: ['examine', 'press', 'activate', 'touch'],
      requires: [],
    },
    'navigation_console': {
      description: 'An advanced interface that appears when you interact with the chair, showing available dimensional destinations.',
      actions: ['examine', 'navigate', 'select_destination', 'activate_portal'],
      requires: ['dimensional_clearance'],
      conditionalBehavior: {
        withRemoteControl: {
          description: 'The console displays a comprehensive list of all rooms you\'ve previously visited.',
          actions: ['examine', 'browse_all_destinations', 'select_from_visited', 'activate_portal'],
          effect: 'shows_modal_menu_with_visited_rooms_list'
        },
        withoutRemoteControl: {
          description: 'The console shows only one available destination: Trent Park.',
          actions: ['examine', 'view_limited_options', 'select_trent_park', 'activate_portal'],
          effect: 'shows_only_trent_park_option'
        }
      }
    },
    'rotating_doors': {
      description: 'Multiple doors of different styles that slowly rotate around the space, each leading to different realities.',
      actions: ['examine', 'approach', 'enter', 'analyze_destination'],
      requires: [],
    },
    'portal_matrix': {
      description: 'The underlying dimensional framework that enables travel between realities.',
      actions: ['examine', 'calibrate', 'stabilize', 'expand'],
      requires: ['portal_stabilizer'],
    },
    'dimensional_anchor': {
      description: 'A stable point in this reality that prevents dimensional drift and ensures safe return.',
      actions: ['examine', 'strengthen', 'maintain', 'expand_range'],
      requires: ['reality_compass'],
    },
    'quantum_coffee': {
      description: 'A cup of impossibly perfect coffee that somehow survived your dramatic arrival.',
      actions: ['examine', 'drink', 'analyze', 'appreciate'],
      requires: [],
    },
    'apartment_door': {
      description: 'A familiar-looking door with a brass nameplate reading "Dale & Polly". This door only appears if you possess the apartment key.',
      actions: ['examine', 'enter', 'unlock'],
      requires: ['dales_apartment_key'],
    },
  },

  npcs: [
    'dimensional_guardian',
    'reality_guide',
    'crossing_keeper',
  ],

  events: {
    onEnter: ['activateInfiniteSpace', 'startDoorRotation', 'showNavigationOptions', 'checkRemoteControlInventory'],
    onExit: ['recordDestination', 'stabilizeReality'],
    onInteract: {
      chair: ['checkInventoryForRemoteControl', 'showAppropriateDestinationOptions', 'initiateTeleport'],
      'chair:sit': ['checkRemoteControlStatus', 'showDestinationModal', 'processDestinationChoice'],
      'chair:sit_with_remote': ['showVisitedRoomsModal', 'allowDestinationSelection', 'initiateTeleport'],
      'chair:sit_basic': ['transportToTrentPark', 'showBasicTransportMessage'],
      rotating_doors: ['showDoorVisions', 'triggerDisorientation', 'revealSymbols'],
      portal_matrix: ['checkStability', 'verifyDestination', 'allowEntry'],
      remote_control: ['unlockAllPortals', 'showFullDestinationMatrix', 'enableModalMenu'],
      navigation_console: ['checkRemoteControlInventory', 'displayAvailableDestinations', 'processSelection'],
    },
  },

  flags: {
    infiniteSpace: true,
    doorsRotating: true,
    chairAvailable: true,
    guideEncountered: false,
    destinationChosen: false,
    realityStable: true,
    hubFunctionality: true, // Marks this as zone HUB
    interZoneTransitAvailable: true,
    remoteControlFound: false,
    remoteControlInInventory: false,
    modalMenuActive: false,
    visitedRoomsTracked: true,
    basicChairMode: true, // Default mode without remote control
    enhancedChairMode: false, // Activated with remote control
  },

  quests: {
    main: 'Choose Your Destination',
    optional: [
      'Decipher the Door Symbols',
      'Understand the Chair\'s Purpose',
      'Communicate with the Guardian',
      'Map the Stable Portals',
      'Find the Remote Control',
      'Unlock All Zone Portals',
      'Master the Modal Destination Menu',
    ],
  },

  // Custom modal menu system for chair destinations
  modalMenuSystem: {
    triggerCondition: 'remote_control_in_inventory',
    menuType: 'visited_rooms_destination_selector',
    defaultDestination: 'mystery_trent_park',
    enhancedDestinations: [
      // Visited rooms will be populated dynamically by the game engine
      // This list represents the maximum possible destinations
      { id: 'controlnexus', name: 'Control Nexus', zone: 'introZone' },
      { id: 'controlroom', name: 'Control Room', zone: 'introZone' },
      { id: 'hiddenlab', name: 'Hidden Lab', zone: 'introZone' },
      { id: 'introreset', name: 'Intro Reset', zone: 'introZone' },
      { id: 'gorstanhub', name: 'Gorstan Hub', zone: 'gorstanZone' },
      { id: 'carronspire', name: 'Carron Spire', zone: 'gorstanZone' },
      { id: 'torridon', name: 'Torridon', zone: 'gorstanZone' },
      { id: 'torridoninn', name: 'Torridon Inn', zone: 'gorstanZone' },
      { id: 'gorstanvillage', name: 'Gorstan Village', zone: 'gorstanZone' },
      { id: 'ravenchamber', name: 'Raven Chamber', zone: 'glitchZone' },
      { id: 'datavoid', name: 'Data Void', zone: 'glitchZone' },
      { id: 'glitchinguniverse', name: 'Glitching Universe', zone: 'glitchZone' },
      { id: 'failure', name: 'Failure', zone: 'glitchZone' },
      { id: 'stkatherinesdock', name: 'St Katherine\'s Dock', zone: 'londonZone' },
      { id: 'londonhub', name: 'London Hub', zone: 'londonZone' },
      { id: 'cafeoffice', name: 'Café Office', zone: 'londonZone' },
      { id: 'timessquare', name: 'Times Square', zone: 'newyorkZone' },
      { id: 'manhattanhub', name: 'Manhattan Hub', zone: 'newyorkZone' },
      { id: 'burgerjoint', name: 'Burger Joint', zone: 'newyorkZone' },
      { id: 'storeroom', name: 'Storeroom', zone: 'newyorkZone' },
      { id: 'labrynthhub', name: 'Labyrinth Hub', zone: 'labrynthZone' },
      { id: 'crystalcave', name: 'Crystal Cave', zone: 'labrynthZone' },
      { id: 'labyrinthentrance', name: 'Labyrinth Entrance', zone: 'labrynthZone' },
      { id: 'libraryentrance', name: 'Library Entrance', zone: 'libraryZone' },
      { id: 'ancientarchives', name: 'Ancient Archives', zone: 'libraryZone' },
      { id: 'skyplatform', name: 'Sky Platform', zone: 'cloudZone' },
      { id: 'pearldepths', name: 'Pearl Depths', zone: 'underwaterZone' },
      { id: 'nebularstation', name: 'Nebular Station', zone: 'spaceZone' },
      { id: 'voidchamber', name: 'Void Chamber', zone: 'offmultiverseZone' },
      { id: 'offmultiversehub', name: 'Off-Multiverse Hub', zone: 'offmultiverseZone' },
      { id: 'trentpark', name: 'Trent Park', zone: 'external' },
      { id: 'dalesapartment', name: 'Dale\'s Apartment', zone: 'external' },
    ],
  },

  environmental: {
    lighting: 'brilliant_white_without_glare',
    temperature: 'perfectly_neutral',
    airQuality: 'pure_and_breathable',
    soundscape: ['infinite_silence', 'whisper_of_shifting_realities', 'dimensional_harmonics'],
    hazards: ['temporal_displacement_risk', 'reality_disorientation'],
  },

  security: {
    level: 'transcendent',
    accessRequirements: ['dimensional_clearance'],
    alarmTriggers: ['reality_manipulation_attempts'],
    surveillanceActive: false,
    surveillanceType: 'exists_outside_normal_monitoring',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '5-15 minutes',
    keyFeatures: [
      'Infinite white space',
      'Single navigation chair',
      'Rotating door matrix',
      'Multiple destination choices',
      'Reality crossroads theme',
      'Inter-zone hub functionality',
    ],
  },

  secrets: {
    hidden_destination: {
      description: 'A secret door that only appears under specific conditions',
      requirements: ['complete all introZone quests', 'possess navigation_crystal', 'demonstrate worthiness'],
      rewards: ['access_to_secret_realm', 'dimensional_mastery'],
    },
    master_navigator: {
      description: 'Ultimate control over the crossing\'s navigation system',
      requirements: ['find remote_control', 'visit all available zones', 'understand dimensional mechanics'],
      rewards: ['unlimited_travel_access', 'reality_architect_status'],
    },
    crossingOrigin: {
      description: 'The truth about how and why this crossing exists',
      requirements: ['commune with dimensional_guardian', 'analyze portal_matrix', 'piece together dimensional_map_fragments'],
      rewards: ['crossing_creation_knowledge', 'dimensional_history_understanding'],
    },
  },

  customActions: {
    'activate_portal_matrix': {
      description: 'Use the remote control to activate all zone portals simultaneously',
      requirements: ['remote_control', 'dimensional_clearance', 'portal_stabilizer'],
      effects: ['unlock_all_zone_hubs', 'gain_master_navigator_status'],
    },
    'stabilize_crossing': {
      description: 'Reinforce the dimensional anchor to create a more stable crossing point',
      requirements: ['reality_compass', 'portal_stabilizer', 'navigation_crystal'],
      effects: ['improve_crossing_stability', 'reduce_dimensional_hazards'],
    },
    'commune_with_infinity': {
      description: 'Meditate in the infinite space to gain deeper understanding',
      requirements: ['infinite_patience', 'dimensional_sensitivity', 'clear_mind'],
      effects: ['gain_cosmic_insight', 'reveal_hidden_destinations'],
    },
    // Remote control chair functionality
    'chair_sit_with_remote_control': {
      description: 'Sit in the chair while holding the remote control to access all visited destinations',
      requirements: ['remote_control_in_inventory'],
      effects: ['show_visited_rooms_modal', 'enable_destination_selection'],
      triggerEvent: 'openDestinationModal',
    },
    'chair_sit_without_remote_control': {
      description: 'Sit in the chair without the remote control - only Trent Park is available',
      requirements: ['no_remote_control_in_inventory'],
      effects: ['transport_to_trent_park_directly'],
      triggerEvent: 'transportToTrentPark',
    },
    'show_destination_modal': {
      description: 'Display modal menu showing all rooms the player has previously visited',
      requirements: ['remote_control_in_inventory', 'chair_interaction'],
      effects: ['display_modal_destination_menu', 'pause_game_for_selection'],
      triggerEvent: 'showModalMenu',
    },
    'select_destination_from_modal': {
      description: 'Choose a destination from the modal menu and travel there',
      requirements: ['modal_menu_active', 'destination_selected'],
      effects: ['transport_to_selected_room', 'close_modal_menu'],
      triggerEvent: 'executeDestinationSelection',
    },
  },

  // Hub-specific portal network with remote control functionality
  portalNetwork: {
    standardDestination: 'londonZone_stkatherinesdock', // Next in ZONES_ORDER
    remoteControlDestinations: {
      // Unlocked when player has remote_control
      'london': 'londonZone_londenhub',
      'newyork': 'newyorkZone_newyorkhub',
      'offmultiverse': 'offmultiverseZone_hub',
      'elfhame': 'elfhameZone_faeglade',
      'glitch': 'glitchZone_datavoid',
      'maze': 'mazeZone_mazehub',
      'gorstan': 'gorstanZone_gorstanvillage',
      'offgorstan': 'offgorstanZone_hub',
      'stanton': 'stantonZone_villagegreen',
    },
  },

  // Dimensional mechanics specific to crossing
  dimensionalMechanics: {
    stabilityLevel: 'maximum',
    portalCapacity: 'unlimited',
    realityAnchorStrength: 'absolute',
    temporalDriftRisk: 'minimal',
  },
};

export default crossing;
