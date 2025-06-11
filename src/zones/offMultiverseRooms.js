// Gorstan Game Module — v3.0.0
// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// offmultiverseRooms.js — Room definitions for the Off Multiverse zone

const offmultiverseRooms = {
  room8: {
    id: "room8",
    name: "Another Control Room",
    zone: "offMultiverse",
    description: "Another Control Room stands quietly, awaiting your next move.",
    onReturnDescription: "The hum of the machinery is familiar, yet something feels off.",
    exits: {},
    image: "controlnexus.png",
  },
  room9: {
    id: "room9",
    name: "Control Room 1",
    zone: "offMultiverse",
    description: "Control Room 1 stands quietly, awaiting your next move.",
    onReturnDescription: "The control panels flicker as you return.",
    exits: { north: "room10" },
    image: "controlnexus.png",
  },
  room10: {
    id: "room10",
    name: "Control Room 2",
    zone: "offMultiverse",
    description: "Control Room 2 stands quietly, awaiting your next move.",
    onReturnDescription: "You sense a faint echo of your previous visit.",
    exits: { north: "room49", south: "room9", east: "room11" },
    image: "controlnexusreturned.png",
  },
  room11: {
    id: "room11",
    name: "Danger - Hidden Lab",
    zone: "offMultiverse",
    description: "Danger - Hidden Lab stands quietly, awaiting your next move.",
    onReturnDescription: "The lab’s shadows seem deeper than before.",
    exits: {},
    image: "hiddenlab.png",
  },
  
};

export default offmultiverseRooms;