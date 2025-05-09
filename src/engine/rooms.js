// Rooms Configuration
// This file defines the rooms in the Gorstan game world.
// Each room includes a description, exits to other rooms, optional images, and interactive items.

// MIT License Copyright (c) 2025 Geoff Webster

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
    exits: { west: "crossing", east: "hiddenlab", north: "centralpark" },
  },
  hiddenlab: {
    description: "Flickering lights. Scattered notes. A forgotten research facility.",
    image: "/images/hiddenlab.png",
    exits: { west: "controlnexus", down: "arbitercore" },
  },
  controlroom: {
    description: "A secured room with monitors and override levers.",
    image: "/images/controlroom.png",
    exits: { north: "controlnexus" },
  },

  // --- Endgame (Stanton Harcourt) ---
  stantonharcourt: {
    description: "The past and future converge here in a quiet village... for now.",
    image: "/images/stantonharcourt.png",
    exits: {},
  },

  // --- London Phase ---
  findlaterscornercafe: {
    description: "A quiet London café with the scent of burnt beans and destiny.",
    image: "/images/findlaterscornercafe.png",
    exits: { east: "cafeoffice" },
  },
  cafeoffice: {
    description: "An office above the café filled with charts and whispers.",
    image: "/images/cafeoffice.png",
    exits: { west: "findlaterscornercafe", south: "trentparkearth" },
  },
  trentparkearth: {
    description: "Trees watch you. The portal is near.",
    image: "/images/trentparkearth.png",
    exits: { east: "dalesapartment" },
  },
  dalesapartment: {
    description: "Stacks of notes and a flickering monitor. Dale was here.",
    image: "/images/dalesapartment.png",
    exits: { east: "stkatherinesdock" },
  },
  stkatherinesdock: {
    description: "A London dock with whispers of a portal shimmering in the canal.",
    image: "/images/stkatherinesdock.png",
    exits: { portal: "centralpark" },
  },

  // --- New York Phase ---
  centralpark: {
    description: "An overgrown green with ancient benches and dimensional ripples.",
    image: "/images/centralpark.png",
    exits: (state) => {
      const exits = { south: "controlnexus", east: "burgerjoint", west: "aevirawarehouse" };
      const flags = state?.storyFlags || new Set();
      if (flags.has("coffeeThrown") || state.inventory?.includes("medallion")) {
        exits.down = "hiddenstore";
      }
      return exits;
    },
  },
  burgerjoint: {
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
    description: "Shelves of junk and a napkin that shouldn't exist.",
    image: "/images/greasystoreroom.png",
    exits: { out: "burgerjoint" },
    items: {
      greasyNapkin: {
        name: "greasy napkin",
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
        name: "gold coin",
        description: "A shiny coin from another time.",
        canPickup: true,
      },
    },
  },
};