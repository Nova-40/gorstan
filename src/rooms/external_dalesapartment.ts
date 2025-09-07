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

// Dale's Apartment - Source of the Forbidden Knowledge Artifact

import { Room } from '../types/Room';

const dalesapartment: Room = {
  id: 'dalesapartment',
  zone: 'external',
  title: 'Dale & Polly\'s Apartment',
  description: [
    'You step into a cozy, lived-in apartment that feels like a sanctuary from the dimensional chaos outside. The space has a warm, inviting atmosphere with mismatched furniture that somehow works perfectly together. Bookshelves line every available wall, filled with an eclectic mixture of academic texts, science fiction novels, and mysterious tomes that seem to shimmer with their own inner light.',
    'The living room centers around a comfortable sofa facing a fireplace that crackles with what appears to be dimensional flame - it burns without fuel and casts light that reveals hidden symbols on the walls. Dale\'s desk is cluttered with research notes, dimensional equations, and sketches of impossible geometries.',
    'Polly\'s workspace occupies the kitchen table, where crystalline devices and ancient artifacts are carefully arranged alongside everyday items like coffee mugs and house plants. The juxtaposition of the mundane and the miraculous creates an oddly comforting atmosphere.',
    'The most intriguing feature is a locked cabinet in the corner, its surface inscribed with warnings in multiple languages. A faint humming emanates from within, suggesting something of considerable power rests behind its protective barriers.',
  ],
  image: 'external_dalesapartment.png',
  ambientAudio: 'cozy_apartment_with_dimensional_energy.mp3',

  consoleIntro: [
    '>> DALE & POLLY\'S APARTMENT - DIMENSIONAL RESEARCH SANCTUARY',
    '>> Occupancy: RESIDENTIAL - Two interdimensional researchers',
    '>> Security level: PERSONAL - Private dimensional workspace',
    '>> Research focus: ADVANCED THEORY - Forbidden knowledge studies',
    '>> Artifact storage: SECURED - High-level protective containment',
    '>> Library classification: MIXED - Academic and esoteric materials',
    '>> Dimensional stability: HIGH - Carefully maintained equilibrium',
    '>> Access authorization: VISITOR - Guest privileges granted',
    '>> Warning: Some materials require specialist knowledge to handle safely',
    '>> "Home is where the dimensional equation balances"',
  ],

  exits: {
    front_door: 'introZone_crossing',
    emergency_portal: 'introZone_crossing',
  },

  items: [
    'research_notes_dale',
    'dimensional_equations_notebook',
    'coffee_mug_with_formula',
    'house_plant_responsive_to_dimensions',
    'polly_artifact_analysis_tools',
    'interdimensional_house_keys',
    'comfortable_reading_lamp',
    'photos_of_dimensional_travels',
  ],

  interactables: {
    'dimensional_fireplace': {
      description: 'A fireplace that burns with dimensional flame, revealing hidden symbols on the walls when its light touches them.',
      actions: ['examine_flame', 'read_wall_symbols', 'warm_hands', 'meditate_by_fire'],
      requires: [],
    },
    'dales_research_desk': {
      description: 'A cluttered workspace filled with advanced dimensional research and theoretical calculations.',
      actions: ['study_equations', 'read_research_notes', 'examine_sketches', 'understand_theories'],
      requires: ['academic_background'],
    },
    'pollys_artifact_workspace': {
      description: 'Polly\'s organized collection of crystalline devices and ancient artifacts under careful study.',
      actions: ['examine_crystals', 'study_artifacts', 'use_analysis_tools', 'learn_techniques'],
      requires: ['artifact_study_permission'],
    },
    'forbidden_knowledge_cabinet': {
      description: 'A heavily secured cabinet containing something that hums with dangerous power. Warning labels in multiple languages advise extreme caution.',
      actions: ['examine_locks', 'read_warnings', 'listen_to_humming', 'attempt_unlock'],
      requires: ['cabinet_access_key'],
    },
    'bookshelf_collection': {
      description: 'An extensive library combining academic texts with mysterious tomes that shimmer with otherworldly energy.',
      actions: ['browse_books', 'read_academic_texts', 'study_mysterious_tomes', 'research_topics'],
      requires: [],
    },
  },

  npcs: [
    'dale_dimensional_researcher',
    'polly_artifact_specialist',
  ],

  events: {
    onEnter: ['showApartmentWelcome', 'activateDimensionalSafety', 'feelHomeyAtmosphere'],
    onExit: ['apartmentFarewell', 'maintainDimensionalStability'],
    onInteract: {
      forbidden_knowledge_cabinet: ['checkAccessPermissions', 'warnOfDangers', 'revealArtifact'],
      dimensional_fireplace: ['revealHiddenSymbols', 'provideDimensionalWarmth'],
      dales_research_desk: ['shareResearchInsights', 'explainDimensionalTheory'],
      pollys_artifact_workspace: ['demonstrateArtifactAnalysis', 'teachSafeHandling'],
    },
  },

  flags: {
    apartmentDiscovered: true,
    daleMetAndTrusted: false,
    pollyMetAndTrusted: false,
    forbiddenCabinetUnlocked: false,
    forbiddenArtifactObtained: false,
    dimensionalResearchShared: false,
    artifactAnalysisLearned: false,
  },

  quests: {
    main: 'Gain Dale and Polly\'s Trust to Access the Forbidden Knowledge',
    optional: [
      'Study Dale\'s Dimensional Research',
      'Learn Artifact Analysis from Polly',
      'Understand the Dimensional Fireplace Symbols',
      'Unlock the Forbidden Knowledge Cabinet',
      'Obtain the Forbidden Knowledge Artifact',
    ],
  },

  // Special artifact system
  forbiddenArtifact: {
    name: 'Tome of Primordial Logic',
    description: 'An ancient artifact that contains the fundamental logical principles underlying all dimensional reality',
    unlockRequirements: ['dale_trust', 'polly_trust', 'dimensional_understanding'],
    purpose: 'Required for accessing the Hidden Library via the Librarian\'s logic puzzle',
    power: 'Contains answers to the deepest questions about reality\'s structure',
  },

  customActions: {
    'gain_researchers_trust': {
      description: 'Demonstrate your worthiness to access their most dangerous artifacts',
      requirements: ['dimensional_knowledge', 'responsible_behavior', 'academic_respect'],
      effects: ['unlock_cabinet_access', 'gain_forbidden_artifact'],
    },
    'study_forbidden_knowledge': {
      description: 'Carefully examine the Tome of Primordial Logic under supervision',
      requirements: ['cabinet_access', 'researcher_trust', 'mental_preparation'],
      effects: ['gain_primordial_understanding', 'unlock_librarian_puzzle'],
    },
  },

  // Apartment characteristics
  residentialFeatures: {
    atmosphere: 'cozy_academic_sanctuary_with_dimensional_wonders',
    security: 'personal_trust_based_rather_than_technological',
    specialFeatures: 'forbidden_knowledge_storage_and_dimensional_research_lab',
    accessibility: 'welcoming_to_trusted_visitors',
  },
};

export default dalesapartment;
