// Gorstan Game Module — v2.8.3
// MIT License © 2025 Geoff Webster
// GameContext.js — React context for shared game state across components

import React, { createContext, useContext, useState } from "react";

/**
 * GameContext
 * Provides global access to player inventory, score, traits, god mode, and related setters.
 * @type {React.Context<{
 *   inventory: string[],
 *   setInventory: function,
 *   score: number,
 *   setScore: function,
 *   traits: string[],
 *   setTraits: function,
 *   godMode: boolean,
 *   toggleGodMode: function
 * }>}
 */
const GameContext = createContext(null);

/**
 * GameProvider
 * Wraps children with game state context for inventory, score, traits, and god mode.
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to receive game context.
 * @returns {JSX.Element}
 */
export const GameProvider = ({ children }) => {
  // === State Variables ===
  /** @type {[string[], function]} */
  const [inventory, setInventory] = useState(["coffee"]);
  /** @type {[number, function]} */
  const [score, setScore] = useState(0);
  /** @type {[string[], function]} */
  const [traits, setTraits] = useState([]);
  /** @type {[boolean, function]} */
  const [godMode, setGodMode] = useState(false);

  /**
   * Toggles god mode on/off.
   */
  const toggleGodMode = () => setGodMode((prev) => !prev);

  // Defensive: Optionally, add error boundaries or fallback UI here if needed

  return (
    <GameContext.Provider
      value={{
        inventory,
        setInventory,
        score,
        setScore,
        traits,
        setTraits,
        godMode,
        toggleGodMode
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  /** Child components to receive game context */
  children: (props, propName, componentName) => {
    if (!props[propName]) {
      return new Error(`${componentName} requires children`);
    }
    return null;
  }
};

/**
 * useGameContext
 * Custom hook to access the game context.
 * Throws an error if used outside a GameProvider.
 * @returns {Object} The game context value.
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    // Defensive: Ensure hook is used within a provider
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for context, provider, hook, props, and state.
- ✅ Defensive error handling for context usage.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Consider persisting state to localStorage for session continuity.
*/
