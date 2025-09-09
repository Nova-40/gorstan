/**
 * Demo allowlist - curated rooms for the 10-15 minute demo experience
 * Journey: Control Nexus → Crossing Hub → Faeglade tour → Set piece conclusion
 */
export const DEMO_ROOM_IDS = new Set<string>([
  // Starting sequence
  'controlnexus',
  'crossing',

  // Faeglade tour (main demo zone)
  'elfhame',
  'faeglade',
  'faelake',
  'faelakenorthshore',

  // Set piece finale
  'faepalacemainhall',
  'faepalacerhianonsroom',

  // Emergency/utility rooms
  'introreset',
  'liminalhub', // Fallback hub
]);

/**
 * Get all rooms allowed in demo mode
 */
export function getDemoAllowedRooms(): Set<string> {
  return DEMO_ROOM_IDS;
}

/**
 * Check if a room is allowed in demo mode
 */
export function isRoomAllowedInDemo(roomId: string): boolean {
  return DEMO_ROOM_IDS.has(roomId);
}

/**
 * Demo journey suggestion for optimal experience
 */
export const DEMO_SUGGESTED_PATH = [
  'controlnexus',
  'crossing',
  'elfhame',
  'faeglade',
  'faelake',
  'faepalacemainhall',
  'faepalacerhianonsroom',
] as const;

/**
 * Get tooltip message for disabled exits in demo
 */
export function getDemoBlockMessage(): string {
  return 'Available in the full game';
}
