// Rooms Configuration
// This file defines the rooms in the Gorstan game world.
// Each room includes a description, exits to other rooms, optional images, and interactive items.

export const rooms = {
  // Aevira Warehouse
  aevirawarehouse: {
    description: "Rows of forgotten crates and a lingering smell of old paper fill the massive Aevira Warehouse.",
    exits: { west: "centralpark", east: "ancientvault" },
    image: "/images/aevirawarehouse.png",
  },

  // Ancient Vault
  ancientvault: {
    description: "Heavy stone doors and ancient glyphs hint at forgotten powers.",
    exits: { west: "aevirawarehouse", east: "arbitercore" },
    image: "/images/ancientvault.png",
  },

  // Arbiter Core
  arbitercore: {
    description: "The heart of judgement: an ancient machine hums faintly.",
    exits: { west: "ancientvault" },
    image: "/images/arbitercore.png",
  },

  // Burger Joint
  burgerjoint: {
    description: "An old-fashioned burger joint. The chef eyes you with a knowing smile.",
    image: "/images/burgerjoint.png",
    exits: { south: "centralpark" },
  },

  // Cafe Office
  cafeoffice: {
    description: "A side office behind Findlater’s Café.",
    exits: { south: "findlaterscornercafe" },
    image: "/images/cafeoffice.png",
  },

  // Carron Spire
  carronspire: {
    description: "A jagged mountain spire under a cold, alien sky.",
    exits: { south: "faelake" },
    image: "/images/carronspire.png",
  },

  // Central Park
  centralpark: {
    description: "You are standing in the heart of Central Park. There is a strange sense that something is hidden beneath your feet.",
    image: "/images/centralpark.png",
    exits: { north: "burgerjoint", east: "aevirawarehouse", down: "glitchroom" },
  },

  // Control Nexus
  controlnexus: {
    description: "The Control Nexus: A swirling vortex of broken commands and abandoned authority.",
    exits: { south: "hiddenlab" },
    image: "/images/controlnexus.png",
  },

  // Control Nexus Returned
  controlnexusreturned: {
    description: "The same Nexus... changed. Scarred by your presence.",
    exits: { north: "controlnexus" },
    image: "/images/controlnexusreturned.png",
  },

  // Control Room
  controlroom: {
    description: "Banks of blinking panels dominate the Control Room.",
    exits: { south: "hiddenlab", west: "resetroom" },
    image: "/images/controlroom.png",
  },

  // Dale's Apartment
  dalesapartment: {
    description: "Dale's apartment — a safe place, for now.",
    exits: { north: "findlaterscornercafe" },
    image: "/images/dalesapartment.png",
  },

  // Faelake
  faelake: {
    description: "Still waters reflect impossible constellations.",
    exits: { north: "carronspire" },
    image: "/images/faelake.png",
  },

  // Findlater's Corner Café
  findlaterscornercafe: {
    description: "Findlater's Corner Café: The smell of pastries battles the London smog.",
    exits: { north: "cafeoffice", south: "dalesapartment" },
    image: "/images/findlaterscornercafe.png",
  },

  // Forgotten Chamber
  forgottenchamber: {
    description: "A lost chamber beyond normal space.",
    exits: { south: "storagechamber", north: "caveofechoes" },
    image: "/images/forgottenchamber.png",
  },

  // Glitch Realm
  glitchrealm: {
    description: "The glitch thickens, breaking everything.",
    exits: { south: "glitchroom", east: "lucidveil" },
    image: "/images/glitchrealm.png",
  },

  // Glitch Room
  glitchroom: {
    description: "Reality flickers here. Dangerous.",
    exits: { north: "pollysbay", east: "primeconfluence" },
    image: "/images/glitchroom.png",
  },

  greasystoreroom: {
    description: (state) => {
      if (state.flags.foundNapkin) {
        return "You stand in the greasy storeroom again. The smell is no better, but you’ve already taken the strange napkin.";
      }
      return "It’s dark, humid, and coated in an oily film. Shelves are stacked with expired tins and odd tools. A suspiciously folded napkin lies on a crate.";
    },
    image: "/images/greasystoreroom.png",
    exits: {
      west: "burgerjoint"
    },
    items: (state) => {
      if (state.flags.foundNapkin) return {};
      return {
        greasyNapkin: {
          name: "greasy napkin",
          description: "A soggy, slightly disgusting napkin... wait — there’s a faint sketch of something... it looks like a lattice.",
          canPickup: true,
          onPickup: (game) => {
            game.setFlag("foundNapkin");
            game.addItem("greasyNapkin");
            game.output("You carefully unfold the napkin and realise it’s a crude blueprint of the Lattice. The ink is smudged, but unmistakable.");
          }
        }
      };
    }
  },
  
  latticeroom: {
    description: (state) => {
      if (state.flags.activatedLattice) {
        return "The Lattice pulses more rapidly now. You feel its awareness. It is... listening.";
      }
      if (state.inventory?.includes("greasyNapkin")) {
        return "You recognise the structure from the napkin sketch — this is the Lattice. Its angles shimmer, waiting for input.";
      }
      return "A massive geometric form floats before you. Its angles bend reality. You feel like it’s watching you, judging your presence.";
    },
    image: "/images/latticeroom.png",
    exits: {
      back: "hiddenlibrary"
    },
    onSay: (msg, state) => {
      if (msg.toLowerCase() === "activate lattice" && state.inventory?.includes("greasyNapkin")) {
        state.flags.activatedLattice = true;
        return "You hold up the napkin. The Lattice shifts — subtly — and you hear a deep chime within your bones. It accepts you.";
      }
      if (msg.toLowerCase() === "activate lattice") {
        return "Nothing happens. The Lattice does not respond.";
      }
    },
    onEnter: (state) => {
      if (!state.flags.seenLattice) {
        state.flags.seenLattice = true;
        state.output?.("The Lattice dominates the space, humming with latent energy.");
      }
    }
  },
  
  // Hallucination Room
  hallucinationroom: {
    description: "The walls drip like wax. You cannot trust your senses here.",
    exits: { west: "lucidveil" },
    image: "/images/hallucinationroom.png",
  },

  // Hidden Lab
  hiddenlab: {
    description: "A hidden lab, whirring quietly.",
    exits: { north: "controlroom" },
    image: "/images/hiddenlab.png",
  },

  // Hidden Library
  hiddenlibrary: {
    description: "Shelves stretch into the shadows. A silent archivist watches.",
    exits: { south: "observationsuite", north: "storagechamber", east: "latticeroom"},
    image: "/images/hiddenlibrary.png",
  },

  // Intro Jump
  introjump: {
    description: "You fall through a shimmering portal, light cascading around you.",
    image: "/images/introjump.png",
    exits: { down: "controlnexus" },
    onEnter: (state) => {
      state.flags.fell = true;
    },
  },

  // Intro Reset
  introreset: {
    description: "Reality twists and reforms around you. Everything resets, ready to begin anew.",
    image: "/images/introreset.png",
    exits: { restart: "introstreet1" },
    onEnter: (game) => {
      game.resetInventory();
      game.storyFlags.clear();
      game.currentRoom = "introstreet1";
    },
  },

  // Intro Splat
  introsplat: {
    description: "SPLAT. You feel... very flat. Maybe try again?",
    image: "/images/introsplat.png",
    exits: {},
    onEnter: (state) => {
      state.flags.splatted = true;
      if (typeof Audio !== "undefined") new Audio("/splat.mp3").play();
    },
  },

  // Intro Street 1
  introstreet1: {
    description: "A dimly lit street. The air hums. You feel watched.",
    image: "/images/introstreet1.png",
    exits: { forward: "introstreet2" },
  },

  // Intro Street 2
  introstreet2: {
    description: (state) => {
      const { waited, jumped } = state.flags || {};
      if (jumped) return "You already jumped. The truck is gone, the air still crackles.";
      if (waited) return "You waited too long. The truck hit you. It’s... over.";
      return "The truck is coming fast. You must decide: 'jump' or 'wait'.";
    },
    image: "/images/introstreet2.png",
    exits: (state) => {
      const { jumped, waited } = state.flags || {};
      if (jumped) return { east: "introjump" };
      if (waited) return { restart: "introsplat" };
      return {};
    },
    onEnter: (game) => {
      if (!game.storyFlags.has("introStartTime")) {
        game.storyFlags.add("introStartTime");
        game.introStartTime = Date.now();
      } else {
        const elapsed = Date.now() - game.introStartTime;
        if (elapsed > 8000 && !game.flags?.jumped && !game.flags?.waited) {
          game.setFlag("waited");
          game.currentRoom = "introsplat";
        }
      }
    },
    onSay: (msg, state) => {
      if (msg === "jump") {
        state.flags.jumped = true;
        return "You leap just in time — the truck roars behind you as you vanish into a glowing rift.";
      }
      if (msg === "wait") {
        state.flags.waited = true;
        return "You wait. You freeze. That was the wrong choice.";
      }
    },
  },

  // Observation Suite
  observationsuite: {
    description: "A massive glass dome stares into unknown skies.",
    exits: { west: "pollysbay", north: "hiddenlibrary" },
    image: "/images/observationsuite.png",
  },

  // Polly's Bay
  pollysbay: {
    description: "An interrogation bay. Polly’s laughter echoes endlessly.",
    exits: { south: "glitchroom", east: "observationsuite" },
    image: "/images/pollysbay.png",
  },

  // Prime Confluence
  primeconfluence: {
    description: "Streams of possibility converge into a single roaring current.",
    exits: { west: "glitchroom" },
    image: "/images/primeconfluence.png",
  },

  // Reset Room
  resetroom: {
    description: 'An enormous blue button pulses gently at the center. A sign reads: "Do Not Push".',
    exits: { east: "controlroom" },
    image: "/images/resetroom.png",
  },

  // Rhiannon's Chamber
  rhianonschamber: {
    description: "The chamber of Rhiannon — quiet, sacred, and strangely heavy.",
    exits: { west: "primeconfluence" },
    image: "/images/rhianonschamber.png",
  },

  // Secret Tunnel
  secrettunnel: {
    description: "A secret tunnel, rough and ancient, leading who-knows-where.",
    exits: { north: "centralpark", south: "forgottenchamber" },
    image: "/images/secrettunnel.png",
  },

  // Storage Chamber
  storagechamber: {
    description: "Stacks of ancient, dusty tomes and games long forgotten.",
    exits: { south: "hiddenlibrary", north: "forgottenchamber" },
    image: "/images/storagechamber.png",
  },

  // Torridon After
  torridonafter: {
    description: "After the cataclysm: Torridon lies broken and bleeding.",
    exits: { west: "torridonbefore" },
    image: "/images/torridonafter.png",
  },

  // Torridon Before
  torridonbefore: {
    description: "Before the cataclysm: a peaceful, eerie version of Torridon.",
    exits: { west: "torridoninn", east: "torridonafter" },
    image: "/images/torridonbefore.png",
  },

  // Torridon Inn
  torridoninn: {
    description: "The Torridon Inn, quiet and mist-shrouded.",
    exits: { east: "torridonbefore" },
    image: "/images/torridoninn.png",
  },

  // Trent Park Earth
  trentparkearth: {
    description: "Back on Earth: Trent Park, quiet and still.",
    exits: { west: "crossing" },
    image: "/images/trentparkearth.png",
  },
};

/**
 * Retrieves the description of a room.
 * @param {string} roomName - The name of the room.
 * @param {object} state - The current game state.
 * @returns {string} - The room description or an error message if the room is invalid.
 */
export function getRoomDescription(roomName, state) {
  try {
    if (!rooms[roomName]) {
      console.warn(`[Rooms] Room "${roomName}" not found. Redirecting to fallback.`);
      return "This room does not exist. You feel lost.";
    }
    const room = rooms[roomName];
    return typeof room.description === "function" ? room.description(state) : room.description;
  } catch (err) {
    console.error("❌ Error retrieving room description:", err);
    return "An error occurred while retrieving the room description.";
  }
}

/**
 * Retrieves the exits of a room.
 * @param {string} roomName - The name of the room.
 * @param {object} state - The current game state.
 * @returns {object} - The room exits or an empty object if the room is invalid.
 */
export function getRoomExits(roomName, state) {
  try {
    if (!rooms[roomName]) {
      console.warn(`[Rooms] Room "${roomName}" not found. Returning empty exits.`);
      return {};
    }
    const room = rooms[roomName];
    return typeof room.exits === "function" ? room.exits(state) : room.exits || {};
  } catch (err) {
    console.error("❌ Error retrieving room exits:", err);
    return {};
  }
}


