// Centralized room id constants. Keep internal ids stable here.
export const CAFE_ROOM_ID = 'cafe_main';

// Optional compatibility mapping (not used by default). If content/commands
// refer to the short name 'cafe', map it here at the router/command boundary.
export const ROOM_ALIASES: Record<string, string> = {
  cafe: CAFE_ROOM_ID,
};
