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

// Café Office - London Zone Mesh Room with 34 Chair Destinations

import { Room } from '../types/Room';

const cafeoffice: Room = {
  id: 'cafeoffice',
  zone: 'londonZone',
  title: 'Café Office',
  description: [
    'You enter a uniquely London establishment - a café that doubles as a co-working space, where the aroma of expertly brewed coffee mingles with the quiet energy of creative professionals. The space feels both intimate and expansive, with exposed brick walls and large windows overlooking the Thames.',
    'Thirty-four carefully curated chairs are arranged throughout the space, each one different and seemingly chosen for both comfort and character. Some are vintage leather armchairs perfect for deep thinking, others are ergonomic desk chairs for productivity, and a few are quirky artistic pieces that serve as conversation starters.',
    'Each chair sits at its own small table or workspace, equipped with power outlets, notebooks, and a small placard with a cryptic destination name. The chairs seem to hum with an almost imperceptible energy, as if they\'re connected to something far beyond this cozy London café.',
    'Baristas move efficiently between the espresso machine and laptop-wielding customers, while soft jazz plays in the background. Yet there\'s something distinctly otherworldly about this place - as if sitting in the right chair might transport you somewhere entirely unexpected.',
  ],
  image: 'londonZone_cafeoffice.png',
  ambientAudio: 'london_cafe_coworking.mp3',

  consoleIntro: [
    '>> CAFÉ OFFICE - DIMENSIONAL MESH POINT',
    '>> Total chair destinations: 34 unique locations',
    '>> Coffee quality: EXCEPTIONAL - Artisan roasted beans',
    '>> WiFi strength: EXCELLENT - Gigabit fiber connection',
    '>> Dimensional stability: STABLE - All chairs tested and certified',
    '>> Working atmosphere: PRODUCTIVE - Conducive to creativity',
    '>> Customer capacity: 34 individual workstations',
    '>> Portal energy: SUBTLE - Integrated into furniture',
    '>> Safety rating: EXCELLENT - No reported travel incidents',
    '>> "Where every seat is a journey waiting to happen"',
  ],

  exits: {
    outside: 'londonZone_stkatherinesdock',
    
    // 34 chair destinations - mesh room system
    chair01: 'introZone_controlroom',
    chair02: 'introZone_hiddenlab',
    chair03: 'gorstanZone_carronspire',
    chair04: 'gorstanZone_torridoninn',
    chair05: 'glitchZone_ravenchamber',
    chair06: 'glitchZone_datavoid',
    chair07: 'elfhameZone_elfhame',
    chair08: 'elfhameZone_faeglade',
    chair09: 'mazeZone_mazehub',
    chair10: 'mazeZone_secretmazeentry',
    chair11: 'stantonZone_villagegreen',
    chair12: 'stantonZone_stantonharcourt',
    chair13: 'newyorkZone_centralpark',
    chair14: 'newyorkZone_timessquare',
    chair15: 'offmultiverseZone_observationroom',
    chair16: 'offgorstanZone_ancientvault',
    chair17: 'latticeZone_primeconfluence',
    chair18: 'latticeZone_libraryofnine',
    chair19: 'gorstanZone_gorstanvillage',
    chair20: 'introZone_introreset',
    chair21: 'glitchZone_glitchinguniverse',
    chair22: 'elfhameZone_faelake',
    chair23: 'mazeZone_mirrorhall',
    chair24: 'stantonZone_ascendantStanton',
    chair25: 'newyorkZone_manhattanhub',
    chair26: 'offmultiverseZone_controlnexusreturned',
    chair27: 'offgorstanZone_multiversehub',
    chair28: 'latticeZone_hiddenlibrary',
    chair29: 'mazeZone_pollysbay',
    chair30: 'elfhameZone_faelakenorthshore',
    chair31: 'glitchZone_failure',
    chair32: 'stantonZone_glitchStanton',
    chair33: 'newyorkZone_aevirawarehouse',
    chair34: 'offgorstanZone_exit',
  },

  items: [
    'artisan_coffee',
    'laptop_with_wifi',
    'chair_destination_guide',
    'cafe_loyalty_card',
    'coworking_day_pass',
    'notebook_and_pen',
    'phone_charger',
    'bluetooth_headphones',
  ],

  interactables: {
    'chair_collection': {
      description: 'An eclectic collection of 34 unique chairs, each with its own character and mysterious destination.',
      actions: ['examine_all', 'test_comfort', 'read_destinations', 'choose_carefully'],
      requires: [],
    },
    'espresso_bar': {
      description: 'A professional-grade espresso machine tended by skilled baristas who craft perfect coffee.',
      actions: ['order_coffee', 'watch_preparation', 'chat_with_barista', 'learn_techniques'],
      requires: ['london_currency'],
    },
    'coworking_stations': {
      description: 'Modern workstations equipped with everything a digital nomad could need.',
      actions: ['set_up_workspace', 'connect_devices', 'work_productively', 'network_with_others'],
      requires: ['coworking_membership'],
    },
    'destination_placards': {
      description: 'Small cards at each chair bearing cryptic destination names and symbols.',
      actions: ['read_carefully', 'decipher_symbols', 'study_patterns', 'memorize_options'],
      requires: [],
    },
    'window_view': {
      description: 'Large windows offering a view of the Thames and London\'s ever-changing skyline.',
      actions: ['gaze_outside', 'watch_boats', 'observe_weather', 'contemplate_journey'],
      requires: [],
    },
    'community_board': {
      description: 'A bulletin board where travelers and workers share experiences and recommendations.',
      actions: ['read_posts', 'add_review', 'find_travel_partners', 'share_experience'],
      requires: ['café_membership'],
    },
  },

  npcs: [
    'head_barista',
    'coworking_manager',
    'regular_customer_writer',
    'digital_nomad',
    'chair_travel_guide',
    'coffee_enthusiast',
    'local_entrepreneur',
  ],

  events: {
    onEnter: ['showChairOptions', 'smellFreshCoffee', 'hearProductiveBuzz'],
    onExit: ['recordChairChoice', 'saveCafeMemory'],
    onInteract: {
      chair_collection: ['displayDestinationOptions', 'explainChairMagic'],
      espresso_bar: ['experienceLondonCoffeeCulture', 'gainCaffeineBoost'],
      destination_placards: ['revealTravelMysteries', 'provideGuidance'],
      community_board: ['connectWithTravelers', 'shareWisdom'],
    },
  },

  flags: {
    cafeDiscovered: true,
    coffeeOrdered: false,
    chairsExamined: false,
    destinationsStudied: false,
    workspaceSetUp: false,
    baristaBefriended: false,
    travelGuideConsulted: false,
  },

  quests: {
    main: 'Choose Your Dimensional Destination Wisely',
    optional: [
      'Try Every Type of Coffee on the Menu',
      'Study All 34 Chair Destinations',
      'Meet Fellow Travelers and Workers',
      'Learn the History of Each Chair',
      'Help Other Customers Choose Destinations',
      'Become a Café Regular',
    ],
  },

  environmental: {
    lighting: 'warm_natural_light_with_industrial_fixtures',
    temperature: 'comfortable_heated_café_atmosphere',
    airQuality: 'aromatic_with_coffee_and_fresh_air',
    soundscape: ['espresso_machine_hissing', 'keyboard_typing', 'quiet_conversation', 'jazz_background'],
    hazards: ['caffeine_overdose_risk', 'laptop_theft_possibility', 'decision_paralysis'],
  },

  security: {
    level: 'café_casual_security',
    accessRequirements: ['customer_status'],
    alarmTriggers: ['chair_vandalism', 'equipment_theft', 'disruptive_behavior'],
    surveillanceActive: true,
    surveillanceType: 'staff_awareness_and_community_watch',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy_to_moderate',
    estimatedPlayTime: '15-30 minutes',
    keyFeatures: [
      'London café culture atmosphere',
      '34 unique chair destinations',
      'Coworking space functionality',
      'Artisan coffee experience',
      'Mesh room travel system',
    ],
  },

  secrets: {
    chairMasterKey: {
      description: 'A special key that allows access to any chair destination without restriction',
      requirements: ['befriend chair_travel_guide', 'complete_all_chair_journeys', 'prove_responsible_travel'],
      rewards: ['unrestricted_chair_access', 'chair_master_status'],
    },
    baristaSecretMenu: {
      description: 'Hidden coffee drinks that provide special travel benefits',
      requirements: ['become_café_regular', 'gain head_barista trust', 'coffee_connoisseur_knowledge'],
      rewards: ['enhanced_travel_energy', 'special_coffee_effects'],
    },
    cafeFoundersStory: {
      description: 'The true origin story of how this café became a dimensional hub',
      requirements: ['extensive_café_research', 'interview_all_staff', 'historical_investigation'],
      rewards: ['café_historical_knowledge', 'founder_recognition'],
    },
  },

  customActions: {
    'coffee_tasting_journey': {
      description: 'Sample different coffee preparations while studying chair destinations',
      requirements: ['coffee_appreciation', 'tasting_notes', 'sufficient_time'],
      effects: ['enhanced_decision_making', 'caffeine_clarity_boost'],
    },
    'chair_destination_research': {
      description: 'Systematically study each chair and its associated destination',
      requirements: ['chair_destination_guide', 'analytical_skills', 'patience'],
      effects: ['complete_destination_knowledge', 'optimal_travel_planning'],
    },
    'networking_session': {
      description: 'Connect with other travelers and workers to share experiences',
      requirements: ['social_skills', 'shared_experiences', 'open_mindedness'],
      effects: ['travel_partner_connections', 'shared_wisdom_gained'],
    },
  },

  // Mesh room system
  meshSystem: {
    totalDestinations: 34,
    destinationType: 'chair_based_portals',
    accessMethod: 'sit_and_focus',
    safetyProtocol: 'barista_supervision',
    uniqueDestinationRule: true,
    returnMethod: 'dimensional_anchor',
  },

  // London café culture
  cafeCulture: {
    coffeeQuality: 'artisan_third_wave',
    workingAtmosphere: 'productive_creative',
    customerBase: 'mixed_locals_and_travelers',
    socialDynamics: 'friendly_collaborative',
  },
};

export default cafeoffice;
