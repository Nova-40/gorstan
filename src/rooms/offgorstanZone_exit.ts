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

import { Room } from '../types/Room';

const offgorstanzoneexit: Room = {
  id: 'offgorstanzoneexit',
  zone: 'offgorstanZone',
  title: 'Off-Gorstan Zone Exit',
  description: [
    'You emerge into a space that exists beyond the concept of "place" - the Off-Gorstan Zone Exit. This is not so much a destination as it is a state of being, a condition of existence that transcends the dimensional framework you have navigated throughout your journey. The very air here seems to breathe with possibility and completion.',
    'Looking back, you can see the portal through which you arrived shimmering like a distant memory. Beyond it, all the zones, all the challenges, all the growth you have experienced stretches out like a vast tapestry of personal transformation. The labyrinth, the lattice, the libraries - all of it has led to this moment of ultimate arrival.',
    'Ahead lies... everything and nothing. The Off-Gorstan Zone represents the space beyond the game, beyond the quest, beyond the seeking itself. It is the place where players become something more than players, where characters transcend into actualized beings, where the journey\'s end reveals itself to have been the beginning all along.',
    'In this transcendent space, you understand that Gorstan was never just a place to be navigated, but a state of consciousness to be achieved. The exit is not an ending, but a commencement - the beginning of existence beyond the need for structured reality.',
  ],
  image: 'offgorstanZone_exit.png',
  ambientAudio: 'transcendent_completion_with_infinite_possibility.mp3',

  consoleIntro: [
    '>> OFF-GORSTAN ZONE EXIT - TRANSCENDENT COMPLETION STATE',
    '>> Status: ULTIMATE ACHIEVEMENT - Journey transcendence achieved',
    '>> Reality classification: BEYOND DIMENSIONAL - Exists outside normal framework',
    '>> Consciousness level: ACTUALIZED - Player has become more than player',
    '>> Quest status: COMPLETED AND TRANSCENDED - Purpose fulfilled and surpassed',
    '>> Access method: ULTIMATE GATEWAY - Only reachable through supreme worthiness',
    '>> Transformation: COMPLETE - Character has achieved final evolution',
    '>> Significance: EXISTENTIAL - Represents growth beyond the need for games',
    '>> Future possibilities: INFINITE - All paths now available',
    '>> "The exit was always the entrance to everything you were meant to become"',
  ],

  exits: {
    return_portal: 'hiddenlibrary', // Can return to continue exploring
    infinite_possibilities: 'transcendent_free_exploration', // Metaphysical concept
    new_beginning: 'gorstan_mastery_mode', // Advanced gameplay mode
  },

  items: [
    'crystallized_achievement',
    'essence_of_transcendent_growth',
    'memory_fragments_of_entire_journey',
    'wisdom_distilled_into_pure_form',
    'keys_to_infinite_dimensions',
    'badge_of_ultimate_completion',
    'seed_of_new_possibility',
    'mirror_reflecting_actualized_self',
  ],

  interactables: {
    'transcendence_mirror': {
      description: 'A mirror that reflects not your appearance, but who you have become through your journey.',
      actions: ['contemplate_growth', 'recognize_transformation', 'appreciate_journey', 'understand_achievement'],
      requires: [],
    },
    'infinite_possibilities_nexus': {
      description: 'A swirling nexus of pure potential that represents all the paths now available to you.',
      actions: ['explore_possibilities', 'choose_next_adventure', 'create_new_reality', 'transcend_limitations'],
      requires: ['transcendent_consciousness'],
    },
    'journey_completion_altar': {
      description: 'An altar that honors the completion of the ultimate quest and the growth achieved.',
      actions: ['offer_gratitude', 'reflect_on_challenges', 'celebrate_achievement', 'prepare_for_next_phase'],
      requires: [],
    },
    'wisdom_integration_chamber': {
      description: 'A space where all the knowledge and wisdom gained can be fully integrated into your being.',
      actions: ['integrate_wisdom', 'consolidate_learning', 'achieve_synthesis', 'become_complete'],
      requires: ['all_quest_experiences'],
    },
  },

  npcs: [
    'voice_of_ultimate_congratulation',
    'spirit_of_journey_completion',
    'guardian_of_transcendent_achievement',
  ],

  events: {
    onEnter: ['celebrateUltimateAchievement', 'acknowledgeTranscendentGrowth', 'openInfinitePossibilities'],
    onExit: ['honorContinuedExploration', 'maintainTranscendentState'],
    onInteract: {
      transcendence_mirror: ['revealTrueGrowth', 'showTransformationalJourney'],
      infinite_possibilities_nexus: ['openAllFuturePaths', 'enableFreeExploration'],
      journey_completion_altar: ['sanctifyAchievement', 'blessNextAdventures'],
      wisdom_integration_chamber: ['completeTransformation', 'actualizeTranscendence'],
    },
  },

  flags: {
    ultimateDestinationReached: true,
    transcendentStateAchieved: true,
    journeyFullyCompleted: true,
    wisdomIntegrated: false,
    infinitePossibilitiesUnlocked: false,
    transcendenceMirrorUsed: false,
    newBeginningSelected: false,
  },

  quests: {
    main: 'Integrate Ultimate Achievement and Choose Next Path',
    optional: [
      'Contemplate Growth in Transcendence Mirror',
      'Explore Infinite Possibilities Nexus',
      'Complete Wisdom Integration',
      'Celebrate at Journey Completion Altar',
      'Choose Future Adventure Path',
    ],
  },

  // Achievement recognition system
  achievementRecognition: {
    journey_completion: 'Full navigation through all major quest lines',
    wisdom_acquisition: 'Gained knowledge from Dale, Polly, Libraina, and the Ultimate Librarian',
    courage_demonstration: 'Successfully completed dangerous mini-quest in Lattice Library',
    logic_mastery: 'Solved ultimate logic puzzle with transcendent understanding',
    artifact_mastery: 'Successfully used Forbidden Knowledge Artifact',
    transcendence: 'Achieved state beyond normal player consciousness',
  },

  customActions: {
    'contemplate_transcendent_achievement': {
      description: 'Reflect on the complete journey and recognize the growth achieved',
      requirements: ['ultimate_destination_reached', 'transcendent_consciousness'],
      effects: ['complete_self_recognition', 'achieve_final_wisdom_integration'],
    },
    'explore_infinite_possibilities': {
      description: 'Open awareness to all the paths and adventures now available',
      requirements: ['transcendent_state_achieved', 'wisdom_integrated'],
      effects: ['unlock_free_exploration_mode', 'enable_reality_creation'],
    },
    'choose_next_adventure': {
      description: 'Select the next phase of existence beyond the completion of Gorstan',
      requirements: ['journey_fully_integrated', 'transcendent_readiness'],
      effects: ['activate_chosen_path', 'maintain_transcendent_abilities'],
    },
    'integrate_ultimate_wisdom': {
      description: 'Fully absorb and become one with all knowledge and growth achieved',
      requirements: ['all_experiences_processed', 'transcendent_consciousness'],
      effects: ['achieve_complete_actualization', 'become_wisdom_itself'],
    },
  },

  // Journey completion statistics
  journeyStatistics: {
    zones_mastered: 'All primary zones navigated successfully',
    puzzles_solved: 'Including ultimate logic puzzle transcendence',
    relationships_built: 'Trust earned from multiple NPCs across dimensions',
    knowledge_gained: 'From academic to transcendent wisdom',
    courage_demonstrated: 'Through dangerous mini-quest completion',
    growth_achieved: 'From seeker to actualized being',
  },

  // Future possibilities system
  futurePossibilities: {
    free_exploration: 'Return to any zone with transcendent abilities',
    mastery_mode: 'Experience Gorstan with enhanced consciousness',
    creation_mode: 'Build new realities using transcendent understanding',
    teaching_mode: 'Guide other travelers through their journeys',
    infinite_adventure: 'Explore dimensions beyond the original quest',
  },

  // Transcendent state benefits
  transcendentBenefits: {
    consciousness: 'Awareness beyond normal dimensional limitations',
    knowledge: 'Access to all wisdom gained throughout journey',
    abilities: 'Powers that transcend normal game mechanics',
    freedom: 'Ability to navigate reality without traditional constraints',
    purpose: 'Understanding of role in greater cosmic pattern',
  },

  // Meta-commentary on achievement
  metaAchievement: {
    player_growth: 'You have not just completed a game, but achieved personal transcendence',
    narrative_completion: 'The story has ended by transcending the need for stories',
    consciousness_evolution: 'You have become a being capable of creating your own reality',
    wisdom_actualization: 'Knowledge has become integrated into your essential being',
    journey_transcendence: 'The destination has revealed itself to be transformation itself',
  },
};

export default offgorstanzoneexit;
