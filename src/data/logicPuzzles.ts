/**
 * Logic Puzzle Data
 * Contains puzzle templates, generators, and puzzle content
 */

import {
  type LogicPuzzle,
  type PuzzleGenerator,
  type PuzzleTemplate,
  type PuzzleCollection,
  type SequencePuzzle,
  type QuantumPuzzle,
  type LogicDeductionPuzzle,
} from '../types/logicPuzzles';

// Puzzle Generators
export const puzzleGenerators: PuzzleGenerator[] = [
  {
    id: 'sequence_generator',
    name: 'Sequence Pattern Generator',
    description: 'Generates mathematical and logical sequence puzzles',
    supportedTypes: ['sequence'],
    supportedDifficulties: ['trivial', 'easy', 'medium', 'hard'],
    configuration: {
      randomization: 0.7,
      coherence: 0.9,
      accessibility: 0.8,
      innovation: 0.6,
    },
    algorithms: {
      trivial: {
        name: 'Simple Arithmetic',
        complexity: 1,
        parameters: { steps: 2, operations: ['add', 'subtract'] },
        weights: { pattern: 1.0, variation: 0.2 },
      },
      easy: {
        name: 'Basic Patterns',
        complexity: 3,
        parameters: { steps: 4, operations: ['add', 'subtract', 'multiply'] },
        weights: { pattern: 0.8, variation: 0.4 },
      },
      medium: {
        name: 'Complex Sequences',
        complexity: 5,
        parameters: { steps: 6, operations: ['add', 'subtract', 'multiply', 'power'] },
        weights: { pattern: 0.6, variation: 0.6 },
      },
      hard: {
        name: 'Advanced Patterns',
        complexity: 8,
        parameters: {
          steps: 10,
          operations: ['add', 'subtract', 'multiply', 'power', 'fibonacci', 'prime'],
        },
        weights: { pattern: 0.4, variation: 0.8 },
      },
    },
  },
  {
    id: 'grid_generator',
    name: 'Grid Logic Generator',
    description: 'Creates spatial arrangement and constraint puzzles',
    supportedTypes: ['grid'],
    supportedDifficulties: ['easy', 'medium', 'hard', 'expert'],
    configuration: {
      randomization: 0.6,
      coherence: 0.95,
      accessibility: 0.7,
      innovation: 0.8,
    },
    algorithms: {
      easy: {
        name: 'Simple Grid',
        complexity: 2,
        parameters: { size: [3, 3], constraints: 2 },
        weights: { logic: 0.8, spatial: 0.6 },
      },
      medium: {
        name: 'Standard Grid',
        complexity: 4,
        parameters: { size: [4, 4], constraints: 4 },
        weights: { logic: 0.7, spatial: 0.8 },
      },
      hard: {
        name: 'Complex Grid',
        complexity: 6,
        parameters: { size: [5, 5], constraints: 6 },
        weights: { logic: 0.6, spatial: 1.0 },
      },
      expert: {
        name: 'Master Grid',
        complexity: 9,
        parameters: { size: [6, 6], constraints: 8 },
        weights: { logic: 0.5, spatial: 1.0 },
      },
    },
  },
  {
    id: 'quantum_generator',
    name: 'Quantum Puzzle Generator',
    description: 'Creates puzzles requiring quantum artifact interaction',
    supportedTypes: ['quantum', 'artifact'],
    supportedDifficulties: ['medium', 'hard', 'expert', 'quantum'],
    configuration: {
      randomization: 0.5,
      coherence: 0.9,
      accessibility: 0.5,
      innovation: 1.0,
    },
    algorithms: {
      medium: {
        name: 'Basic Quantum',
        complexity: 4,
        parameters: { artifacts: 1, elements: 2, resonance: 30 },
        weights: { quantum: 0.8, artifacts: 0.6 },
      },
      hard: {
        name: 'Advanced Quantum',
        complexity: 7,
        parameters: { artifacts: 2, elements: 3, resonance: 50 },
        weights: { quantum: 1.0, artifacts: 0.8 },
      },
      expert: {
        name: 'Master Quantum',
        complexity: 10,
        parameters: { artifacts: 3, elements: 4, resonance: 70 },
        weights: { quantum: 1.0, artifacts: 1.0 },
      },
      quantum: {
        name: 'Transcendent Quantum',
        complexity: 15,
        parameters: { artifacts: 4, elements: 5, resonance: 90 },
        weights: { quantum: 1.0, artifacts: 1.0 },
      },
    },
  },
];

// Puzzle Templates
export const puzzleTemplates: PuzzleTemplate[] = [
  {
    id: 'arithmetic_sequence',
    name: 'Arithmetic Sequence Template',
    type: 'sequence',
    baseStructure: {
      sequence: [],
      pattern: { type: 'arithmetic', rule: '', complexity: 0 },
      missingElements: [],
    },
    variables: {
      start: { type: 'number', range: [1, 100] },
      difference: { type: 'number', range: [1, 20] },
      length: { type: 'number', range: [5, 15] },
      gaps: { type: 'number', range: [1, 3] },
    },
    validation: { solvable: true, unique: true, difficulty: 'easy' },
  },
  {
    id: 'sudoku_variant',
    name: 'Sudoku-style Grid Template',
    type: 'grid',
    baseStructure: {
      grid: { width: 0, height: 0, cells: [], constraints: {} },
      rules: [],
      objective: '',
    },
    variables: {
      size: { type: 'number', options: [4, 6, 9] },
      clues: { type: 'number', range: [0.3, 0.6] },
      regions: { type: 'array', constraints: { minRegions: 2 } },
    },
    validation: { solvable: true, unique: true, difficulty: 'medium' },
  },
  {
    id: 'quantum_resonance',
    name: 'Quantum Resonance Template',
    type: 'quantum',
    baseStructure: {
      quantumState: {
        superposition: false,
        entanglement: [],
        measurement: { basis: 'fire', outcome: null },
      },
      quantumGates: { available: [], sequence: [], target: null },
      artifactChanneling: { primaryArtifact: '', supportingArtifacts: [], resonancePattern: [] },
    },
    variables: {
      elements: {
        type: 'array',
        options: [
          ['fire', 'water'],
          ['earth', 'air'],
          ['fire', 'earth'],
          ['water', 'air'],
        ],
      },
      complexity: { type: 'number', range: [2, 8] },
      artifacts: { type: 'number', range: [1, 3] },
    },
    validation: { solvable: true, unique: false, difficulty: 'hard' },
  },
];

// Predefined Puzzle Collections
export const puzzleCollections: PuzzleCollection[] = [
  {
    id: 'tutorial_basics',
    name: 'Logic Fundamentals',
    description: 'Introduction to logic puzzles and basic problem-solving techniques',
    theme: 'tutorial',
    puzzles: ['tutorial_sequence_1', 'tutorial_grid_1', 'tutorial_logic_1'],
    ordering: 'sequential',
    progression: {
      unlockConditions: { playerLevel: 1 },
      completionRewards: {
        experience: 100,
        unlockedContent: { puzzles: ['exploration_set_1'] },
      },
      masteryRequirements: {
        minimumScore: 80,
        timeRequirements: 300000, // 5 minutes total
        noHints: false,
      },
    },
    analytics: {
      totalAttempts: 0,
      completionRate: 0,
      averageTime: 0,
      difficultyProgression: [1, 2, 3],
      playerFeedback: { rating: 0, comments: [], difficultyVotes: {} },
    },
  },
  {
    id: 'quantum_mysteries',
    name: 'Quantum Artifact Mysteries',
    description: 'Advanced puzzles requiring quantum artifact manipulation',
    theme: 'quantum',
    puzzles: ['quantum_entanglement_1', 'artifact_resonance_1', 'quantum_cipher_1'],
    ordering: 'branching',
    progression: {
      unlockConditions: {
        completedPuzzles: ['tutorial_basics'],
        artifactLevels: { flame_crystal: 3, frost_lens: 2 },
      },
      completionRewards: {
        experience: 500,
        quantumResonance: 25,
        artifactProgression: { flame_crystal: 50, frost_lens: 30 },
        unlockedContent: { lore: ['quantum_theory_advanced'] },
      },
      masteryRequirements: {
        minimumScore: 90,
        artifactMastery: { flame_crystal: 80, frost_lens: 60 },
      },
    },
    analytics: {
      totalAttempts: 0,
      completionRate: 0,
      averageTime: 0,
      difficultyProgression: [6, 7, 8],
      playerFeedback: { rating: 0, comments: [], difficultyVotes: {} },
    },
  },
  {
    id: 'master_challenges',
    name: 'Grandmaster Trials',
    description: 'Ultimate logic challenges for master puzzle solvers',
    theme: 'master',
    puzzles: ['master_sequence_1', 'master_grid_1', 'master_quantum_1', 'master_hybrid_1'],
    ordering: 'open',
    progression: {
      unlockConditions: {
        completedPuzzles: ['quantum_mysteries'],
        playerStats: { puzzlesSolved: 50, masteryLevel: 80 },
      },
      completionRewards: {
        experience: 1000,
        quantumResonance: 100,
        items: ['master_puzzle_badge', 'quantum_insights_tome'],
        unlockedContent: {
          routes: ['quantum_laboratory'],
          lore: ['puzzle_mastery_secrets'],
        },
      },
      masteryRequirements: {
        minimumScore: 95,
        timeRequirements: 1800000, // 30 minutes total
        noHints: true,
        artifactMastery: { flame_crystal: 100, frost_lens: 100, earth_core: 80 },
      },
    },
    analytics: {
      totalAttempts: 0,
      completionRate: 0,
      averageTime: 0,
      difficultyProgression: [12, 15, 18, 20],
      playerFeedback: { rating: 0, comments: [], difficultyVotes: {} },
    },
  },
];

// Sample Logic Puzzles
export const samplePuzzles: LogicPuzzle[] = [
  {
    id: 'tutorial_sequence_1',
    type: 'sequence',
    category: 'tutorial',
    difficulty: 'trivial',
    title: 'Number Patterns',
    description: 'Complete the sequence by finding the pattern',

    puzzle: {
      data: {
        sequence: [2, 4, 6, null, 10, 12],
        pattern: { type: 'arithmetic', rule: '+2', complexity: 1 },
        missingElements: [3],
      } as SequencePuzzle,
      solution: [8],
      hints: [
        'Look at the difference between consecutive numbers',
        'Each number increases by the same amount',
        'The missing number should be 8',
      ],
      explanation:
        'This is an arithmetic sequence where each number increases by 2. Starting from 2, we get: 2, 4, 6, 8, 10, 12.',
    },

    generation: {
      seed: 'tutorial_seq_1',
      algorithm: 'simple_arithmetic',
      parameters: { start: 2, difference: 2, length: 6 },
      complexity: 1,
    },

    progression: {
      prerequisites: {},
      rewards: {
        experience: 10,
        unlockedContent: { puzzles: ['tutorial_grid_1'] },
      },
    },

    analytics: {
      attempts: 0,
      completions: 0,
      averageTime: 0,
      commonMistakes: [],
      hintUsage: [0, 0, 0],
    },

    metadata: {
      created: Date.now(),
      lastModified: Date.now(),
      version: '1.0.0',
      tags: ['tutorial', 'sequence', 'arithmetic'],
      author: 'system',
    },
  },

  {
    id: 'quantum_entanglement_1',
    type: 'quantum',
    category: 'artifact',
    difficulty: 'hard',
    title: 'Quantum Entanglement Puzzle',
    description: 'Use the Flame Crystal and Frost Lens to create quantum entanglement',

    puzzle: {
      data: {
        quantumState: {
          superposition: true,
          entanglement: ['flame_crystal', 'frost_lens'],
          measurement: { basis: 'flux', outcome: null },
        },
        quantumGates: {
          available: ['hadamard', 'cnot', 'phase'],
          sequence: [],
          target: { entangled: true, phase: 'aligned' },
        },
        artifactChanneling: {
          primaryArtifact: 'flame_crystal',
          supportingArtifacts: ['frost_lens'],
          resonancePattern: [0.8, 0.6, 0.9, 0.7],
        },
      } as QuantumPuzzle,
      solution: {
        gateSequence: ['hadamard', 'cnot'],
        resonancePattern: [0.8, 0.6, 0.9, 0.7],
        finalState: 'entangled',
      },
      hints: [
        'Start by putting the flame crystal into superposition',
        'Use the CNOT gate to entangle the artifacts',
        'The resonance pattern should create harmonic oscillation',
        'Fire and ice elements naturally complement each other',
      ],
      explanation:
        'Quantum entanglement requires creating superposition in one artifact, then using a controlled gate to entangle it with another. The resonance pattern maintains stability during the process.',
    },

    generation: {
      seed: 'quantum_ent_1',
      algorithm: 'quantum_gate_sequence',
      parameters: { artifacts: 2, gates: 3, complexity: 7 },
      complexity: 7,
    },

    quantumAspects: {
      requiredArtifacts: ['flame_crystal', 'frost_lens'],
      quantumElements: ['flux', 'void'],
      resonanceRequired: 50,
      artifactInteractions: [
        {
          artifactId: 'flame_crystal',
          interactionType: 'channel',
          effect: 'Creates superposition state',
        },
        {
          artifactId: 'frost_lens',
          interactionType: 'resonate',
          effect: 'Provides entanglement target',
        },
      ],
    },

    progression: {
      prerequisites: {
        completedPuzzles: ['tutorial_basics'],
        artifactLevels: { flame_crystal: 3, frost_lens: 2 },
      },
      rewards: {
        experience: 100,
        quantumResonance: 20,
        artifactProgression: { flame_crystal: 25, frost_lens: 15 },
        unlockedContent: { lore: ['quantum_entanglement_theory'] },
      },
      timeConstraints: {
        timeLimit: 600000, // 10 minutes
        optimalTime: 300000, // 5 minutes for bonus
      },
    },

    analytics: {
      attempts: 0,
      completions: 0,
      averageTime: 0,
      commonMistakes: [
        'Attempting entanglement without superposition',
        'Wrong gate sequence order',
        'Insufficient resonance pattern',
      ],
      hintUsage: [0, 0, 0, 0],
    },

    metadata: {
      created: Date.now(),
      lastModified: Date.now(),
      version: '1.0.0',
      tags: ['quantum', 'entanglement', 'artifacts', 'hard'],
      author: 'system',
    },
  },

  {
    id: 'logic_deduction_houses',
    type: 'logic',
    category: 'exploration',
    difficulty: 'medium',
    title: 'The Three Houses Problem',
    description: 'Determine which family lives in which house using logical deduction',

    puzzle: {
      data: {
        entities: ['Smith', 'Jones', 'Brown'],
        properties: {
          house: ['Red', 'Blue', 'Green'],
          pet: ['Dog', 'Cat', 'Bird'],
          profession: ['Doctor', 'Teacher', 'Engineer'],
        },
        clues: [
          {
            id: 'clue1',
            statement: 'The Smith family does not live in the red house',
            type: 'negative',
            entities: ['Smith'],
            properties: ['Red'],
          },
          {
            id: 'clue2',
            statement: 'The doctor lives in the blue house',
            type: 'positive',
            entities: ['Doctor'],
            properties: ['Blue'],
          },
          {
            id: 'clue3',
            statement: 'The family with the dog is not the teacher',
            type: 'negative',
            entities: ['Dog'],
            properties: ['Teacher'],
          },
          {
            id: 'clue4',
            statement: 'Brown family has a bird and lives next to the doctor',
            type: 'conditional',
            entities: ['Brown'],
            properties: ['Bird', 'adjacent_to_blue'],
          },
        ],
        solution: {
          Smith: { house: 'Green', pet: 'Cat', profession: 'Engineer' },
          Jones: { house: 'Blue', pet: 'Dog', profession: 'Doctor' },
          Brown: { house: 'Red', pet: 'Bird', profession: 'Teacher' },
        },
      } as LogicDeductionPuzzle,
      solution: {
        Smith: { house: 'Green', pet: 'Cat', profession: 'Engineer' },
        Jones: { house: 'Blue', pet: 'Dog', profession: 'Doctor' },
        Brown: { house: 'Red', pet: 'Bird', profession: 'Teacher' },
      },
      hints: [
        'Start with the most specific clues first',
        'The doctor lives in the blue house - who could this be?',
        'Use elimination to narrow down possibilities',
        'Brown has a bird and lives next to the doctor',
      ],
      explanation:
        'By systematically applying each clue and using elimination, we can determine that Jones is the doctor in the blue house with a dog, Brown is the teacher in the red house with a bird, and Smith is the engineer in the green house with a cat.',
    },

    generation: {
      seed: 'logic_houses_1',
      algorithm: 'constraint_satisfaction',
      parameters: { entities: 3, properties: 3, clues: 4 },
      complexity: 5,
    },

    progression: {
      prerequisites: {
        completedPuzzles: ['tutorial_sequence_1'],
      },
      rewards: {
        experience: 50,
        unlockedContent: { puzzles: ['logic_deduction_advanced'] },
      },
    },

    analytics: {
      attempts: 0,
      completions: 0,
      averageTime: 0,
      commonMistakes: [
        'Not using all clues systematically',
        'Misinterpreting conditional statements',
        'Forgetting to check solution against all clues',
      ],
      hintUsage: [0, 0, 0, 0],
    },

    metadata: {
      created: Date.now(),
      lastModified: Date.now(),
      version: '1.0.0',
      tags: ['logic', 'deduction', 'medium', 'exploration'],
      author: 'system',
    },
  },
];

// Quantum Puzzle Presets
export const quantumPuzzlePresets = {
  basicResonance: {
    name: 'Basic Resonance',
    description: 'Simple artifact resonance puzzle',
    requiredArtifacts: 1,
    complexity: 3,
    elements: ['fire'],
    pattern: [0.5, 0.7, 0.9, 0.6],
  },

  dualHarmony: {
    name: 'Dual Harmony',
    description: 'Two-artifact harmonic resonance',
    requiredArtifacts: 2,
    complexity: 5,
    elements: ['fire', 'water'],
    pattern: [0.8, 0.6, 0.8, 0.6, 0.9, 0.7],
  },

  elementalFusion: {
    name: 'Elemental Fusion',
    description: 'Multi-element quantum fusion puzzle',
    requiredArtifacts: 3,
    complexity: 8,
    elements: ['fire', 'water', 'earth'],
    pattern: [0.9, 0.7, 0.8, 0.6, 0.9, 0.8, 0.7, 0.9],
  },

  transcendentSynthesis: {
    name: 'Transcendent Synthesis',
    description: 'Ultimate quantum synthesis challenge',
    requiredArtifacts: 4,
    complexity: 12,
    elements: ['fire', 'water', 'earth', 'air'],
    pattern: [1.0, 0.8, 0.9, 0.7, 1.0, 0.6, 0.8, 0.9, 0.7, 1.0],
  },
};

// Difficulty Scaling Parameters
export const difficultyScaling = {
  trivial: { complexity: 1, steps: 2, hints: 3, timeMultiplier: 3.0 },
  easy: { complexity: 3, steps: 4, hints: 3, timeMultiplier: 2.0 },
  medium: { complexity: 5, steps: 6, hints: 4, timeMultiplier: 1.5 },
  hard: { complexity: 8, steps: 10, hints: 4, timeMultiplier: 1.0 },
  expert: { complexity: 12, steps: 15, hints: 2, timeMultiplier: 0.8 },
  quantum: { complexity: 18, steps: 20, hints: 1, timeMultiplier: 0.6 },
};

export const puzzleData = {
  generators: puzzleGenerators,
  templates: puzzleTemplates,
  collections: puzzleCollections,
  samples: samplePuzzles,
  quantumPresets: quantumPuzzlePresets,
  difficultyScaling,
};
