// Gorstan Game Module — v3.2.0
// MIT License © 2025 Geoff Webster
// GameContext.jsx — React context for shared game state across components

import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import rooms from './rooms';

/**
 * Initial state for the Gorstan game.
 * @type {Object}
 */
export const initialState = {
  started: false,
  playerName: "",
  currentRoom: "controlnexus",
  inventory: [],
  score: 0,
  traits: [],
  resetCycles: 0,
  visitedRooms: [],
  puzzleLevel: 0,
  npcMemory: {},
  storyFlags: {},
  debugMode: false,
  godMode: false,
  skipInstructions: false,
  showStatus: false,
  showDebugHelp: false,
  stats: {
    health: 100,
    energy: 100,
    mood: 100
  },
  log: []
};

/**
 * Reducer for main game state.
 * Handles player name, traits, puzzle level, god/debug mode, and skip instructions.
 * @param {Object} state - Current game state.
 * @param {Object} action - Action object with type and payload.
 * @returns {Object} New game state.
 */
export function gameReducer(state, action) {
  switch (action.type) {
    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.payload };
    case "UPDATE_TRAITS":
      return { ...state, traits: [...new Set([...state.traits, ...action.payload])] };
    case "SET_PUZZLE_LEVEL":
      return { ...state, puzzleLevel: action.payload };
    case "ENABLE_GOD_MODE":
      return { ...state, debugMode: true, godMode: true };
    case "SET_ROOM":
      return { ...state, currentRoom: action.payload };
    case "SET_SKIP_INSTRUCTIONS":
      return { ...state, skipInstructions: action.payload };
    case "MOVE": {
      const currentRoom = rooms[state.currentRoom];
      const nextRoomId = currentRoom?.exits?.[action.payload];
      if (nextRoomId && rooms[nextRoomId]) {
        return {
          ...state,
          currentRoom: nextRoomId,
          log: [...state.log || [], `You move ${action.payload}.`],
          previousRoom: state.currentRoom
        };
      } else {
        return {
          ...state,
          log: [...state.log || [], "You can't go that way."]
        };
      }
    }
    case "SCORE":
      return { ...state, score: state.score + (action.payload || 0) };
    case "THROW_COFFEE":
      return {
        ...state,
        inventory: state.inventory.filter(item => item !== "coffee"),
        log: [...state.log || [], "You throw your Gorstan coffee with unexpected force."]
      };
    case "TOGGLE_STATUS_PANEL":
      return {
        ...state,
        showStatus: !state.showStatus
      };
    case "TOGGLE_DEBUG_HELP":
      return {
        ...state,
        showDebugHelp: !state.showDebugHelp
      };
    case "ADJUST_STATS":
      return {
        ...state,
        stats: {
          ...state.stats,
          ...Object.fromEntries(
            Object.entries(action.payload || {}).map(([key, val]) => [
              key,
              Math.max(0, (state.stats?.[key] || 0) + val)
            ])
          )
        }
      };
    case "LOG":
      return {
        ...state,
        log: [...state.log || [], action.payload]
      };
    default:
      return state;
  }
}

/**
 * GameContext
 * Provides global access to game state and dispatch.
 * @type {React.Context<{state: Object, dispatch: function}>}
 */
export const GameContext = createContext();

/**
 * GameStateProvider
 * Wraps children with game state context using useReducer.
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to receive game context.
 * @returns {JSX.Element}
 */
export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

GameStateProvider.propTypes = {
  /** Child components to receive game context */
  children: PropTypes.node.isRequired,
};

/**
 * useGameContext
 * Custom hook to access the game context.
 * Throws an error if used outside a GameStateProvider.
 * @returns {{state: Object, dispatch: function}} The game context value.
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    // Defensive: Ensure hook is used within a provider
    throw new Error("useGameContext must be used within a GameStateProvider");
  }
  return context;
};
