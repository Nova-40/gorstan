// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// GameContext.js — React context for shared game state across components

import React, { createContext, useContext, useState } from "react";

/**
 * GameContext
 * Provides global access to player inventory, score, traits, and game flags.
 */

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [inventory, setInventory] = useState(["coffee"]);
  const [score, setScore] = useState(0);
  const [traits, setTraits] = useState([]);
  const [godMode, setGodMode] = useState(false);

  const toggleGodMode = () => setGodMode((prev) => !prev);

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

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
