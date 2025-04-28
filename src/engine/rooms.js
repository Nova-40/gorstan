// /src/engine/rooms.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0
// /src/engine/rooms.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0
// /src/engine/rooms.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

export const rooms = {
  intro: {
    description: 'A dark street. A yellow truck barrels toward you. A portal shimmers open beside you. A voice echoes: "That one."',
    exits: {},
    onEnter: (game) => {
      if (!game.hasItem('gorstancoffee')) {
        game.addItem('gorstancoffee', { description: 'A steaming cup of Gorstan coffee, oddly comforting.' });
      }
    },
  },

  centralpark: {
    description: 'You are standing in the heart of Central Park. There is a strange sense that something is hidden beneath your feet.',
    exits: {
      north: 'burgerjoint',
      east: 'aevirawarehouse',
    },
  },

  burgerjoint: {
    description: 'An old-fashioned burger joint. The chef eyes you with a knowing smile.',
    exits: {
      south: 'centralpark',
    },
  },

  aevirawarehouse: {
    description: 'Rows of forgotten crates and a lingering smell of old paper fill the massive Aevira Warehouse.',
    exits: {
      west: 'centralpark',
      east: 'ancientvault',
    },
    onEnter: (game) => {
      if (!game.storyProgress.spokeToChef) {
        game.moveToRoom('centralpark');
        return 'A guard stops you. "Not without clearance!" You are escorted back to Central Park.';
      }
      return null;
    },
  },

  ancientvault: {
    description: 'Heavy stone doors and ancient glyphs hint at forgotten powers.',
    exits: {
      west: 'aevirawarehouse',
      east: 'arbitercore',
    },
  },

  arbitercore: {
    description: 'The heart of judgement: an ancient machine hums faintly.',
    exits: {
      west: 'ancientvault',
    },
  },

  findlaterscornercafe: {
    description: "Findlater's Corner Café: The smell of pastries battles the London smog.",
    exits: {
      north: 'cafeoffice',
      south: 'dalesapartment',
    },
  },

  cafeoffice: {
    description: 'A side office behind Findlater’s Café.',
    exits: {
      south: 'findlaterscornercafe',
    },
  },

  dalesapartment: {
    description: "Dale's apartment — a safe place, for now.",
    exits: {
      north: 'findlaterscornercafe',
    },
  },

  controlroom: {
    description: 'Banks of blinking panels dominate the Control Room.',
    exits: {
      south: 'hiddenlab',
      west: 'resetroom',
    },
  },

  resetroom: {
    description: 'A single massive reset button glows faintly.',
    exits: {
      east: 'controlroom',
    },
  },

  hiddenlab: {
    description: 'A hidden lab, whirring quietly.',
    exits: {
      north: 'controlroom',
    },
  },

  glitchroom: {
    description: 'Reality flickers here. Dangerous.',
    exits: {
      north: 'pollysbay',
      east: 'primeconfluence',
    },
  },

  pollysbay: {
    description: 'An interrogation bay. Polly’s laughter echoes.',
    exits: {
      south: 'glitchroom',
      east: 'observationsuite',
    },
  },

  observationsuite: {
    description: 'A massive glass dome stares into unknown skies.',
    exits: {
      west: 'pollysbay',
      north: 'hiddenlibrary',
    },
  },

  hiddenlibrary: {
    description: 'Shelves stretch into the shadows. A silent archivist watches.',
    exits: {
      south: 'observationsuite',
      north: 'storagechamber',
    },
  },

  storagechamber: {
    description: 'Stacks of ancient, dusty tomes and strange artifacts.',
    exits: {
      south: 'hiddenlibrary',
      north: 'forgottenchamber',
    },
  },

  forgottenchamber: {
    description: 'A lost chamber beyond normal space.',
    exits: {
      south: 'storagechamber',
      north: 'caveofechoes',
    },
  },

  caveofechoes: {
    description: 'An ancient cave. The walls seem to echo not your words, but your innermost thoughts.',
    exits: {
      south: 'forgottenchamber',
    },
    onEnter: (game) => {
      if (game.gameLog && game.gameLog.length > 0) {
        const echoIndex = Math.floor(Math.random() * game.gameLog.length);
        const echo = game.gameLog[echoIndex]?.text || '...silence...';
        return `The walls whisper: "${echo}"`;
      }
      return 'The walls remain eerily silent.';
    },
  },

  secrettunnel: {
    description: 'An ancient tunnel, rough and secret.',
    exits: {
      south: 'caveofechoes',
      north: 'centralpark',
    },
  },

  glitchrealm: {
    description: 'The glitch thickens, breaking everything.',
    exits: {
      south: 'glitchroom',
      east: 'lucidveil',
    },
  },

  lucidveil: {
    description: 'Mist where reality and memory blur.',
    exits: {
      west: 'glitchrealm',
      east: 'hallucinationroom',
    },
  },

  hallucinationroom: {
    description: 'The room warps and twists around you.',
    exits: {
      west: 'lucidveil',
    },
  },

  carronspire: {
    description: 'A lonely spire under alien stars.',
    exits: {
      south: 'faelake',
    },
  },

  faelake: {
    description: 'Still waters reflect impossible skies.',
    exits: {
      north: 'carronspire',
    },
  },

  crossing: {
    description: 'Many paths converge at this crossing.',
    exits: {
      west: 'centralpark',
      east: 'trentparkearth',
    },
  },

  crossing2: {
    description: 'The crossing shifts and lies.',
    exits: {
      south: 'fallback',
    },
  },

  fallback: {
    description: 'A dead end. You should not be here.',
    exits: {
      north: 'crossing2',
    },
  },

  rhianonschamber: {
    description: 'Sacred, heavy with presence.',
    exits: {
      west: 'primeconfluence',
    },
  },

  primeconfluence: {
    description: 'Converging streams of possibility.',
    exits: {
      west: 'glitchroom',
    },
  },

  torridoninn: {
    description: 'A misty inn in Torridon.',
    exits: {
      east: 'torridonbefore',
    },
  },

  torridonbefore: {
    description: 'Torridon before catastrophe.',
    exits: {
      west: 'torridoninn',
      east: 'torridonafter',
    },
  },

  torridonafter: {
    description: 'Torridon shattered after events.',
    exits: {
      west: 'torridonbefore',
    },
  },
};

export function checkSecretTunnelAccess(game) {
  if (game.hasItem('gorstancoffee') || game.hasItem('briefcase') || game.hasItem('medallion')) {
    if (!rooms.centralpark.exits.down) {
      rooms.centralpark.exits.down = 'secrettunnel';
      console.log('You uncover a hidden path beneath the park!');
    }
  }
}

