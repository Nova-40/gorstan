// /src/engine/rooms.js
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.5

// Utility function for error logging
const logError = (message, err) => console.error(`❌ ${message}`, err);

// Rooms Configuration
// This file defines the rooms in the Gorstan game world.
// Each room includes a description, exits to other rooms, optional images, and interactive items.

export const rooms = {
  // --- Intro Phase ---
  introstreet1: {
    description: "A dimly lit street stretches before you, shrouded in an eerie silence. The air hums with an unnatural energy, and shadows seem to shift just beyond your vision. You feel an unsettling presence watching you.",
    image: "/images/introstreet1.png",
    exits: () => ({ north: "introstreet2" }),
    onEnter: (engine) => {
      if (!engine || typeof engine.enterRoom !== "function") {
        logError("Invalid engine object in introstreet1 onEnter.");
        return;
      }
      console.log("✅ onEnter for introstreet1 triggered");
      setTimeout(() => {
        console.log("⏳ transitioning to introstreet2");
        engine.enterRoom("introstreet2");
      }, 4000);
    },
    items: null,
  },

  introstreet2: {
    description: "The street ahead is bathed in the harsh glare of headlights. A truck barrels toward you, its horn blaring like a warning from another world. The ground trembles beneath your feet as you face a split-second decision: 'jump' or 'wait'.",
    image: "/images/introstreet2.png",
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== "function") {
        logError("Invalid engine object in introstreet2 onEnter.");
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
    items: null,
  },

  introstreetclear: {
    description: "You find yourself in a quiet corner of the street, untouched by the chaos. The air is still, and for a moment, you feel a fleeting sense of safety. The distant hum of the city seems almost comforting.",
    image: "/images/introstreetclear.png",
    exits: { south: "findlaterscornercafe", north: "dalesapartment" },
    onEnter: null,
    items: null,
  },

  introjump: {
    description: "You leap into the unknown, and the world around you dissolves into a swirling vortex of light and static. Time and space blur as you fall through a portal to somewhere... else.",
    image: "/images/introjump.png",
    exits: { down: "controlnexus" },
    onEnter: null,
    items: null,
  },

  introsplat: {
    description: "Darkness envelops you. The air is cold and still, and the only light comes from a faintly glowing terminal in the void. You feel weightless, as if suspended in nothingness.",
    exits: { reset: "introreset" },
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== "function") {
        logError("Invalid engine object in introsplat onEnter.");
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
    image: null,
    items: null,
  },

  introreset: {
    description: "A mechanical voice echoes around you: 'Please hold on. Multiverse is now resetting...' The world flickers and shifts, as if reality itself is being rewritten.",
    image: "/images/introreset.png",
    exits: { enter: "controlnexus" },
    onEnter: null,
    items: null,
  },

  // --- Post Briefcase Unlock ---
  hiddenstore: {
    description: "You step into a forgotten shop hidden beneath Central Park. Dusty shelves are lined with strange artifacts, each radiating an aura of mystery. The air is thick with the scent of old wood and secrets.",
    image: "/images/glitchroom.png",
    exits: { up: "centralpark", down: "glitchrealm" },
    onEnter: null,
    items: null,
  },

  glitchrealm: {
    description: "Reality feels fragile here, as if the world could shatter at any moment. The air shimmers with glitches, and the ground beneath your feet seems to flicker in and out of existence.",
    image: "/images/glitchrealm.png",
    onEnter: (engine) => {
      if (!engine || typeof engine.output !== "function") {
        logError("Invalid engine object in glitchrealm onEnter.");
        return;
      }
      engine.output("You feel the world glitch around you. Something isn’t right here.");
    },
    exits: { up: "hiddenstore" },
    items: null,
  },

  // --- Control Layer ---
  controlnexus: {
    description: "A vast control room hums with potential energy. Buttons flash in rhythmic patterns, and shimmering portals line the walls. The air is charged with the promise of infinite possibilities.",
    image: "/images/controlnexus.png",
    exits: { east: "controlnexusreturned" },
    onEnter: null,
    items: null,
  },

  hiddenlab: {
    description: "Flickering lights illuminate scattered notes and broken equipment. This forgotten research facility feels like a place where great discoveries—and terrible mistakes—were made.",
    image: "/images/hiddenlab.png",
    exits: { west: "controlnexus", down: "arbitercore" },
    onEnter: null,
    items: null,
  },

  // --- New York Phase ---
  centralpark: {
    description: "An overgrown park stretches before you, its ancient benches covered in moss. Dimensional ripples shimmer in the air, hinting at the secrets hidden beneath the surface.",
    image: "/images/centralpark.png",
    exits: (state) => {
      const exits = { south: "controlnexus", east: "burgerjoint", west: "aevirawarehouse" };
      const flags = state?.storyFlags || new Set();
      if (flags.has("coffeeThrown")) {
        exits.down = "hiddenstore";
      }
      return exits;
    },
    onEnter: null,
    items: null,
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
    description: "The smell of grease and burnt coffee fills the air. A chef stands behind the counter, his eyes sharp and knowing. This is no ordinary burger joint.",
    image: "/images/burgerjoint.png",
    onEnter: (engine) => {
      if (!engine.storyFlags.has("chefSpoken")) {
        engine.output("The chef eyes you. 'Can I help you with something?' he asks.");
      }
    },
    exits: { west: "centralpark", storage: "greasystoreroom" },
    items: null,
  },

  greasystoreroom: {
    items: ["briefcase"],
    description: "Shelves of junk line the walls, but among the clutter, you spot a crumpled napkin and a shiny gold coin. The air smells faintly of grease and secrets.",
    image: "/images/greasystoreroom.png",
    exits: { out: "burgerjoint" },
    onEnter: null,
    items: {
      greasyNapkin: {
        name: "Greasy Napkin",
        description: "A crumpled, greasy napkin with a quantum sketch on it.",
        canPickup: true,
        onPickup: (engine) => {
          if (!engine || typeof engine.output !== "function") {
            logError("Invalid engine object in greasyNapkin onPickup.");
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
      if (!engine || typeof engine.output !== "function") {
        logError("Invalid engine object in arbitercore onEnter.");
        return;
      }
      engine.output("The Arbiter's presence is overwhelming. You feel as though you're being weighed.");
    },
    exits: { up: "hiddenlab" },
    items: null,
  },

  // --- Crossing Phase ---
  crossing: {
    description: "This place doesn’t belong to any one timeline. It watches you pass.",
    image: "/images/crossing.png",
    exits: { east: "controlnexus", west: "pollysbay" },
    onEnter: null,
    items: null,
  },

  pollysbay: {
    description: "You step onto cracked tiles. The walls flicker with projection static. This is not a seaside bay, no matter what the appearance is. This place is too clean.",
    image: "/images/pollysbay.png",
    exits: { east: "crossing", south: "findlaterscornercafe" },
    onEnter: null,
    items: null,
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
    items: null,
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
          if (!engine || typeof engine.output !== "function") {
            logError("Invalid engine object in runbag onPickup.");
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
    onEnter: null,
    items: null,
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
          if (!engine || typeof engine.output !== "function") {
            logError("Invalid engine object in faeCrownShard onPickup.");
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
    exits: {},
    onEnter: null,
    items: null,
  },

  // --- Torridon Phase ---
  torridonbefore: {
    description: "The village before the storm. The air is tense with anticipation.",
    image: "/images/torridonbefore.png",
    exits: { east: "carronspire" },
    onEnter: null,
    items: null,
  },
  torridonafter: {
    description: "A quiet village after the storm. The air feels heavy with loss.",
    image: "/images/torridonafter.png",
    exits: { west: "torridonbefore", east: "ancientvault" },
    onEnter: null,
    items: null,
  },
  torridoninn: {
    description: "A cozy inn with a roaring fire and the smell of fresh bread.",
    image: "/images/torridoninn.png",
    exits: { north: "torridonbefore", south: "stkatherinesdock" },
    onEnter: null,
    items: null,
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
    onEnter: null,
    items: null,
  },

  ancientvault: {
    description: "You find yourself in ancientvault. The air is thick with mystery.",
    image: "/images/ancientvault.png",
    exits: { secret: "arbitercore" },
    onEnter: null,
    items: null,
  },

  cafeoffice: {
    description: "You find yourself in cafeoffice. The air is thick with mystery.",
    image: "/images/cafeoffice.png",
    exits: { north: "findlaterscornercafe", secret: "torridonbefore" },
    onEnter: null,
    items: null,
  },

  carronspire: {
    description: "You find yourself in carronspire. The air is thick with mystery.",
    image: "/images/carronspire.png",
    exits: { secret: "latticeroom" },
    onEnter: null,
    items: null,
  },

  controlnexusreturned: {
    description: "You find yourself in another strange room full of ancient tech. The air is thick with mystery.",
    image: "/images/controlnexusreturned.png",
    exits: { west: "controlnexus", east: "controlroom" },
    onEnter: null,
    items: null,
  },

  controlroom: {
    description: "You enter the control room. Lights blink in patterns you can’t decipher. Something important happened here—and may again.",
    image: "/images/controlroom.png",
    exits: { north: "resetroom", west: "controlnexusreturned", secret: "observationsuite" },
    onEnter: null,
    items: null,
  },

  crossing2: {
    description: "You find yourself in crossing2. The air is thick with mystery.",
    image: "/images/crossing2.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  elfhame: {
    description: "This is Elfhame—where bargains are whispered, time moves sideways, and no path is ever quite the same twice.",
    image: "/images/elfhame.png",
    exits: { east: "faelake", south: "faelake2" },
    onEnter: null,
    items: null,
  },

  faelake: {
    description: "The lake glows with an otherworldly sheen. Ripples drift across the surface without wind, as if something just slipped beneath.",
    image: "/images/faelake.png",
    exits: { east: "rhiannonschamber" },
    onEnter: null,
    items: null,
  },

  faelake2: {
    description: "Some of the stones on the shore here seem to call your name, they want you to pick them up.",
    image: "/images/faelake2.png",
    exits: { west: "faelake" },
    onEnter: null,
    items: null,
  },

  fallback: {
    description: "You find yourself in fallback. That means something is very wrong.",
    image: "/images/fallback.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  forgottenchamber: {
    description: "You find yourself in forgottenchamber. You can feel it sucking memories from your brain.",
    image: "/images/forgottenchamber.png",
    exits: { down: "maze1" },
    onEnter: null,
    items: null,
  },

  glitchroom: {
    description: "You find yourself in glitchroom. Odd it doesn't seem to be working.",
    image: "/images/glitchroom.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  hallucinationroom: {
    description: "Is this room named for its concept aligned to the Beatles Lucy in the Sky song? Thats just odd!.",
    image: "/images/hallucinationroom.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  hiddenlibrary: {
    description: "You find yourself in the library. Every domain, kingdom, phylum and other taxonomy aspects, on every planet, in every multiverse, in every instance, is recorded here.",
    image: "/images/hiddenlibrary.png",
    exits: { east: "libraryarchivist" },
    onEnter: null,
    items: null,
  },

  introstart: {
    description: "You find yourself in introstart. The air is thick with mystery.",
    image: "/images/introstart.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  latticeroom: {
    description: "You find yourself in latticeroom. The air is thick with mystery.",
    image: "/images/latticeroom.png",
    exits: { secret: "lucidveil" },
    onEnter: null,
    items: null,
  },

  libraryarchivist: {
    description: "You find yourself in libraryarchivist. The air is thick with mystery.",
    image: "/images/libraryarchivist.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  lucidveil: {
    description: "You find yourself in lucidveil. The air is thick with mystery.",
    image: "/images/lucidveil.png",
    exits: { west: "stantonharcourt" },
    onEnter: null,
    items: null,
  },

  maze1: {
    description: "You find yourself in maze1. The air is thick with mystery.",
    image: "/images/maze1.png",
    exits: { forward: "maze2", loop: "maze3" },
    onEnter: null,
    items: null,
  },

  maze2: {
    description: "You find yourself in maze2. The air is thick with mystery.",
    image: "/images/maze2.png",
    exits: { forward: "maze3", loop: "maze1" },
    onEnter: null,
    items: null,
  },

  maze3: {
    description: "You find yourself in maze3. The air is thick with mystery.",
    image: "/images/maze3.png",
    exits: { forward: "maze1", out1: "secrettunnel", out2: "elfhame", out3: "glitchroom" },
    onEnter: null,
    items: null,
  },

  observationsuite: {
    description: "You find yourself in observationsuite. The air is thick with mystery.",
    image: "/images/observationsuite.png",
    exits: { east: "primeconfluence", secret: "resetroom" },
    onEnter: null,
    items: null,
  },

  primeconfluence: {
    description: "You find yourself in primeconfluence. The air is thick with mystery.",
    image: "/images/primeconfluence.png",
    exits: {},
    onEnter: null,
    items: null,
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
    exits: {},
    items: null,
  },

  buttonpressed: {
    description: "A glowing message pulses above: **DON'T PRESS THIS BUTTON AGAIN**. The room vibrates with unstable energy.",
    image: "/images/buttonpressed_768x512.png", // adjust path if needed
    exits: {}, // no manual exits; handled via engine logic
    onEnter: null,
    items: null,
  },

  rhianonschamber: {
    description: "You find yourself in rhianonschamber. The air is thick with mystery.",
    image: "/images/rhianonschamber.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  secrettunnel: {
    description: "You find yourself in secrettunnel. The air is thick with mystery.",
    image: "/images/secrettunnel.png",
    exits: { exit1: "centralpark", exit2: "trentparkearth", exit3: "pollysbay", exit4: "resetroom", exit5: "elfhame", exit6: "maze1" },
    onEnter: null,
    items: null,
  },

  stkatherinesdock: {
    description: "You find yourself in St. Katherine's Dock. The air is thick with mystery.",
    image: "/images/stkatherinesdock.png",
    exits: { west: "centralpark" },
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
    items: null,
  },

  storagechamber: {
    description: "You find yourself in a storage chamber. The air is thick with mystery.",
    image: "/images/storagechamber.png",
    exits: { south: "centralpark" },
    onEnter: null,
    items: null,
  },

  // --- Additional Rooms ---
  // Add more rooms here following the same structure

  // Example:
  // roomName: {
  //   description: "Room description here.",
  //   image: "/path/to/image.png",
  //   exits: { direction: "targetRoom" },
  //   onEnter: (engine) => { /* custom logic */ },
  //   items: null,
  // },
};
