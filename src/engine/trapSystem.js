
// trapSystem.js — v2.8.2
// Manages trap seeding, triggering, detection, and defusing

let activeTraps = {};
let disarmedTraps = {};
let trapTimers = {};
let trapSeededRooms = [];

export const seedTraps = (roomList, debug = false) => {
  const allRoomIds = Object.keys(roomList);
  const trapCount = debug ? 0 : Math.floor(allRoomIds.length / 6); // 1 in 6 rooms
  const chosenRooms = [];

  while (chosenRooms.length < trapCount) {
    const candidate = allRoomIds[Math.floor(Math.random() * allRoomIds.length)];
    if (!chosenRooms.includes(candidate)) {
      chosenRooms.push(candidate);
    }
  }

  trapSeededRooms = chosenRooms;
  activeTraps = chosenRooms.reduce((acc, roomId) => {
    acc[roomId] = true;
    return acc;
  }, {});
};

export const checkForTrap = (roomId, state, dispatch) => {
  if (disarmedTraps[roomId]) return;

  if (activeTraps[roomId]) {
    const debugMode = state.flags?.debug;
    const curious = state.traits?.includes("curious");

    if (curious || debugMode) {
      dispatch({ type: "LOG", payload: "[Trap Warning] Something feels off here..." });
    }

    if (!trapTimers[roomId]) {
      trapTimers[roomId] = setTimeout(() => {
        if (state.room === roomId) {
          if (debugMode) {
            dispatch({ type: "LOG", payload: "[DEBUG] You triggered a trap... but it fizzles harmlessly." });
          } else {
            dispatch({ type: "LOG", payload: "💥 A hidden trap springs! You're overwhelmed and lose consciousness." });
            dispatch({ type: "MOVE", payload: { room: "centralpark" } }); // Safe fallback
          }
          delete trapTimers[roomId];
        }
      }, 3000); // 3s delay before triggering
    }
  }
};

export const defuseTrap = (roomId, dispatch) => {
  if (activeTraps[roomId]) {
    disarmedTraps[roomId] = true;
    delete activeTraps[roomId];
    dispatch({ type: "LOG", payload: `🧰 You carefully defuse the trap in ${roomId}.` });
  } else {
    dispatch({ type: "LOG", payload: "There's nothing to defuse here." });
  }
};

export const getTrapStatus = () => {
  return {
    active: Object.keys(activeTraps),
    disarmed: Object.keys(disarmedTraps)
  };
};
