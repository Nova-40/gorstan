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

// Off-Multiverse Hub - Reality Coordination Center

import { Room } from '../types/Room';

const hub: Room = {
  id: 'hub',
  zone: 'offmultiverseZone',
  title: 'Reality Coordination Hub',
  description: [
    'You stand within the ultimate control center of all existence - the Reality Coordination Hub that manages the flow of reality across infinite dimensions. This space transcends physical description, existing as a conceptual nexus where pure thought and mathematical certainty converge to orchestrate the symphony of all possible worlds.',
    'Holographic displays of impossible complexity show the real-time status of every universe, every timeline, every possible variation of existence. The displays shift and flow like living thought, responding to the consciousness of whoever observes them. Each point of light represents entire civilizations, entire realities, entire possibilities.',
    'At the center of this cosmic command center sits the Master Reality Console - a crystalline interface that exists simultaneously in all dimensions. Through it, the fundamental parameters of existence itself can be observed, analyzed, and when absolutely necessary, adjusted to maintain the delicate balance of infinite possibility.',
    'Beings of pure consciousness move through the space like living equations, each one responsible for maintaining different aspects of reality\'s foundation. They communicate through direct transfer of understanding, bypassing the limitations of language entirely.',
    'The Hub serves as the crossing point accessible via the Manhattan crossing hub exception - a special express route that bypasses normal dimensional restrictions for those who have demonstrated the wisdom and responsibility necessary to handle the ultimate powers of reality management.',
  ],
  image: 'offmultiverseZone_hub.png',
  ambientAudio: 'reality_coordination_hub.mp3',

  consoleIntro: [
    '>> REALITY COORDINATION HUB - ULTIMATE EXISTENCE MANAGEMENT CENTER',
    '>> Jurisdiction: ALL POSSIBLE REALITIES - Infinite dimensional oversight',
    '>> Management level: FUNDAMENTAL EXISTENCE - Mathematical reality parameters',
    '>> Console access: MASTER LEVEL - Ultimate reality manipulation interface',
    '>> Consciousness entities: ACTIVE - Pure thought beings maintaining systems',
    '>> Reality displays: INFINITE COMPLEXITY - All universe status monitoring',
    '>> CROSSING HUB ACCESS: Manhattan exception route active',
    '>> Authorization level: TRANSCENDENT - Beyond normal clearance requirements',
    '>> Responsibility weight: ABSOLUTE - Infinite consequence awareness required',
    '>> "Where All Possibilities Converge and Are Coordinated"',
  ],

  exits: {
    // CROSSING HUB EXCEPTION - Direct from Manhattan Hub
    crossing_hub_entrance: 'newyorkZone_manhattanhub',
    
    // Back to void chamber
    void_chamber: 'offmultiverseZone_voidchamber',
    
    // Hub control areas
    reality_monitoring_center: 'offmultiverseZone_realitymonitoring',
    existence_coordination_chamber: 'offmultiverseZone_existencecoordination',
    timeline_management_facility: 'offmultiverseZone_timelinemanagement',
    possibility_calculation_core: 'offmultiverseZone_possibilitycore',
    
    // Advanced reality manipulation
    master_reality_console: 'offmultiverseZone_masterconsole',
    consciousness_interface: 'offmultiverseZone_consciousnessinterface',
    
    // Emergency reality stabilization
    reality_stabilization_emergency: 'offmultiverseZone_realitystabilization',
    existence_backup_systems: 'offmultiverseZone_existencebackup',
    
    // Return routes to all zones
    zone_oversight_portal: 'offmultiverseZone_zoneoversight',
    dimensional_return_matrix: 'introZone_crossing',
    
    // Hidden jump portal to crossing
    hidden_reality_transcendence_portal: 'introZone_crossing',
  },

  items: [
    'master_reality_access_key',
    'consciousness_interface_crystal',
    'infinite_complexity_analyzer',
    'reality_parameter_modifier',
    'existence_coordination_manual',
    'transcendent_authorization_badge',
    'crossing_hub_access_token',
    'ultimate_responsibility_reminder',
  ],

  interactables: {
    'master_reality_console': {
      description: 'Crystalline interface existing in all dimensions, capable of adjusting fundamental existence parameters.',
      actions: ['observe_reality_parameters', 'monitor_existence_balance', 'access_ultimate_controls', 'understand_reality_management'],
      requires: ['transcendent_authorization', 'ultimate_responsibility_awareness'],
    },
    'infinite_complexity_displays': {
      description: 'Holographic systems showing real-time status of every universe and every possibility.',
      actions: ['monitor_all_realities', 'track_existence_flows', 'identify_anomalies', 'observe_infinite_possibilities'],
      requires: ['consciousness_expansion'],
    },
    'consciousness_entities': {
      description: 'Beings of pure thought responsible for maintaining different aspects of reality\'s foundation.',
      actions: ['communicate_through_understanding', 'learn_existence_maintenance', 'receive_cosmic_training', 'join_reality_coordination'],
      requires: ['pure_consciousness_attainment'],
    },
    'crossing_hub_interface': {
      description: 'Special interface managing the Manhattan crossing hub exception route.',
      actions: ['monitor_crossing_hub', 'manage_exception_access', 'verify_authorization', 'maintain_express_route'],
      requires: ['crossing_hub_clearance'],
    },
    'reality_balance_monitors': {
      description: 'Systems that maintain the delicate equilibrium of infinite possibility.',
      actions: ['monitor_balance', 'detect_imbalances', 'coordinate_corrections', 'maintain_stability'],
      requires: ['balance_management_training'],
    },
    'existence_coordination_algorithms': {
      description: 'Mathematical systems that orchestrate the flow of reality across all dimensions.',
      actions: ['study_algorithms', 'understand_coordination', 'optimize_flows', 'maintain_existence_harmony'],
      requires: ['mathematical_transcendence'],
    },
    'hidden_reality_transcendence_portal': {
      description: 'A transcendent portal that manifested from pure consciousness itself, radiating absolute truth and ultimate understanding. This gateway exists beyond normal reality parameters, showing not just the Crossing but the fundamental principles that govern all existence.',
      actions: ['examine', 'enter', 'step_through'],
      requires: ['has_jumped_in_hub'],
    },
  },

  npcs: [
    'reality_coordination_overseer',
    'master_consciousness_entity',
    'existence_balance_specialist',
    'crossing_hub_administrator',
    'infinite_possibility_coordinator',
    'transcendent_responsibility_guide',
  ],

  events: {
    onEnter: ['showUltimateResponsibility', 'accessRealityCoordination', 'feelInfiniteWeight'],
    onExit: ['hubFarewell', 'retainCosmicResponsibility', 'clearTemporaryPortal'],
    onInteract: {
      master_reality_console: ['gainUltimateUnderstanding', 'accessRealityManagementSystems'],
      infinite_complexity_displays: ['comprehendInfiniteScope', 'gainUniversalOversight'],
      consciousness_entities: ['achievePureConsciousness', 'joinRealityMaintenance'],
      crossing_hub_interface: ['masterCrossingHubSystem', 'gainExpressRouteControl'],
      hidden_reality_transcendence_portal: ['enterCrossingPortal', 'stabilizeReality'],
    },
  },

  flags: {
    realityCoordinationHubDiscovered: true,
    crossingHubAccessVerified: false,
    masterConsoleAccessed: false,
    consciousnessEntitiesMet: false,
    realityDisplaysComprehended: false,
    existenceCoordinationUnderstood: false,
    transcendentAuthorizationGranted: false,
    ultimateResponsibilityAccepted: false,
    has_jumped_in_hub: false,
  },

  quests: {
    main: 'Master Reality Coordination and Ultimate Responsibility',
    optional: [
      'Gain Access to Master Reality Console',
      'Communicate with Pure Consciousness Entities',
      'Understand Infinite Complexity Displays',
      'Master Crossing Hub Exception Management',
      'Learn Existence Balance Maintenance',
      'Accept Ultimate Cosmic Responsibility',
    ],
  },

  environmental: {
    lighting: 'pure_consciousness_illumination_beyond_physics',
    temperature: 'transcendent_comfort_perfect_for_any_consciousness',
    airQuality: 'pure_existence_medium_supporting_all_life_forms',
    soundscape: ['reality_harmonics', 'existence_coordination', 'consciousness_communication', 'infinite_possibility_flow'],
    hazards: ['ultimate_responsibility_weight', 'infinite_complexity_overload', 'transcendent_consciousness_requirement'],
  },

  security: {
    level: 'ultimate_cosmic_security',
    accessRequirements: ['transcendent_authorization', 'ultimate_responsibility_acceptance', 'crossing_hub_clearance'],
    alarmTriggers: ['reality_parameter_violation', 'existence_balance_disruption', 'unauthorized_console_access'],
    surveillanceActive: true,
    surveillanceType: 'consciousness_entity_monitoring_and_reality_oversight_systems',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'ultimate_transcendent',
    estimatedPlayTime: '60+ minutes',
    keyFeatures: [
      'Ultimate reality coordination center',
      'Master reality console access',
      'Crossing hub exception management',
      'Pure consciousness entity interaction',
      'Infinite possibility oversight',
    ],
  },

  secrets: {
    realityMastery: {
      description: 'Complete mastery over reality coordination and existence management',
      requirements: ['transcendent_authorization', 'master_console_access', 'consciousness_entity_partnership'],
      rewards: ['reality_mastery', 'existence_coordination_abilities'],
    },
    crossingHubMastery: {
      description: 'Complete understanding and control of the crossing hub exception system',
      requirements: ['crossing_hub_clearance', 'exception_route_management', 'manhattan_connection_mastery'],
      rewards: ['crossing_hub_mastery', 'express_route_creation_abilities'],
    },
    ultimateResponsibility: {
      description: 'Full acceptance and capability to handle the ultimate responsibility of reality management',
      requirements: ['infinite_wisdom', 'perfect_balance', 'transcendent_consciousness'],
      rewards: ['ultimate_responsibility_mastery', 'cosmic_oversight_abilities'],
    },
  },

  customActions: {
    'reality_coordination_training': {
      description: 'Receive training in the ultimate art of reality coordination',
      requirements: ['transcendent_authorization', 'consciousness_entity_guidance', 'infinite_responsibility_acceptance'],
      effects: ['reality_coordination_skills', 'existence_management_abilities'],
    },
    'consciousness_entity_partnership': {
      description: 'Establish partnership with pure consciousness entities for reality maintenance',
      requirements: ['pure_consciousness_attainment', 'reality_understanding', 'cosmic_responsibility'],
      effects: ['consciousness_entity_alliance', 'reality_maintenance_partnership'],
    },
    'master_console_authorization': {
      description: 'Gain authorized access to the Master Reality Console',
      requirements: ['transcendent_authorization', 'ultimate_responsibility_acceptance', 'reality_mastery_demonstration'],
      effects: ['master_console_access', 'reality_parameter_control'],
    },
    'jump': {
      description: 'Jump to disturb the dimensional fabric and reveal hidden portals',
      effect: 'You leap upward in the ultimate reality coordination center. Your movement through this transcendent space causes ripples in the very fabric of existence itself. The consciousness entities pause their eternal work to observe as a portal of pure understanding manifests - a gateway that exists beyond normal reality, offering direct access to the foundational Crossing.',
      flags: { has_jumped_in_hub: true },
      cooldown: 30000, // Portal visible for 30 seconds
      energyCost: 0,
    },
  },

  // Crossing hub exception implementation
  crossingHubException: {
    directRoute: 'newyorkZone_manhattanhub',
    bypassedRestrictions: 'all_normal_dimensional_limitations',
    accessRequirements: 'crossing_hub_clearance_and_transcendent_authorization',
    purpose: 'express_route_for_reality_coordination_responsibilities',
  },

  // Reality coordination characteristics
  coordinationProperties: {
    scope: 'all_possible_realities_across_infinite_dimensions',
    management: 'fundamental_existence_parameter_coordination',
    responsibility: 'ultimate_cosmic_oversight_and_balance_maintenance',
    access: 'transcendent_consciousness_and_crossing_hub_exception',
  },

  // Master systems
  masterSystems: {
    realityConsole: 'crystalline_interface_existing_in_all_dimensions',
    consciousnessEntities: 'pure_thought_beings_maintaining_existence',
    complexityDisplays: 'infinite_scope_reality_monitoring_systems',
    coordinationAlgorithms: 'mathematical_existence_flow_orchestration',
  },
};

export default hub;
