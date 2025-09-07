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

// Torridon - Highland lakeside settlement

import { Room } from '../types/Room';

const torridon: Room = {
  id: 'torridon',
  zone: 'gorstanZone',
  title: 'Torridon',
  description: [
    'You stand in Torridon, a picturesque Highland settlement built along the shores of a pristine mountain loch. Traditional stone houses cascade down gentle slopes toward the water\'s edge, their slate roofs glistening with morning dew.',
    'The loch stretches before you like a mirror, reflecting the dramatic peaks of ancient mountains that rise majestically from its far shore. Small fishing boats bob gently at wooden piers, their nets and lines ready for the day\'s catch.',
    'A narrow cobblestone path winds through the settlement, connecting cottages where smoke curls lazily from chimneys. The sweet scent of blooming gorse mingles with the fresh, clean air that carries the gentle lapping of water against stone.',
    'The famous Torridon Inn stands prominently near the water, its welcoming lights and the sound of Highland music promising warmth and good company to weary travelers.',
  ],
  image: 'gorstanZone_torridon.png',
  ambientAudio: 'lakeside_highland_settlement.mp3',

  consoleIntro: [
    '>> TORRIDON - HIGHLAND LAKESIDE SETTLEMENT',
    '>> Population: 89 residents - Fishing and tourism community',
    '>> Geographic position: LAKEFRONT - Pristine mountain loch setting',
    '>> Primary industries: FISHING, hospitality, traditional crafts',
    '>> Water quality: EXCELLENT - Pristine Highland loch water',
    '>> Tourism status: ACTIVE - Popular Highland destination',
    '>> Transportation: BOAT ACCESS - Traditional fishing vessels available',
    '>> Cultural heritage: PRESERVED - Highland fishing traditions maintained',
    '>> Weather conditions: MILD - Lakeside microclimate benefits',
    '>> Notable features: Historic inn, fishing fleet, mountain views',
  ],

  exits: {
    north: 'gorstanZone_gorstanvillage',
    east: 'gorstanZone_loch_katrine',
    west: 'gorstanZone_heathermoors',
    enter_inn: 'gorstanZone_torridoninn',
    take_boat: 'gorstanZone_loch_crossing',
    climb_path: 'gorstanZone_mountain_trail',
  },

  items: [
    'fresh_trout',
    'fishing_net',
    'mountain_spring_water',
    'lakeside_pebbles',
    'highland_pine_cone',
    'boat_rope',
    'weather_worn_driftwood',
    'loch_water_sample',
  ],

  interactables: {
    'mountain_loch': {
      description: 'A pristine Highland loch with crystal-clear water reflecting the surrounding mountains.',
      actions: ['examine', 'wade', 'drink_water', 'skip_stones', 'fish'],
      requires: [],
    },
    'fishing_boats': {
      description: 'Traditional Highland fishing boats moored at wooden piers, well-maintained and seaworthy.',
      actions: ['examine', 'board', 'inspect_nets', 'hire_passage'],
      requires: ['boating_permission'],
    },
    'wooden_piers': {
      description: 'Sturdy stone and wood piers extending into the loch, weathered by years of Highland weather.',
      actions: ['walk_on', 'fish_from', 'examine_construction', 'sit'],
      requires: [],
    },
    'stone_cottages': {
      description: 'Traditional Highland homes built from local stone with slate roofs and small gardens.',
      actions: ['examine', 'admire_architecture', 'visit', 'knock'],
      requires: ['local_introduction'],
    },
    'cobblestone_path': {
      description: 'A winding path of smooth stones connecting the various parts of the settlement.',
      actions: ['follow', 'examine', 'walk_slowly'],
      requires: [],
    },
    'torridon_inn': {
      description: 'A welcoming Highland inn with warm lights and the sound of traditional music drifting from within.',
      actions: ['examine', 'enter', 'listen_to_music', 'smell_cooking'],
      requires: [],
    },
    'mountain_backdrop': {
      description: 'Ancient mountains rising dramatically from the loch\'s far shore, their peaks touching the clouds.',
      actions: ['admire', 'identify_peaks', 'plan_climbing_route', 'photograph'],
      requires: ['mountain_knowledge'],
    },
  },

  npcs: [
    'highland_fisherman',
    'innkeeper_mairi',
    'boat_captain',
    'local_guide',
    'mountain_climber',
    'settlement_elder',
    'visiting_naturalist',
  ],

  events: {
    onEnter: ['showLochscapeBeauty', 'hearWaterLapping', 'smellMountainAir'],
    onExit: ['lakesideFarewell', 'carryMountainMemories'],
    onInteract: {
      mountain_loch: ['showLochReflections', 'experienceTranquility'],
      fishing_boats: ['meetLocalFishermen', 'learnFishingTraditions'],
      torridon_inn: ['hearWelcomingMusic', 'smellTraditionalCooking'],
      mountain_backdrop: ['inspireMountaineeringUrge', 'revealClimbingRoutes'],
    },
  },

  flags: {
    torridonDiscovered: true,
    lochAccessible: true,
    fishingPermitted: false,
    boatingLicensed: false,
    innWelcoming: true,
    localTrustEarned: false,
    mountainGuideAvailable: true,
  },

  quests: {
    main: 'Explore Highland Lakeside Life',
    optional: [
      'Learn Traditional Highland Fishing',
      'Take a Boat Trip on the Loch',
      'Climb the Surrounding Mountains', 
      'Experience Highland Hospitality at the Inn',
      'Document Local Wildlife and Nature',
      'Help Local Fishermen with Their Work',
    ],
  },

  environmental: {
    lighting: 'natural_highland_daylight_with_loch_reflections',
    temperature: 'mild_lakeside_microclimate',
    airQuality: 'pristine_mountain_air_with_loch_moisture',
    soundscape: ['gentle_water_lapping', 'distant_bagpipes', 'seabird_calls', 'mountain_wind'],
    hazards: ['sudden_loch_weather_changes', 'slippery_pier_surfaces', 'mountain_climbing_risks'],
  },

  security: {
    level: 'community_safe',
    accessRequirements: ['respectful_tourism_behavior'],
    alarmTriggers: ['water_pollution', 'fishing_violations', 'disturbance_of_wildlife'],
    surveillanceActive: true,
    surveillanceType: 'community_watch_with_ranger_patrols',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '12-20 minutes',
    keyFeatures: [
      'Highland lakeside atmosphere',
      'Traditional fishing culture',
      'Mountain and loch scenery',
      'Highland hospitality',
      'Outdoor recreation opportunities',
    ],
  },

  secrets: {
    hiddenFishingSpots: {
      description: 'Secret locations on the loch where the best fish can be caught',
      requirements: ['gain highland_fisherman trust', 'demonstrate fishing skill', 'respect fishing traditions'],
      rewards: ['access_to_best_fishing', 'legendary_catch_opportunities'],
    },
    ancientLochLegends: {
      description: 'Old Highland stories about the loch and its mysterious depths',
      requirements: ['listen to settlement_elder stories', 'visit torridon_inn regularly', 'show cultural respect'],
      rewards: ['loch_legend_knowledge', 'hidden_historical_sites'],
    },
    mountainPassages: {
      description: 'Hidden climbing routes through the surrounding peaks',
      requirements: ['befriend local_guide', 'prove climbing competence', 'contribute to community'],
      rewards: ['secret_mountain_passages', 'highland_climbing_skills'],
    },
  },

  customActions: {
    'traditional_fishing': {
      description: 'Learn and practice traditional Highland fishing methods on the loch',
      requirements: ['fishing_net', 'highland_fisherman guidance', 'fishing_license'],
      effects: ['gain_fishing_skills', 'catch_highland_trout'],
    },
    'loch_meditation': {
      description: 'Find inner peace sitting by the tranquil loch waters',
      requirements: ['quiet_contemplation', 'appreciation_of_nature', 'peaceful_mindset'],
      effects: ['restore_mental_energy', 'gain_highland_serenity'],
    },
    'mountain_photography': {
      description: 'Capture the stunning Highland scenery on camera',
      requirements: ['camera_equipment', 'artistic_eye', 'mountain_knowledge'],
      effects: ['create_scenic_photographs', 'document_highland_beauty'],
    },
    'community_gathering': {
      description: 'Join local community events and celebrations',
      requirements: ['community_acceptance', 'cultural_sensitivity', 'festive_timing'],
      effects: ['deep_community_integration', 'unlock_local_traditions'],
    },
  },

  // Highland loch ecosystem
  ecosystem: {
    fishSpecies: ['highland_trout', 'mountain_char', 'pike', 'perch'],
    birdlife: ['red_deer', 'golden_eagles', 'grouse', 'ospreys'],
    plantlife: ['highland_heather', 'mountain_ash', 'scots_pine', 'wild_thyme'],
    conservation: 'protected_highland_habitat',
  },

  // Weather and seasonal changes
  seasonal: {
    spring: 'wildflower_blooms_and_bird_nesting',
    summer: 'peak_tourism_and_fishing_season',
    autumn: 'dramatic_color_changes_and_harvest',
    winter: 'snow_capped_mountains_and_cozy_inn_atmosphere',
  },

  // Traditional activities
  traditionalActivities: {
    'highland_games': 'seasonal_athletic_competitions',
    'ceilidh_dancing': 'community_social_dancing',
    'storytelling': 'evening_tale_sharing_traditions',
    'fishing_competitions': 'friendly_angling_contests',
  },
};

export default torridon;
