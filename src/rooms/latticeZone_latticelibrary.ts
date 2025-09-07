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

// Lattice Library - Book-Eating Creatures Mini-Quest

import { Room } from '../types/Room';

const latticelibrary: Room = {
  id: 'latticelibrary',
  zone: 'latticeZone',
  title: 'Lattice Library',
  description: [
    'You enter a vast library where knowledge itself has become vulnerable. The space is arranged like a maze of towering bookshelves, creating corridors and chambers filled with precious texts. However, this is no ordinary library - strange creatures scurry through the aisles, consuming books at an alarming rate.',
    'The Book Devourers are bizarre entities that resemble a cross between hungry rodents and living shadows. They move in coordinated swarms, systematically working their way through the collection. As they consume each book, the knowledge within vanishes forever, leaving only empty bindings and scattered pages.',
    'Scattered throughout the library are hundreds of books that need saving, but at the center of the maze sits the most precious text of all: the Chronicle of Lattice Wisdom, bound in silver and glowing with protective runes. This is the book that Libraina desperately needs, but it\'s surrounded by the hungriest and most aggressive of the creatures.',
    'The exit portal shimmers near the Chronicle, but it\'s heavily guarded by Book Devourers. You\'ll need exceptional timing, strategy, and courage to rescue both the Chronicle and yourself from this bibliographic nightmare.',
  ],
  image: 'latticeZone_latticelibrary.png',
  ambientAudio: 'library_under_siege_with_creature_sounds.mp3',

  consoleIntro: [
    '>> LATTICE LIBRARY - EMERGENCY PRESERVATION PROTOCOL ACTIVE',
    '>> Status: UNDER ATTACK - Book Devourer infestation detected',
    '>> Collection status: RAPIDLY DIMINISHING - Knowledge consumption in progress',
    '>> Preservation priority: CHRONICLE OF LATTICE WISDOM - Special retrieval required',
    '>> Creature classification: BOOK DEVOURERS - Hostile knowledge consumers',
    '>> Mission objective: RESCUE OPERATION - Save books and retrieve Chronicle',
    '>> Exit accessibility: EXTREMELY DANGEROUS - Heavily guarded portal',
    '>> Difficulty level: EXPERT - Requires strategic navigation and timing',
    '>> Debug mode: AVAILABLE - Creature behavior modification possible',
    '>> Warning: Total collection loss imminent without immediate intervention',
  ],

  exits: {
    main_entrance: 'latticemain',
    emergency_portal: 'libraryofthenine', // Only accessible after completing mini-quest
  },

  items: [
    'scattered_book_pages',
    'empty_book_bindings',
    'protective_reading_gloves',
    'library_navigation_map',
    'book_preservation_kit',
    'creature_detection_device',
    'emergency_beacon',
    'knowledge_essence_vial',
  ],

  interactables: {
    'chronicle_of_lattice_wisdom': {
      description: 'The most precious book in the library, glowing with protective runes but surrounded by aggressive Book Devourers.',
      actions: ['approach_carefully', 'distract_creatures', 'grab_chronicle', 'activate_protection_runes'],
      requires: ['extreme_courage', 'strategic_timing'],
    },
    'book_collection_areas': {
      description: 'Various sections of the library where books are under attack by creatures. Each saved book increases your chances of success.',
      actions: ['save_books', 'outmaneuver_creatures', 'create_diversions', 'gather_knowledge'],
      requires: ['agility', 'quick_thinking'],
    },
    'exit_portal': {
      description: 'A shimmering portal that leads to safety, but it\'s surrounded by the most dangerous Book Devourers.',
      actions: ['sprint_to_exit', 'fight_through_creatures', 'use_saved_books_as_distraction', 'escape_with_chronicle'],
      requires: ['chronicle_retrieved', 'extreme_bravery'],
    },
    'creature_behavior_console': {
      description: 'A hidden debug console that can modify creature behavior - for testing purposes only.',
      actions: ['activate_debug_mode', 'disable_creature_aggression', 'make_creatures_ignore_player', 'make_creatures_ignore_chronicle'],
      requires: ['debug_access_code'],
    },
    'libraina_communication_crystal': {
      description: 'A crystal that allows communication with Libraina, providing guidance and encouragement.',
      actions: ['contact_libraina', 'receive_instructions', 'report_progress', 'ask_for_help'],
      requires: [],
    },
  },

  npcs: [
    'libraina_voice_through_crystal',
    'book_devourer_swarms',
    'alpha_book_devourer',
    'rescued_book_spirits',
  ],

  events: {
    onEnter: ['startMiniQuest', 'spawnBookDevourers', 'activateCreatureAI', 'beginBookConsumption'],
    onExit: ['evaluateQuestCompletion', 'calculateBooksSaved', 'determineOutcome'],
    onInteract: {
      chronicle_of_lattice_wisdom: ['attractCreatureAttention', 'testPlayerCourage', 'initiateRetrievalSequence'],
      book_collection_areas: ['saveKnowledge', 'improveSurvivalChances', 'gainCreatureDistraction'],
      exit_portal: ['checkChronicleStatus', 'evaluateCourageLevel', 'determineFinalOutcome'],
      creature_behavior_console: ['activateDebugProtections', 'modifyDifficultyLevel'],
    },
  },

  flags: {
    miniQuestActive: false,
    chronicleRetrieved: false,
    booksBeingSaved: false,
    creaturesActive: true,
    debugModeEnabled: false,
    exitPortalAccessible: false,
    librainaContactEstablished: false,
    questCompleted: false,
    questFailed: false,
  },

  quests: {
    main: 'Retrieve the Chronicle of Lattice Wisdom for Libraina',
    optional: [
      'Save as Many Books as Possible from the Devourers',
      'Establish Contact with Libraina',
      'Navigate the Library Maze Efficiently',
      'Escape Through the Heavily Guarded Portal',
    ],
  },

  // Mini-quest game mechanics
  miniQuestSystem: {
    gameType: 'book_rescue_stealth_action',
    objective: 'retrieve_chronicle_and_escape_alive',
    difficulty: 'expert_level',
    timeLimit: 'none_but_books_continuously_consumed',
    
    creatures: {
      type: 'book_devourers',
      behavior: 'patrol_and_consume_books',
      aggression: 'high_toward_player_and_chronicle',
      intelligence: 'coordinated_swarm_tactics',
      weakness: 'can_be_distracted_by_thrown_books',
    },
    
    bookSavingMechanics: {
      totalBooks: 100,
      chronicleLocation: 'center_of_library_maze',
      pointsPerBookSaved: 10,
      minimumForSuccess: 30, // Must save at least 30 books
      chronicleValue: 500, // Chronicle is worth 50 regular books
    },
    
    exitChallenge: {
      difficulty: 'extremely_dangerous',
      guardCreatures: 5,
      requiredItems: ['chronicle_of_lattice_wisdom'],
      escapeStrategies: ['stealth', 'distraction', 'speed_run', 'combat'],
      successRate: 'depends_on_books_saved_and_strategy',
    },
  },

  // Debug system for testing
  debugSystem: {
    accessCode: 'LATTICE_LIBRARY_DEBUG_2025',
    commands: {
      'disable_creature_attacks': 'Makes creatures ignore player completely',
      'protect_chronicle': 'Makes creatures unable to consume the Chronicle',
      'infinite_time': 'Stops automatic book consumption timer',
      'show_optimal_path': 'Reveals the safest route to Chronicle and exit',
      'god_mode': 'Player becomes invulnerable to creatures',
    },
    warning: 'Debug mode is for testing only - disables achievements',
  },

  customActions: {
    'execute_book_rescue_strategy': {
      description: 'Use saved books and environmental knowledge to create a winning strategy',
      requirements: ['books_saved', 'environmental_awareness', 'tactical_thinking'],
      effects: ['improve_escape_chances', 'distract_creatures', 'create_safe_passage'],
    },
    'perform_chronicle_retrieval': {
      description: 'Attempt the dangerous retrieval of the Chronicle of Lattice Wisdom',
      requirements: ['extreme_courage', 'strategic_planning', 'optimal_timing'],
      effects: ['obtain_chronicle', 'trigger_creature_frenzy', 'activate_exit_sequence'],
    },
    'execute_emergency_escape': {
      description: 'Navigate through the creature-guarded exit portal with the Chronicle',
      requirements: ['chronicle_retrieved', 'escape_strategy', 'perfect_timing'],
      effects: ['complete_quest_successfully', 'unlock_library_of_nine', 'gain_libraina_trust'],
    },
    'activate_debug_protections': {
      description: 'Enable debug mode to modify creature behavior for testing',
      requirements: ['debug_access_code', 'testing_authorization'],
      effects: ['disable_creature_threats', 'enable_safe_testing', 'maintain_quest_structure'],
    },
  },

  // Quest outcomes
  questOutcomes: {
    perfectSuccess: {
      condition: 'chronicle_retrieved_and_50_plus_books_saved',
      reward: 'libraina_maximum_trust_and_special_knowledge',
      nextAccess: 'library_of_nine_with_bonus_content',
    },
    goodSuccess: {
      condition: 'chronicle_retrieved_and_30_plus_books_saved',
      reward: 'libraina_trust_and_library_access',
      nextAccess: 'library_of_nine_standard_access',
    },
    minimalSuccess: {
      condition: 'chronicle_retrieved_but_few_books_saved',
      reward: 'libraina_basic_trust',
      nextAccess: 'library_of_nine_limited_access',
    },
    failure: {
      condition: 'chronicle_lost_or_player_caught',
      consequence: 'return_to_maze_for_second_attempt',
      nextAccess: 'must_retry_from_lattice_zone',
    },
  },

  // Special mechanics
  librainaConnection: {
    communicationMethod: 'crystal_communication_device',
    guidance: 'provides_hints_and_encouragement',
    urgency: 'expresses_desperate_need_for_chronicle',
    reward: 'promises_access_to_library_of_nine',
  },
};

export default latticelibrary;
