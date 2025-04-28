// Updated /src/engine/rooms.js

export const rooms = {
  intro: {
    description: 'A dark street. A yellow truck barrels toward you. A portal shimmers open beside you. A voice echoes: "That one."',
    exits: {},
  },

  centralpark: {
    description: 'You are standing in the heart of Central Park. There is a strange sense that something is hidden beneath your feet.',
    exits: { north: 'burgerjoint', east: 'aevirawarehouse' },
    image: '/assets/centralpark.png',
  },

  burgerjoint: {
    description: 'An old-fashioned burger joint. The chef eyes you with a knowing smile.',
    exits: { south: 'centralpark' },
    image: '/assets/burgerjoint.png',
  },

  aevirawarehouse: {
    description: 'Rows of forgotten crates and a lingering smell of old paper fill the massive Aevira Warehouse.',
    exits: { west: 'centralpark', east: 'ancientvault' },
    image: '/assets/aevirawarehouse.png',
  },

  ancientvault: {
    description: 'Heavy stone doors and ancient glyphs hint at forgotten powers.',
    exits: { west: 'aevirawarehouse', east: 'arbitercore' },
    image: '/assets/ancientvault.png',
  },

  arbitercore: {
    description: 'The heart of judgement: an ancient machine hums faintly.',
    exits: { west: 'ancientvault' },
    image: '/assets/arbitercore.png',
  },

  cafeoffice: {
    description: 'A side office behind Findlater’s Café.',
    exits: { south: 'findlaterscornercafe' },
    image: '/assets/cafeoffice.png',
  },

  findlaterscornercafe: {
    description: "Findlater's Corner Café: The smell of pastries battles the London smog.",
    exits: { north: 'cafeoffice', south: 'dalesapartment' },
    image: '/assets/findlaterscornercafe.png',
  },

  dalesapartment: {
    description: "Dale's apartment — a safe place, for now.",
    exits: { north: 'findlaterscornercafe' },
    image: '/assets/dalesapartment.png',
  },

  controlnexus: {
    description: 'The Control Nexus: A swirling vortex of broken commands and abandoned authority.',
    exits: { south: 'controlnexusreturned' },
    image: '/assets/controlnexus.png',
  },

  controlnexusreturned: {
    description: 'The same Nexus... changed. Scarred by your presence.',
    exits: { north: 'controlnexus' },
    image: '/assets/controlnexusreturned.png',
  },

  controlroom: {
    description: 'Banks of blinking panels dominate the Control Room.',
    exits: { south: 'hiddenlab', west: 'resetroom' },
    image: '/assets/controlroom.png',
  },

  hiddenlab: {
    description: 'A hidden lab, whirring quietly.',
    exits: { north: 'controlroom' },
    image: '/assets/hiddenlab.png',
  },

  resetroom: {
    description: 'An enormous blue button pulses gently at the center. A sign reads: "Do Not Push".',
    exits: { east: 'controlroom' },
    image: '/assets/resetroom.png',
  },

  glitchroom: {
    description: 'Reality flickers here. Dangerous.',
    exits: { north: 'pollysbay', east: 'primeconfluence' },
    image: '/assets/glitchroom.png',
  },

  glitchrealm: {
    description: 'The glitch thickens, breaking everything.',
    exits: { south: 'glitchroom', east: 'lucidveil' },
    image: '/assets/glitchrealm.png',
  },

  lucidveil: {
    description: 'Mist where reality and memory blur.',
    exits: { west: 'glitchrealm', east: 'hallucinationroom' },
    image: '/assets/lucidveil.png',
  },

  hallucinationroom: {
    description: 'The walls drip like wax. You cannot trust your senses here.',
    exits: { west: 'lucidveil' },
    image: '/assets/hallucinationroom.png',
  },

  pollysbay: {
    description: 'An interrogation bay. Polly’s laughter echoes endlessly.',
    exits: { south: 'glitchroom', east: 'observationsuite' },
    image: '/assets/pollysbay.png',
  },

  observationsuite: {
    description: 'A massive glass dome stares into unknown skies.',
    exits: { west: 'pollysbay', north: 'hiddenlibrary' },
    image: '/assets/observationsuite.png',
  },

  hiddenlibrary: {
    description: 'Shelves stretch into the shadows. A silent archivist watches.',
    exits: { south: 'observationsuite', north: 'storagechamber' },
    image: '/assets/hiddenlibrary.png',
  },

  storagechamber: {
    description: 'Stacks of ancient, dusty tomes and games long forgotten.',
    exits: { south: 'hiddenlibrary', north: 'forgottenchamber' },
    image: '/assets/storagechamber.png',
  },

  forgottenchamber: {
    description: 'A lost chamber beyond normal space.',
    exits: { south: 'storagechamber', north: 'caveofechoes' },
    image: '/assets/forgottenchamber.png',
  },

  secrettunnel: {
    description: 'A secret tunnel, rough and ancient, leading who-knows-where.',
    exits: { north: 'centralpark', south: 'forgottenchamber' },
    image: '/assets/secrettunnel.png',
  },

  crossing: {
    description: 'The Crossing: multiple pathways branch out here, some lit, some lost to darkness.',
    exits: { west: 'centralpark', east: 'trentparkearth' },
    image: '/assets/crossing.png',
  },

  crossing2: {
    description: 'Another Crossing — or is it the same? Paths twist and lie.',
    exits: { south: 'fallback' },
    image: '/assets/crossing2.png',
  },

  fallback: {
    description: 'A dead-end fallback room — used if something breaks reality.',
    exits: { north: 'crossing2' },
    image: '/assets/fallback.png',
  },

  carronspire: {
    description: 'A jagged mountain spire under a cold, alien sky.',
    exits: { south: 'faelake' },
    image: '/assets/carronspire.png',
  },

  faelake: {
    description: 'Still waters reflect impossible constellations.',
    exits: { north: 'carronspire' },
    image: '/assets/faelake.png',
  },

  torridoninn: {
    description: 'The Torridon Inn, quiet and mist-shrouded.',
    exits: { east: 'torridonbefore' },
    image: '/assets/torridoninn.png',
  },

  torridonbefore: {
    description: 'Before the cataclysm: a peaceful, eerie version of Torridon.',
    exits: { west: 'torridoninn', east: 'torridonafter' },
    image: '/assets/torridonbefore.png',
  },

  torridonafter: {
    description: 'After the cataclysm: Torridon lies broken and bleeding.',
    exits: { west: 'torridonbefore' },
    image: '/assets/torridonafter.png',
  },

  primeconfluence: {
    description: 'Streams of possibility converge into a single roaring current.',
    exits: { west: 'glitchroom' },
    image: '/assets/primeconfluence.png',
  },

  rhianonschamber: {
    description: 'The chamber of Rhiannon — quiet, sacred, and strangely heavy.',
    exits: { west: 'primeconfluence' },
    image: '/assets/rhianonschamber.png',
  },

  trentparkearth: {
    description: 'Back on Earth: Trent Park, quiet and still.',
    exits: { west: 'crossing' },
    image: '/assets/trentparkearth.png',
  },
};


