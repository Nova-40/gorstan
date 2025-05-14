// /src/engine/rooms.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

// Rooms Configuration
// This file defines the rooms in the Gorstan game world.
// Each room includes a description, exits to other rooms, optional images, and interactive items.

export const rooms = {
  // --- Intro Phase ---
  introstreet1: {
    onEnter: (engine) => {
      if (!engine || typeof engine.enterRoom !== 'function') {
        console.error('❌ Invalid engine object in introstreet1 onEnter.');
        return;
      }
      console.log("✅ onEnter for introstreet1 triggered");
      setTimeout(() => {
        console.log("⏳ transitioning to introstreet2");
        engine.enterRoom("introstreet2");
      }, 4000);
    },
    description: "A dimly lit street. The air hums. You feel watched.",
    image: "/images/introstreet1.png",
    exits: () => ({ north: "introstreet2" }),
  },
  introstreet2: {
    description: "The truck is coming fast. You must decide: 'jump' or 'wait'.",
    image: "/images/introstreet2.png",
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== 'function') {
        console.error('❌ Invalid engine object in introstreet2 onEnter.');
        return;
      }
      setTimeout(() => {
        if (!engine.storyFlags.has("jumped") && !engine.storyFlags.has("waited")) {
          engine.output("The truck is almost here. You need to do something!");
        }
      }, 3000);
    },
    exits: (state) => {
      const exits = {};
      const flags = state?.storyFlags || new Set();
      if (flags.has("jumped")) exits.east = "introjump";
      if (flags.has("waited")) exits.restart = "introsplat";
      if (flags.has("secretDoorUnlocked")) exits.north = "introstreetclear";
      return exits;
    },
  },
  introstreetclear: {
    description: "A quiet corner of the street, untouched by the chaos. You’re briefly safe here.",
    image: "/images/introstreetclear.png",
    exits: { south: "findlaterscornercafe", north: "dalesapartment" },
  },
  introjump: {
    description: "You feel yourself falling through a portal of light and static...",
    image: "/images/introjump.png",
    exits: { down: "controlnexus" },
  },
  introsplat: {
    description: "Blackness surrounds you. A terminal glows faintly in the void.",
    exits: { reset: "introreset" },
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== 'function') {
        console.error('❌ Invalid engine object in introsplat onEnter.');
        return;
      }
      const lines = [
        "Reality is a construct…",
        "Calibrating your consciousness…",
        "Deploying the Gorstan protocol…",
        "Warning: truck detected.",
        "Brace for impact…",
        "Multiverse resetting...",
      ];
      lines.forEach((line, i) => {
        setTimeout(() => engine.output(line), i * 1600);
      });
      setTimeout(() => engine.move("reset"), lines.length * 1600 + 1000);
    },
  },
  introreset: {
    description: "Please hold on. Multiverse is now resetting...",
    image: "/images/introreset.png",
    exits: { enter: "controlnexus" },
  },

  // --- Post Briefcase Unlock ---
  hiddenstore: {
    description: "A forgotten shop tucked under Central Park, filled with anomalies.",
    image: "/images/glitchroom.png",
    exits: { up: "centralpark", down: "glitchrealm" },
  },
  glitchrealm: {
    description: "Reality is thin here. Very thin.",
    image: "/images/glitchrealm.png",
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== 'function') {
        console.error('❌ Invalid engine object in glitchrealm onEnter.');
        return;
      }
      engine.output("You feel the world glitch around you. Something isn’t right here.");
    },
    exits: { up: "hiddenstore" },
  },

  // --- Control Layer ---
  controlnexus: {
    description: "A vast control room humming with potential. Buttons flash and portals shimmer.",
    image: "/images/controlnexus.png",
    exits: { east: "controlnexusreturned" },
  },
  hiddenlab: {
    description: "Flickering lights. Scattered notes. A forgotten research facility.",
    image: "/images/hiddenlab.png",
    exits: { west: "controlnexus", down: "arbitercore" },
  },

  // --- New York Phase ---
  centralpark: {
    description: "An overgrown green with ancient benches and dimensional ripples.",
    image: "/images/centralpark.png",
    exits: (state) => {
      const exits = { south: "controlnexus", east: "burgerjoint", west: "aevirawarehouse" };
      const flags = state?.storyFlags || new Set();
      if (flags.has("coffeeThrown")) {
        exits.down = "hiddenstore";
      }
      return exits;
    },
  },
  burgerjoint: {
  
    onCommand: (cmd, engine) => {
      const state = engine.getFlag("chefTalk") || 0;
      if (cmd.toLowerCase().includes("talk")) {
        if (state === 0) {
          engine.output("The chef nods. 'Go help yourself from the store room, mate.'");
          engine.setFlag("chefTalk", 1);
        } else if (state === 1) {
          engine.output("He grins. 'They're expecting you at the warehouse now.'");
          engine.setFlag("chefTalk", 2);
        } else {
          engine.output("'What are you still doing here? They’re waiting.'");
        }
      }
    },

    description: "Grime, grease, and a chef who knows too much.",
    image: "/images/burgerjoint.png",
    onEnter: (engine) => {
      if (!engine.storyFlags.has("chefSpoken")) {
        engine.output("The chef eyes you. 'Can I help you with something?' he asks.");
      }
    },
    exits: { west: "centralpark", storage: "greasystoreroom" },
  },
  greasystoreroom: {
    items: ["briefcase"],
    description: "Shelves of junk and a napkin that shouldn't exist.",
    image: "/images/greasystoreroom.png",
    exits: { out: "burgerjoint" },
    items: {
      greasyNapkin: {
        name: "Greasy Napkin",
        description: "A crumpled, greasy napkin with a quantum sketch on it.",
        canPickup: true,
        onPickup: (engine) => {
          if (!engine || typeof engine.output !== 'function') {
            console.error('❌ Invalid engine object in greasyNapkin onPickup.');
            return;
          }
          engine.output("You pick up the napkin. It’s oddly precise.");
        },
      },
      goldcoin: {
        name: "Gold Coin",
        description: "A shiny coin from another time.",
        canPickup: true,
      },
    },
  },

  // --- Arbiter Phase ---
  arbitercore: {
    description: "A silence here cuts deep. Something dormant... judges.",
    image: "/images/arbitercore.png",
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== 'function') {
        console.error('❌ Invalid engine object in arbitercore onEnter.');
        return;
      }
      engine.output("The Arbiter's presence is overwhelming. You feel as though you're being weighed.");
    },
    exits: { up: "hiddenlab" },
  },

  // --- Crossing Phase ---
  crossing: {
    description: "This place doesn’t belong to any one timeline. It watches you pass.",
    image: "/images/crossing.png",
    exits: { east: "controlnexus", west: "pollysbay" },
  },
  pollysbay: {
    description: "You step onto cracked tiles. The walls flicker with projection static. This is not a seaside bay, no matter what the appearance is. This place is too clean.",
    image: "/images/pollysbay.png",
    exits: { east: "crossing", south: "findlaterscornercafe" },
  },

  // --- Findlaters Café Phase ---
  findlaterscornercafe: {
    description: "The smell of coffee and pastries fills the air. A quiet hum of conversation surrounds you.",
    image: "/images/findlaterscornercafe.png",
    onEnter: (engine) => {
      if (!engine.storyFlags.has("hadFlatWhite")) {
        engine.output("The barista smiles. 'Flat white? It's the best in town.'");
      }
    },
    exits: { north: "pollysbay", west: "centralpark" },
  },

  // --- Dale's Apartment ---
  dalesapartment: {
    items: ["runbag"],
    description: "A small, cluttered apartment. Papers and books are scattered everywhere.",
    image: "/images/dalesapartment.png",
    exits: { south: "introstreetclear" },
    items: {
      runbag: {
        name: "Runbag",
        description: "A sturdy bag filled with essentials for a quick escape.",
        canPickup: true,
        onPickup: (engine) => {
          if (!engine || typeof engine.output !== 'function') {
            console.error('❌ Invalid engine object in runbag onPickup.');
            return;
          }
          engine.output("You pick up the runbag. It feels like it’s been waiting for you.");
        },
      },
    },
  },

  // --- Observation Deck ---
  observationdeck: {
    description: "You peer through reinforced glass. The stars are wrong.",
    image: "/images/observationdeck.png",
    exits: { down: "controlnexus" },
  },

  // --- Aevira Warehouse ---
  aevirawarehouse: {
  
    onEnter: (engine) => {
      if (!engine.hasItem("briefcase")) {
        engine.output("A security guard stops you. 'Oi! You ain't cleared!' He panics and pushes you back to Central Park.");
        engine.moveTo("centralpark");
      } else {
        engine.output("The guards see the briefcase. 'Right this way.' You step in and feel the weight of expectation.");
        engine.triggerBriefcasePuzzle?.();
      }
    },

    description: "Stacks of crates and machinery hum faintly. This place feels abandoned, but not empty.",
    image: "/images/aevirawarehouse.png",
    exits: { north: "centralpark" },
    items: {
      faeCrownShard: {
        name: "Fae Crown Shard",
        description: "A shimmering fragment from a long-lost monarchy.",
        canPickup: true,
        onPickup: (engine) => {
          if (!engine || typeof engine.output !== 'function') {
            console.error('❌ Invalid engine object in faeCrownShard onPickup.');
            return;
          }
          engine.output("You pick up the shard. It glows faintly in your hand.");
        },
      },
    },
  },

  // --- Rhiannon's Chamber ---
  rhiannonschamber: {
    description: "Glyphs pulse across the walls. A mirror in the centre shows not your reflection, but possibilities.",
    image: "/images/rhiannonschamber.png",
    exits: { },
  },

  // --- Torridon Phase ---
  torridonbefore: {
    description: "The village before the storm. The air is tense with anticipation.",
    image: "/images/torridonbefore.png",
    exits: { east: "carronspire" },
  },
  torridonafter: {
    description: "A quiet village after the storm. The air feels heavy with loss.",
    image: "/images/torridonafter.png",
    exits: { west: "torridonbefore", east: "ancientvault" },
  },
  torridoninn: {
    description: "A cozy inn with a roaring fire and the smell of fresh bread.",
    image: "/images/torridoninn.png",
    exits: { north: "torridonbefore", south: "stkatherinesdock" },
  },

  // --- Trent Park ---
  trentparkearth: {
    onCommand: (cmd, engine) => {
      if (cmd.toLowerCase() === "sit") {
        engine.moveTo("resetroom");
        engine.output("You sit on the strange chair. Something hums... and the world shifts.");
      }
    },
    description: "A park on Earth, filled with crows and the faint sound of distant traffic.",
    image: "/images/trentparkearth.png",
    exits: { north: "centralpark", south: "stkatherinesdock" },
  },

  ancientvault: {
    description: "You find yourself in ancientvault. The air is thick with mystery.",
    image: "/images/ancientvault.png",
    exits: { secret: "arbitercore" }
  },

  cafeoffice: {
    description: "You find yourself in cafeoffice. The air is thick with mystery.",
    image: "/images/cafeoffice.png",
    exits: { north: "findlaterscornercafe", secret: "torridonbefore" }
  },

  carronspire: {
    description: "You find yourself in carronspire. The air is thick with mystery.",
    image: "/images/carronspire.png",
    exits: { secret: "latticeroom" }
  },

  controlnexusreturned: {
    description: "You find yourself in controlnexusreturned. The air is thick with mystery.",
    image: "/images/controlnexusreturned.png",
    exits: { east: "controlroom" }
  },

  controlroom: {
    description: "You find yourself in controlroom. The air is thick with mystery.",
    image: "/images/controlroom.png",
    exits: { north: "resetroom", secret: "observationsuite" }
  },

  crossing2: {
    description: "You find yourself in crossing2. The air is thick with mystery.",
    image: "/images/crossing2.png",
    exits: { south: "centralpark" }
  },

  elfhame: {
    description: "You find yourself in elfhame. The air is thick with mystery.",
    image: "/images/elfhame.png",
    exits: { east: "faelake", south: "faelake2" }
  },

  faelake: {
    description: "You find yourself in faelake. The air is thick with mystery.",
    image: "/images/faelake.png",
    exits: { east: "rhiannonschamber" }
  },

  faelake2: {
    description: "You find yourself in faelake2. The air is thick with mystery.",
    image: "/images/faelake2.png",
    exits: { west: "faelake" }
  },

  fallback: {
    description: "You find yourself in fallback. The air is thick with mystery.",
    image: "/images/fallback.png",
    exits: { south: "centralpark" }
  },

  forgottenchamber: {
    description: "You find yourself in forgottenchamber. The air is thick with mystery.",
    image: "/images/forgottenchamber.png",
    exits: { down: "maze1" }
  },

  glitchroom: {
    description: "You find yourself in glitchroom. The air is thick with mystery.",
    image: "/images/glitchroom.png",
    exits: { south: "centralpark" }
  },

  hallucinationroom: {
    description: "You find yourself in hallucinationroom. The air is thick with mystery.",
    image: "/images/hallucinationroom.png",
    exits: { south: "centralpark" }
  },

  hiddenlibrary: {
    description: "You find yourself in hiddenlibrary. The air is thick with mystery.",
    image: "/images/hiddenlibrary.png",
    exits: { east: "libraryarchivist" }
  },

  introstart: {
    description: "You find yourself in introstart. The air is thick with mystery.",
    image: "/images/introstart.png",
    exits: { south: "centralpark" }
  },

  latticeroom: {
    description: "You find yourself in latticeroom. The air is thick with mystery.",
    image: "/images/latticeroom.png",
    exits: { secret: "lucidveil" }
  },

  libraryarchivist: {
    description: "You find yourself in libraryarchivist. The air is thick with mystery.",
    image: "/images/libraryarchivist.png",
    exits: { south: "centralpark" }
  },

  lucidveil: {
    description: "You find yourself in lucidveil. The air is thick with mystery.",
    image: "/images/lucidveil.png",
    exits: { west: "stantonharcourt" }
  },

  maze1: {
    description: "You find yourself in maze1. The air is thick with mystery.",
    image: "/images/maze1.png",
    exits: { forward: "maze2", loop: "maze3" }
  },

  maze2: {
    description: "You find yourself in maze2. The air is thick with mystery.",
    image: "/images/maze2.png",
    exits: { forward: "maze3", loop: "maze1" }
  },

  maze3: {
    description: "You find yourself in maze3. The air is thick with mystery.",
    image: "/images/maze3.png",
    exits: { forward: "maze1", out1: "secrettunnel", out2: "elfhame", out3: "glitchroom" }
  },

  observationsuite: {
    description: "You find yourself in observationsuite. The air is thick with mystery.",
    image: "/images/observationsuite.png",
    exits: { east: "primeconfluence", secret: "resetroom" }
  },

  primeconfluence: {
    description: "You find yourself in primeconfluence. The air is thick with mystery.",
    image: "/images/primeconfluence.png",
    exits: { }
  },

  resetroom: {
  description: "Welcome to the oinously named reset room there is a chair here and a big blue button.",
  image: "/images/resetroom.png",
  onCommand: (cmd, engine) => {
    if (cmd.toLowerCase() === "sit") {
      engine.output("You sit down in the chair. Wow, that’s comfort — WHAHHT! The universe flips and you are somewhere else.");
      engine.moveTo("trentparkearth");
    }
  },
  exits: {}
},
  

  rhianonschamber: {
    description: "You find yourself in rhianonschamber. The air is thick with mystery.",
    image: "/images/rhianonschamber.png",
    exits: { south: "centralpark" }
  },

  secrettunnel: {
    description: "You find yourself in secrettunnel. The air is thick with mystery.",
    image: "/images/secrettunnel.png",
    exits: { exit1: "centralpark", exit2: "trentparkearth", exit3: "pollysbay", exit4: "resetroom", exit5: "elfhame", exit6: "maze1" }
  },

  stkatherinesdock: {
  
    onCommand: (cmd, engine) => {
      if (cmd.toLowerCase().includes("portal")) {
        if (engine.hasItem("runbag")) {
          engine.output("The portal hums and opens toward Central Park.");
          engine.moveTo("centralpark");
        } else {
          engine.output("The portal flickers but remains shut. Something’s missing.");
        }
      }
    },

    description: "You find yourself in stkatherinesdock. The air is thick with mystery.",
    image: "/images/stkatherinesdock.png",
    exits: { west: "centralpark" }
  },

  storagechamber: {
    description: "You find yourself in storagechamber. The air is thick with mystery.",
    image: "/images/storagechamber.png",
    exits: { south: "centralpark" }
  }}
