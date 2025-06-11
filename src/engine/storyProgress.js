// Gorstan Game Module — v3.0.0

// storyProgress.js — v2.8.2
// Manages player traits, flags, and milestone events using reducer pattern
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

// storyProgress.js — trait management functions (insert at the bottom)

export const gainTrait = (trait, state, dispatch) => {
  if (!state.traits.includes(trait)) {
    dispatch({ type: "GAIN_TRAIT", payload: trait });
  }
};

export const checkTraitUnlocks = (state, dispatch) => {
  import("./traits").then(module => {
    module.default.forEach(trait => {
      if (trait.unlockCondition && trait.unlockCondition(state)) {
        gainTrait(trait.name, state, dispatch);
      }
    });
  });
};

export const hasFlag = (state, flag) => {
  return state.flags?.includes(flag);
};

export const setFlag = (dispatch, flag) => {
  dispatch({ type: 'SET_FLAG', payload: flag });
};


// Reset function for storyProgress — used in AppCore to restart state
export const reset = () => {
  console.log("Story progress reset."); // Extend as needed
};