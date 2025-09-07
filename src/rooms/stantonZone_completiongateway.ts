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

// Completion Gateway - The Final Threshold Before Ultimate Game Completion

import { Room } from '../types/Room';

const completiongateway: Room = {
  id: 'stantonZone_completiongateway',
  zone: 'stantonZone',
  title: 'Completion Gateway',
  description: [
    'You stand before the ultimate threshold - the Completion Gateway that represents the culmination of your entire journey through the dimensional realms. This is not merely another portal, but a living assessment of everything you\'ve learned, experienced, and mastered throughout your adventure.',
    'The gateway itself defies description - it appears as a shimmering archway that contains within it glimpses of every zone you\'ve visited, every challenge you\'ve overcome, and every piece of wisdom you\'ve gained. As you approach, it responds to your presence, displaying scenes from your journey like a living testament to your growth and achievement.',
    'This is the most devious challenge in the entire game - not because it requires complex puzzles or physical trials, but because it demands absolute honesty about your readiness to complete the journey. The gateway can sense whether you\'ve truly mastered the lessons of each zone or merely passed through them.',
    'Beyond the gateway lies the final completion of the game. But passage is only granted to those who have genuinely embraced the full depth of their dimensional adventure. The gateway is patient - it will wait until you are truly ready, for premature passage would diminish the meaning of everything you\'ve accomplished.',
  ],
  image: 'stantonZone_completiongateway.png',
  ambientAudio: 'ultimate_completion_gateway_with_journey_echoes.mp3',

  consoleIntro: [
    '>> COMPLETION GATEWAY - ULTIMATE THRESHOLD',
    '>> Status: FINAL PASSAGE TO GAME COMPLETION',
    '>> Assessment mode: COMPREHENSIVE JOURNEY EVALUATION',
    '>> Gateway type: LIVING TESTAMENT - Responds to achievement depth',
    '>> Challenge level: ULTIMATE HONESTY - Most devious in entire game',
    '>> Passage requirement: GENUINE MASTERY - Not mere zone completion',
    '>> Journey display: ALL ZONES AND ACHIEVEMENTS REFLECTED',
    '>> Readiness detection: ABSOLUTE TRUTH SENSING',
    '>> Patience level: INFINITE - Will wait for true readiness',
    '>> Beyond: GAME COMPLETION AND TRANSCENDENCE',
    '>> "Only those who truly understand their journey may pass"',
  ],

  exits: {
    village_green: 'villagegreen',
    stanton_harcourt: 'stantonharcourt',
    readiness_assessment_chamber: 'stantonZone_readinessassessment',
    journey_reflection_space: 'stantonZone_journeyreflection',
    ultimate_preparation_area: 'stantonZone_ultimatepreparation',
    // The final completion exit only appears when truly ready
    final_completion: 'GAME_COMPLETION_SEQUENCE',
    emergency_return: 'introZone_crossing',
  },

  items: [
    'journey_testament_crystal',
    'mastery_verification_scroll',
    'completion_readiness_indicator',
    'dimensional_wisdom_compendium',
    'ultimate_achievement_token',
    'transcendence_preparation_guide',
    'game_completion_key',
    'final_threshold_pass',
  ],

  interactables: {
    'living_gateway_archway': {
      description: 'The shimmering archway that displays your entire journey and assesses your true readiness.',
      actions: ['approach_gateway', 'view_journey_reflection', 'undergo_assessment', 'attempt_passage'],
      requires: ['significant_dimensional_experience'],
    },
    'journey_testament_display': {
      description: 'Visual representation of every zone visited, challenge faced, and wisdom gained.',
      actions: ['review_entire_journey', 'acknowledge_achievements', 'understand_growth', 'embrace_mastery'],
      requires: ['zone_completion_experience'],
    },
    'mastery_evaluation_field': {
      description: 'An energy field that can detect the depth of your understanding versus surface completion.',
      actions: ['enter_evaluation_field', 'demonstrate_true_mastery', 'prove_genuine_understanding', 'show_wisdom_depth'],
      requires: ['genuine_dimensional_mastery'],
    },
    'completion_readiness_scanner': {
      description: 'Ancient mechanism that determines if you\'re truly ready for final game completion.',
      actions: ['undergo_readiness_scan', 'demonstrate_preparedness', 'prove_completion_worthiness', 'earn_passage_rights'],
      requires: ['comprehensive_journey_mastery'],
    },
    'transcendence_preparation_altar': {
      description: 'Sacred space for final preparation and reflection before ultimate completion.',
      actions: ['prepare_for_transcendence', 'reflect_on_journey', 'embrace_completion', 'achieve_ultimate_readiness'],
      requires: ['gateway_assessment_passed'],
    },
  },

  npcs: [
    'gateway_keeper',
    'completion_assessor',
    'journey_testament_guardian',
    'mastery_evaluation_sage',
    'transcendence_guide',
  ],

  events: {
    onEnter: ['activateGatewayAssessment', 'displayJourneyTestament', 'beginReadinessEvaluation'],
    onExit: ['recordCompletionProgress', 'maintainGatewayConnection'],
    onInteract: {
      living_gateway_archway: ['assessJourneyMastery', 'evaluateCompletionReadiness', 'determinePassageEligibility'],
      journey_testament_display: ['reviewEntireAdventure', 'acknowledgeAllAchievements'],
      mastery_evaluation_field: ['detectGenuineUnderstanding', 'verifyWisdomDepth'],
      completion_readiness_scanner: ['comprehensiveReadinessCheck', 'ultimateWorthinessEvaluation'],
      transcendence_preparation_altar: ['prepareForFinalCompletion', 'achieveTranscendenceReadiness'],
    },
  },

  flags: {
    gatewayAssessmentActive: false,
    journeyTestamentDisplayed: false,
    readinessEvaluationStarted: false,
    masteryEvaluationCompleted: false,
    genuineUnderstandingConfirmed: false,
    completionReadinessVerified: false,
    transcendencePreparationCompleted: false,
    passageEligibilityAchieved: false,
    finalCompletionUnlocked: false,
  },

  quests: {
    main: 'Achieve True Readiness for Game Completion',
    optional: [
      'Review and Acknowledge Entire Journey',
      'Demonstrate Genuine Zone Mastery',
      'Pass Comprehensive Readiness Assessment',
      'Prepare for Final Transcendence',
      'Unlock Ultimate Completion Passage',
    ],
  },

  // Completion assessment system
  completionAssessment: {
    evaluation_criteria: [
      'depth_of_zone_understanding',
      'genuine_wisdom_integration',
      'challenge_mastery_demonstration',
      'character_growth_evidence',
      'readiness_for_transcendence',
    ],
    assessment_method: 'living_gateway_evaluation',
    passage_requirement: 'demonstrated_true_mastery',
    failure_consequence: 'patient_waiting_and_guidance',
    success_result: 'unlock_final_game_completion',
  },

  customActions: {
    'undergo_ultimate_assessment': {
      description: 'Submit to the gateway\'s comprehensive evaluation of your entire journey',
      requirements: ['significant_zone_experience', 'dimensional_mastery', 'wisdom_integration'],
      effects: ['reveal_mastery_depth', 'assess_completion_readiness', 'determine_passage_eligibility'],
    },
    'demonstrate_genuine_mastery': {
      description: 'Prove that your journey achievements represent true understanding, not mere completion',
      requirements: ['zone_wisdom_integration', 'character_growth', 'challenge_transcendence'],
      effects: ['confirm_genuine_understanding', 'unlock_advanced_assessment', 'progress_toward_passage'],
    },
    'achieve_transcendence_readiness': {
      description: 'Reach the state of ultimate preparedness for final game completion',
      requirements: ['gateway_assessment_passed', 'mastery_verification', 'wisdom_synthesis'],
      effects: ['unlock_transcendence_preparation', 'enable_final_completion', 'achieve_ultimate_worthiness'],
    },
    'unlock_final_completion_passage': {
      description: 'Gain access to the ultimate completion of the entire game',
      requirements: ['ultimate_readiness_achieved', 'gateway_approval', 'transcendence_preparation'],
      effects: ['open_completion_passage', 'enable_game_completion', 'achieve_ultimate_victory'],
    },
  },

  // Gateway characteristics
  gatewayFeatures: {
    assessment_type: 'comprehensive_journey_evaluation',
    honesty_requirement: 'absolute_truth_about_readiness',
    wisdom_detection: 'depth_versus_surface_understanding',
    patience_level: 'infinite_waiting_for_true_readiness',
    completion_access: 'only_for_genuinely_prepared',
  },

  // Journey testament system
  journeyTestament: {
    display_method: 'living_visual_representation',
    content_scope: 'entire_dimensional_adventure',
    assessment_focus: 'growth_and_wisdom_gained',
    reflection_purpose: 'honest_self_evaluation',
    mastery_verification: 'genuine_understanding_proof',
  },

  // Ultimate completion requirements
  ultimateCompletionRequirements: {
    zone_mastery: 'demonstrated_genuine_understanding',
    wisdom_integration: 'synthesized_all_lessons_learned',
    character_growth: 'evident_personal_transformation',
    challenge_transcendence: 'overcome_limitations_and_fears',
    readiness_confirmation: 'gateway_assessment_approval',
  },

  // Final challenge mechanics (most devious)
  finalChallengeCharacteristics: {
    deviousness_source: 'requires_absolute_honesty_and_self_awareness',
    challenge_type: 'confronting_truth_about_your_own_readiness',
    difficulty_factor: 'cannot_fake_or_shortcut_genuine_mastery',
    wisdom_requirement: 'integration_of_all_dimensional_experiences',
    completion_gate: 'only_opens_for_truly_prepared_souls',
  },
};

export default completiongateway;
