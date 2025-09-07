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

// Village Green - The Final Preparation Space in Stanton Harcourt

import { Room } from '../types/Room';

const villagegreen: Room = {
  id: 'villagegreen',
  zone: 'stantonZone',
  title: 'Village Green',
  description: [
    'The heart of Stanton Harcourt\'s mystical energy converges at this ancient village green, where a perfect circle of impossibly green grass defies the laws of seasonal change. The space pulses with an otherworldly energy that seems to acknowledge your proximity to the ultimate completion of your journey.',
    'At the center stands an ancient stone circle, its weathered monoliths covered in runes that shift and change as you watch them. These aren\'t just decorative symbols - they respond to your presence, glowing faintly with different colors based on the challenges you\'ve completed and the wisdom you\'ve gained throughout your entire adventure.',
    'The green itself serves as a nexus point where all the dimensional energies you\'ve encountered in your travels seem to converge. Streams of barely visible energy flow across the grass in patterns that mirror the connections between the zones you\'ve visited, creating a living map of your journey etched in light upon the earth.',
    'This is the final preparation space before the ultimate challenges. The air thrums with anticipation, and you can sense that every step you take here, every interaction, is being evaluated by forces that will determine whether you\'re truly ready for the completion that lies ahead.',
  ],
  image: 'stantonZone_villagegreen.png',
  ambientAudio: 'mystical_green_with_completion_energy.mp3',

  consoleIntro: [
    '>> VILLAGE GREEN - FINAL PREPARATION NEXUS',
    '>> Location: Heart of Stanton Harcourt\'s mystical convergence',
    '>> Status: COMPLETION ENERGY NEXUS - All dimensional streams converge here',
    '>> Stone circle: RESPONSIVE RUNES - React to traveler\'s journey progress',
    '>> Grass energy: PERPETUAL VERDANCE - Defies natural seasonal laws',
    '>> Energy mapping: JOURNEY VISUALIZATION - Your path etched in light',
    '>> Evaluation mode: ACTIVE - Readiness for completion being assessed',
    '>> Preparation level: FINAL PHASE - Ultimate challenges await',
    '>> Connection status: ALL ZONES LINKED - Dimensional convergence active',
    '>> "In the green heart of completion, all journeys find their truth"',
  ],

  exits: {
    stanton_harcourt: 'stantonharcourt',
    stone_circle_center: 'stantonZone_stonecircle',
    energy_convergence_point: 'stantonZone_energyconvergence',
    preparation_grove: 'stantonZone_preparationgrove',
    wisdom_pavilion: 'stantonZone_wisdompavillion',
    completion_gateway: 'stantonZone_completiongateway',
    return_to_crossing: 'introZone_crossing',
  },

  items: [
    'perpetually_green_grass_sample',
    'responsive_rune_fragment',
    'dimensional_convergence_crystal',
    'journey_light_map',
    'completion_energy_core',
    'readiness_assessment_scroll',
    'nexus_resonance_tuner',
    'final_preparation_guide',
  ],

  interactables: {
    'ancient_stone_circle': {
      description: 'Weathered monoliths covered in runes that shift and glow based on your journey progress.',
      actions: ['read_responsive_runes', 'touch_ancient_stones', 'channel_completion_energy', 'activate_evaluation'],
      requires: ['dimensional_travel_experience'],
    },
    'impossible_green_grass': {
      description: 'Perfect circle of eternally green grass that defies natural laws and seasons.',
      actions: ['step_onto_green', 'feel_eternal_energy', 'understand_timelessness', 'prepare_for_transcendence'],
      requires: [],
    },
    'dimensional_energy_streams': {
      description: 'Visible streams of energy that flow in patterns mirroring your journey connections.',
      actions: ['trace_energy_patterns', 'follow_journey_map', 'understand_connections', 'synthesize_experiences'],
      requires: ['zone_completion_experience'],
    },
    'convergence_nexus_point': {
      description: 'The exact center where all dimensional energies from your travels converge.',
      actions: ['stand_at_center', 'feel_convergence', 'channel_all_energies', 'achieve_synthesis'],
      requires: ['multiple_zone_mastery'],
    },
    'readiness_assessment_field': {
      description: 'An invisible field that evaluates your preparation for the ultimate completion.',
      actions: ['undergo_assessment', 'demonstrate_readiness', 'prove_worthiness', 'earn_approval'],
      requires: ['significant_journey_progress'],
    },
  },

  npcs: [
    'nexus_guardian',
    'completion_assessor',
    'dimensional_convergence_monitor',
    'journey_wisdom_keeper',
    'final_preparation_guide',
  ],

  events: {
    onEnter: ['activateNexusEnergy', 'beginReadinessAssessment', 'displayJourneyMap'],
    onExit: ['recordPreparationProgress', 'maintainNexusConnection'],
    onInteract: {
      ancient_stone_circle: ['activateResponsiveRunes', 'assessJourneyProgress', 'revealCompletionPath'],
      impossible_green_grass: ['connectWithEternalEnergy', 'prepareForTranscendence'],
      dimensional_energy_streams: ['visualizeJourneyConnections', 'synthesizeAllExperiences'],
      convergence_nexus_point: ['channelAllDimensionalEnergies', 'achieveUltimatePreparation'],
      readiness_assessment_field: ['evaluateCompletionReadiness', 'determineUltimateWorthiness'],
    },
  },

  flags: {
    nexusEnergyActive: false,
    readinessAssessmentStarted: false,
    journeyMapRevealed: false,
    responsiveRunesActivated: false,
    eternalEnergyConnected: false,
    energyStreamsTraced: false,
    nexusConvergenceAchieved: false,
    preparationCompleted: false,
    completionReadinessConfirmed: false,
  },

  quests: {
    main: 'Achieve Ultimate Preparation for Completion',
    optional: [
      'Activate All Responsive Runes',
      'Connect with Eternal Green Energy',
      'Trace All Dimensional Energy Streams',
      'Achieve Nexus Convergence',
      'Pass Readiness Assessment',
      'Synthesize Journey Experiences',
    ],
  },

  // Nexus convergence system
  nexusSystem: {
    purpose: 'final_preparation_and_assessment',
    energy_sources: 'all_previously_visited_zones',
    assessment_criteria: [
      'zone_completion_mastery',
      'dimensional_understanding',
      'wisdom_synthesis',
      'challenge_transcendence',
      'readiness_for_ultimate_completion',
    ],
    convergence_requirement: 'harmony_with_all_dimensional_energies',
  },

  customActions: {
    'achieve_nexus_convergence': {
      description: 'Channel and harmonize with all dimensional energies at the convergence point',
      requirements: ['dimensional_mastery', 'energy_synthesis', 'journey_completion'],
      effects: ['unlock_completion_readiness', 'activate_final_gateway', 'achieve_transcendent_preparation'],
    },
    'pass_readiness_assessment': {
      description: 'Demonstrate worthiness for the ultimate completion through comprehensive evaluation',
      requirements: ['significant_zone_progress', 'wisdom_synthesis', 'challenge_mastery'],
      effects: ['confirm_completion_readiness', 'unlock_final_challenges', 'gain_nexus_approval'],
    },
    'synthesize_journey_experiences': {
      description: 'Integrate all knowledge and wisdom gained throughout the entire adventure',
      requirements: ['multiple_zone_experiences', 'dimensional_understanding', 'wisdom_collection'],
      effects: ['achieve_ultimate_wisdom', 'unlock_transcendent_abilities', 'prepare_for_completion'],
    },
    'activate_completion_gateway': {
      description: 'Prepare and activate the portal that leads to the ultimate completion',
      requirements: ['nexus_convergence', 'readiness_confirmation', 'final_preparation'],
      effects: ['open_completion_path', 'enable_final_transition', 'achieve_ultimate_readiness'],
    },
  },

  // Preparation characteristics
  preparationFeatures: {
    energy_level: 'maximum_convergence_achieved',
    assessment_mode: 'comprehensive_readiness_evaluation',
    grass_properties: 'eternal_verdance_beyond_time',
    stone_responsiveness: 'journey_progress_visualization',
    nexus_function: 'all_dimensional_energies_unified',
  },

  // Journey synthesis system
  journeySynthesis: {
    visualization: 'energy_streams_as_journey_map',
    integration: 'all_zone_experiences_unified',
    evaluation: 'comprehensive_readiness_assessment',
    preparation: 'ultimate_completion_readiness',
    transcendence: 'harmony_with_all_dimensions',
  },
};

export default villagegreen;
