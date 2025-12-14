// Centralized room id constants. Keep internal ids stable here.
export const CAFE_ROOM_ID = 'cafe_main';

// Optional compatibility mapping (not used by default). If content/commands
// refer to the short name 'cafe', map it here at the router/command boundary.
export const ROOM_ALIASES: Record<string, string> = {
  cafe: CAFE_ROOM_ID,
  // compatibility: test fixtures and older content sometimes use 'control_nexus'
  // while the canonical id used in state is 'controlnexus'. Map common variants here.
  control_nexus: 'controlnexus',
  controlnexus: 'controlnexus',
};
