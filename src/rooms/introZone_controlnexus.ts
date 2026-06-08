/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Renders room descriptions and image logic.

import type { Room } from '../types/Room';

const controlnexus: Room = {
  id: 'controlnexus',
  zone: 'introZone',
  title: 'The Control Nexus',
  description: [
  "You stand in a circular chamber that pulses with dormant energy. The curved walls are lined with darkened screens, their surfaces occasionally flickering with cryptic data streams and static bursts. Thick cables snake across the polished floor like technological vines, converging at a central console. A single command chair faces this nexus of control, its ergonomic form suggesting long periods of monitoring. The air carries a faint ozone scent, and you can hear the subtle hum of sleeping systems waiting to be awakened. This place feels like the nerve center of something vast and important.",
],
  image: 'introZone_controlnexus.gif',
  ambientAudio: 'lowhum.mp3',

  consoleIntro: [
    '>> NEXUS CONTROL SYSTEM - EMERGENCY PROTOCOLS ACTIVE',
    '>> Biometric scan complete... User identity: UNREGISTERED',
    '>> Previous operator status: MISSING - 47 days, 12 hours',
    '>> System status: AUTONOMOUS MODE - Limited functionality',
    '>> WARNING: Multiverse stability index at 23% and declining',
    '>> Dimensional anchor points showing signs of drift',
    '>> PRIORITY ALERT: Immediate operator intervention required',
    '>> Scanning for available command protocols...',
    '>> Basic access granted. Welcome to the Control Nexus.',
    '>> Type HELP for available commands, or STATUS for current readings.',
  ],

  exits: {
    west: 'controlroom',
    sit: 'hiddenlab',
  },

  clickHotspots: [
    {
      id: 'nexus-command-console',
      label: 'Main Control Console',
      commandTarget: 'console',
      kind: 'machine',
      shape: 'rect',
      coords: [38, 46, 25, 22],
      hoverText: 'Use the main control console',
      commands: [
        { label: 'Use', command: 'use console', priority: 1 },
        { label: 'Scan', command: 'scan console', priority: 2 },
        { label: 'Examine', command: 'inspect console', priority: 3 },
      ],
    },
    {
      id: 'nexus-command-chair',
      label: 'Command Chair',
      commandTarget: 'chair',
      kind: 'fixedObject',
      shape: 'rect',
      coords: [45, 64, 15, 22],
      hoverText: 'Sit in the command chair',
      commands: [
        { label: 'Sit', command: 'sit', priority: 1 },
        { label: 'Examine', command: 'inspect chair', priority: 2 },
      ],
    },
    {
      id: 'nexus-wall-screens',
      label: 'Dimensional Screens',
      commandTarget: 'screens',
      kind: 'machine',
      shape: 'polygon',
      coords: [11, 16, 35, 11, 66, 11, 91, 17, 84, 38, 15, 38],
      hoverText: 'Read the dimensional screens',
      commands: [
        { label: 'Read', command: 'read screens', priority: 1 },
        { label: 'Analyze', command: 'analyze screens', priority: 2 },
        { label: 'Examine', command: 'inspect screens', priority: 3 },
      ],
    },
    {
      id: 'nexus-cable-run',
      label: 'Fiber-Optic Cable Run',
      commandTarget: 'cables',
      kind: 'scenery',
      shape: 'polygon',
      coords: [6, 78, 31, 68, 49, 73, 81, 88, 76, 96, 40, 83, 16, 92],
      hoverText: 'Trace the pulsing cable run',
      commands: [
        { label: 'Trace', command: 'trace cables', priority: 1 },
        { label: 'Examine', command: 'inspect cables', priority: 2 },
      ],
    },
    {
      id: 'nexus-exit-controlroom',
      label: 'West Access Door',
      commandTarget: 'west',
      kind: 'exit',
      shape: 'rect',
      coords: [3, 33, 14, 36],
      hoverText: 'Go west to the control room',
    },
  ],

  effects: [
    {
      id: 'nexus-console-glow',
      type: 'css',
      preset: 'object-glow-soft',
      label: 'Console Glow',
      x: 0.5,
      y: 0.55,
      width: 220,
      height: 120,
      opacity: 0.65,
      zIndex: 4,
      reducedMotionFallback: 'steady',
    },
    {
      id: 'nexus-screen-flicker-left',
      type: 'css',
      preset: 'screen-flicker',
      label: 'Screen Flicker',
      x: 0.25,
      y: 0.23,
      width: 180,
      height: 92,
      opacity: 0.55,
      zIndex: 3,
      reducedMotionFallback: 'steady',
    },
    {
      id: 'nexus-screen-flicker-right',
      type: 'css',
      preset: 'neon-flicker',
      label: 'Dimensional Telemetry',
      x: 0.73,
      y: 0.24,
      width: 180,
      height: 92,
      opacity: 0.5,
      zIndex: 3,
      reducedMotionFallback: 'steady',
    },
    {
      id: 'nexus-cable-route',
      type: 'svg',
      preset: 'route-line',
      label: 'Cable Data Flow',
      x: 0.5,
      y: 0.83,
      width: 520,
      height: 120,
      opacity: 0.55,
      zIndex: 5,
      reducedMotionFallback: 'static',
    },
  ],

  items: [
    
  ],

  interactables: {
    console: {
      description: [
  "The main control console glows with a soft blue light, its interface displaying streams of dimensional data.",
],
      actions: ['activate', 'examine', 'use'],
      requires: [],
    },
    chair: {
      description: [
  "A sophisticated command chair with neural interface ports and biometric sensors.",
],
      actions: ['sit', 'examine'],
      requires: [],
    },
    screens: {
      description: [
  "Wall-mounted displays showing various dimensional readings and system diagnostics.",
],
      actions: ['examine', 'activate'],
      requires: ['strangekey'],
    },
    cables: {
      description: [
  "Thick fiber-optic cables pulse with faint light, carrying vast amounts of data.",
],
      actions: ['examine', 'trace'],
      requires: [],
    },
  },

  npcs: [],

  events: {
    onEnter: ['showConsoleIntro', 'checkFirstVisit'],
    onExit: ['saveProgress'],
    onInteract: {
      console: ['activateConsole', 'showSystemStatus'],
      chair: ['sitInChair', 'checkNeuralInterface'],
      screens: ['displayDimensionalData'],
    },
  },

  flags: {
    controlSystemOnline: true,
    firstVisit: true,
    consoleActivated: false,
    chairOccupied: false,
    systemsAnalyzed: false,
    emergencyProtocolsRead: false,
  },

  quests: {
    main: 'Begin Multiverse Investigation',
    optional: [
      'Analyze Control Systems',
      'Read Emergency Protocols',
      'Contact Remaining Operators',
    ],
  },

  environmental: {
    lighting: 'dim_blue_glow',
    temperature: 'cool',
    airQuality: 'sterile_with_ozone',
    soundscape: ['low_electrical_hum', 'occasional_data_chirps', 'distant_machinery'],
    hazards: [],
  },

  security: {
    level: 'restricted',
    accessRequirements: [],
    alarmTriggers: ['unauthorized_console_access'],
    surveillanceActive: true,
  },

  metadata: {
    created: '2025-07-09',
    lastModified: '2025-07-17',
    author: 'Geoff',
    version: '2.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '10-15 minutes',
    keyFeatures: [
      'Central control hub',
      'Multiverse monitoring',
      'Interactive console system',
      'Narrative revelation point',
    ],
  },

  secrets: {
    hiddenPanel: {
      description: [
  "A concealed maintenance panel behind the main console",
],
      requirements: ['examine console thoroughly', 'use strangekey'],
      rewards: ['backup_data_crystal', 'emergency_codes'],
    },
    operatorLogs: {
      description: [
  "Personal logs from the previous operator",
],
      requirements: ['activate console', 'sit in chair'],
      rewards: ['backstory_revelation', 'dimensional_map_fragment'],
    },
  },

  customActions: {
    scan: {
      description: [
  "Perform a dimensional scan of the area",
],
      requirements: ['console_activated'],
      effects: ['reveal_hidden_exits', 'update_dimensional_map'],
    },
    calibrate: {
      description: [
  "Calibrate the dimensional stabilizers",
],
      requirements: ['operator_manual_read', 'chair_occupied'],
      effects: ['improve_stability_index', 'unlock_advanced_controls'],
    },
  },
};

export default controlnexus;
