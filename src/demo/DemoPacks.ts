export const DEMO_PACKS = [
  // existing packs may be present; this file adds the Glitchrealm Sampler
  {
    id: 'glitch_sampler',
    name: 'Glitchrealm Sampler',
    style: 'scripted',
    entryRoom: 'glitchrealm.hall',
    allowMinigames: true,
    steps: [
      { say: "The lattice cracks.", cmd: 'look' },
      { say: 'Feel the pulse.', cmd: 'east' },
      { say: 'Dominic swims…', cmd: 'play dominicCyclotronSwim' },
      { say: 'Surface again.', cmd: 'talk' },
    ],
  },
];
