// MIT License
// Gorstan Game v3.0.5 – Room Utility
// getRoomById – Find a room by ID in the rooms array

/**
 * Returns a room object by ID.
 * @param {string} id - The room ID to find
 * @param {Array} rooms - The full list of rooms
 * @returns {Object|null} - Room object or null
 */
const getRoomById = (id, rooms) => {
  return rooms.find(room => room.id === id) || null;
};

export default getRoomById;
