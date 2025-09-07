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

// Tower Hill - Historic Area Around the Tower of London

import { Room } from '../types/Room';

const towerhill: Room = {
  id: 'towerhill',
  zone: 'londonZone',
  title: 'Tower Hill',
  description: [
    'You stand on Tower Hill, the historic elevated ground that has witnessed over 900 years of London\'s most dramatic events. The ancient Tower of London dominates the landscape, its formidable walls and towers speaking of royal power, imprisonment, and execution.',
    'The scaffold site, where so many met their fate, is now marked by a simple memorial. Anne Boleyn, Catherine Howard, Lady Jane Grey - their stories echo in the very stones beneath your feet.',
    'Modern London bustles around this ancient site, with tourists queuing to see the Crown Jewels while office workers hurry past to the nearby financial district. The contrast between medieval fortress and contemporary city creates an almost surreal atmosphere.',
    'From here, you can see Tower Bridge spanning the Thames, while the gleaming towers of the City of London rise like modern battlements beyond the ancient walls.',
  ],
  image: 'londonZone_towerhill.png',
  ambientAudio: 'london_historic_atmosphere.mp3',

  consoleIntro: [
    '>> TOWER HILL - HISTORIC EXECUTION SITE',
    '>> Significance: EXTREME - 900+ years of royal history',
    '>> Tower of London: WORLD HERITAGE SITE - UNESCO protected',
    '>> Historical events: Royal executions, crown jewel storage, royal mint',
    '>> Current status: MAJOR TOURIST ATTRACTION',
    '>> Security: EXCEPTIONAL - Royal protection, tourism police',
    '>> Notable residents: Crown Jewels, Yeoman Warders, Ravens',
    '>> Transport: Tower Hill Underground Station (Circle/District)',
    '>> Visitor numbers: 3+ million annually',
    '>> Warning: Mind the spirits of the past - this place remembers everything',
  ],

  exits: {
    west: 'londonZone_stkatherinesdock',
    east: 'londonZone_towerbridge',
    north: 'londonZone_citycentre',
    south: 'londonZone_thamesriver',
    
    // Tower of London access
    enter_tower: 'londonZone_toweroflondon',
    visit_chapel: 'londonZone_chapel_st_peter',
    crown_jewels: 'londonZone_jewel_house',
    
    // Underground access
    tube_station: 'londonZone_towerhill_station',
    
    // Memorial sites
    scaffold_site: 'londonZone_scaffold_memorial',
  },

  items: [
    'tower_entrance_ticket',
    'historical_guidebook',
    'execution_memorial_plaque',
    'yeoman_warder_badge',
    'tower_raven_feather',
    'medieval_stone_fragment',
    'crown_jewels_postcard',
    'tudor_rose_replica',
  ],

  interactables: {
    'tower_of_london': {
      description: 'The formidable medieval fortress that has served as royal palace, prison, and treasure house.',
      actions: ['examine', 'enter', 'admire_architecture', 'learn_history'],
      requires: ['tower_entrance_ticket'],
    },
    'scaffold_memorial': {
      description: 'A glass memorial marking the site where noble prisoners met their fate, including two queens of England.',
      actions: ['examine', 'pay_respects', 'read_inscriptions', 'reflect'],
      requires: [],
    },
    'ancient_walls': {
      description: 'Medieval stone walls that have stood for nearly a millennium, witness to countless historical events.',
      actions: ['examine', 'touch', 'feel_history', 'photograph'],
      requires: [],
    },
    'tower_ravens': {
      description: 'The legendary ravens whose presence is said to protect the Crown and the Tower.',
      actions: ['observe', 'photograph', 'learn_legend', 'count_ravens'],
      requires: [],
    },
    'yeoman_warders': {
      description: 'The ceremonial guardians of the Tower, also known as Beefeaters, in their distinctive red uniforms.',
      actions: ['speak_with', 'learn_from', 'photograph', 'hear_stories'],
      requires: [],
    },
    'crown_jewels_queue': {
      description: 'The queue of visitors waiting to see the Crown Jewels, one of the world\'s most precious collections.',
      actions: ['join_queue', 'observe_crowd', 'estimate_wait_time', 'people_watch'],
      requires: ['tower_entrance_ticket'],
    },
    'roman_ruins': {
      description: 'Remnants of the original Roman wall that once protected Londinium.',
      actions: ['examine', 'study_archaeology', 'photograph', 'touch_history'],
      requires: [],
    },
  },

  npcs: [
    'yeoman_warder',
    'tower_historian',
    'tourist_guide',
    'crown_jewels_guard',
    'tower_raven_keeper',
    'london_archaeologist',
    'security_officer',
  ],

  events: {
    onEnter: ['feelHistoricalWeight', 'hearTowerBells', 'senseAncientPower'],
    onExit: ['towerFarewell', 'rememberHistory'],
    onInteract: {
      tower_of_london: ['enterFortress', 'learnRoyalHistory'],
      scaffold_memorial: ['payRespects', 'rememberVictims'],
      tower_ravens: ['hearLegend', 'observeProtectors'],
      yeoman_warders: ['hearStories', 'learnTraditions'],
    },
  },

  flags: {
    towerExplored: false,
    crownJewelsSeen: false,
    scaffoldVisited: false,
    ravensEncountered: false,
    warderSpokenTo: false,
    historicalKnowledgeGained: false,
    respectsPaid: false,
  },

  quests: {
    main: 'Experience the Tower of London\'s History',
    optional: [
      'Visit the Crown Jewels',
      'Pay Respects at the Scaffold Site',
      'Meet the Tower Ravens',
      'Speak with a Yeoman Warder',
      'Explore the Medieval Walls',
      'Learn About Royal Executions',
      'Discover Roman London',
    ],
  },

  environmental: {
    lighting: 'natural_london_daylight_with_ancient_shadows',
    temperature: 'mild_london_climate_with_stone_coolness',
    airQuality: 'urban_air_with_historical_atmosphere',
    soundscape: ['tourist_chatter', 'tower_bells', 'raven_calls', 'traffic_hum', 'ceremonial_drums'],
    hazards: ['heavy_tourist_crowds', 'uneven_ancient_paving', 'emotional_historical_weight'],
  },

  security: {
    level: 'maximum_royal_security',
    accessRequirements: ['public_access', 'security_screening_for_tower'],
    alarmTriggers: ['unauthorized_tower_access', 'crown_jewels_threat', 'royal_protection_breach'],
    surveillanceActive: true,
    surveillanceType: 'comprehensive_cctv_and_armed_guards',
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
      'Historic royal fortress',
      'Crown Jewels access',
      'Execution memorial sites',
      'Yeoman Warder interactions',
      'Medieval architecture',
    ],
  },

  secrets: {
    hiddenRoyalCrypt: {
      description: 'A secret crypt beneath the Chapel of St Peter ad Vincula containing unnamed royal remains',
      requirements: ['befriend tower_historian', 'prove_historical_scholarship', 'special_access_permission'],
      rewards: ['royal_historical_secrets', 'ancient_royal_artifact', 'historian_recognition'],
    },
    ravenMasterSecrets: {
      description: 'The Ravenmaster\'s secret knowledge about the Tower\'s mystical protections',
      requirements: ['gain_raven_keeper_trust', 'show_respect_for_tradition', 'prove_worthy_of_secrets'],
      rewards: ['mystical_protection_knowledge', 'raven_communication_ability'],
    },
    executionerMemento: {
      description: 'A hidden artifact from the Tower\'s days as an execution site',
      requirements: ['pay_respects_at_scaffold', 'understand_victim_stories', 'show_proper_reverence'],
      rewards: ['historical_artifact', 'deeper_understanding_of_history'],
    },
  },

  customActions: {
    'attend_ceremony_of_keys': {
      description: 'Witness the ancient Ceremony of the Keys, performed every night for over 700 years',
      requirements: ['special_ceremony_ticket', 'evening_visit', 'security_clearance'],
      effects: ['witness_living_history', 'ceremony_participant_status'],
    },
    'speak_with_ravens': {
      description: 'Attempt to communicate with the Tower\'s legendary ravens',
      requirements: ['raven_keeper_permission', 'patience', 'respect_for_tradition'],
      effects: ['raven_communication', 'mystical_connection'],
    },
    'trace_royal_footsteps': {
      description: 'Follow the historical paths of famous royal prisoners',
      requirements: ['historical_knowledge', 'tower_historian_guidance', 'emotional_resilience'],
      effects: ['deep_historical_connection', 'royal_prisoner_understanding'],
    },
  },

  // London cultural elements
  londonCulture: {
    historicalPeriod: 'Norman_to_Modern_continuous_history',
    architecturalStyle: 'Norman_medieval_fortress_architecture',
    socialClass: 'Royal_heritage_international_tourism',
    economicActivity: 'Heritage_tourism_and_royal_ceremonies',
  },

  // Royal heritage
  royalHeritage: {
    significance: 'Crown_jewels_royal_fortress_execution_site',
    prisoners: 'Anne_Boleyn_Lady_Jane_Grey_Rudolf_Hess',
    ceremonies: 'Ceremony_of_Keys_Crown_Jewel_displays',
    modernRole: 'UNESCO_World_Heritage_Site_tourism',
  },
};

export default towerhill;
