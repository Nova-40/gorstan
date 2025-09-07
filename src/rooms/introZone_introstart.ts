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

// Intro Start - introZone LANDING room, first location in game

import { Room } from '../types/Room';

const introstart: Room = {
  id: 'introstart',
  zone: 'introZone',
  title: 'The Beginning',
  description: [
    'You awaken in a small, dimly lit room that feels both familiar and strange. The walls are lined with old wooden panels, and there\'s a sense of anticipation in the air.',
    'A single lamp illuminates a simple wooden desk where an old leather journal lies open. The pages seem to shimmer with possibility.',
    'To your right, a window looks out onto what appears to be an endless void, yet somehow it doesn\'t feel threatening - more like a canvas waiting to be painted.',
    'A door stands slightly ajar to the north, through which you can hear the faint sound of machinery and see flickering lights.',
    'This feels like the very beginning of something important - a story that\'s about to unfold, a journey that\'s about to begin.',
  ],
  image: 'introZone_introstreet1.png',
  ambientAudio: 'gentle_beginning.mp3',

  consoleIntro: [
    '>> INITIALIZATION COMPLETE',
    '>> Welcome to GORSTAN',
    '>> Reality anchor: STABLE',
    '>> Player consciousness: AWAKENED',
    '>> Tutorial protocols: ACTIVE',
    '>> Objective: Begin your journey',
    '>> Status: Ready to explore',
    '>> Navigation: Type "help" for commands',
    '>> Safe zone: CONFIRMED',
    '>> Adventure awaits...',
  ],

  exits: {
    'north': 'controlroom',
    'door': 'controlroom',
    'forward': 'controlroom',
    'continue': 'controlroom',
    'journal': 'introtutorial', // Special tutorial room if it exists
    'window': 'crossing', // Emergency exit to crossing
  },

  items: [
    'starter_journal',
    'welcome_note',
    'basic_toolkit',
    'navigation_guide',
    'reality_primer',
  ],

  interactables: {
    'journal': {
      description: 'An old leather journal with pages that seem to glow softly. The first page reads "Welcome, Traveler" in elegant script.',
      actions: ['examine', 'read', 'write', 'take'],
      requires: [],
    },
    'desk': {
      description: 'A simple wooden desk with carved edges. It appears to be made from a single piece of ancient oak.',
      actions: ['examine', 'search', 'sit_at'],
      requires: [],
    },
    'lamp': {
      description: 'A brass lamp with a warm, steady glow that somehow never seems to flicker.',
      actions: ['examine', 'adjust', 'turn_off', 'turn_on'],
      requires: [],
    },
    'window': {
      description: 'A large window that looks out onto an endless void. Instead of being frightening, it seems full of potential.',
      actions: ['examine', 'look_through', 'open', 'touch'],
      requires: [],
    },
    'door': {
      description: 'A sturdy wooden door standing slightly ajar. Light and the sound of machinery emanate from beyond.',
      actions: ['examine', 'open', 'close', 'knock', 'enter'],
      requires: [],
    },
    'walls': {
      description: 'Wooden panels with intricate carvings that seem to tell a story of journeys and adventures.',
      actions: ['examine', 'touch', 'trace_carvings'],
      requires: [],
    },
  },

  npcs: [
    'welcome_spirit',
    'tutorial_guide',
  ],

  events: {
    onEnter: ['showWelcomeMessage', 'activateTutorialMode', 'establishSafeZone'],
    onExit: ['saveTutorialProgress', 'activateMainGame'],
    onInteract: {
      journal: ['showTutorialText', 'recordProgress', 'unlockBasicCommands'],
      desk: ['revealHiddenItems', 'showInteractionTips'],
      lamp: ['demonstrateLighting', 'showInventorySystem'],
      window: ['explainNavigation', 'showWorldOverview'],
      door: ['introduceMovement', 'prepareForAdventure'],
    },
  },

  flags: {
    isStartingRoom: true,
    tutorialActive: true,
    safeZone: true,
    journalRead: false,
    deskSearched: false,
    windowExamined: false,
    doorOpened: false,
    readyToProgress: false,
    firstTimeVisit: true,
  },

  quests: {
    main: 'Learn the Basics',
    optional: [
      'Read the Welcome Journal',
      'Examine All Objects',
      'Practice Commands',
      'Understand Navigation',
      'Prepare for Adventure',
    ],
  },

  environmental: {
    lighting: 'warm_lamplight',
    temperature: 'comfortable',
    airQuality: 'fresh_and_clean',
    soundscape: ['gentle_ambience', 'distant_machinery', 'pages_rustling'],
    hazards: [],
  },

  security: {
    level: 'safe',
    accessRequirements: [],
    alarmTriggers: [],
    surveillanceActive: false,
    surveillanceType: 'none',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'tutorial',
    estimatedPlayTime: '3-10 minutes',
    keyFeatures: [
      'Starting location',
      'Tutorial introduction',
      'Safe learning environment',
      'Basic interaction training',
      'Journey preparation',
    ],
  },

  secrets: {
    hidden_message: {
      description: 'A secret message carved into the desk',
      requirements: ['examine desk carefully', 'trace_carvings on walls'],
      rewards: ['developer_note', 'bonus_starting_item'],
    },
    early_access: {
      description: 'Skip tutorial and go directly to crossing',
      requirements: ['look_through window', 'understand the void', 'show readiness'],
      rewards: ['emergency_crossing_access', 'advanced_start_bonus'],
    },
  },

  customActions: {
    'begin_journey': {
      description: 'Formally start your adventure in Gorstan',
      requirements: ['journal read', 'basic understanding gained'],
      effects: ['mark_tutorial_complete', 'unlock_full_navigation'],
    },
    'study_carefully': {
      description: 'Take time to thoroughly understand your surroundings',
      requirements: ['examine all interactables', 'show patience'],
      effects: ['gain_observation_bonus', 'unlock_detail_insights'],
    },
    'embrace_beginning': {
      description: 'Accept the start of your journey with enthusiasm',
      requirements: ['positive_interaction', 'readiness_to_proceed'],
      effects: ['gain_courage_bonus', 'unlock_confident_dialogue'],
    },
  },

  // Landing room functionality - entry point to introZone
  landingRoom: {
    isLanding: true,
    nextZoneAccess: 'controlroom', // Path toward zone progression
    emergencyExit: 'crossing', // Hub access if needed
    tutorialComplete: false,
  },

  // Tutorial system
  tutorialSystem: {
    active: true,
    stepProgress: 0,
    totalSteps: 6,
    steps: [
      'Examine the journal',
      'Look around the room',
      'Try basic commands',
      'Understand movement',
      'Practice interaction',
      'Prepare to continue',
    ],
  },
};

export default introstart;
