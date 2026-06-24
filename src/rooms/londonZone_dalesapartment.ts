/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Renders room descriptions and image logic.

import { Room } from '../types/Room';

type DaleHotspot = {
  id: string;
  label: string;
  command: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible?: boolean;
};

type DaleVisualScene = {
  id: string;
  ambient: string;
  testId: string;
};

type DaleRoom = Room & {
  visualScene: DaleVisualScene;
  clickHotspots: DaleHotspot[];
  commandAliases: Record<string, string>;
  itemDescriptions: Record<string, string>;
};

const dalesapartment: DaleRoom = {
  id: 'dalesapartment',
  zone: 'londonZone',
  title: "Dale and Polly's Apartment",
  description: [
    'You step into a bright, immaculately clean apartment that feels almost unnaturally tidy. Every surface gleams, every book is perfectly aligned, and not a single item appears out of place.',
    'The living room is decorated in modern minimalist style with clean lines and neutral colors. A comfortable sofa faces a wall-mounted television, while floor-to-ceiling windows flood the space with natural light.',
    "In one corner of the lounge, a large fish tank bubbles quietly. Inside, a single goldfish named Dominic swims in lazy circles, seemingly the only living thing that doesn't conform to the apartment's rigid organization.",
    "The level of tidiness borders on obsessive - it's as if someone has been maintaining this place as a shrine, keeping everything exactly as it was meant to be, waiting for its occupants to return.",
  ],
  image: 'londonzone_dalesapartment.png',
  ambientAudio: 'apartment_ambience.mp3',

  visualScene: {
    id: 'dales-apartment-visual-slice',
    ambient: 'domestic-apartment',
    testId: 'dales-apartment-visual-scene',
  },

  clickHotspots: [
    {
      id: 'findlaters-cafe',
      description: "Return north to Findlater's Corner Coffee Shop.",
      label: "Findlater's Café",
      command: 'go north',
      x: 42,
      y: 8,
      width: 16,
      height: 16,
    },
    {
      id: 'bedroom',
      description: "Go through to Dale's bedroom.",
      label: 'Bedroom',
      command: 'go bedroom',
      x: 7,
      y: 28,
      width: 15,
      height: 24,
    },
    {
      id: 'kitchen',
      description: "Go through to Dale's kitchen.",
      label: 'Kitchen',
      command: 'go kitchen',
      x: 78,
      y: 26,
      width: 15,
      height: 24,
    },
    {
      id: 'fish-tank',
      description: 'Examine Dominic’s aquarium.',
      label: 'Fish Tank',
      command: 'examine fish_tank',
      x: 62,
      y: 42,
      width: 14,
      height: 15,
    },
    {
      id: 'dominic',
      description: 'Examine Dominic the goldfish.',
      label: 'Dominic',
      command: 'examine dominic_goldfish',
      x: 66,
      y: 45,
      width: 7,
      height: 7,
    },
    {
      id: 'living-room-sofa',
      description: 'Examine the modern sofa.',
      label: 'Sofa',
      command: 'examine living_room_sofa',
      x: 26,
      y: 58,
      width: 27,
      height: 19,
    },
    {
      id: 'coffee-table',
      description: 'Examine the coffee table.',
      label: 'Coffee Table',
      command: 'examine coffee_table',
      x: 43,
      y: 68,
      width: 18,
      height: 11,
    },
    {
      id: 'wall-photos',
      description: 'Examine the photographs on the wall.',
      label: 'Wall Photos',
      command: 'examine wall_photos',
      x: 31,
      y: 18,
      width: 22,
      height: 14,
    },
  ],

  commandAliases: {
    'fish tank': 'fish_tank',
    aquarium: 'fish_tank',
    dominic: 'dominic_goldfish',
    goldfish: 'dominic_goldfish',
    sofa: 'living_room_sofa',
    couch: 'living_room_sofa',
    table: 'coffee_table',
    'coffee table': 'coffee_table',
    photos: 'wall_photos',
    photographs: 'wall_photos',
    pictures: 'wall_photos',
    'wall photos': 'wall_photos',
  },

  itemDescriptions: {
    dominic:
      'Dominic the goldfish circles the aquarium with the faint air of a creature who has seen several realities and disapproved of most of them.',
    dominic_goldfish:
      'Dominic the goldfish circles the aquarium with the faint air of a creature who has seen several realities and disapproved of most of them.',
    sofa:
      'A modern sofa, comfortable enough to suggest good intentions and slightly too many cushions.',
    living_room_sofa:
      'A modern sofa, comfortable enough to suggest good intentions and slightly too many cushions.',
    photos:
      'The photographs show small, ordinary moments from Dale’s life, arranged with more care than he would probably admit.',
    wall_photos:
      'The photographs show small, ordinary moments from Dale’s life, arranged with more care than he would probably admit.',
  },



  consoleIntro: [
    ">> RESIDENTIAL APARTMENT - DALE & POLLY'S HOME",
    '>> Security status: PRIVATE RESIDENCE - Unauthorized access detected',
    '>> Maintenance level: EXCEPTIONAL - All systems optimal',
    '>> Cleanliness index: 99.7% - Above standard parameters',
    '>> Occupancy status: TEMPORARILY VACANT - Recent activity detected',
    '>> Pet care system: ACTIVE - Automated feeding schedule operational',
    '>> Personal belongings: SECURED - Packed for travel',
    '>> Climate control: OPTIMAL - Perfect living conditions maintained',
    '>> WARNING: Emotional attachment indicators detected',
    '>> Note: Prepared for extended absence scenario',
  ],

  exits: {
    north: 'findlaterscornercoffeeshop',
    bedroom: 'dales_bedroom',
    kitchen: 'dales_kitchen',
  },

  items: [
    'apartment_keys',
    'photo_albums',
    'shared_calendar',
    'travel_brochures',
    'emergency_contact_list',
    'goldfish_food',
    'remote_control',
    'dominic',
  ],

  interactables: {
    dominic: {
      description:
        'Dominic the goldfish circles the aquarium with the faint air of a creature who has seen several realities and disapproved of most of them.',
      actions: ['examine', 'talk_to', 'watch_swimming'],
      requires: [],
    },
    sofa: {
      description:
        'A modern sofa, comfortable enough to suggest good intentions and slightly too many cushions.',
      actions: ['examine'],
      requires: [],
    },
    photos: {
      description:
        'The photographs show small, ordinary moments from Dale’s life, arranged with more care than he would probably admit.',
      actions: ['examine'],
      requires: [],
    },
    fish_tank: {
      description:
        'A large, well-maintained aquarium with crystal-clear water. Dominic the goldfish swims contentedly among plastic plants and a small castle.',
      actions: ['examine', 'feed_fish', 'watch', 'talk_to_dominic'],
      requires: [],
    },
    dominic_goldfish: {
      description:
        'A bright orange goldfish who seems remarkably alert and intelligent for his species. He watches you with curious eyes.',
      actions: ['examine', 'feed', 'talk_to', 'watch_swimming'],
      requires: [],
    },
    living_room_sofa: {
      description:
        'A comfortable modern sofa with plush cushions arranged in perfect symmetry. It looks barely used despite being lived-in.',
      actions: ['examine', 'sit', 'look_under_cushions', 'search_cushions'],
      requires: [],
    },
    coffee_table: {
      description:
        'A pristine glass coffee table with not a single fingerprint or water ring. Its surface is so clean it almost sparkles.',
      actions: ['examine', 'look_under', 'search'],
      requires: [],
    },
    spotless_surfaces: {
      description:
        'Every surface in the apartment gleams with an almost supernatural cleanliness. Not a speck of dust anywhere.',
      actions: ['examine', 'touch', 'run_finger_across'],
      requires: [],
    },
    wall_photos: {
      description:
        'Carefully arranged photographs showing Dale and Polly in various happy moments - holidays, celebrations, everyday life.',
      actions: ['examine', 'study_faces', 'read_captions'],
      requires: [],
    },
    perfect_alignment: {
      description:
        'Books, ornaments, and furniture are arranged with mathematical precision. Everything has its exact place.',
      actions: ['examine', 'measure_distances', 'appreciate_order'],
      requires: [],
    },
  },

  npcs: [],

  events: {
    onEnter: ['assessTidiness', 'activatePetCare', 'checkEmotionalState'],
    onExit: ['secureApartment', 'updateFishCare'],
    onInteract: {
      fish_tank: ['attractDominicAttention', 'observeFishBehavior'],
      dominic_goldfish: ['establishConnection', 'interpretFishCommunication'],
      wall_photos: ['triggerMemories', 'feelNostalgia'],
      spotless_surfaces: ['appreciateCare', 'wonderAboutMaintenance'],
      living_room_sofa: ['checkForHiddenItems', 'searchCushions'],
      coffee_table: ['lookForRemote', 'searchForItems'],
    },
  },

  flags: {
    apartmentSecure: true,
    dominicFed: false,
    photosExamined: false,
    runbagFound: false,
    tidynessAppreciated: false,
    fishConnectionMade: false,
    remoteControlFound: false,
  },

  quests: {
    main: 'Explore the Shared Life Space',
    optional: [
      'Care for Dominic the Goldfish',
      'Examine the Relationship Photos',
      'Find the Travel Preparations',
      'Understand the Perfect Tidiness',
      'Locate Personal Belongings',
    ],
  },

  environmental: {
    lighting: 'bright_natural_sunlight',
    temperature: 'perfectly_comfortable',
    airQuality: 'fresh_and_clean',
    soundscape: [
      'fish_tank_bubbling',
      'distant_city_sounds',
      'gentle_air_conditioning',
      'occasional_goldfish_splashing',
      'perfect_silence',
    ],
    hazards: [],
  },

  security: {
    level: 'moderate',
    accessRequirements: ['resident_access'],
    alarmTriggers: ['unauthorized_entry', 'disturbance_of_order'],
    surveillanceActive: false,
  },

  metadata: {
    created: '2025-07-09',
    lastModified: '2025-07-09',
    author: 'Geoff',
    version: '2.0',
    playTested: false,
    difficulty: 'easy',
    estimatedPlayTime: '10-15 minutes',
    keyFeatures: [
      'Obsessively tidy apartment',
      'Dominic the intelligent goldfish',
      'Evidence of shared life',
      'Travel preparations',
      'Perfect organization',
    ],
  },

  secrets: {
    hidden_runbag_location: {
      description: 'The travel bag packed and ready in the bedroom',
      requirements: ['explore bedroom area', 'examine travel preparations'],
      rewards: ['access_to_runbag', 'travel_essentials'],
    },
    dominic_intelligence: {
      description: "Discover the true intelligence behind Dominic's eyes",
      requirements: ['spend time with dominic', 'feed fish multiple times', 'talk to goldfish'],
      rewards: ['fish_wisdom', 'unusual_pet_bond'],
    },
    relationship_story: {
      description:
        "The full story of Dale and Polly's life together told through photos and belongings",
      requirements: ['examine all wall_photos', 'study shared_calendar', 'explore all rooms'],
      rewards: ['relationship_understanding', 'emotional_connection'],
    },
    hidden_remote_control: {
      description:
        'A remote control hidden between the sofa cushions - essential for accessing certain systems',
      requirements: ['search sofa cushions', 'look_under_cushions on living_room_sofa'],
      rewards: ['hub_access_remote', 'system_control_capability'],
    },
  },

  customActions: {
    feed_dominic: {
      description: 'Give Dominic his daily feeding and spend time with him',
      requirements: ['goldfish_food'],
      effects: ['happy_goldfish', 'establish_pet_bond', 'gain_fish_wisdom'],
    },
    appreciate_tidiness: {
      description: 'Take time to truly appreciate the incredible organization of the apartment',
      requirements: ['examine multiple spotless_surfaces'],
      effects: ['understand_care_level', 'appreciate_dedication', 'feel_home_atmosphere'],
    },
    piece_together_life: {
      description: "Use photos and belongings to understand Dale and Polly's relationship",
      requirements: ['examine wall_photos', 'study shared_items'],
      effects: ['understand_relationship', 'feel_emotional_connection', 'appreciate_shared_life'],
    },
    look_for_remote_control: {
      description: 'Search specifically for the missing remote control',
      requirements: ['examine coffee_table', 'search living_room_sofa'],
      effects: ['find_hub_remote', 'unlock_system_access', 'gain_remote_control_item'],
    },
    find_runbag: {
      description: 'Search the bedroom area for travel preparations',
      requirements: ['explore bedroom area', 'examine travel preparations'],
      effects: ['discover_runbag', 'add_runbag_to_room', 'set_runbagFound_flag'],
    },
  },
};

export default dalesapartment;
