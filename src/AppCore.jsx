/**
 * File: src/AppCore.jsx
 * Gorstan Game – v3.1.0
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: App core logic, loads all zones and passes rooms to GameEngine.
 */

import React, { useState, useEffect } from 'react';
import GameEngine from './engine/GameEngine';
import loadAllRooms from './engine/roomLoader'; // Make sure roomLoader.js exists in src/engine

const AppCore = () => {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const load = async () => {
      const loadedRooms = await loadAllRooms();
      setRooms(loadedRooms);
    };
    load();
  }, []);

  if (!rooms) {
    return <div className="text-center p-4">Loading world data...</div>;
  }

  return <GameEngine rooms={rooms} />;
};

export default AppCore;


