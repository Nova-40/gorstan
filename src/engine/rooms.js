// Gorstan Game Module — v3.0.0
// 📦 /src/engine/rooms.js
// Gorstan Room Aggregator: Collects and validates all modular rooms from zone files

import elfhameRooms from "../zones/elfhameRooms.js";
import glitchRooms from "../zones/glitchRooms.js";
import gorstanRooms from "../zones/gorstanRooms.js";
import internalResetRooms from "../zones/resetroom.js";
import introRooms from "../zones/introRooms.js";
import latticeRooms from "../zones/latticeRooms.js";
import londonRooms from "../zones/londonRooms.js";
import mazeRooms from "../zones/mazeRooms.js";
import multiplezonesRooms from "../zones/multiplezonesRooms.js";
import newyorkRooms from "../zones/newyorkRooms.js";
import offgorstanRooms from "../zones/offgorstanRooms.js";
import offmultiverseRooms from "../zones/offmultiverseRooms.js";
import prewelcomeRooms from "../zones/prewelcomeRooms.js";
import stantonharcourtRooms from "../zones/stantonharcourtRooms.js";
import resetRoom from '../zones/resetRoom.js';

// 🧩 Combine all rooms
const allRooms = {
  ...elfhameRooms,
  ...glitchRooms,
  ...gorstanRooms,
    ...introRooms,
  ...latticeRooms,
  ...londonRooms,
  ...mazeRooms,
  ...multiplezonesRooms,
  ...newyorkRooms,
  ...offgorstanRooms,
  ...offmultiverseRooms,
  ...prewelcomeRooms,
  ...stantonharcourtRooms,
  ...resetRoom
};

// ✅ Validate Room Structure
function validateRooms(rooms) {
  const errors = [];
  const roomKeys = Object.keys(rooms);

  roomKeys.forEach(key => {
    const room = rooms[key];
    if (!room.id) errors.push(`${key} missing id`);
    if (!room.name) errors.push(`${key} missing name`);
    if (!room.description) errors.push(`${key} missing description`);
    if (!room.exits || typeof room.exits !== "object") {
      errors.push(`${key} has invalid or missing exits`);
    } else {
      Object.values(room.exits).forEach(exit => {
        if (!rooms[exit]) errors.push(`${key} → exit to unknown room: ${exit}`);
      });
    }
    if (!room.descriptionReturn) {
      room.descriptionReturn = `You return to ${room.name}.`;
    }
  });

  if (errors.length > 0) {
    console.warn("⚠️ Room validation errors:\n", errors.join("\n"));
  } else {
    console.log("✅ All rooms passed validation.");
  }
}

// Run validation on game start
validateRooms(allRooms);

// 🚀 Export for use in GameEngine
export default allRooms;