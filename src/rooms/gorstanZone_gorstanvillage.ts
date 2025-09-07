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

import { Room } from '../types/Room';

const gorstanvillage: Room = {
  id: 'gorstanvillage',
  zone: 'gorstanZone',
  title: 'Gorstan Village',
  description: [
    'You enter the heart of Gorstan, a traditional Highland village nestled in a sheltered glen between rolling hills. Stone cottages with thatched roofs line cobbled streets, their chimneys sending wisps of peat smoke into the crisp mountain air.',
    'The village green is dominated by an ancient standing stone, weathered by countless seasons but still bearing traces of carved Celtic spirals. Children play traditional games while their elders sit on wooden benches, sharing stories and gossip.',
    'A bustling marketplace occupies the village center, where Highland crafters display their wares: woolen plaids, carved wooden items, and bottles of amber whisky. The sound of hammer on anvil rings from the blacksmith\'s forge.',
    'The warm glow of lanterns begins to illuminate windows as evening approaches, and the inviting aroma of hearty Highland stew drifts from the village inn.',
  ],
  image: 'gorstanZone_gorstanvillage.png',
  ambientAudio: 'village_life_highland.mp3',

  consoleIntro: [
    '>> GORSTAN VILLAGE - HIGHLAND COMMUNITY CENTER',
    '>> Population: 247 residents - Seasonal variations noted',
    '>> Economic status: STABLE - Traditional crafts and agriculture',
    '>> Cultural heritage: STRONG - Highland traditions preserved',
    '>> Infrastructure: TRADITIONAL - Stone construction with modern amenities',
    '>> Community cohesion: EXCELLENT - Close-knit clan relationships',
    '>> Services available: Market, inn, forge, healer, storyteller',
    '>> Security level: LOW - Community self-policing active',
    '>> Visitor status: WELCOME - Highland hospitality traditions',
    '>> Local governance: CLAN COUNCIL - Democratic with traditional elements',
  ],

  exits: {
    north: 'gorstanZone_gorstanhub',
    south: 'gorstanZone_torridon',
    east: 'gorstanZone_carronspire',
    west: 'gorstanZone_heathermoors',
    enter_inn: 'gorstanZone_torridoninn',
    enter_forge: 'gorstanZone_village_forge',
    enter_market: 'gorstanZone_village_market',
  },

  items: [
    'highland_wool',
    'hand_carved_trinket',
    'village_crafted_mug',
    'local_honey',
    'dried_heather_bundle',
    'clan_tartan_sample',
    'fresh_bread',
    'highland_cheese',
  ],

  interactables: {
    'standing_stone': {
      description: 'An ancient monolith at the village center, carved with spiral patterns and clan symbols.',
      actions: ['examine', 'touch', 'decipher_carvings', 'make_offering'],
      requires: [],
    },
    'village_green': {
      description: 'A well-maintained common area where villagers gather for celebrations and community events.',
      actions: ['examine', 'sit', 'join_activities', 'observe_traditions'],
      requires: [],
    },
    'marketplace_stalls': {
      description: 'Wooden stalls displaying Highland crafts, foods, and traditional goods.',
      actions: ['examine', 'browse', 'purchase', 'negotiate'],
      requires: ['highland_currency'],
    },
    'cottage_windows': {
      description: 'Warm, glowing windows of stone cottages showing glimpses of Highland family life.',
      actions: ['observe', 'listen', 'knock'],
      requires: ['respectful_approach'],
    },
    'blacksmith_forge': {
      description: 'A traditional Highland forge with glowing coals and the rhythmic ring of metalwork.',
      actions: ['examine', 'watch', 'commission_work', 'learn'],
      requires: [],
    },
    'village_well': {
      description: 'An ancient stone well that has served the community for generations.',
      actions: ['examine', 'draw_water', 'make_wish', 'hear_echoes'],
      requires: [],
    },
  },

  npcs: [
    'village_elder',
    'highland_blacksmith',
    'market_trader',
    'storyteller',
    'village_children',
    'clan_chief',
    'local_healer',
  ],

  events: {
    onEnter: ['showVillageWelcome', 'hearVillageLife', 'noticeMarketActivity'],
    onExit: ['farewellBlessings', 'inviteReturn'],
    onInteract: {
      standing_stone: ['revealAncientHistory', 'activateClanSpirit'],
      marketplace_stalls: ['showLocalCrafts', 'meetTraders'],
      blacksmith_forge: ['demonstrateSkills', 'offerApprenticeshipInfo'],
      village_well: ['shareWishingTraditions', 'revealVillageSecrets'],
    },
  },

  flags: {
    villageDiscovered: true,
    marketActive: true,
    communityWelcoming: true,
    traditionsObserved: false,
    clanStandingEvaluated: false,
    forgeAccessible: true,
    healerAvailable: true,
  },

  quests: {
    main: 'Integrate into Highland Community',
    optional: [
      'Learn Highland Crafts',
      'Understand Clan History',
      'Participate in Village Traditions',
      'Help with Community Needs',
      'Discover Village Secrets',
      'Build Relationships with Villagers',
    ],
  },

  environmental: {
    lighting: 'warm_golden_lantern_glow',
    temperature: 'comfortable_highland_evening',
    airQuality: 'fresh_mountain_air_with_peat_smoke',
    soundscape: ['village_chatter', 'children_playing', 'forge_hammering', 'distant_bagpipes'],
    hazards: ['none_community_safe'],
  },

  security: {
    level: 'community_watch',
    accessRequirements: ['respectful_behavior'],
    alarmTriggers: ['theft', 'violence', 'disrespect_to_traditions'],
    surveillanceActive: true,
    surveillanceType: 'community_awareness',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '15-25 minutes',
    keyFeatures: [
      'Highland community life',
      'Traditional crafts and trades',
      'Clan culture and history',
      'Social interaction mechanics',
      'Economic gameplay elements',
    ],
  },

  secrets: {
    villageFoundation: {
      description: 'The ancient origins of Gorstan village and its spiritual significance',
      requirements: ['decipher standing_stone carvings', 'gain village_elder trust', 'participate in traditions'],
      rewards: ['village_history_knowledge', 'clan_ancestry_information'],
    },
    hiddenTreasure: {
      description: 'A community treasure hidden somewhere in the village for emergencies',
      requirements: ['prove community loyalty', 'gain clan_chief trust', 'help with community crisis'],
      rewards: ['village_treasure_access', 'honorary_clan_membership'],
    },
    craftMasterSecrets: {
      description: 'Advanced Highland crafting techniques passed down through generations',
      requirements: ['apprentice with highland_blacksmith', 'demonstrate skill', 'earn master approval'],
      rewards: ['master_crafting_abilities', 'unique_highland_items'],
    },
  },

  customActions: {
    'clan_greeting': {
      description: 'Perform the traditional Highland clan greeting to show respect',
      requirements: ['highland_etiquette_knowledge', 'respectful_demeanor'],
      effects: ['increase_clan_standing', 'unlock_clan_interactions'],
    },
    'market_trade': {
      description: 'Engage in traditional Highland bartering and trade',
      requirements: ['trade_goods', 'negotiation_skills', 'highland_currency'],
      effects: ['acquire_unique_items', 'build_trader_relationships'],
    },
    'storytelling_circle': {
      description: 'Join the evening storytelling tradition around the village fire',
      requirements: ['evening_time', 'respectful_listening', 'cultural_appreciation'],
      effects: ['learn_clan_legends', 'gain_storyteller_friendship'],
    },
    'community_festival': {
      description: 'Participate in seasonal Highland festivals and celebrations',
      requirements: ['proper_seasonal_timing', 'traditional_attire', 'community_acceptance'],
      effects: ['deep_cultural_integration', 'unlock_festival_quests'],
    },
  },

  // Village economy
  economy: {
    primaryIndustries: ['crafts', 'agriculture', 'animal_husbandry', 'tourism'],
    tradeGoods: ['wool', 'whisky', 'metalwork', 'carved_items', 'preserved_foods'],
    currency: 'highland_coins',
    marketDays: ['tuesday', 'friday', 'sunday'],
  },

  // Clan relationships
  clanSystem: {
    governingClan: 'Clan MacGorstan',
    alliedClans: ['Clan MacCarron', 'Clan Stewart', 'Clan Fraser'],
    clanStructure: 'traditional_hierarchy',
    clanMeeting: 'monthly_gathering',
  },

  // Traditional events
  traditionalEvents: {
    'highland_games': {
      frequency: 'annual',
      season: 'summer',
      activities: ['caber_toss', 'highland_dancing', 'pipe_competition'],
    },
    'harvest_festival': {
      frequency: 'annual',
      season: 'autumn',
      activities: ['feast', 'storytelling', 'gratitude_ceremonies'],
    },
    'clan_gathering': {
      frequency: 'monthly',
      activities: ['clan_business', 'dispute_resolution', 'tradition_maintenance'],
    },
  },
};

export default gorstanvillage;
