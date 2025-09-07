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

// Prime Confluence - Gateway from Maze to Lattice Zone

import { Room } from '../types/Room';

const primeconfluence: Room = {
  id: 'primeconfluence',
  zone: 'latticeZone',
  title: 'Prime Confluence',
  description: [
    'You stand at the heart of a geometric impossibility, where the labyrinth\'s winding passages converge into perfect mathematical harmony. The walls here shimmer with crystalline formations that pulse in synchronized patterns, creating a hypnotic display of light and shadow.',
    'Above you, the ceiling opens into a vast dome where floating geometric shapes rotate in precise orbits, their surfaces reflecting infinite variations of the chamber below. The air hums with potential energy, as if reality itself is more malleable in this space.',
    'Three pathways branch from this central hub: behind you lies the familiar chaos of the labyrinth, while ahead, a translucent bridge of pure mathematics extends toward a realm of organized thought and structured knowledge. To your right, an alcove contains what appears to be a puzzle mechanism of incredible complexity.',
    'The confluence emanates a sense of transition - you are standing at the boundary between random exploration and purposeful discovery, between confusion and clarity, between maze and meaning.',
  ],
  image: 'latticeZone_primeconfluence.png',
  ambientAudio: 'geometric_harmony_with_mathematical_resonance.mp3',

  consoleIntro: [
    '>> PRIME CONFLUENCE - MATHEMATICAL TRANSITION NEXUS',
    '>> Geometric classification: CONVERGENCE POINT',
    '>> Dimensional stability: EXTREMELY HIGH - Perfect mathematical balance',
    '>> Pathway analysis: MULTI-DIRECTIONAL - Maze, Lattice, and Puzzle access',
    '>> Energy signature: HARMONIC RESONANCE - Synchronized crystalline patterns',
    '>> Mathematical complexity: ADVANCED - Geometric impossibility maintained',
    '>> Access requirements: LABYRINTH COMPLETION or AUTHORIZED ENTRY',
    '>> Transition protocol: PUZZLE VERIFICATION for Lattice Zone access',
    '>> Warning: Only those who demonstrate logical thinking may proceed',
    '>> "Where chaos gives way to order, the confluence awaits"',
  ],

  exits: {
    labyrinth_return: 'labrynthZone_hub',
    lattice_bridge: 'latticemain',
  },

  items: [
    'crystalline_formation_sample',
    'geometric_calculation_device',
    'harmonic_resonance_tuner',
    'mathematical_compass',
    'confluence_energy_crystal',
    'pattern_recognition_lens',
    'dimensional_stability_anchor',
    'puzzle_mechanism_manual',
  ],

  interactables: {
    'crystalline_formations': {
      description: 'Pulsing crystal structures that seem to respond to mathematical thinking and logical patterns.',
      actions: ['examine_patterns', 'touch_crystals', 'listen_to_harmony', 'tune_resonance'],
      requires: [],
    },
    'floating_geometries': {
      description: 'Rotating geometric shapes overhead that demonstrate perfect mathematical relationships.',
      actions: ['observe_orbits', 'calculate_patterns', 'predict_movements', 'understand_relationships'],
      requires: ['mathematical_understanding'],
    },
    'lattice_bridge': {
      description: 'A translucent bridge of pure mathematics leading to the Lattice Zone. It appears solid to those who understand its principles.',
      actions: ['examine_structure', 'test_solidity', 'cross_bridge', 'understand_mathematics'],
      requires: ['confluence_puzzle_solved'],
    },
    'confluence_puzzle_mechanism': {
      description: 'An incredibly complex puzzle device that seems to test both logical thinking and pattern recognition.',
      actions: ['examine_puzzle', 'attempt_solution', 'analyze_patterns', 'apply_logic'],
      requires: [],
    },
  },

  npcs: [
    'geometric_guide_spirit',
  ],

  events: {
    onEnter: ['announceConfluence', 'activateHarmonicResonance', 'assessMathematicalReadiness'],
    onExit: ['deactivateResonance', 'recordTransition'],
    onInteract: {
      confluence_puzzle_mechanism: ['initializePuzzleChallenge', 'testLogicalThinking', 'evaluatePatternRecognition'],
      lattice_bridge: ['checkPuzzleCompletion', 'validateBridgeAccess', 'enableLatticeEntry'],
      crystalline_formations: ['harmonizeWithPlayer', 'enhanceMathematicalPerception'],
      floating_geometries: ['demonstrateMathematicalPrinciples', 'inspireMathematicalThinking'],
    },
  },

  flags: {
    confluenceDiscovered: true,
    harmonicResonanceActive: false,
    confluencePuzzleSolved: false,
    latticeBridgeAccessible: false,
    mathematicalUnderstandingDemonstrated: false,
    geometricGuideEncountered: false,
  },

  quests: {
    main: 'Solve the Confluence Puzzle to Access the Lattice Zone',
    optional: [
      'Study the Crystalline Formation Patterns',
      'Understand the Floating Geometric Relationships',
      'Achieve Harmonic Resonance with the Chamber',
      'Consult the Geometric Guide Spirit',
    ],
  },

  // Puzzle system for accessing Lattice Zone
  confluencePuzzle: {
    name: 'Mathematical Harmony Challenge',
    description: 'A multi-stage puzzle testing pattern recognition, logical deduction, and mathematical understanding',
    stages: [
      {
        id: 'pattern_recognition',
        challenge: 'Identify the sequence pattern in the crystalline formations',
        solution: 'fibonacci_spiral_with_prime_modulation',
        hint: 'The crystals pulse in a sequence that follows both growth and prime number patterns',
      },
      {
        id: 'geometric_relationships',
        challenge: 'Determine the orbital relationship of the floating geometries',
        solution: 'golden_ratio_harmonic_orbits',
        hint: 'The shapes move in ratios that reflect natural mathematical harmony',
      },
      {
        id: 'logical_bridge',
        challenge: 'Apply logical principles to make the bridge solid',
        solution: 'mathematical_faith_and_understanding',
        hint: 'The bridge exists for those who truly understand that mathematics underlies all reality',
      },
    ],
    completion_reward: 'Access to Lattice Zone and enhanced mathematical perception',
  },

  customActions: {
    'solve_confluence_puzzle': {
      description: 'Engage with the complex puzzle mechanism to prove your logical thinking abilities',
      requirements: ['pattern_recognition_skill', 'mathematical_understanding', 'logical_deduction'],
      effects: ['unlock_lattice_bridge', 'gain_mathematical_insight', 'harmonize_with_confluence'],
    },
    'cross_lattice_bridge': {
      description: 'Step onto the mathematical bridge to enter the Lattice Zone',
      requirements: ['confluence_puzzle_solved', 'mathematical_faith'],
      effects: ['enter_lattice_zone', 'gain_structured_thinking_bonus'],
    },
    'commune_with_geometric_guide': {
      description: 'Seek wisdom from the spirit that guards this mathematical transition',
      requirements: ['respectful_approach', 'mathematical_curiosity'],
      effects: ['gain_puzzle_hints', 'understand_lattice_purpose', 'receive_guidance'],
    },
  },

  // Confluence characteristics
  confluenceProperties: {
    mathematical_nature: 'perfect_geometric_harmony_and_logical_structure',
    transition_function: 'gateway_between_chaos_and_order',
    puzzle_complexity: 'advanced_multi_stage_mathematical_challenge',
    access_philosophy: 'only_logical_thinkers_may_proceed_to_structured_knowledge',
  },
};

export default primeconfluence;
