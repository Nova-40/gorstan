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

// Burger Joint - NYC Zone Mesh Room (14 unique destinations)

import { Room } from '../types/Room';

const burgerjoint: Room = {
  id: 'burgerjoint',
  zone: 'newyorkZone',
  title: 'Interdimensional Burger Joint',
  description: [
    'You enter a quintessential New York burger joint with red vinyl seating, checkered floors, and the intoxicating aroma of perfectly grilled beef patties. The classic American diner aesthetic is enhanced by subtle dimensional touches - the jukebox occasionally plays music from other realities, and the milkshake machine creates swirls of otherworldly colors.',
    'The restaurant buzzes with a diverse mix of locals, tourists, and interdimensional travelers who\'ve discovered this remarkable establishment. Each seat seems to shimmer with portal energy, suggesting that sitting down might transport you to unexpected destinations across the multiverse.',
    'Neon signs advertise "The Best Burgers in All Realities" while steam rises from the grill where the chef works his magic with ingredients sourced from multiple dimensions. The vintage 1950s décor creates a nostalgic atmosphere that feels both timeless and mysteriously connected to other worlds.',
    'You count exactly 14 different seating options - 10 classic red vinyl benches along the windows and walls, plus 4 chrome-and-leather stools at the counter. Each seat pulses with a unique dimensional frequency, promising a different interdimensional journey.',
    'The dirty napkin dispenser at table 7 catches your eye - it seems to be the key to unlocking something important, possibly access to the legendary Library Zone.'
  ],
  image: 'newyorkZone_burgerjoint.png',
  ambientAudio: 'burger_joint_atmosphere.mp3',

  consoleIntro: [
    '>> INTERDIMENSIONAL BURGER JOINT - NYC MESH ROOM',
    '>> Seating capacity: 14 DIMENSIONAL PORTALS (10 benches + 4 stools)',
    '>> Mesh room status: ACTIVE - All destinations unique and verified',
    '>> Kitchen status: OPERATIONAL - Multidimensional ingredients available',
    '>> Jukebox: INTERDIMENSIONAL PLAYLIST - Songs from 847 realities',
    '>> Service quality: EXCELLENT - Classic American diner hospitality',
    '>> Napkin dispenser: SIGNIFICANT - Library Zone access mechanism detected',
    '>> Food safety: CERTIFIED - Health department approved across dimensions',
    '>> Portal stability: STABLE - Chair-based transport system reliable',
    '>> "Where Every Seat Takes You Somewhere New!"',
  ],

  exits: {
    // Standard room exits
    front_door: 'newyorkZone_timessquare',
    back_exit: 'newyorkZone_manhattanhub',
    kitchen_door: 'newyorkZone_storeroom',
    
    // 10 BENCH DESTINATIONS (unique across all zones)
    bench01: 'introZone_hiddenlab',
    bench02: 'gorstanZone_carronspire',
    bench03: 'glitchZone_datavoid',
    bench04: 'londonZone_bigben',
    bench05: 'labrynthZone_crystalcave',
    bench06: 'libraryZone_ancientarchives',
    bench07: 'cloudZone_skyplatform',
    bench08: 'underwaterZone_pearldepths',
    bench09: 'spaceZone_nebularstation',
    bench10: 'offmultiverseZone_voidchamber',
    
    // 4 STOOL DESTINATIONS (unique counter seats)
    stool01: 'introZone_introreset',
    stool02: 'gorstanZone_torridoninn',
    stool03: 'glitchZone_failure',
    stool04: 'londonZone_thamesdocks',
  },

  items: [
    'classic_cheeseburger',
    'chocolate_milkshake',
    'crispy_french_fries',
    'dirty_napkin_from_dispenser',
    'interdimensional_menu',
    'vintage_coca_cola_bottle',
    'burger_joint_receipt',
    'jukebox_coin',
    'ketchup_packet_dimensional',
    'counter_stool_cushion',
  ],

  interactables: {
    'bench_seating': {
      description: '10 classic red vinyl benches, each one a portal to a different zone.',
      actions: ['sit_bench01', 'sit_bench02', 'sit_bench03', 'sit_bench04', 'sit_bench05', 'sit_bench06', 'sit_bench07', 'sit_bench08', 'sit_bench09', 'sit_bench10'],
      requires: ['portal_activation_sequence'],
    },
    'counter_stools': {
      description: '4 chrome-and-leather stools at the counter, each leading to special destinations.',
      actions: ['sit_stool01', 'sit_stool02', 'sit_stool03', 'sit_stool04'],
      requires: ['counter_access'],
    },
    'dirty_napkin_dispenser': {
      description: 'A seemingly ordinary napkin dispenser at table 7 that holds the key to the Library Zone.',
      actions: ['examine_closely', 'pull_napkin', 'activate_mechanism', 'unlock_library_access'],
      requires: ['observational_skills'],
    },
    'interdimensional_jukebox': {
      description: 'A vintage jukebox that plays music from across the multiverse.',
      actions: ['insert_coin', 'select_song', 'browse_catalog', 'activate_dimensional_radio'],
      requires: ['jukebox_coin'],
    },
    'burger_grill': {
      description: 'The main cooking area where dimensional ingredients are crafted into perfect burgers.',
      actions: ['watch_cooking', 'smell_aromas', 'order_special', 'learn_recipes'],
      requires: [],
    },
    'milkshake_machine': {
      description: 'A chrome milkshake machine that creates swirls of otherworldly flavors.',
      actions: ['order_shake', 'watch_preparation', 'taste_flavors', 'analyze_dimensional_ingredients'],
      requires: ['nyc_currency'],
    },
    'vintage_décor': {
      description: 'Classic 1950s American diner décor with subtle dimensional enhancements.',
      actions: ['admire_style', 'photograph', 'study_history', 'detect_anomalies'],
      requires: [],
    },
  },

  npcs: [
    'chef_dimensional_joe',
    'waitress_rosie',
    'counter_regular_sal',
    'jukebox_repair_technician',
    'interdimensional_food_critic',
    'burger_joint_owner',
    'napkin_dispenser_guardian',
  ],

  events: {
    onEnter: ['showBurgerJointWelcome', 'smellDeliciousAromas', 'hearJukeboxMusic'],
    onExit: ['burgerJointFarewell', 'rememberGreatFood'],
    onInteract: {
      bench_seating: ['activateBenchPortal', 'experienceInterdimensionalTravel'],
      counter_stools: ['activateStoolPortal', 'accessCounterDestinations'],
      dirty_napkin_dispenser: ['discoverLibraryKey', 'unlockSecretAccess'],
      interdimensional_jukebox: ['playMultiverseMusic', 'enhanceAtmosphere'],
    },
  },

  flags: {
    burgerJointDiscovered: true,
    benchPortalsActive: false,
    stoolPortalsActive: false,
    dirtyNapkinFound: false,
    libraryAccessUnlocked: false,
    jukeboxPlayed: false,
    orderPlaced: false,
    meshSystemMapped: false,
  },

  quests: {
    main: 'Experience the Interdimensional Burger Joint',
    optional: [
      'Try Burgers from Different Dimensions',
      'Map All 14 Portal Destinations',
      'Find the Dirty Napkin for Library Access',
      'Play Every Song on the Interdimensional Jukebox',
      'Learn the Secret Burger Recipes',
      'Meet All the Regular Customers',
    ],
  },

  environmental: {
    lighting: 'warm_vintage_diner_lighting',
    temperature: 'comfortable_indoor_climate',
    airQuality: 'delicious_food_aromas_with_dimensional_hints',
    soundscape: ['grill_sizzling', 'jukebox_music', 'conversation', 'milkshake_machine'],
    hazards: ['hot_surfaces', 'slippery_floors', 'portal_activation_confusion'],
  },

  security: {
    level: 'public_restaurant_with_portal_monitoring',
    accessRequirements: ['customer_status'],
    alarmTriggers: ['food_safety_violations', 'portal_misuse', 'dimensional_contamination'],
    surveillanceActive: false,
    surveillanceType: 'staff_observation_only',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'easy_to_moderate',
    estimatedPlayTime: '20-35 minutes',
    keyFeatures: [
      '14 unique mesh destinations',
      'Classic American diner atmosphere',
      'Dirty napkin Library Zone key',
      'Interdimensional cuisine',
      'Portal seating system',
    ],
  },

  secrets: {
    secretBurgerRecipe: {
      description: 'The legendary interdimensional burger recipe that enhances dimensional travel',
      requirements: ['chef_friendship', 'kitchen_access', 'ingredient_knowledge'],
      rewards: ['dimensional_burger_recipe', 'enhanced_portal_nutrition'],
    },
    jukeboxOverride: {
      description: 'Master codes to play any song from any dimension',
      requirements: ['repair_technician_tools', 'jukebox_maintenance_knowledge', 'musical_appreciation'],
      rewards: ['unlimited_jukebox_access', 'interdimensional_music_library'],
    },
    regularCustomerSecrets: {
      description: 'Stories and secrets from the burger joint\'s most loyal interdimensional customers',
      requirements: ['social_skills', 'multiple_visits', 'trust_building'],
      rewards: ['customer_knowledge_network', 'interdimensional_gossip_access'],
    },
  },

  customActions: {
    'dirty_napkin_activation': {
      description: 'Use the dirty napkin from the dispenser to unlock Library Zone access',
      requirements: ['dirty_napkin_from_dispenser', 'library_access_knowledge', 'napkin_activation_sequence'],
      effects: ['library_zone_unlocked', 'napkin_key_activated'],
    },
    'dimensional_food_sampling': {
      description: 'Taste cuisine from multiple dimensions to enhance interdimensional perception',
      requirements: ['nyc_currency', 'adventurous_palate', 'dimensional_ingredient_tolerance'],
      effects: ['enhanced_dimensional_sensitivity', 'culinary_multiverse_knowledge'],
    },
    'mesh_room_mastery': {
      description: 'Learn to navigate all 14 portal destinations efficiently',
      requirements: ['portal_travel_experience', 'dimensional_mapping_skills', 'seating_system_knowledge'],
      effects: ['mesh_navigation_expertise', 'interdimensional_travel_efficiency'],
    },
  },

  // Mesh room system for 14 unique destinations
  meshSystem: {
    totalSeats: 14,
    benchCount: 10,
    stoolCount: 4,
    uniqueDestinations: [
      'introZone_hiddenlab', 'gorstanZone_carronspire', 'glitchZone_datavoid', 'londonZone_bigben',
      'labrynthZone_crystalcave', 'libraryZone_ancientarchives', 'cloudZone_skyplatform',
      'underwaterZone_pearldepths', 'spaceZone_nebularstation', 'offmultiverseZone_voidchamber',
      'introZone_introreset', 'gorstanZone_torridoninn', 'glitchZone_failure', 'londonZone_thamesdocks'
    ],
    activationMethod: 'seat_selection_and_portal_activation',
  },

  // Library Zone access mechanism
  libraryAccess: {
    keyItem: 'dirty_napkin_from_dispenser',
    location: 'table_7_napkin_dispenser',
    unlockTarget: 'libraryZone_entrance',
    requirement: 'napkin_dispenser_interaction',
  },

  // NYC diner culture
  dinerCulture: {
    atmosphere: 'classic_american_comfort_food',
    serviceStyle: 'friendly_efficient_neighborhood_service',
    foodQuality: 'traditional_with_dimensional_enhancements',
    customerBase: 'locals_tourists_and_interdimensional_travelers',
  },
};

export default burgerjoint;
