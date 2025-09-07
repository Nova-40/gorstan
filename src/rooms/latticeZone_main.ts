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

// Lattice Zone Main - Realm of Structured Knowledge

import { Room } from '../types/Room';

const latticemain: Room = {
  id: 'latticemain',
  zone: 'latticeZone',
  title: 'The Lattice Zone',
  description: [
    'You step into a realm where knowledge itself has taken physical form. The space extends infinitely in all directions, but is organized into a perfect three-dimensional grid of crystalline platforms connected by bridges of pure light. Each platform contains a different category of information, glowing softly with the accumulated wisdom of countless scholars.',
    'The air shimmers with floating equations, diagrams, and symbols that drift lazily between the platforms like intellectual snow. When you focus on any particular piece of knowledge, it becomes clearer and more detailed, as if responding to your curiosity and attention.',
    'At the center of this vast lattice rises a magnificent tower that seems to be constructed entirely from compressed books and scrolls. This is clearly the path to the Lattice Library, but the entrance is sealed by a complex puzzle lock that pulses with scholarly energy.',
    'The entire zone hums with the sound of thinking minds, creating a symphony of intellectual pursuit that is both inspiring and slightly overwhelming. You sense that this is a place where great discoveries are made, but only by those who approach knowledge with the proper respect and methodology.',
  ],
  image: 'latticeZone_main.png',
  ambientAudio: 'crystalline_knowledge_grid_with_thinking_symphony.mp3',

  consoleIntro: [
    '>> LATTICE ZONE - STRUCTURED KNOWLEDGE REALM',
    '>> Information classification: ORGANIZED OMNISCIENCE',
    '>> Platform count: INFINITE - Self-generating knowledge grid',
    '>> Knowledge density: MAXIMUM - All information available in structured form',
    '>> Access level: EARNED - Entry granted through logical demonstration',
    '>> Central feature: LATTICE LIBRARY TOWER - Advanced research facility',
    '>> Puzzle status: ACTIVE - Library access requires intellectual demonstration',
    '>> Learning amplification: 1000x - Accelerated knowledge acquisition enabled',
    '>> Safety protocol: MENTAL PROTECTION - Safeguards against information overload',
    '>> "In the lattice, all knowledge is connected, all learning is possible"',
  ],

  exits: {
    confluence_bridge: 'primeconfluence',
    library_tower: 'latticelibrary',
  },

  items: [
    'crystallized_knowledge_fragment',
    'floating_equation_collector',
    'scholarly_resonance_tuner',
    'intellectual_navigation_compass',
    'wisdom_amplification_crystal',
    'pattern_synthesis_device',
    'knowledge_grid_interface',
    'learning_acceleration_module',
  ],

  interactables: {
    'knowledge_platforms': {
      description: 'Crystalline platforms containing organized categories of information that glow with accumulated wisdom.',
      actions: ['browse_categories', 'access_information', 'cross_reference', 'synthesize_knowledge'],
      requires: [],
    },
    'floating_information': {
      description: 'Equations, diagrams, and symbols that drift through the air, becoming clearer when focused upon.',
      actions: ['focus_attention', 'capture_equations', 'understand_diagrams', 'interpret_symbols'],
      requires: ['intellectual_curiosity'],
    },
    'library_tower_entrance': {
      description: 'The entrance to the magnificent Library Tower, sealed by a complex puzzle lock that tests scholarly methodology.',
      actions: ['examine_puzzle_lock', 'attempt_solution', 'analyze_scholarly_requirements', 'apply_methodology'],
      requires: ['lattice_navigation_mastery'],
    },
    'light_bridges': {
      description: 'Bridges of pure light that connect the knowledge platforms, allowing navigation through the infinite grid.',
      actions: ['cross_bridges', 'follow_connections', 'map_relationships', 'understand_structure'],
      requires: [],
    },
    'central_information_nexus': {
      description: 'A swirling vortex of concentrated knowledge at the heart of the lattice, containing the most advanced concepts.',
      actions: ['approach_nexus', 'commune_with_knowledge', 'request_guidance', 'seek_wisdom'],
      requires: ['advanced_intellectual_preparation'],
    },
  },

  npcs: [
    'lattice_librarian_avatar',
    'knowledge_guardian_spirit',
  ],

  events: {
    onEnter: ['welcomeToLattice', 'activateKnowledgeGrid', 'assessIntellectualReadiness'],
    onExit: ['preserveLearningProgress', 'deactivateAmplification'],
    onInteract: {
      library_tower_entrance: ['initializeScholarlyTest', 'evaluateMethodology', 'checkPrerequisites'],
      knowledge_platforms: ['enhanceLearning', 'facilitateUnderstanding', 'connectConcepts'],
      floating_information: ['clarifyKnowledge', 'revealConnections', 'inspireInsight'],
      central_information_nexus: ['offerAdvancedWisdom', 'testReadiness', 'provideGuidance'],
    },
  },

  flags: {
    latticeZoneEntered: true,
    knowledgeGridActive: false,
    navigationMasteryAchieved: false,
    scholarlyMethodologyDemonstrated: false,
    libraryTowerAccessGranted: false,
    advancedWisdomSought: false,
    intellectualAmplificationActive: false,
  },

  quests: {
    main: 'Demonstrate Scholarly Methodology to Access the Library Tower',
    optional: [
      'Explore the Knowledge Platform Categories',
      'Master Navigation of the Light Bridges',
      'Capture and Study Floating Information',
      'Commune with the Central Information Nexus',
      'Consult the Lattice Librarian Avatar',
    ],
  },

  // Scholarly methodology test for library access
  scholarlyTest: {
    name: 'Academic Excellence Demonstration',
    description: 'A comprehensive test of scholarly methodology, research skills, and intellectual approach',
    components: [
      {
        skill: 'research_methodology',
        challenge: 'Demonstrate proper academic research techniques using the knowledge platforms',
        requirement: 'systematic_information_gathering_and_cross_referencing',
      },
      {
        skill: 'critical_thinking',
        challenge: 'Analyze contradictory information and synthesize coherent conclusions',
        requirement: 'logical_evaluation_and_evidence_based_reasoning',
      },
      {
        skill: 'intellectual_humility',
        challenge: 'Acknowledge limitations and seek guidance when appropriate',
        requirement: 'recognition_of_knowledge_boundaries_and_wisdom_seeking',
      },
      {
        skill: 'knowledge_synthesis',
        challenge: 'Connect disparate concepts to create new understanding',
        requirement: 'innovative_thinking_within_scholarly_framework',
      },
    ],
    completion_reward: 'Access to Lattice Library and enhanced learning capabilities',
  },

  customActions: {
    'navigate_knowledge_grid': {
      description: 'Master the art of moving efficiently through the infinite lattice of information',
      requirements: ['spatial_reasoning', 'pattern_recognition', 'intellectual_navigation'],
      effects: ['unlock_advanced_platforms', 'gain_navigation_mastery', 'access_deeper_knowledge'],
    },
    'demonstrate_scholarly_methodology': {
      description: 'Prove your worthiness to access the Library Tower through academic excellence',
      requirements: ['research_skills', 'critical_thinking', 'intellectual_humility', 'synthesis_ability'],
      effects: ['unlock_library_tower', 'gain_scholarly_recognition', 'enhance_learning_capacity'],
    },
    'commune_with_knowledge_nexus': {
      description: 'Seek advanced wisdom from the concentrated knowledge at the lattice\'s heart',
      requirements: ['advanced_preparation', 'intellectual_courage', 'wisdom_seeking'],
      effects: ['gain_profound_insights', 'unlock_hidden_knowledge', 'transcend_intellectual_limitations'],
    },
  },

  // Lattice Zone characteristics
  latticeProperties: {
    knowledge_organization: 'perfect_categorical_structure_with_infinite_expansion',
    learning_amplification: 'thousand_fold_acceleration_of_knowledge_acquisition',
    intellectual_requirements: 'scholarly_methodology_and_genuine_curiosity',
    access_philosophy: 'knowledge_freely_given_to_those_who_approach_with_proper_respect',
  },
};

export default latticemain;
