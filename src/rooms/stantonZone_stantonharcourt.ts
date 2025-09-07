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

// Stanton Harcourt - The Final Challenge Zone (most devious before game completion)

import { Room } from '../types/Room';

const stantonharcourt: Room = {
  id: 'stantonharcourt',
  zone: 'stantonZone',
  title: 'Stanton Harcourt',
  description: [
    'You enter the ancient village of Stanton Harcourt, a place where time itself seems to move differently. The cobblestone streets wind in patterns that shouldn\'t be geometrically possible, and the medieval buildings cast shadows that don\'t match the position of the sun.',
    'This is the final test before the ultimate completion of your journey - a zone designed to challenge even the most experienced travelers. The very air thrums with an undercurrent of cunning complexity, as if the place itself is aware of your proximity to the end and is determined to present the most devious puzzles and trials.',
    'Ancient stone houses line the streets, their windows reflecting not the world around them but glimpses of other dimensions you\'ve visited. The famous church tower looms in the distance, its bells tolling a rhythm that matches the beating of your heart, as if it knows you\'re approaching the culmination of all your adventures.',
    'Local villagers move about their daily lives, but there\'s something otherworldly about them - they speak in riddles, their tasks seem to serve purposes beyond the mundane, and their eyes hold the wisdom of those who exist at the threshold between worlds.',
  ],
  image: 'stantonZone_stantonharcourt.png',
  ambientAudio: 'medieval_village_with_dimensional_undertones.mp3',

  consoleIntro: [
    '>> STANTON HARCOURT - FINAL CHALLENGE ZONE',
    '>> Classification: ULTIMATE TEST - Most devious zone before completion',
    '>> Temporal status: IRREGULARITIES DETECTED - Time flows differently here',
    '>> Challenge level: MAXIMUM - Designed for experienced travelers only',
    '>> Dimensional resonance: THRESHOLD ENERGY - Between worlds awareness',
    '>> Population: ENLIGHTENED VILLAGERS - Speak in riddles and wisdom',
    '>> Architecture: IMPOSSIBLE GEOMETRY - Streets that shouldn\'t exist',
    '>> Church tower: MYSTICAL BEACON - Tolls in harmony with visitor heartbeat',
    '>> Warning: This zone will test everything you have learned',
    '>> "At the threshold of completion, the greatest trials await"',
  ],

  exits: {
    village_green: 'villagegreen',
    church_tower: 'stantonZone_churchtower',
    ancient_library: 'stantonZone_ancientlibrary',
    riddle_alley: 'stantonZone_riddlealley',
    threshold_chamber: 'stantonZone_thresholdchamber',
    dimensional_bridge: 'offgorstanZone_exit', // Final completion path
    emergency_return: 'introZone_crossing',
  },

  items: [
    'cobblestone_with_time_marks',
    'dimensional_reflection_shard',
    'church_bell_resonance_crystal',
    'villager_wisdom_scroll',
    'impossible_geometry_compass',
    'threshold_energy_detector',
    'final_challenge_key',
    'completion_proximity_indicator',
  ],

  interactables: {
    'impossible_cobblestone_streets': {
      description: 'Streets that wind in geometrically impossible patterns, challenging spatial understanding.',
      actions: ['trace_pattern', 'understand_geometry', 'navigate_impossibility', 'transcend_limitations'],
      requires: ['advanced_spatial_reasoning'],
    },
    'dimensional_reflection_windows': {
      description: 'Windows that reflect glimpses of all the dimensions and zones you\'ve previously visited.',
      actions: ['view_reflections', 'recall_journey', 'synthesize_experiences', 'understand_progression'],
      requires: ['dimensional_travel_experience'],
    },
    'enlightened_villagers': {
      description: 'Local residents who speak in riddles and seem to exist at the threshold between worlds.',
      actions: ['engage_in_riddles', 'seek_wisdom', 'understand_threshold_nature', 'learn_final_secrets'],
      requires: ['wisdom_from_previous_zones'],
    },
    'church_tower_bells': {
      description: 'Ancient bells that toll in rhythm with your heartbeat, as if the tower knows you\'re near completion.',
      actions: ['listen_to_rhythm', 'synchronize_heartbeat', 'understand_proximity', 'prepare_for_finale'],
      requires: [],
    },
    'threshold_energy_field': {
      description: 'A palpable energy that permeates the village, indicating proximity to the ultimate completion.',
      actions: ['sense_energy', 'measure_proximity', 'prepare_for_transition', 'embrace_culmination'],
      requires: ['completion_readiness'],
    },
  },

  npcs: [
    'wise_village_elder',
    'riddling_shopkeeper',
    'threshold_guardian',
    'completion_herald',
    'dimensional_scholar',
  ],

  events: {
    onEnter: ['announceProximityToCompletion', 'activateThresholdEnergy', 'presentFinalChallenges'],
    onExit: ['recordFinalProgress', 'maintainThresholdConnection'],
    onInteract: {
      impossible_cobblestone_streets: ['testSpatialTranscendence', 'challengeGeometricUnderstanding'],
      dimensional_reflection_windows: ['reviewEntireJourney', 'synthesizeAllExperiences'],
      enlightened_villagers: ['presentUltimateRiddles', 'shareThresholdWisdom'],
      church_tower_bells: ['synchronizeWithCompletion', 'prepareForCulmination'],
      threshold_energy_field: ['measureCompletionReadiness', 'enableFinalTransition'],
    },
  },

  flags: {
    finalZoneEntered: true,
    proximityToCompletionDetected: true,
    thresholdEnergyActive: false,
    villagerRiddlesSolved: false,
    geometryTranscended: false,
    heartbeatSynchronized: false,
    completionReadinessAchieved: false,
    finalChallengesCompleted: false,
  },

  quests: {
    main: 'Complete the Ultimate Final Challenges',
    optional: [
      'Solve All Villager Riddles',
      'Transcend Impossible Geometry',
      'Synchronize with Church Tower Bells',
      'Understand Threshold Energy',
      'Synthesize All Journey Experiences',
      'Achieve Completion Readiness',
    ],
  },

  // Final challenge mechanics
  finalChallengeSystem: {
    difficulty: 'most_devious_in_entire_game',
    purpose: 'ultimate_test_before_completion',
    requirements: 'all_previous_zone_experiences_and_wisdom',
    challenges: [
      'impossible_geometry_navigation',
      'villager_riddle_mastery',
      'dimensional_reflection_synthesis',
      'threshold_energy_harmonization',
      'heartbeat_bell_synchronization',
    ],
    completion_gateway: 'dimensional_bridge_to_off_gorstan_zone',
  },

  customActions: {
    'solve_ultimate_riddles': {
      description: 'Engage with enlightened villagers to solve the most devious riddles in the game',
      requirements: ['wisdom_from_all_zones', 'riddle_solving_mastery', 'threshold_understanding'],
      effects: ['unlock_advanced_challenges', 'gain_villager_approval', 'progress_toward_completion'],
    },
    'transcend_impossible_geometry': {
      description: 'Navigate and understand streets that exist beyond normal spatial limitations',
      requirements: ['advanced_spatial_reasoning', 'dimensional_travel_experience', 'geometric_transcendence'],
      effects: ['unlock_church_tower_access', 'gain_geometric_mastery', 'approach_completion_threshold'],
    },
    'synchronize_with_completion': {
      description: 'Harmonize with the threshold energy and church bells to prepare for final transition',
      requirements: ['all_challenges_completed', 'heartbeat_synchronization', 'completion_readiness'],
      effects: ['unlock_dimensional_bridge', 'achieve_ultimate_preparation', 'enable_final_completion'],
    },
    'achieve_final_completion_readiness': {
      description: 'Demonstrate mastery of all challenges to become ready for game completion',
      requirements: ['all_riddles_solved', 'geometry_transcended', 'threshold_harmonized'],
      effects: ['unlock_completion_gateway', 'achieve_ultimate_readiness', 'enable_final_transition'],
    },
  },

  // Threshold characteristics
  thresholdProperties: {
    proximity_to_completion: 'maximum_threshold_reached',
    challenge_difficulty: 'most_devious_in_game',
    wisdom_requirements: 'synthesis_of_all_previous_experiences',
    energy_signature: 'completion_gateway_resonance',
    temporal_effects: 'time_flows_according_to_readiness',
  },

  // Village characteristics
  villageFeatures: {
    architecture: 'impossible_medieval_geometry',
    population: 'enlightened_threshold_dwellers',
    purpose: 'final_testing_before_completion',
    energy: 'culmination_and_transcendence',
    wisdom_level: 'ultimate_challenge_mastery',
  },
};

export default stantonharcourt;
