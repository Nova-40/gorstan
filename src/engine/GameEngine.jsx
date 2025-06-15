/**
 * File: src/engine/GameEngine.jsx
 * Gorstan Game – v3.1.0
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Central game logic loop, routing commands, managing state transitions, and handling rooms.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getRoomById from '../engine/roomUtils';

const GameEngine = ({ rooms }) => {
  const [currentRoomId, setCurrentRoomId] = useState('introstart');
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const foundRoom = getRoomById(currentRoomId, rooms);
    if (foundRoom) {
      setRoom(foundRoom);
    } else {
      console.warn('Room not found:', currentRoomId);
      setRoom({ name: 'Unknown Zone', description: ['This room does not exist. The multiverse may be unstable.'] });
    }
  }, [currentRoomId, rooms]);

  if (!room) {
    return <div className="text-red-500 p-4">Loading room data...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{room.name}</h1>
      {room.description.map((line, i) => (
        <p key={i}>{line}</p>
      ))}

      {room.exits && (
        <div className="mt-4">
          <h2 className="font-semibold">Exits:</h2>
          <ul className="list-disc list-inside">
            {room.exits.map((exit, i) => (
              <li key={i}>
                <button
                  onClick={() => setCurrentRoomId(exit.target)}
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  {exit.label || exit.direction || exit.target}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {room.trap && (
        <div className="text-red-600 mt-4">
          ⚠️ Trap Active: {room.trap.description || 'Be careful.'}
        </div>
      )}
    </div>
  );
};

GameEngine.propTypes = {
  rooms: PropTypes.array.isRequired,
};

export default GameEngine;

