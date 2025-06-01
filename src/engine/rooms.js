
// rooms.js — v2.8.2
// Defines rooms, exits, images, hidden paths, and items

const rooms = {
  controlnexus: {
    id: "controlnexus",
    name: "Control Nexus",
    description: "A vast hexagonal room with a console at the center. The air hums with potential.",
    altDescription: "You've returned to the Control Nexus. The console still hums.",
    image: "controlnexus.png",
    exits: {
      north: "controlroom",
      south: "centralpark"
    },
    hiddenExits: ["east"],
    items: ["coffee"],
    flags: ["start"]
  },
  controlroom: {
    id: "controlroom",
    name: "Control Room",
    description: "Banks of flickering monitors line the walls. One shows a street outside.",
    image: "controlroom.png",
    exits: {
      south: "controlnexus"
    },
    traps: true
  },
  centralpark: {
    id: "centralpark",
    name: "Central Park",
    description: "A simulated park environment under a glass dome. A bench waits.",
    altDescription: "The park feels different, like someone is watching.",
    image: "centralpark.png",
    exits: {
      north: "controlnexus",
      west: "cafeoffice"
    },
    items: ["map"]
  },
  cafeoffice: {
    id: "cafeoffice",
    name: "Findlater's Café",
    description: "A quiet café filled with memory. Someone left a note on the counter.",
    image: "cafeoffice.png",
    exits: {
      east: "centralpark"
    },
    items: ["foldedNote"]
  }
};

export default rooms;
