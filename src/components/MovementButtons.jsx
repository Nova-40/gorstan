// /src/components/MovementButtons.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from 'react';

const directions = [
  { label: 'N', command: 'north' },
  { label: 'W', command: 'west' },
  { label: 'E', command: 'east' },
  { label: 'S', command: 'south' },
  { label: 'Up', command: 'up' },
  { label: 'Down', command: 'down' },
  { label: 'Jump', command: 'jump' },
];

export function MovementButtons({ exits = [], onMove }) {
  const isActive = (dirCommand) => exits.includes(dirCommand);

  return (
    <div className="movement-buttons flex flex-col items-center">
      <div className="movement-grid grid grid-cols-3 gap-2">
        {directions.map((dir) => (
          <button
            key={dir.command}
            className={`movement-button p-2 rounded transition ${
              isActive(dir.command) ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500'
            }`}
            onClick={() => isActive(dir.command) && onMove(dir.command)}
            disabled={!isActive(dir.command)}
          >
            {dir.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MovementButtons;
