// Rooms Configuration code is MIT licenced and is part of the Gorstan game engine.
// This file defines the rooms in the Gorstan ((c) 2025 Geoff Webster) game world.
// Each room includes a description, exits to other rooms, optional images, and interactive items.
// Utility functions are provided to interact with the room data and handle errors gracefully.

export const rooms = {
  // Example Room: Intro Street
  introstreet1: {
    description: "A dimly lit street. The air hums. You feel watched.",
    image: "/images/introstreet1.png",
    exits: { forward: "introcrossing" },
  },

  // Example Room: Intro Crossing
  introcrossing: {
    description: (state) => {
      const { waited, jumped } = state.flags || {};
      if (jumped) return "You already jumped. The truck is gone, the air still crackles.";
      if (waited) return "You waited too long. The truck hit you. It’s... over.";
      return "The truck is coming fast. You must decide: 'jump' or 'wait'.";
    },
    image: "/images/crossing.png",
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

  // Example Room: Intro Splat
  introsplat: {
    description: "SPLAT. You feel... very flat. Maybe try again?",
    image: "/images/introsplat.png",
    exits: {},
    onEnter: (state) => {
      state.flags.splatted = true;
      if (typeof Audio !== "undefined") new Audio("/splat.mp3").play();
    },
  },

  // Example Room: Intro Jump
  introjump: {
    description: "You fall through a shimmering portal, light cascading around you.",
    image: "/images/introjump.png",
    exits: { down: "controlnexus" },
    onEnter: (state) => {
      state.flags.fell = true;
    },
  },

  // Example Room: Central Park
  centralpark: {
    description: "You are standing in the heart of Central Park. There is a strange sense that something is hidden beneath your feet.",
    image: "/images/centralpark.png",
    exits: { north: "burgerjoint", east: "aevirawarehouse" },
  },

  // Example Room: Burger Joint
  burgerjoint: {
    description: "An old-fashioned burger joint. The chef eyes you with a knowing smile.",
    image: "/images/burgerjoint.png",
    exits: { south: "centralpark" },
  },

  // Additional rooms...
  // Add more rooms here following the same structure
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

/**
 * Retrieves the items in a room.
 * @param {string} roomName - The name of the room.
 * @param {object} state - The current game state.
 * @returns {object} - The room items or an empty object if the room is invalid.
 */
export function getRoomItems(roomName, state) {
  try {
    if (!rooms[roomName]) {
      console.warn(`[Rooms] Room "${roomName}" not found. Returning empty items.`);
      return {};
    }
    const room = rooms[roomName];
    return typeof room.items === "function" ? room.items(state) : room.items || {};
  } catch (err) {
    console.error("❌ Error retrieving room items:", err);
    return {};
  }
}

/**
 * Retrieves the image associated with a room.
 * @param {string} roomName - The name of the room.
 * @returns {string|null} - The room image URL or null if no image is defined.
 */
export function getRoomImage(roomName) {
  try {
    if (!rooms[roomName]) {
      console.warn(`[Rooms] Room "${roomName}" not found. Returning null for image.`);
      return null;
    }
    return rooms[roomName].image || null;
  } catch (err) {
    console.error("❌ Error retrieving room image:", err);
    return null;
  }
}


