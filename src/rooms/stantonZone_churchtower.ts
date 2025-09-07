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

// Church Tower - The Bell Synchronization Challenge in Stanton Harcourt

import { Room } from '../types/Room';

const churchtower: Room = {
  id: 'stantonZone_churchtower',
  zone: 'stantonZone',
  title: 'Ancient Church Tower',
  description: [
    'You ascend the narrow stone steps of Stanton Harcourt\'s ancient church tower, each footfall echoing with a resonance that seems to match your heartbeat. The tower rises impossibly high, its medieval stonework defying architectural logic as it stretches toward a sky that shifts between different dimensional hues.',
    'At the pinnacle, a collection of massive bronze bells hangs in perfect formation, each one inscribed with runes from different zones you\'ve visited. These aren\'t ordinary church bells - they\'re tuned to the frequencies of dimensional travel, and their tolling creates harmonics that can synchronize with a traveler\'s life force.',
    'The bells toll continuously in a complex pattern that seems random at first, but as you listen more carefully, you realize they\'re playing your journey\'s rhythm - each chime corresponding to a significant moment in your adventure. To complete the tower\'s challenge, you must synchronize your heartbeat with this cosmic rhythm.',
    'From this height, you can see all of Stanton Harcourt spread below, but more importantly, you can glimpse the dimensional bridges that connect this final zone to all the others. The tower serves as both a vantage point and a tuning mechanism for the completion process.',
  ],
  image: 'stantonZone_churchtower.png',
  ambientAudio: 'dimensional_church_bells_with_heartbeat_rhythm.mp3',

  consoleIntro: [
    '>> ANCIENT CHURCH TOWER - SYNCHRONIZATION CHALLENGE',
    '>> Height: IMPOSSIBLE ELEVATION - Defies architectural limitations',
    '>> Bell system: DIMENSIONAL FREQUENCY TUNERS - Each bell inscribed with zone runes',
    '>> Rhythm pattern: JOURNEY HEARTBEAT - Tolling matches your adventure\'s rhythm',
    '>> Synchronization requirement: LIFE FORCE HARMONY - Match heartbeat to bells',
    '>> Vantage function: DIMENSIONAL OVERVIEW - View all zone connections',
    '>> Challenge type: RHYTHMIC TRANSCENDENCE - Master temporal harmonics',
    '>> Stone construction: MEDIEVAL WITH IMPOSSIBLE PROPERTIES',
    '>> Bell inscriptions: MULTI-ZONE RUNIC - Representing entire journey',
    '>> "In the tower\'s height, heartbeat and cosmos find their rhythm"',
  ],

  exits: {
    stanton_harcourt: 'stantonharcourt',
    bell_chamber: 'stantonZone_bellchamber',
    tower_observation_deck: 'stantonZone_observationdeck',
    dimensional_vantage_point: 'stantonZone_dimensionalvantage',
    synchronization_platform: 'stantonZone_synchronizationplatform',
    spiral_staircase_down: 'stantonharcourt',
    emergency_teleport: 'introZone_crossing',
  },

  items: [
    'dimensional_bell_fragment',
    'journey_rhythm_crystal',
    'heartbeat_synchronizer',
    'runic_bell_inscription_copy',
    'tower_resonance_tuner',
    'cosmic_rhythm_map',
    'synchronization_achievement_token',
    'dimensional_overview_scope',
  ],

  interactables: {
    'dimensional_frequency_bells': {
      description: 'Massive bronze bells inscribed with runes from every zone, tuned to dimensional frequencies.',
      actions: ['listen_to_patterns', 'study_runic_inscriptions', 'attempt_synchronization', 'harmonize_with_rhythm'],
      requires: ['dimensional_travel_experience'],
    },
    'journey_rhythm_pattern': {
      description: 'The complex tolling pattern that corresponds to your entire adventure\'s significant moments.',
      actions: ['analyze_rhythm', 'identify_journey_moments', 'understand_cosmic_timing', 'achieve_recognition'],
      requires: ['significant_journey_progress'],
    },
    'heartbeat_synchronization_mechanism': {
      description: 'An ancient device that can detect and help synchronize your heartbeat with the bells.',
      actions: ['place_hand_on_mechanism', 'monitor_heartbeat', 'adjust_rhythm', 'achieve_synchronization'],
      requires: ['bell_pattern_understanding'],
    },
    'dimensional_overview_window': {
      description: 'Windows that provide a vantage point to see all dimensional bridges and zone connections.',
      actions: ['observe_dimensional_bridges', 'map_zone_connections', 'understand_network', 'gain_perspective'],
      requires: [],
    },
    'tower_resonance_chamber': {
      description: 'The acoustic chamber where all bell vibrations converge and amplify.',
      actions: ['enter_resonance_field', 'experience_harmonic_convergence', 'feel_cosmic_rhythm', 'transcend_timing'],
      requires: ['heartbeat_synchronization'],
    },
  },

  npcs: [
    'bell_tower_keeper',
    'rhythm_synchronization_master',
    'dimensional_harmonics_expert',
    'cosmic_timing_guardian',
    'heartbeat_resonance_guide',
  ],

  events: {
    onEnter: ['beginBellTolling', 'activateHeartbeatMonitoring', 'displayJourneyRhythm'],
    onExit: ['recordSynchronizationProgress', 'maintainRhythmicConnection'],
    onInteract: {
      dimensional_frequency_bells: ['analyzeBellInscriptions', 'mapJourneyRhythm', 'prepareForSynchronization'],
      journey_rhythm_pattern: ['identifyPersonalMoments', 'understandCosmicTiming'],
      heartbeat_synchronization_mechanism: ['monitorLifeForce', 'adjustToCosmicRhythm'],
      dimensional_overview_window: ['visualizeDimensionalNetwork', 'gainCosmicPerspective'],
      tower_resonance_chamber: ['experienceHarmonicTranscendence', 'achieveRhythmicMastery'],
    },
  },

  flags: {
    bellTollingActive: false,
    heartbeatMonitoringStarted: false,
    journeyRhythmRecognized: false,
    bellInscriptionsStudied: false,
    synchronizationAttempted: false,
    heartbeatSynchronized: false,
    dimensionalOverviewGained: false,
    resonanceChamberExperienced: false,
    rhythmicMasteryAchieved: false,
  },

  quests: {
    main: 'Achieve Heartbeat Synchronization with Dimensional Bells',
    optional: [
      'Study All Bell Runic Inscriptions',
      'Recognize Your Journey\'s Rhythm Pattern',
      'Master the Synchronization Mechanism',
      'Gain Dimensional Overview Perspective',
      'Experience Harmonic Resonance Chamber',
      'Achieve Cosmic Rhythmic Transcendence',
    ],
  },

  // Bell synchronization system
  synchronizationSystem: {
    bell_count: 'one_for_each_major_zone',
    frequency_range: 'dimensional_travel_harmonics',
    rhythm_pattern: 'personalized_journey_timing',
    synchronization_requirement: 'heartbeat_matches_cosmic_rhythm',
    mastery_condition: 'sustained_harmonic_resonance',
    completion_effect: 'unlock_advanced_completion_challenges',
  },

  customActions: {
    'synchronize_heartbeat_with_bells': {
      description: 'Achieve perfect harmony between your life force and the dimensional bell rhythm',
      requirements: ['bell_pattern_understanding', 'journey_rhythm_recognition', 'cosmic_awareness'],
      effects: ['unlock_resonance_chamber', 'gain_rhythmic_mastery', 'advance_completion_readiness'],
    },
    'master_dimensional_harmonics': {
      description: 'Understand and control the harmonic frequencies that connect all dimensions',
      requirements: ['heartbeat_synchronization', 'bell_inscription_mastery', 'dimensional_overview'],
      effects: ['unlock_harmonic_abilities', 'gain_cosmic_perspective', 'achieve_transcendent_timing'],
    },
    'achieve_rhythmic_transcendence': {
      description: 'Transcend normal temporal limitations through perfect harmonic synchronization',
      requirements: ['synchronization_mastery', 'resonance_chamber_experience', 'cosmic_rhythm_understanding'],
      effects: ['unlock_time_transcendence', 'gain_cosmic_timing_abilities', 'progress_toward_completion'],
    },
    'gain_dimensional_overview': {
      description: 'Use the tower\'s height to understand the full network of dimensional connections',
      requirements: ['bell_challenge_progress', 'synchronization_attempt', 'cosmic_awareness'],
      effects: ['unlock_dimensional_navigation', 'understand_zone_network', 'gain_completion_perspective'],
    },
  },

  // Tower characteristics
  towerFeatures: {
    height: 'architecturally_impossible_elevation',
    construction: 'medieval_with_dimensional_properties',
    acoustic_design: 'harmonic_resonance_amplification',
    bell_system: 'dimensional_frequency_calibrated',
    vantage_function: 'complete_dimensional_network_overview',
  },

  // Bell inscription system
  bellInscriptions: {
    intro_zone_bell: 'runes_of_beginning_and_crossing',
    london_zone_bell: 'symbols_of_urban_dimension',
    newyork_zone_bell: 'markings_of_metropolitan_energy',
    lattice_zone_bell: 'inscriptions_of_knowledge_and_books',
    labyrinth_zone_bell: 'maze_symbols_and_confusion_runes',
    off_gorstan_bell: 'transition_and_boundary_markings',
    glitch_zone_bell: 'chaos_and_reality_disruption_symbols',
    gorstan_zone_bell: 'core_reality_and_truth_runes',
    off_multiverse_bell: 'infinite_possibility_inscriptions',
    stanton_zone_bell: 'completion_and_transcendence_symbols',
  },
};

export default churchtower;
