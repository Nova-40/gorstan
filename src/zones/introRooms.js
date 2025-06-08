// Gorstan Game Module — v3.0.0
const rooms = {
  introStart: {
    id: "introStart",
    name: "Intro Start",
    zone: "intro",
    description: "Intro Start frames the start of everything — or nothing.",
    onReturnDescription: "You feel the weight of your choices as you return to the beginning.",
    image: "introstart.png",
    exits: {
    },
  },
  introJump: {
    id: "introJump",
    name: "Intro Jump",
    zone: "intro",
    description: "A decision lingers in the air of Intro Jump.",
    onReturnDescription: "You recall the leap you took, and the world seems to hold its breath.",
    image: "introjump.png",
    exits: {
    },
  },
  introReset: {
    id: "introReset",
    name: "Intro Reset",
    zone: "intro",
    description: "Shadows stretch long at the edge of Intro Reset.",
    onReturnDescription: "The cycle begins anew, but something feels different.",
    image: "introreset.png",
    exits: {
    },
  },
  introSplat: {
    id: "introSplat",
    name: "Intro Splat",
    zone: "intro",
    description: "Intro Splat welcomes you, uncertain but inevitable.",
    onReturnDescription: "You remember the impact, but reality is flexible here.",
    image: "introsplat.png",
    exits: {
    },
  },
  introStreet1: {
    id: "introStreet1",
    name: "Intro Street 1",
    zone: "intro",
    description: "Intro Street 1 welcomes you, uncertain but inevitable.",
    onReturnDescription: "The street feels both familiar and strange.",
    image: "introstreet1.png",
    exits: {
    },
  },
  introStreet2: {
    id: "introStreet2",
    name: "Intro Street 2",
    zone: "intro",
    description: "A decision lingers in the air of Intro Street 2.",
    onReturnDescription: "You walk the street again, but the air is different.",
    image: "introstreet2.png",
    exits: {
    },
  },
  introAfter: {
    id: "introAfter",
    name: "Intro After",
    zone: "intro",
    description: "Shadows stretch long at the edge of Intro After.",
    onReturnDescription: "You have crossed the threshold; the world awaits.",
    image: "introstreetclear.png",
    exits: {
    },
  },
};

export default rooms;