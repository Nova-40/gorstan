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

// Torridon Inn - Traditional Highland hospitality

import { Room } from '../types/Room';

const torridoninn: Room = {
  id: 'torridoninn',
  zone: 'gorstanZone',
  title: 'Torridon Inn',
  description: [
    'You step into the warm, welcoming interior of the Torridon Inn, where centuries of Highland hospitality come alive. The low-beamed ceiling is darkened by age and countless peat fires, while tartan tapestries and clan shields adorn the stone walls.',
    'A massive stone fireplace dominates one wall, its hearth crackling with fragrant Highland peat that fills the air with an earthy, comforting aroma. Wooden tables and chairs, worn smooth by generations of use, are arranged around the fire.',
    'Behind the polished oak bar, bottles of amber Highland whisky gleam in the firelight, promising liquid warmth and stories yet to be told. The bar itself is carved with Celtic knotwork and clan symbols.',
    'Traditional Highland music drifts through the air - the haunting melody of pipes mixing with the gentle strum of a harp and the rhythmic beat of a bodhrán drum.',
  ],
  image: 'gorstanZone_torridoninn.png',
  ambientAudio: 'highland_inn_atmosphere.mp3',

  consoleIntro: [
    '>> TORRIDON INN - HIGHLAND HOSPITALITY CENTER',
    '>> Establishment date: 1547 - Nearly 500 years of service',
    '>> Current proprietor: Mairi MacLeod - Third generation innkeeper',
    '>> Accommodations: 12 guest rooms - Traditional Highland comfort',
    '>> Dining: ACTIVE - Traditional Highland cuisine served',
    '>> Bar service: PREMIUM - Extensive Highland whisky selection',
    '>> Entertainment: LIVE - Traditional music nightly',
    '>> Cultural significance: HIGH - Historic clan meeting place',
    '>> Guest registry: OPEN - Travelers welcome',
    '>> House specialties: Highland stew, fresh loch trout, bannock bread',
  ],

  exits: {
    outside: 'gorstanZone_torridon',
    upstairs: 'gorstanZone_torridoninn_rooms',
    kitchen: 'gorstanZone_torridoninn_kitchen',
    cellar: 'gorstanZone_torridoninn_cellar',
    private_dining: 'gorstanZone_torridoninn_private',
  },

  items: [
    'highland_whisky',
    'traditional_oatcakes',
    'clan_tartan_napkin',
    'hand_carved_drinking_horn',
    'peat_fire_coal',
    'highland_honey_mead',
    'fresh_bannock_bread',
    'smoked_highland_salmon',
  ],

  interactables: {
    'stone_fireplace': {
      description: 'A magnificent stone hearth burning fragrant Highland peat, the heart of the inn\'s warmth.',
      actions: ['examine', 'warm_hands', 'stoke_fire', 'sit_beside'],
      requires: [],
    },
    'oak_bar': {
      description: 'A beautiful carved oak bar displaying an impressive selection of Highland whiskies.',
      actions: ['examine', 'order_drink', 'admire_carvings', 'chat_with_bartender'],
      requires: [],
    },
    'whisky_collection': {
      description: 'Bottles of aged Highland whisky from distilleries across Scotland, each with its own character.',
      actions: ['examine', 'sample', 'learn_about', 'purchase'],
      requires: ['highland_currency'],
    },
    'clan_shields': {
      description: 'Ancient shields bearing the heraldry of Highland clans, telling stories of honor and heritage.',
      actions: ['examine', 'identify_clans', 'learn_history', 'pay_respects'],
      requires: [],
    },
    'tartan_tapestries': {
      description: 'Beautiful woven tapestries displaying traditional clan tartans in rich colors.',
      actions: ['examine', 'identify_patterns', 'feel_texture', 'appreciate_craftsmanship'],
      requires: [],
    },
    'musicians_corner': {
      description: 'A cozy corner where Highland musicians gather to play traditional tunes.',
      actions: ['listen', 'request_song', 'join_in', 'tip_musicians'],
      requires: ['musical_appreciation'],
    },
    'guest_registry': {
      description: 'An ancient leather-bound book where travelers sign their names and tell their tales.',
      actions: ['read', 'sign', 'add_story', 'search_names'],
      requires: [],
    },
  },

  npcs: [
    'innkeeper_mairi',
    'highland_bartender',
    'traditional_musicians',
    'storyteller_hamish',
    'traveling_merchant',
    'local_regular_customers',
    'clan_historian',
  ],

  events: {
    onEnter: ['showWarmWelcome', 'hearTraditionalMusic', 'smellPeatFire'],
    onExit: ['receiveDepartureBlessings', 'inviteToReturn'],
    onInteract: {
      stone_fireplace: ['experienceHighlandWarmth', 'hearFiresideStories'],
      oak_bar: ['receiveWhiskyEducation', 'shareTraditionalToasts'],
      clan_shields: ['learnClanHistories', 'respectAncestralHonor'],
      musicians_corner: ['enjoyTraditionalMusic', 'participateInSinging'],
    },
  },

  flags: {
    innDiscovered: true,
    warmthExperienced: true,
    musicPlaying: true,
    whiskyTasted: false,
    storiesTold: false,
    roomBooked: false,
    mealOrdered: false,
    clanHistoryLearned: false,
  },

  quests: {
    main: 'Experience Highland Hospitality',
    optional: [
      'Sample Highland Whiskies',
      'Learn Clan Histories and Traditions',
      'Join the Traditional Music Session',
      'Share Stories with Fellow Travelers',
      'Book a Room for the Night',
      'Try Traditional Highland Cuisine',
      'Meet Local Characters and Personalities',
    ],
  },

  environmental: {
    lighting: 'warm_firelight_with_oil_lamps',
    temperature: 'cozy_heated_by_peat_fire',
    airQuality: 'warm_air_scented_with_peat_smoke_and_whisky',
    soundscape: ['crackling_fire', 'traditional_highland_music', 'friendly_conversation', 'clinking_glasses'],
    hazards: ['too_much_whisky', 'late_night_revelry', 'emotional_storytelling'],
  },

  security: {
    level: 'welcoming_but_watchful',
    accessRequirements: ['respectful_behavior', 'payment_for_services'],
    alarmTriggers: ['fighting', 'disrespect_to_traditions', 'damage_to_property'],
    surveillanceActive: true,
    surveillanceType: 'innkeeper_and_staff_awareness',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '15-30 minutes',
    keyFeatures: [
      'Authentic Highland inn atmosphere',
      'Traditional music and storytelling',
      'Highland whisky culture',
      'Clan heritage and history',
      'Social interaction hub',
    ],
  },

  secrets: {
    hiddenWhiskyReserve: {
      description: 'A secret collection of rare and ancient Highland whiskies kept by the innkeeper',
      requirements: ['gain innkeeper_mairi trust', 'demonstrate whisky knowledge', 'special_occasion_or_honor'],
      rewards: ['access_to_rare_whiskies', 'whisky_connoisseur_status'],
    },
    clanMeetingRoom: {
      description: 'A private chamber where clan chiefs have held secret meetings for centuries',
      requirements: ['prove clan heritage', 'gain clan_historian approval', 'participate in clan business'],
      rewards: ['access_to_clan_secrets', 'invitation_to_clan_meetings'],
    },
    ancientsongbook: {
      description: 'A collection of ancient Highland songs and ballads, some thought lost to time',
      requirements: ['befriend traditional_musicians', 'demonstrate musical ability', 'preserve cultural heritage'],
      rewards: ['learn_ancient_songs', 'become_tradition_keeper'],
    },
  },

  customActions: {
    'highland_toast': {
      description: 'Participate in a traditional Highland toast with fellow guests',
      requirements: ['highland_whisky', 'understanding_of_traditions', 'social_acceptance'],
      effects: ['deepen_friendships', 'gain_cultural_knowledge'],
    },
    'storytelling_session': {
      description: 'Share tales of your adventures with the inn\'s guests and locals',
      requirements: ['interesting_stories', 'good_speaking_ability', 'respect_for_tradition'],
      effects: ['gain_local_fame', 'unlock_secret_stories'],
    },
    'music_collaboration': {
      description: 'Join the musicians in playing traditional Highland tunes',
      requirements: ['musical_instrument', 'knowledge_of_highland_music', 'musicians_acceptance'],
      effects: ['become_honorary_musician', 'learn_rare_musical_traditions'],
    },
    'whisky_tasting': {
      description: 'Learn about Highland whiskies through guided tasting with the bartender',
      requirements: ['payment_for_tasting', 'respectful_appreciation', 'designated_time'],
      effects: ['gain_whisky_expertise', 'unlock_premium_selections'],
    },
  },

  // Inn services and amenities
  services: {
    accommodation: {
      singleRoom: '15 highland_coins per_night',
      doubleRoom: '25 highland_coins per_night',
      suiteRoom: '40 highland_coins per_night',
    },
    dining: {
      highlandStew: '8 highland_coins',
      freshTrout: '12 highland_coins',
      bannockBread: '3 highland_coins',
      fullMeal: '20 highland_coins',
    },
    beverages: {
      localWhisky: '5 highland_coins per_dram',
      premiumWhisky: '12 highland_coins per_dram',
      rareWhisky: '25 highland_coins per_dram',
      traditionalAle: '3 highland_coins per_pint',
    },
  },

  // Regular events and entertainment
  weeklyEvents: {
    mondayNight: 'Storytelling with Hamish',
    wednesdayNight: 'Traditional music session',
    fridayNight: 'Highland dancing',
    saturdayNight: 'Clan gathering and feast',
    sundayAfternoon: 'Whisky tasting and education',
  },

  // Historical significance
  historicalEvents: {
    clanTreaties: 'Multiple peace agreements signed here',
    refugeCenter: 'Sheltered travelers during highland clearances',
    culturalPreservation: 'Maintained traditions through difficult times',
    resistanceMeetings: 'Secret gatherings during political upheavals',
  },
};

export default torridoninn;
