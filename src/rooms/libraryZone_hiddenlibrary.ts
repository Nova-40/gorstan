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

// Hidden Library - Secret chamber accessed via jump portal, home of the mysterious Librarian

import { Room } from '../types/Room';

const hiddenlibrary: Room = {
  id: 'hiddenlibrary',
  zone: 'libraryZone',
  title: 'Hidden Library',
  description: [
    'You find yourself in a library that exists beyond the conventional boundaries of space and knowledge. This is the Hidden Library, a place that few have ever discovered and even fewer have been deemed worthy to enter. The chamber stretches infinitely in all directions, yet somehow feels intimately cozy at the same time.',
    'The shelves here contain books that should not exist - texts written by civilizations that have never been, mathematical proofs of impossible theorems, and historical accounts of events that occurred in dimensions where time flows backward. The air shimmers with the weight of forbidden knowledge and ultimate truths.',
    'At the center of this impossible space sits the Librarian, a figure of indeterminate age and origin who has been the guardian of ultimate knowledge since before the first library was ever conceived. They regard you with eyes that have seen the birth and death of universes, waiting to determine if you are ready for the final revelation.',
    'Behind the Librarian, a swirling portal of pure possibility awaits. You sense that this gateway could take you anywhere in existence - but only if you can prove yourself worthy through wisdom, logic, and the possession of something that bridges the gap between question and answer.',
  ],
  image: 'libraryZone_hiddenlibrary.png',
  ambientAudio: 'ultimate_library_with_cosmic_whispers.mp3',

  consoleIntro: [
    '>> HIDDEN LIBRARY - ULTIMATE KNOWLEDGE REPOSITORY',
    '>> Classification: TRANSCENDENT SPACE - Beyond normal dimensional limits',
    '>> Guardian status: PRESENT - The Librarian awaits your arrival',
    '>> Knowledge level: ULTIMATE - Contains impossible and forbidden texts',
    '>> Access method: JUMP PORTAL - Discovered through mathematical understanding',
    '>> Test requirement: LOGIC PUZZLE - Must demonstrate worthy comprehension',
    '>> Artifact detection: SCANNING - Forbidden Knowledge Tome required for final access',
    '>> Portal destination: CONDITIONAL - Off-Gorstan Zone upon successful completion',
    '>> Warning: This is the final test of your intellectual worthiness',
    '>> "In the end, all knowledge returns to the question: What lies beyond knowing?"',
  ],

  exits: {
    return_portal: 'libraryofthenine',
    ultimate_gateway: 'offgorstanzoneexit', // Only accessible after logic puzzle completion
  },

  items: [
    'impossible_mathematical_texts',
    'backwards_flowing_histories',
    'unwritten_prophecies',
    'crystallized_pure_knowledge',
    'infinite_library_catalog',
    'cosmic_reading_light',
    'forbidden_truth_codex',
    'reality_revision_manuals',
  ],

  interactables: {
    'the_librarian': {
      description: 'The ultimate guardian of knowledge, ancient beyond measure, who holds the key to the final portal.',
      actions: ['speak_with_librarian', 'request_ultimate_test', 'present_artifact', 'attempt_logic_puzzle'],
      requires: [],
    },
    'impossible_knowledge_shelves': {
      description: 'Shelves containing texts that describe realities that have never existed and truths that transcend possibility.',
      actions: ['study_impossible_texts', 'read_backwards_histories', 'comprehend_unwritten_prophecies', 'absorb_crystallized_knowledge'],
      requires: ['transcendent_understanding'],
    },
    'ultimate_gateway_portal': {
      description: 'A swirling portal of pure possibility that leads to the Off-Gorstan Zone, but only opens for those who prove ultimate worthiness.',
      actions: ['examine_portal', 'test_activation', 'prepare_for_transit', 'step_through_gateway'],
      requires: ['logic_puzzle_solved', 'librarian_approval'],
    },
    'cosmic_knowledge_interface': {
      description: 'A mystical interface that allows direct communion with the fundamental principles underlying all reality.',
      actions: ['interface_with_cosmos', 'download_ultimate_knowledge', 'transcend_limitations', 'achieve_enlightenment'],
      requires: ['forbidden_knowledge_artifact', 'ultimate_worthiness'],
    },
  },

  npcs: [
    'the_ultimate_librarian',
    'voices_of_infinite_wisdom',
    'spirits_of_impossible_authors',
  ],

  events: {
    onEnter: ['announceUltimateArrival', 'librarianRecognizesVisitor', 'activateKnowledgeInterface'],
    onExit: ['preserveUltimateWisdom', 'recordTranscendentAchievement'],
    onInteract: {
      the_librarian: ['assessVisitorWorthiness', 'presentUltimateTest', 'evaluateLogicPuzzleAnswer'],
      impossible_knowledge_shelves: ['grantTranscendentInsights', 'expandConsciousnessBeyondLimits'],
      ultimate_gateway_portal: ['testFinalReadiness', 'activatePortalIfWorthy'],
      cosmic_knowledge_interface: ['enableDirectCosmicCommunion', 'downloadUniversalTruths'],
    },
  },

  flags: {
    hiddenLibraryAccessed: true,
    librarianEncountered: false,
    ultimateTestPresented: false,
    forbiddenArtifactPresented: false,
    logicPuzzleSolved: false,
    ultimateGatewayUnlocked: false,
    transcendentWisdomAchieved: false,
    cosmicCommunionCompleted: false,
  },

  quests: {
    main: 'Prove Ultimate Worthiness to the Librarian',
    optional: [
      'Study the Impossible Knowledge Collections',
      'Present the Forbidden Knowledge Artifact',
      'Solve the Ultimate Logic Puzzle',
      'Achieve Cosmic Communion',
      'Unlock the Ultimate Gateway Portal',
    ],
  },

  // The Ultimate Logic Puzzle System
  ultimateLogicPuzzle: {
    description: 'A logic puzzle that tests not just reasoning ability, but fundamental understanding of reality itself',
    puzzle_type: 'transcendent_logical_reasoning',
    artifact_requirement: 'tome_of_primordial_logic_from_dales_apartment',
    
    puzzle_content: {
      question: 'If knowledge is the mapping of reality, and reality is the expression of possibility, and possibility is the freedom from limitation, then what is the relationship between ignorance and truth?',
      
      possible_answers: [
        'Ignorance is the absence of truth',
        'Ignorance is truth waiting to be discovered',
        'Ignorance and truth are the same thing viewed from different perspectives',
        'Ignorance is the space where truth becomes possible',
        'The question creates its own impossibility and therefore transcends the need for an answer',
      ],
      
      correct_logic: 'The fifth answer demonstrates transcendent understanding - recognizing that some questions exist beyond the framework of answers',
      
      evaluation_criteria: [
        'Understanding of the paradox of knowledge',
        'Recognition of logical transcendence',
        'Wisdom beyond mere reasoning',
        'Possession of the Forbidden Knowledge Artifact',
      ],
    },
    
    success_outcome: 'librarian_approval_and_ultimate_gateway_unlock',
    failure_outcome: 'gentle_guidance_to_continue_learning_elsewhere',
  },

  customActions: {
    'present_forbidden_knowledge_artifact': {
      description: 'Present the Tome of Primordial Logic to demonstrate worthiness for the ultimate test',
      requirements: ['tome_of_primordial_logic', 'librarian_trust', 'transcendent_readiness'],
      effects: ['unlock_logic_puzzle_access', 'gain_librarian_respect', 'activate_ultimate_test'],
    },
    'solve_ultimate_logic_puzzle': {
      description: 'Demonstrate transcendent logical understanding to prove ultimate worthiness',
      requirements: ['forbidden_artifact_presented', 'transcendent_reasoning', 'wisdom_beyond_knowledge'],
      effects: ['unlock_ultimate_gateway', 'achieve_final_enlightenment', 'gain_cosmic_access'],
    },
    'achieve_cosmic_communion': {
      description: 'Interface directly with the fundamental principles of reality itself',
      requirements: ['ultimate_gateway_unlocked', 'transcendent_consciousness', 'reality_comprehension'],
      effects: ['download_universal_truths', 'transcend_dimensional_limitations', 'become_knowledge_itself'],
    },
    'step_through_ultimate_gateway': {
      description: 'Pass through the portal to reach the Off-Gorstan Zone and complete the ultimate journey',
      requirements: ['logic_puzzle_solved', 'librarian_approval', 'cosmic_communion_completed'],
      effects: ['transport_to_off_gorstan_zone', 'achieve_final_transcendence', 'complete_ultimate_quest'],
    },
  },

  // Librarian interaction system
  librarianSystem: {
    personality: 'ancient_wise_transcendent_being_beyond_normal_consciousness',
    communication_style: 'speaks_in_paradoxes_and_ultimate_truths',
    test_methodology: 'evaluates_wisdom_not_just_intelligence',
    approval_criteria: 'demonstrates_understanding_that_transcends_the_need_to_understand',
    
    lore_sharing: {
      cosmic_history: 'Reveals the true history of dimensional reality',
      ultimate_purpose: 'Explains the purpose behind the entire multidimensional structure',
      transcendent_wisdom: 'Shares knowledge that exists beyond the concept of knowledge',
      final_truth: 'The understanding that all seeking leads to the realization that seeking itself is the answer',
    },
  },

  // Artifact dependency system
  artifactSystem: {
    required_artifact: 'tome_of_primordial_logic',
    source: 'dales_apartment_forbidden_cabinet',
    verification: 'librarian_recognizes_authentic_forbidden_knowledge',
    purpose: 'bridges_gap_between_question_and_transcendence',
    power: 'contains_logical_principles_underlying_all_reality',
  },

  // Gateway destination
  ultimateGateway: {
    destination: 'offgorstanZone_exit',
    activation_requirements: [
      'forbidden_artifact_presented',
      'logic_puzzle_solved_transcendentally',
      'librarian_approval_granted',
      'cosmic_communion_achieved',
    ],
    transport_method: 'stepping_through_portal_of_pure_possibility',
    significance: 'represents_final_transcendence_of_the_quest_journey',
  },
};

export default hiddenlibrary;
