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

// Library of the Nine - Unlocked by Libraina after Chronicle retrieval

import { Room } from '../types/Room';

const libraryofthenine: Room = {
  id: 'libraryofthenine',
  zone: 'libraryZone',
  title: 'Library of the Nine',
  description: [
    'You stand within one of the most exclusive collections in all the dimensions - the Library of the Nine. This sanctified space contains exactly nine sections, each dedicated to a different fundamental aspect of reality: Time, Space, Matter, Energy, Consciousness, Logic, Chaos, Order, and the mysterious ninth category simply labeled "Beyond".',
    'The architecture defies conventional geometry, with each section existing as its own perfectly crafted chamber that somehow fits within a space that should be far too small to contain them all. Libraina moves between the sections with practiced grace, her knowledge of the collection absolute and profound.',
    'The books here are not merely written texts but living repositories of wisdom. They glow softly with inner light, and some actually whisper when approached. The Chronicle of Lattice Wisdom now rests in a place of honor at the center, its successful retrieval having proven your worthiness to access this sacred knowledge.',
    'In one corner, partially hidden behind a curtain of mathematical equations, you notice what appears to be a concealed alcove. A faint humming suggests there might be a hidden passage accessible only to those who demonstrate exceptional understanding.',
  ],
  image: 'libraryZone_libraryofthenine.png',
  ambientAudio: 'sacred_library_with_whispered_wisdom.mp3',

  consoleIntro: [
    '>> LIBRARY OF THE NINE - EXCLUSIVE DIMENSIONAL KNOWLEDGE ARCHIVE',
    '>> Access level: RESTRICTED - Entry by Libraina\'s permission only',
    '>> Collection status: COMPLETE - Nine fundamental reality aspects',
    '>> Knowledge classification: TRANSCENDENT - Beyond ordinary understanding',
    '>> Visitor privileges: GRANTED - Chronicle retrieval achievement recognized',
    '>> Librarian status: PRESENT - Libraina available for consultation',
    '>> Security level: MAXIMUM - Protected by ancient scholarly oaths',
    '>> Hidden features: DETECTED - Concealed passage requires special access',
    '>> Learning opportunities: UNLIMITED - Wisdom of the Nine Aspects available',
    '>> "Knowledge earned through courage burns brightest in the seeking mind"',
  ],

  exits: {
    main_entrance: 'latticelibrary',
    emergency_exit: 'libraryZone_entrance',
    hidden_passage: 'hiddenlibrary', // Accessible via jump portal
  },

  items: [
    'chronicle_of_lattice_wisdom_displayed',
    'nine_section_catalog',
    'whispered_wisdom_crystals',
    'geometric_equation_curtains',
    'sacred_reading_lecterns',
    'reality_aspect_codex',
    'librarian_knowledge_seal',
    'dimensional_bookmark_collection',
  ],

  interactables: {
    'time_section': {
      description: 'Books that contain the deepest understanding of temporal mechanics and causality.',
      actions: ['study_temporal_theory', 'learn_time_manipulation', 'understand_causality', 'explore_temporal_paradoxes'],
      requires: ['chronicle_achievement'],
    },
    'space_section': {
      description: 'Texts exploring the nature of dimensional space and geometric impossibilities.',
      actions: ['study_spatial_theory', 'learn_dimensional_navigation', 'understand_geometry', 'explore_space_folding'],
      requires: ['chronicle_achievement'],
    },
    'consciousness_section': {
      description: 'Profound works on the nature of awareness, thought, and the observer effect.',
      actions: ['study_consciousness_theory', 'explore_awareness', 'understand_perception', 'learn_mental_techniques'],
      requires: ['chronicle_achievement'],
    },
    'beyond_section': {
      description: 'The mysterious ninth section containing knowledge that transcends the other eight categories.',
      actions: ['attempt_comprehension', 'seek_enlightenment', 'transcend_limitations', 'achieve_understanding'],
      requires: ['mastery_of_eight_sections', 'exceptional_wisdom'],
    },
    'hidden_alcove': {
      description: 'A concealed space behind mathematical equations that seems to contain a secret passage.',
      actions: ['examine_equations', 'search_for_entrance', 'solve_concealment_puzzle', 'discover_jump_portal'],
      requires: ['mathematical_mastery'],
    },
    'chronicle_display': {
      description: 'The Chronicle of Lattice Wisdom now rests in a place of honor, proving your successful quest.',
      actions: ['reflect_on_achievement', 'study_chronicle_contents', 'appreciate_wisdom', 'gain_confidence'],
      requires: [],
    },
  },

  npcs: [
    'libraina_master_librarian',
    'whispered_wisdom_voices',
    'section_guardian_spirits',
  ],

  events: {
    onEnter: ['welcomeSuccessfulHero', 'acknowledgeChronicleRetrieval', 'grantLibraryAccess'],
    onExit: ['preserveKnowledgeGained', 'maintainLibraryAccess'],
    onInteract: {
      time_section: ['revealTemporalSecrets', 'teachTimeManipulation'],
      space_section: ['explainDimensionalMechanics', 'demonstrateSpaceFolding'],
      consciousness_section: ['expandAwarenessCapabilities', 'teachMentalTechniques'],
      beyond_section: ['testTranscendentReadiness', 'grantOrWithholdUltimateKnowledge'],
      hidden_alcove: ['testMathematicalWorthiness', 'revealHiddenJumpPortal'],
      chronicle_display: ['reinforceAchievement', 'provideContinuedInspiration'],
    },
  },

  flags: {
    libraryAccess: true,
    chronicleAchievementRecognized: true,
    timeKnowledgeGained: false,
    spaceKnowledgeGained: false,
    matterKnowledgeGained: false,
    energyKnowledgeGained: false,
    consciousnessKnowledgeGained: false,
    logicKnowledgeGained: false,
    chaosKnowledgeGained: false,
    orderKnowledgeGained: false,
    beyondKnowledgeGained: false,
    hiddenJumpPortalDiscovered: false,
    allSectionsMastered: false,
  },

  quests: {
    main: 'Study the Nine Aspects of Reality',
    optional: [
      'Master Each of the Nine Sections',
      'Discover the Hidden Jump Portal',
      'Gain Libraina\'s Complete Trust',
      'Unlock the Beyond Section',
      'Achieve Transcendent Understanding',
    ],
  },

  // Jump portal system (hidden access to Hidden Library)
  hiddenJumpPortal: {
    location: 'concealed_behind_mathematical_equations',
    discoveryMethod: 'solve_geometric_concealment_puzzle',
    activationMethod: 'jump_movement_while_focused_on_equations',
    destination: 'libraryZone_hiddenlibrary',
    visibility: 'hidden_until_discovered',
    access_requirement: 'mathematical_understanding',
  },

  customActions: {
    'study_reality_aspects': {
      description: 'Systematically study each of the nine fundamental aspects of reality',
      requirements: ['chronicle_achievement', 'scholarly_dedication', 'mental_preparation'],
      effects: ['gain_transcendent_knowledge', 'unlock_advanced_abilities', 'increase_wisdom'],
    },
    'discover_hidden_portal': {
      description: 'Use mathematical understanding to reveal the concealed jump portal',
      requirements: ['mathematical_mastery', 'pattern_recognition', 'persistent_investigation'],
      effects: ['reveal_jump_portal', 'access_hidden_library', 'impress_libraina'],
    },
    'achieve_section_mastery': {
      description: 'Completely master understanding of all nine reality aspects',
      requirements: ['study_all_sections', 'demonstrate_comprehension', 'transcendent_readiness'],
      effects: ['unlock_beyond_section', 'gain_ultimate_library_access', 'achieve_scholarly_enlightenment'],
    },
    'activate_hidden_jump_portal': {
      description: 'Use the jump movement to access the Hidden Library through the concealed portal',
      requirements: ['portal_discovered', 'jump_ability', 'mathematical_focus'],
      effects: ['transport_to_hidden_library', 'meet_mysterious_librarian', 'access_ultimate_knowledge'],
    },
  },

  // Library of Nine mechanics
  nineAspects: {
    'Time': 'Understanding temporal mechanics and causality',
    'Space': 'Mastering dimensional navigation and geometry',
    'Matter': 'Comprehending physical substance and transformation',
    'Energy': 'Grasping force, motion, and power dynamics',
    'Consciousness': 'Exploring awareness, perception, and mental phenomena',
    'Logic': 'Mastering reasoning, proof, and rational thought',
    'Chaos': 'Understanding randomness, disorder, and emergent patterns',
    'Order': 'Comprehending structure, organization, and systematic harmony',
    'Beyond': 'Transcending the limitations of the other eight aspects',
  },

  // Libraina interaction system
  librainaSystem: {
    relationship: 'grateful_mentor_after_chronicle_retrieval',
    knowledge_sharing: 'provides_guidance_for_each_section',
    trust_level: 'high_due_to_successful_quest_completion',
    special_knowledge: 'hints_about_hidden_portal_and_ultimate_mysteries',
  },

  // Achievement recognition
  achievementRecognition: {
    chronicle_retrieval: 'permanent_library_access_granted',
    books_saved: 'additional_knowledge_sections_unlocked',
    quest_completion: 'libraina_maximum_trust_achieved',
    wisdom_demonstration: 'hidden_features_become_accessible',
  },
};

export default libraryofthenine;
