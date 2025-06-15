
// rooms.js – Gorstan v3 JSON-based loader
// MIT License © 2025 Geoff Webster

const roomMap = new Map();

/**
 * Dynamically loads all zone JSON files and populates the room map
 * @returns {Promise<void>}
 */
export async function loadAllRooms() {
  const zoneFiles = import.meta.glob('../zones/*.json');

  for (const path in zoneFiles) {
    const module = await zoneFiles[path]();
    const rooms = module.rooms || [];
    rooms.forEach(room => {
      if (!room.id) {
        console.warn(`Room missing ID in file ${path}`);
        return;
      }
      roomMap.set(room.id, room);
    });
  }
}

/**
 * Returns a room object by its ID
 * @param {string} id
 * @returns {object|null}
 */
export function getRoomById(id) {
  return roomMap.get(id) || null;
}

/**
 * Returns all rooms as an array
 * @returns {Array}
 */
export function getAllRooms() {
  return Array.from(roomMap.values());
}

/**
 * Returns all rooms in a given zone
 * @param {string} zoneName
 * @returns {Array}
 */
export function getRoomsByZone(zoneName) {
  return Array.from(roomMap.values()).filter(r => r.id.startsWith(zoneName));
}
