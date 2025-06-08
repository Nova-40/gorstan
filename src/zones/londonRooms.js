// Gorstan Game Module — v3.0.0
const rooms = {
  room12: {
    id: "room12",
    name: "Café Office",
    zone: "london",
    description: "Café Office waits quietly, too quietly.",
    onReturnDescription: "The office feels both familiar and impossibly distant.",
    image: "cafeoffice.png",
    exits: {
    },
  },
  room13: {
    id: "room13",
    name: "Dale's Apartment",
    zone: "london",
    description: "Faint echoes of footsteps linger longer than they should in Dale's Apartment.",
    onReturnDescription: "You sense Dale's presence lingers, even when he's gone.",
    image: "dalesapartment.png",
    exits: { east: "room14" },
  },
  room14: {
    id: "room14",
    name: "Findlaters Corner Coffee Shop",
    zone: "london",
    description: "Findlaters Corner Coffee Shop waits quietly, too quietly.",
    onReturnDescription: "The aroma of coffee and the murmur of lost conversations fill the air.",
    image: "findlaterscornercafe.png",
    exits: { south: "room15", west:"room12" },
  },
  room15: {
    id: "room15",
    name: "St Katherines Dock",
    zone: "london",
    description: "St Katherines Dock feels both familiar and wrong.",
    onReturnDescription: "The water laps quietly, reflecting a fractured sky.",
    image: "stkatherinesdock.png",
    exits: { west: "room16", east: "room12", north: "room14", jump: "room19" },
  },
  room16: {
    id: "room16",
    name: "Trent Park",
    zone: "london",
    description: "Trees sway in the distance as you regain balance. That chair was something else.",
    onReturnDescription: "Back at Trent Park. Maybe walk it off?",
    exits: { east: "room15" },
    image: "trentpark.png",
    onSay: (text, state, dispatch) => {
      if (text.includes("sit")) {
        dispatch({ type: "LOG", payload: "You rest a moment before returning." });
        dispatch({ type: "SET_ROOM", payload: "resetroom" });
      }
    },
  }
};

export default rooms;