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

// Library Entrance - Unlocked by Dirty Napkin from NYC Storeroom

import { Room } from '../types/Room';

const entrance: Room = {
  id: 'entrance',
  zone: 'libraryZone',
  title: 'Great Library Entrance',
  description: [
    'You step through the dimensional portal activated by the dirty napkin into the magnificent entrance hall of an impossibly vast library. Soaring columns of polished marble support a vaulted ceiling that seems to stretch infinitely upward, disappearing into soft, ambient light that illuminates countless floating books.',
    'The entrance hall showcases the grandeur of this interdimensional repository of knowledge. Ornate reading desks are scattered throughout the space, each equipped with mysterious crystalline devices that appear to be advanced cataloging and translation systems. The air carries the intoxicating scent of aged parchment, leather bindings, and something mysteriously ancient.',
    'Towering shelves line the walls, reaching heights that would require floating platforms to access - platforms that indeed drift silently up and down, guided by unseen forces. Books, scrolls, crystal data tablets, and unknown information storage devices from countless civilizations fill every available space.',
    'At the center of the hall stands an impressive information desk attended by what appears to be a sentient holographic librarian. Behind the desk, a massive directory displays the library\'s contents in multiple languages and symbol systems, many of which seem to shift and change as you watch.',
    'The most remarkable feature is the "Napkin Memorial" - a small, unassuming display case containing the very first dirty napkin that someone used to gain access to this place, with a plaque reading: "In Honor of Practical Solutions to Complex Problems."',
  ],
  image: 'libraryZone_entrance.png',
  ambientAudio: 'great_library_entrance.mp3',

  consoleIntro: [
    '>> GREAT LIBRARY ENTRANCE - INTERDIMENSIONAL KNOWLEDGE REPOSITORY',
    '>> Access method: DIRTY NAPKIN KEY - Successfully activated',
    '>> Collection size: INFINITE - Knowledge from all dimensions',
    '>> Cataloging system: ADVANCED - Multi-dimensional organization',
    '>> Languages supported: ALL KNOWN - Universal translation available',
    '>> Reading assistance: HOLOGRAPHIC LIBRARIANS - Expert guidance',
    '>> Access level: VISITOR - Basic reading and research privileges',
    '>> Special collections: RESTRICTED - Higher clearance required',
    '>> Floating platform system: OPERATIONAL - Vertical access enabled',
    '>> "Knowledge Belongs to Those Who Seek It"',
  ],

  exits: {
    // Return route (dirty napkin activated)
    napkin_portal_return: 'newyorkZone_storeroom',
    
    // Main library sections
    main_reading_hall: 'libraryZone_readinghall',
    ancient_archives: 'libraryZone_ancientarchives',
    digital_collections: 'libraryZone_digitalcollections',
    restricted_section: 'libraryZone_restrictedvault',
    
    // Special collections
    interdimensional_studies: 'libraryZone_interdimensionalstudies',
    temporal_archives: 'libraryZone_temporalarchives',
    
    // Hub connection
    labyrinth_connection: 'labrynthZone_hub',
    
    // Next zone progression
    next_zone: 'cloudZone_entrance',
    
    // Floating platform access
    platform_upper_levels: 'libraryZone_upperlevels',
    platform_lower_archives: 'libraryZone_lowerarchives',
  },

  items: [
    'library_visitor_badge',
    'universal_translator_crystal',
    'floating_platform_controller',
    'catalog_search_interface',
    'interdimensional_bookmark',
    'reading_light_orb',
    'knowledge_absorption_enhancer',
    'dirty_napkin_replica',
  ],

  interactables: {
    'holographic_librarian': {
      description: 'Advanced AI librarian capable of assisting with research across all dimensional knowledge.',
      actions: ['ask_for_help', 'request_directions', 'search_catalog', 'get_recommendations'],
      requires: [],
    },
    'napkin_memorial': {
      description: 'Display case honoring the humble dirty napkin that first opened access to this library.',
      actions: ['read_plaque', 'examine_napkin', 'appreciate_irony', 'understand_accessibility'],
      requires: [],
    },
    'universal_catalog': {
      description: 'Massive directory system containing the locations of all knowledge in the library.',
      actions: ['search_topics', 'browse_categories', 'find_specific_books', 'access_digital_index'],
      requires: ['catalog_access_permission'],
    },
    'floating_platforms': {
      description: 'Gravity-defying platforms that provide access to the library\'s upper reaches.',
      actions: ['board_platform', 'control_movement', 'access_high_shelves', 'navigate_levels'],
      requires: ['platform_safety_training'],
    },
    'translation_stations': {
      description: 'Crystalline devices that can translate any written language or symbol system.',
      actions: ['translate_text', 'learn_languages', 'decode_symbols', 'understand_meanings'],
      requires: ['translation_crystal'],
    },
    'reading_spaces': {
      description: 'Comfortable study areas equipped with advanced reading and comprehension aids.',
      actions: ['settle_for_reading', 'activate_comprehension_aids', 'take_notes', 'meditate_on_knowledge'],
      requires: [],
    },
    'information_desk': {
      description: 'Central help desk staffed by the holographic librarian and assistance systems.',
      actions: ['get_visitor_information', 'request_special_access', 'file_research_request', 'report_issues'],
      requires: [],
    },
  },

  npcs: [
    'holographic_chief_librarian',
    'knowledge_spirit_guide',
    'interdimensional_research_assistant',
    'floating_platform_operator',
    'catalog_maintenance_construct',
    'translation_specialist_ai',
  ],

  events: {
    onEnter: ['showLibraryMajesty', 'activateVisitorProtocols', 'feelKnowledgePresence'],
    onExit: ['libraryFarewell', 'saveReadingProgress'],
    onInteract: {
      holographic_librarian: ['receiveLibraryOrientation', 'gainResearchGuidance'],
      napkin_memorial: ['appreciatePracticalWisdom', 'understandAccessibilityPhilosophy'],
      universal_catalog: ['unlockKnowledgeNavigation', 'gainResearchSkills'],
      floating_platforms: ['masterVerticalNavigation', 'accessAdvancedCollections'],
    },
  },

  flags: {
    libraryEntranceDiscovered: true,
    dirtyNapkinMemorialSeen: false,
    holographicLibrarianMet: false,
    catalogSystemLearned: false,
    floatingPlatformTrained: false,
    visitorBadgeObtained: false,
    translationSystemActivated: false,
    researchPermissionsGranted: false,
  },

  quests: {
    main: 'Explore the Great Interdimensional Library',
    optional: [
      'Learn to Use the Universal Catalog System',
      'Master Floating Platform Navigation',
      'Meet All the Holographic Librarians',
      'Discover the Story Behind the Dirty Napkin',
      'Activate Translation System for Unknown Languages',
      'Gain Access to Special Collections',
    ],
  },

  environmental: {
    lighting: 'soft_ambient_with_reading_enhancement',
    temperature: 'perfectly_climate_controlled',
    airQuality: 'pure_with_knowledge_enhancing_properties',
    soundscape: ['pages_turning', 'quiet_whispers', 'platform_humming', 'knowledge_resonance'],
    hazards: ['information_overload', 'platform_navigation_complexity', 'getting_lost_in_knowledge'],
  },

  security: {
    level: 'intellectual_property_protection',
    accessRequirements: ['dirty_napkin_key_activation', 'visitor_registration'],
    alarmTriggers: ['knowledge_theft', 'unauthorized_copying', 'vandalism'],
    surveillanceActive: true,
    surveillanceType: 'holographic_librarian_monitoring_and_knowledge_tracking',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '25-35 minutes',
    keyFeatures: [
      'Interdimensional knowledge repository',
      'Dirty napkin access mechanism',
      'Holographic librarian assistance',
      'Floating platform system',
      'Universal translation capabilities',
    ],
  },

  secrets: {
    napkinPhilosophy: {
      description: 'Deep understanding of why simple solutions often work best',
      requirements: ['napkin_memorial_study', 'philosophical_reflection', 'practical_wisdom'],
      rewards: ['practical_problem_solving_mastery', 'accessibility_design_principles'],
    },
    librarianNetworkAccess: {
      description: 'Direct communication with the interdimensional librarian network',
      requirements: ['holographic_librarian_friendship', 'research_expertise', 'knowledge_contribution'],
      rewards: ['librarian_network_access', 'advanced_research_capabilities'],
    },
    universalKnowledgeMapping: {
      description: 'Complete understanding of how all knowledge is interconnected',
      requirements: ['catalog_mastery', 'interdimensional_studies', 'pattern_recognition'],
      rewards: ['universal_knowledge_map', 'information_synthesis_abilities'],
    },
  },

  customActions: {
    'dirty_napkin_appreciation': {
      description: 'Fully appreciate the elegance of the dirty napkin access solution',
      requirements: ['napkin_memorial_interaction', 'philosophical_mindset', 'humor_appreciation'],
      effects: ['practical_wisdom_gained', 'accessibility_consciousness'],
    },
    'holographic_research_collaboration': {
      description: 'Work with holographic librarians on advanced research projects',
      requirements: ['visitor_badge', 'research_skills', 'collaborative_mindset'],
      effects: ['advanced_research_access', 'librarian_partnership'],
    },
    'floating_platform_mastery': {
      description: 'Achieve expert-level floating platform navigation skills',
      requirements: ['platform_safety_training', 'spatial_awareness', 'courage'],
      effects: ['platform_mastery', 'vertical_library_access'],
    },
  },

  // Dirty napkin access system
  napkinAccessSystem: {
    activationItem: 'dirty_napkin_from_nyc_storeroom',
    accessMethod: 'dimensional_portal_activation',
    philosophy: 'practical_solutions_to_complex_problems',
    memorial: 'honored_display_of_first_access_napkin',
  },

  // Library characteristics
  libraryCharacteristics: {
    scope: 'interdimensional_universal_knowledge_repository',
    organizationSystem: 'multi_dimensional_cataloging_with_ai_assistance',
    accessibilityLevel: 'designed_for_all_knowledge_seekers',
    specialFeatures: 'floating_platforms_and_universal_translation',
  },

  // Knowledge management system
  knowledgeSystem: {
    cataloging: 'universal_multi_language_classification',
    assistance: 'holographic_librarian_ai_network',
    translation: 'crystal_based_universal_language_conversion',
    navigation: 'floating_platform_and_dimensional_portal_system',
  },
};

export default entrance;
