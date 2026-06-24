/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Renders room descriptions and image logic.

import { Room } from '../types/Room';

type VisualHotspot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  command: string;
  description?: string;
};

type VisualSceneRoom = Room & {
  visualScene: {
    id: string;
    ambient: string;
    testId: string;
  };
  clickHotspots: VisualHotspot[];
  itemDescriptions?: Record<string, string>;
};

const alveiraworkshop = {
  id: 'alveiraworkshop',
  zone: 'newyorkZone',
  RoomDefinition: 'standard',
  title: 'Hidden Alveira Workshop',
  description: [
    'A concealed stair from Central Park leads down into a workshop that should not fit beneath Manhattan.',
    'Benches crowd the walls, covered with delicate instruments, folded diagrams, labelled switches, half-built devices, and the sort of cabling that suggests someone has been having ideas at unsafe voltages.',
    'At the centre of the room stands a chair: plain, functional, and very obviously not plain or functional. Its metal frame carries the quiet confidence of machinery that has already decided where you are going.',
    'The air smells faintly of warm dust, ozone, old paper and coffee. Somewhere inside the walls, a relay clicks with patient disapproval.',
  ],
  image: 'newyork_alveiraworkshop.png',
  ambientAudio: 'alveira_workshop_ambience.mp3',

  visualScene: {
    id: 'alveira-workshop-visual-slice',
    ambient: 'hidden-workshop',
    testId: 'alveira-workshop-visual-scene',
  },

  clickHotspots: [
    {
      id: 'central-park-return',
      x: 5,
      y: 38,
      width: 14,
      height: 34,
      label: 'Central Park',
      command: 'go up',
      description: 'Return up to Central Park.',
    },
    {
      id: 'transporter-chair',
      x: 43,
      y: 42,
      width: 18,
      height: 30,
      label: 'Chair',
      command: 'sit chair',
      description: 'Sit in the workshop chair.',
    },
    {
      id: 'workbench',
      x: 62,
      y: 48,
      width: 23,
      height: 20,
      label: 'Workbench',
      command: 'inspect workbench',
      description: 'Inspect the device-littered workbench.',
    },
  ],

  consoleIntro: [
    '>> HIDDEN ALVEIRA WORKSHOP',
    '>> Access state: UNLOCKED BY BRIEFCASE EVENT',
    '>> Chair system: ACTIVE',
    '>> Destination: OFF WORLD MAIN CHAMBER',
    '>> Warning: Sit only if emotionally prepared for architecture with opinions.',
  ],

  exits: {
    up: 'centralpark',
    out: 'centralpark',
  },

  items: ['workshop_notes', 'relay_switches', 'chair_interface'],

  itemDescriptions: {
    workshop_notes:
      'The notes describe route stabilisation, chair-based transit and several warnings written in increasingly annoyed handwriting.',
    relay_switches:
      'A bank of relay switches, labelled with destinations, tolerances and one small sticker reading “do not press for morale”.',
    chair_interface:
      'A discreet panel built into the chair arm. It is warm, responsive, and attempting to look innocent.',
  },

  interactables: {
    transporter_chair: {
      description:
        'A deceptively ordinary chair containing enough high technology to make the rest of the room feel under-dressed.',
      actions: ['sit', 'examine', 'activate'],
      requires: [],
    },
    workbench: {
      description:
        'A crowded workbench covered in tools, wiring looms, handwritten diagrams and devices that appear to have been invented during arguments.',
      actions: ['examine', 'search', 'study'],
      requires: [],
    },
  },

  npcs: [],
  traps: [],

  events: {
    onEnter: ['recordAlveiraWorkshopEntry'],
    onExit: ['recordAlveiraWorkshopExit'],
    onInteract: {
      transporter_chair: ['activateOffWorldTransit'],
      workbench: ['inspectWorkshopDevices'],
    },
  },

  flags: {
    workshopEntered: false,
    chairActivated: false,
  },

  quests: {
    main: 'Use the Alveira Workshop Chair',
    optional: ['Inspect the Workbench', 'Read the Workshop Notes'],
  },

  environmental: {
    lighting: 'workshop_lamps_and_quantum_glow',
    temperature: 'warm_hidden_machinery',
    airQuality: 'ozone_dust_and_coffee',
    soundscape: ['relay_clicks', 'low_transformer_hum', 'distant_city_muffle'],
    hazards: ['improper_transit_risk'],
  },

  security: {
    level: 'restricted',
    accessRequirements: ['briefcase_puzzle_solved'],
    alarmTriggers: [],
    surveillanceActive: false,
  },

  metadata: {
    created: '2026-06-24',
    lastModified: '2026-06-24',
    author: 'Geoff',
    version: '1.0',
    playTested: false,
    difficulty: 'moderate',
    estimatedPlayTime: '4-8 minutes',
    keyFeatures: ['Hidden workshop', 'Chair transporter', 'Off World route'],
  },
} as unknown as VisualSceneRoom;

export default alveiraworkshop;
