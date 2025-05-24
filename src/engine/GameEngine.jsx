// GameEngine.jsx
// Gorstan v2.4.1 – Error-safe engine core
// MIT License © 2025 Geoff Webster

import React, { useEffect, useState } from 'react';
import { rooms } from './rooms';
import { parseCommand } from './commandParser';
import StatusPanel from '../components/StatusPanel';

/**
 * Core game loop component.
 * Handles room transitions, command parsing, and UI rendering.
 */
export default function GameEngine({ playerName, startingRoom }) {
  const [currentRoom, setCurrentRoom] = useState(startingRoom || 'introstart');
  const [score, setScore] = useState(0);
  const [commandLog, setCommandLog] = useState([]);

  const room = rooms[currentRoom];

  useEffect(() => {
    if (!room) {
      console.warn(`[GameEngine] Room not found: ${currentRoom}`);
    }
  }, [currentRoom]);

  /**
   * Safely executes a command string.
   * Wraps parseCommand in a try/catch to prevent UI crash.
   */
  const handleCommand = (command) => {
    setCommandLog((prev) => [...prev, `> ${command}`]);
    try {
      parseCommand(command, {
        currentRoom,
        setCurrentRoom,
        playerName,
        setScore,
        score,
        log: (msg) => setCommandLog((prev) => [...prev, msg]),
      });
    } catch (err) {
      console.error(`[GameEngine] Command execution failed:`, err);
      setCommandLog((prev) => [...prev, `⚠️ Error processing command.`]);
    }
  };

  return (
    <div className="p-4">
      <StatusPanel score={score} />
      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-300">{currentRoom}</h2>
        <p className="mb-2">
          {room?.description || (
            <span className="text-red-400">Room data missing or corrupted.</span>
          )}
        </p>
        {room?.image && (
          <img
            src={room.image}
            alt={currentRoom}
            className="max-w-full mb-4 rounded"
          />
        )}
      </div>

      <div className="bg-black border border-green-500 p-3 rounded mb-4 text-sm text-green-200 max-h-64 overflow-y-auto">
        {commandLog.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <input
        type="text"
        className="w-full p-2 bg-black border border-green-500 text-green-200 rounded"
        placeholder="Enter command..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            handleCommand(e.target.value.trim());
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
