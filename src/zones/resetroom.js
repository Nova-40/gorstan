// Gorstan Game Module — v3.0.0
const resetroom = {
  room49: {
    id: "room49",
    name: "Reset Room",
    zone: "offMultiverse",
    description: "An ominous room stands quietly, awaiting your next move. There is a Chair here and a large blue button",
    onReturnDescription: "The reset mechanism hums, ready for another cycle.",
    exits: { north: "room8", south: "room9" },
    image: "resetroom.png",
    onEnter: (state, dispatch) => {
      dispatch({ type: "SHOW_RESET_BUTTON" });
    },
    objects: {
      chair: {
        name: "chair",
        description: "A vast chamber with a single glowing blue button on a pedestal. Your reflection stares back from the polished floor.",
        interact: "You sit in the chair. It reclines slightly with a pneumatic hiss.",
      },
    },
  }
};

export default resetroom;
