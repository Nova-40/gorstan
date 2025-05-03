// /src/components/MovementPanel.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster

// MovementPanel Component
// This component renders a movement control panel with directional buttons, utility actions like "Look" and "Inventory",
// and additional actions like "Talk" and "Pick Up" if NPCs or items are present in the current room.
// It also supports swipe gestures for movement and includes a collapsible feature for better user experience.

// Props:
// - currentRoom: The current room identifier (string).
// - onMoveCommand: A callback function triggered when a button is clicked or a swipe gesture is detected, passing the corresponding command.

import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { rooms } from '../engine/rooms';

export default function MovementPanel({ currentRoom, onMoveCommand }) {
  const [pulse, setPulse] = useState(false); // Controls the pulse animation for inactivity
  const [lastMoveTime, setLastMoveTime] = useState(Date.now()); // Tracks the last movement time
  const [collapsed, setCollapsed] = useState(false); // Tracks whether the panel is collapsed

  // Extract room-specific data
  const exits = rooms[currentRoom]?.exits || {}; // Available exits in the current room
  const npcs = rooms[currentRoom]?.npcs || []; // NPCs present in the current room
  const items = rooms[currentRoom]?.items || []; // Items present in the current room

  // Effect to trigger pulse animation after 15 seconds of inactivity
  useEffect(() => {
    const timeout = setTimeout(() => setPulse(true), 15000);
    return () => clearTimeout(timeout);
  }, [lastMoveTime]);

  /**
   * Handles movement commands and resets the pulse animation.
   * @param {string} command - The movement or action command.
   */
  const handleMove = (command) => {
    try {
      onMoveCommand(command); // Trigger the callback with the command
      setPulse(false); // Reset the pulse animation
      setLastMoveTime(Date.now()); // Update the last movement time
    } catch (err) {
      console.error('❌ Error handling movement command:', err);
    }
  };

  // Swipe gesture handlers for movement
  const handlers = useSwipeable({
    onSwipedLeft: () => exits.west && handleMove('go west'),
    onSwipedRight: () => exits.east && handleMove('go east'),
    onSwipedUp: () => exits.north && handleMove('go north'),
    onSwipedDown: () => exits.south && handleMove('go south'),
    trackMouse: true, // Enables mouse tracking for swipe gestures
  });

  // Render the collapsed version of the panel
  if (collapsed) {
    return (
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-gray-700 text-white p-2 rounded shadow"
        >
          ⬆️ Open Nav
        </button>
      </div>
    );
  }

  // Render the expanded version of the panel
  return (
    <div
      {...handlers}
      className={`fixed top-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2 transition-opacity duration-700 ease-in-out ${
        pulse ? 'animate-pulse' : ''
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(true)}
        className="text-xs text-gray-400 hover:text-white mb-2"
      >
        Collapse
      </button>

      {/* Directional Buttons */}
      {exits.north && (
        <button
          onClick={() => handleMove('go north')}
          className="bg-green-600 hover:bg-green-700 text-white rounded p-2 w-20"
        >
          ⬆️
        </button>
      )}
      <div className="flex space-x-2">
        {exits.west && (
          <button
            onClick={() => handleMove('go west')}
            className="bg-green-600 hover:bg-green-700 text-white rounded p-2 w-20"
          >
            ⬅️
          </button>
        )}
        {exits.east && (
          <button
            onClick={() => handleMove('go east')}
            className="bg-green-600 hover:bg-green-700 text-white rounded p-2 w-20"
          >
            ➡️
          </button>
        )}
      </div>
      {exits.south && (
        <button
          onClick={() => handleMove('go south')}
          className="bg-green-600 hover:bg-green-700 text-white rounded p-2 w-20"
        >
          ⬇️
        </button>
      )}

      {/* Utility Buttons */}
      <div className="flex space-x-2 pt-2">
        <button
          onClick={() => handleMove('look')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2 w-20 text-xs"
        >
          Look
        </button>
        <button
          onClick={() => handleMove('inventory')}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded p-2 w-20 text-xs"
        >
          Inventory
        </button>
      </div>

      {/* Talk or Pick Up if relevant */}
      {npcs.length > 0 && (
        <button
          onClick={() => handleMove('talk')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black rounded p-2 w-20 text-xs mt-2"
        >
          Talk
        </button>
      )}
      {items.length > 0 && (
        <button
          onClick={() => handleMove('pickup')}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded p-2 w-20 text-xs mt-2"
        >
          Pick Up
        </button>
      )}
    </div>
  );
}