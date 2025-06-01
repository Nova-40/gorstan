
// storyProgress.js — v2.8.2
// Manages player traits, flags, and milestone events using reducer pattern

export const initialStoryState = {
  traits: [],
  flags: {},
  milestones: []
};

export const storyFlagsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRAIT":
      if (!state.traits.includes(action.payload)) {
        return { ...state, traits: [...state.traits, action.payload] };
      }
      return state;

    case "REMOVE_TRAIT":
      return {
        ...state,
        traits: state.traits.filter(t => t !== action.payload)
      };

    case "TOGGLE_FLAG":
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.payload]: !state.flags[action.payload]
        }
      };

    case "SET_FLAG":
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.payload.key]: action.payload.value
        }
      };

    case "CLEAR_FLAGS":
      return {
        ...state,
        flags: {}
      };

    case "ADD_MILESTONE":
      if (!state.milestones.includes(action.payload)) {
        return { ...state, milestones: [...state.milestones, action.payload] };
      }
      return state;

    default:
      return state;
  }
};

// Helper functions
export const hasTrait = (state, trait) => state.traits.includes(trait);
export const getFlag = (state, key) => state.flags[key] || false;
export const isMilestoneComplete = (state, milestone) => state.milestones.includes(milestone);
