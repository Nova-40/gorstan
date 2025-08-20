import { vi } from 'vitest';

// Mock room data for testing
export const mockRoomRegistry = {
  // Control/Intro zone
  controlnexus: {
    id: 'controlnexus',
    title: 'Control Nexus',
    exits: [
      { to: 'crossing', description: 'north' },
      { to: 'controlroom', description: 'west' }
    ]
  },
  crossing: {
    id: 'crossing',
    title: 'The Crossing',
    exits: [
      { to: 'controlnexus', description: 'south' },
      { to: 'elfhame', description: 'north' }
    ]
  },
  controlroom: {
    id: 'controlroom',
    title: 'Control Room',
    exits: [
      { to: 'controlnexus', description: 'east' },
      { to: 'hiddenlab', description: 'secret' }
    ]
  },
  hiddenlab: {
    id: 'hiddenlab',
    title: 'Hidden Laboratory',
    exits: [
      { to: 'controlroom', description: 'back' }
    ]
  },

  // Elfhame/Faeglade zone
  elfhame: {
    id: 'elfhame',
    title: 'Elfhame',
    exits: [
      { to: 'crossing', description: 'south' },
      { to: 'faeglade', description: 'north' }
    ]
  },
  faeglade: {
    id: 'faeglade',
    title: 'Faeglade',
    exits: [
      { to: 'elfhame', description: 'south' },
      { to: 'faelake', description: 'east' }
    ]
  },
  faelake: {
    id: 'faelake',
    title: 'Fae Lake',
    exits: [
      { to: 'faeglade', description: 'west' },
      { to: 'faelakenorthshore', description: 'north' }
    ]
  },
  faelakenorthshore: {
    id: 'faelakenorthshore',
    title: 'Fae Lake North Shore',
    exits: [
      { to: 'faelake', description: 'south' },
      { to: 'faepalacemainhall', description: 'portal' }
    ]
  },
  faepalacemainhall: {
    id: 'faepalacemainhall',
    title: 'Fae Palace Main Hall',
    exits: [
      { to: 'faelakenorthshore', description: 'portal' },
      { to: 'faepalacerhianonsroom', description: 'west' }
    ]
  },
  faepalacerhianonsroom: {
    id: 'faepalacerhianonsroom',
    title: 'Rhianon\'s Room',
    exits: [
      { to: 'faepalacemainhall', description: 'east' }
    ]
  },

  // Glitch realm
  datavoid: {
    id: 'datavoid',
    title: 'Data Void',
    exits: [
      { to: 'glitchinguniverse', description: 'drift' }
    ]
  },
  glitchinguniverse: {
    id: 'glitchinguniverse',
    title: 'Glitching Universe',
    exits: [
      { to: 'datavoid', description: 'return' },
      { to: 'issuesdetected', description: 'debug' }
    ]
  },
  issuesdetected: {
    id: 'issuesdetected',
    title: 'Issues Detected',
    exits: [
      { to: 'glitchinguniverse', description: 'back' },
      { to: 'ravenchamber', description: 'resolve' }
    ]
  },
  ravenchamber: {
    id: 'ravenchamber',
    title: 'Raven Chamber',
    exits: [
      { to: 'issuesdetected', description: 'up' }
    ]
  },

  // Add more zones as needed for comprehensive testing
  gorstanhub: {
    id: 'gorstanhub',
    title: 'Gorstan Hub',
    exits: [
      { to: 'gorstanvillage', description: 'north' }
    ]
  },
  gorstanvillage: {
    id: 'gorstanvillage',
    title: 'Gorstan Village',
    exits: [
      { to: 'gorstanhub', description: 'south' },
      { to: 'torridon', description: 'east' }
    ]
  },
  torridon: {
    id: 'torridon',
    title: 'Torridon',
    exits: [
      { to: 'gorstanvillage', description: 'west' },
      { to: 'torridoninn', description: 'inn' }
    ]
  },
  torridoninn: {
    id: 'torridoninn',
    title: 'Torridon Inn',
    exits: [
      { to: 'torridon', description: 'out' },
      { to: 'carronspire', description: 'tower' }
    ]
  },
  carronspire: {
    id: 'carronspire',
    title: 'Carron Spire',
    exits: [
      { to: 'torridoninn', description: 'down' }
    ]
  },

  // Intro/Reset room
  introZone_controlnexus: {
    id: 'introZone_controlnexus',
    title: 'Control Nexus (Intro)',
    exits: [
      { to: 'controlnexus', description: 'begin' }
    ]
  }
};

// Create a vi.mock that returns our mock registry
export const setupRoomRegistryMock = () => {
  vi.mock('../roomRegistry', () => ({
    roomRegistry: mockRoomRegistry
  }));
  return mockRoomRegistry;
};
