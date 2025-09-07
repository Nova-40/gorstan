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

// Ancient Archives - Library Zone Historical Collection

import { Room } from '../types/Room';

const ancientarchives: Room = {
  id: 'ancientarchives',
  zone: 'libraryZone',
  title: 'Ancient Archives',
  description: [
    'You enter the hallowed Ancient Archives, where the oldest knowledge in the interdimensional library is preserved in climate-controlled perfection. Towering shelves carved from a single piece of obsidian stretch toward a vaulted ceiling painted with constellations from civilizations that predate recorded history.',
    'The atmosphere here is reverent and hushed, with specially designed silence fields that muffle all unnecessary sound while amplifying the gentle whisper of turning pages. Ancient scrolls, stone tablets, crystalline data cores, and books bound in materials that no longer exist rest in specially designed preservation chambers.',
    'Floating preservation orbs drift slowly between the shelves, maintaining optimal conditions for each artifact. Some documents are so old they exist partially in multiple dimensions, requiring special viewing apparatus to read them completely. The scent of time itself seems to permeate the air - a mixture of aged wisdom and cosmic dust.',
    'At the center of the archives stands the Chronological Index, a massive crystalline structure that organizes all historical knowledge by timeline, dimension, and civilization. Touching its surface reveals the interconnected flow of knowledge through time and space.',
    'Ancient reading alcoves provide intimate spaces for studying the most precious documents, each equipped with temporal stabilization fields that prevent the degradation that would normally result from exposure to mortal observation.',
  ],
  image: 'libraryZone_ancientarchives.png',
  ambientAudio: 'ancient_archives_ambience.mp3',

  consoleIntro: [
    '>> ANCIENT ARCHIVES - HISTORICAL PRESERVATION VAULT',
    '>> Document age range: 50,000 BCE to DIMENSIONAL ORIGIN',
    '>> Preservation status: OPTIMAL - Advanced temporal stabilization',
    '>> Climate control: PERFECT - Multi-dimensional environmental systems',
    '>> Access level: SCHOLAR - Advanced research credentials required',
    '>> Silence fields: ACTIVE - Optimal study environment maintained',
    '>> Document types: COMPREHENSIVE - All historical media formats',
    '>> Chronological indexing: COMPLETE - Universal timeline integration',
    '>> Viewing apparatus: SPECIALIZED - Multi-dimensional document access',
    '>> "Where History Whispers Its Secrets"',
  ],

  exits: {
    // Back to main library
    main_entrance: 'libraryZone_entrance',
    reading_hall: 'libraryZone_readinghall',
    
    // Specialized archive sections
    prehistoric_vault: 'libraryZone_prehistoricvault',
    civilization_records: 'libraryZone_civilizationrecords',
    temporal_anomaly_section: 'libraryZone_temporalanomalies',
    
    // Connected zones via historical documents
    ancient_wisdom_portal: 'cloudZone_ancientwisdom',
    temporal_research_lab: 'spaceZone_temporalresearch',
    
    // Special access routes
    chronological_index_portal: 'libraryZone_timelinecentral',
    preservation_maintenance: 'libraryZone_preservationlab',
    
    // Scholar access
    restricted_ancient_vault: 'libraryZone_restrictedancients',
  },

  items: [
    'ancient_scroll_fragment',
    'temporal_viewing_lens',
    'preservation_field_generator',
    'chronological_coordinate_crystal',
    'historical_translation_matrix',
    'ancient_civilization_catalog',
    'time_stabilization_device',
    'dimensional_document_reader',
  ],

  interactables: {
    'chronological_index': {
      description: 'Massive crystalline structure organizing all historical knowledge by timeline and dimension.',
      actions: ['browse_timelines', 'search_civilizations', 'trace_historical_connections', 'access_temporal_data'],
      requires: ['chronological_research_clearance'],
    },
    'preservation_chambers': {
      description: 'Specialized containers maintaining optimal conditions for ancient documents.',
      actions: ['view_contents', 'adjust_preservation', 'study_artifacts', 'access_documents'],
      requires: ['preservation_training'],
    },
    'ancient_reading_alcoves': {
      description: 'Intimate study spaces with temporal stabilization for viewing precious documents.',
      actions: ['study_ancient_texts', 'activate_stabilization', 'research_deeply', 'meditate_on_wisdom'],
      requires: ['scholar_access_level'],
    },
    'dimensional_viewing_apparatus': {
      description: 'Specialized equipment for reading documents that exist across multiple dimensions.',
      actions: ['calibrate_viewer', 'access_multidimensional_text', 'adjust_dimensional_focus', 'read_impossible_documents'],
      requires: ['dimensional_viewing_training'],
    },
    'floating_preservation_orbs': {
      description: 'Autonomous systems maintaining perfect environmental conditions for each artifact.',
      actions: ['monitor_conditions', 'interact_with_orb', 'learn_preservation_science', 'calibrate_systems'],
      requires: ['preservation_science_knowledge'],
    },
    'obsidian_shelving': {
      description: 'Perfectly carved shelves that enhance the preservation properties of stored documents.',
      actions: ['examine_craftsmanship', 'study_preservation_properties', 'understand_material_science', 'appreciate_artistry'],
      requires: [],
    },
    'silence_field_generators': {
      description: 'Advanced technology creating perfect acoustic conditions for study and preservation.',
      actions: ['adjust_silence_levels', 'study_acoustic_science', 'enhance_concentration', 'understand_technology'],
      requires: ['acoustic_engineering_knowledge'],
    },
  },

  npcs: [
    'chief_archivist_temporal',
    'ancient_document_guardian',
    'chronological_index_keeper',
    'preservation_specialist_ai',
    'dimensional_historian',
    'time_stabilization_technician',
  ],

  events: {
    onEnter: ['showArchivesMajesty', 'activatePreservationProtocols', 'feelHistoricalWeight'],
    onExit: ['archivesFarewell', 'saveResearchProgress'],
    onInteract: {
      chronological_index: ['unlockHistoricalTimelines', 'gainTemporalPerspective'],
      preservation_chambers: ['accessAncientWisdom', 'learnPreservationScience'],
      ancient_reading_alcoves: ['deepHistoricalStudy', 'gainAncientKnowledge'],
      dimensional_viewing_apparatus: ['readImpossibleTexts', 'expandDimensionalUnderstanding'],
    },
  },

  flags: {
    ancientArchivesDiscovered: true,
    chronologicalIndexAccessed: false,
    preservationTrainingCompleted: false,
    dimensionalViewingMastered: false,
    ancientWisdomGained: false,
    temporalStabilizationUnderstood: false,
    scholarAccessGranted: false,
    historicalResearchCompleted: false,
  },

  quests: {
    main: 'Unlock the Secrets of Ancient History',
    optional: [
      'Master the Chronological Index System',
      'Complete Preservation Science Training',
      'Learn to Use Dimensional Viewing Apparatus',
      'Study Documents from Lost Civilizations',
      'Understand Temporal Stabilization Technology',
      'Gain Scholar-Level Archive Access',
    ],
  },

  environmental: {
    lighting: 'soft_preservation_lighting_with_temporal_stability',
    temperature: 'precisely_controlled_archival_conditions',
    airQuality: 'purified_with_temporal_ionization',
    soundscape: ['silence_field_humming', 'pages_whispering', 'preservation_orb_floating', 'time_flowing'],
    hazards: ['temporal_paradox_risk', 'information_overload', 'dimensional_viewing_strain'],
  },

  security: {
    level: 'maximum_historical_protection',
    accessRequirements: ['scholar_credentials', 'preservation_training', 'temporal_stability_clearance'],
    alarmTriggers: ['document_damage', 'unauthorized_copying', 'temporal_contamination'],
    surveillanceActive: true,
    surveillanceType: 'temporal_monitoring_and_preservation_orb_surveillance',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'challenging',
    estimatedPlayTime: '30-45 minutes',
    keyFeatures: [
      'Ancient historical documents',
      'Temporal stabilization technology',
      'Chronological index system',
      'Dimensional viewing apparatus',
      'Advanced preservation science',
    ],
  },

  secrets: {
    temporalMastery: {
      description: 'Complete understanding of temporal stabilization and historical timeline navigation',
      requirements: ['temporal_science_expertise', 'chronological_index_mastery', 'historical_research_skills'],
      rewards: ['temporal_navigation_abilities', 'historical_timeline_mastery'],
    },
    ancientCivilizationSecrets: {
      description: 'Hidden knowledge about civilizations that predate known history',
      requirements: ['ancient_document_access', 'dimensional_viewing_expertise', 'archaeological_knowledge'],
      rewards: ['ancient_civilization_database', 'prehistoric_technology_understanding'],
    },
    preservationMastery: {
      description: 'Expert-level knowledge of document preservation across dimensions',
      requirements: ['preservation_science_training', 'orb_system_understanding', 'material_science_expertise'],
      rewards: ['preservation_technology_mastery', 'artifact_restoration_abilities'],
    },
  },

  customActions: {
    'temporal_research': {
      description: 'Conduct advanced research using temporal stabilization and dimensional viewing',
      requirements: ['scholar_access_level', 'dimensional_viewing_training', 'temporal_stability_clearance'],
      effects: ['advanced_historical_knowledge', 'temporal_research_expertise'],
    },
    'ancient_wisdom_synthesis': {
      description: 'Synthesize knowledge from multiple ancient civilizations',
      requirements: ['ancient_document_access', 'chronological_index_mastery', 'pattern_recognition'],
      effects: ['synthesized_ancient_wisdom', 'cross_cultural_understanding'],
    },
    'preservation_innovation': {
      description: 'Develop new preservation techniques for impossible-to-preserve documents',
      requirements: ['preservation_science_expertise', 'dimensional_understanding', 'innovative_thinking'],
      effects: ['preservation_innovation', 'document_rescue_capabilities'],
    },
  },

  // Ancient archives characteristics
  archiveCharacteristics: {
    documentAgeRange: '50000_bce_to_dimensional_origin',
    preservationLevel: 'temporal_stabilization_with_dimensional_enhancement',
    accessLevel: 'scholar_and_specialist_credentials_required',
    specialFeatures: 'multidimensional_viewing_and_chronological_indexing',
  },

  // Preservation technology
  preservationTechnology: {
    temporalStabilization: 'prevents_document_degradation_from_observation',
    environmentalControl: 'floating_orb_monitoring_and_adjustment',
    dimensionalViewing: 'access_to_documents_existing_across_multiple_dimensions',
    silenceFields: 'acoustic_optimization_for_study_and_preservation',
  },

  // Historical knowledge system
  historicalSystem: {
    chronologicalIndex: 'crystal_based_timeline_and_civilization_database',
    documentTypes: 'scrolls_tablets_crystals_and_impossible_formats',
    researchCapabilities: 'temporal_navigation_and_dimensional_cross_reference',
    wisdomAccess: 'ancient_knowledge_synthesis_and_understanding',
  },
};

export default ancientarchives;
