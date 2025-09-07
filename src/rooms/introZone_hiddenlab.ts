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

// Hidden Laboratory - Experimental research facility beneath the control complex

import { Room } from '../types/Room';

const hiddenlab: Room = {
  id: 'hiddenlab',
  zone: 'introZone',
  title: 'Hidden Laboratory',
  description: [
    'You descend into a concealed research facility that exists beneath the main control complex. The laboratory is a marvel of scientific engineering, with pristine white walls lined with advanced experimental equipment.',
    'Quantum field generators hum quietly in protective casings, while dimensional analysis arrays display constantly shifting readouts. Multiple workstations are arranged around a central experimental chamber.',
    'The air tingles with residual energy from dimensional experiments. Holographic displays show complex mathematical models and interdimensional mapping data.',
    'This is clearly where the most sensitive research was conducted - understanding the nature of the multiverse itself.',
  ],
  image: 'introZone_hiddenlab.png',
  ambientAudio: 'laboratory_hum.mp3',

  consoleIntro: [
    '>> HIDDEN LABORATORY - DIMENSIONAL RESEARCH FACILITY',
    '>> Access Level: TOP SECRET - Experimental Division',
    '>> Facility Status: EMERGENCY STANDBY MODE',
    '>> Quantum field generators: STABLE',
    '>> Dimensional analysis arrays: ACTIVE MONITORING',
    '>> WARNING: Unauthorized access to experimental equipment forbidden',
    '>> Research data archives: ENCRYPTED - Clearance required',
    '>> Safety protocols: MAXIMUM - Containment procedures active',
    '>> Emergency evacuation route: CONTROL NEXUS (chair transport)',
    '>> Welcome to the frontier of dimensional science',
  ],

  exits: {
    up: 'controlroom',
    sit: 'controlnexus', // Chair transport back to nexus
    north: 'crossing',
  },

  items: [
    'quantum_resonator',
    'dimensional_probe',
    'research_notes',
    'experimental_data_crystal',
    'prototype_stabilizer',
  ],

  interactables: {
    'quantum_generators': {
      description: 'Massive cylindrical devices that generate and contain quantum fields for dimensional experiments.',
      actions: ['examine', 'activate', 'calibrate'],
      requires: ['research_clearance'],
    },
    'analysis_arrays': {
      description: 'Banks of sophisticated sensors and computers that monitor dimensional fluctuations in real-time.',
      actions: ['examine', 'read_data', 'run_analysis'],
      requires: [],
    },
    'experimental_chamber': {
      description: 'A sealed chamber in the center of the lab where dimensional experiments are conducted.',
      actions: ['examine', 'enter', 'activate'],
      requires: ['safety_override'],
    },
    'research_terminals': {
      description: 'Advanced computer workstations with access to experimental data and theoretical models.',
      actions: ['examine', 'access_data', 'review_experiments'],
      requires: ['research_access_card'],
    },
    'holographic_displays': {
      description: 'Three-dimensional projections showing complex mathematical models of multiverse structures.',
      actions: ['examine', 'interact', 'analyze_models'],
      requires: [],
    },
    'transport_chair': {
      description: 'A sophisticated chair similar to the one in the Control Nexus, designed for quick evacuation.',
      actions: ['sit', 'examine', 'activate'],
      requires: [],
    },
  },

  npcs: [],

  events: {
    onEnter: ['showLabIntro', 'checkSecurityClearance', 'activateMonitoring'],
    onExit: ['saveResearchProgress', 'lockdownSystems'],
    onInteract: {
      quantum_generators: ['showEnergyReadings', 'warnAboutDanger'],
      analysis_arrays: ['displayDimensionalData', 'showAnomalies'],
      experimental_chamber: ['checkSafetyProtocols', 'showExperimentHistory'],
      research_terminals: ['accessResearchLogs', 'showTheoretical_models'],
      transport_chair: ['initiateTransport', 'showDestinationOptions'],
    },
  },

  flags: {
    labDiscovered: true,
    securityActive: true,
    experimentsOngoing: false,
    quantumFieldsStable: true,
    emergencyMode: true,
    dataEncrypted: true,
  },

  quests: {
    main: 'Investigate Dimensional Research',
    optional: [
      'Access Encrypted Research Data',
      'Understand the Experiments',
      'Stabilize Quantum Fields',
      'Locate Missing Researchers',
    ],
  },

  environmental: {
    lighting: 'bright_sterile_white',
    temperature: 'precisely_controlled_cool',
    airQuality: 'purified_with_ionization',
    soundscape: ['quantum_field_humming', 'computer_processing', 'ventilation_systems', 'energy_fluctuations'],
    hazards: ['quantum_field_exposure', 'dimensional_instability'],
  },

  security: {
    level: 'maximum',
    accessRequirements: ['hidden_access', 'research_clearance'],
    alarmTriggers: ['unauthorized_equipment_access', 'safety_protocol_violations'],
    surveillanceActive: true,
    surveillanceType: 'quantum_monitoring',
  },

  metadata: {
    created: '2025-09-06',
    lastModified: '2025-09-06',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '10-15 minutes',
    keyFeatures: [
      'Hidden research facility',
      'Quantum field technology',
      'Dimensional analysis equipment',
      'Research data archives',
      'Emergency transport system',
    ],
  },

  secrets: {
    researcherLogs: {
      description: 'Personal logs from the research team during the crisis',
      requirements: ['access research_terminals', 'decrypt data_crystal'],
      rewards: ['crisis_backstory', 'experimental_procedures'],
    },
    prototypeTechnology: {
      description: 'Advanced experimental devices not yet in production',
      requirements: ['activate quantum_generators', 'calibrate analysis_arrays'],
      rewards: ['prototype_equipment', 'advanced_capabilities'],
    },
    evacuationProcedures: {
      description: 'Emergency protocols for laboratory evacuation',
      requirements: ['examine transport_chair', 'access research_terminals'],
      rewards: ['evacuation_routes', 'emergency_contacts'],
    },
  },

  customActions: {
    'run_dimensional_scan': {
      description: 'Perform a comprehensive scan of local dimensional stability',
      requirements: ['activate analysis_arrays', 'calibrate quantum_generators'],
      effects: ['reveal_dimensional_anomalies', 'update_stability_readings'],
    },
    'access_research_archive': {
      description: 'Attempt to access the encrypted research data archives',
      requirements: ['research_access_card', 'decryption_key'],
      effects: ['unlock_research_data', 'reveal_experiment_history'],
    },
    'emergency_evacuation': {
      description: 'Activate emergency evacuation protocols',
      requirements: ['emergency_authorization'],
      effects: ['lockdown_laboratory', 'transport_to_surface'],
    },
  },
};

export default hiddenlab;
