// src/components/PuzzleUI.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useState } from 'react';

export default function PuzzleUI({ puzzle, onSolve }) {
  const [selectedOption, setSelectedOption] = useState('');

  if (!puzzle) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded shadow-md mb-4">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Puzzle:</h2>
      <p className="text-green-400 mb-6 text-center">{puzzle.description}</p>

      {puzzle.options && (
        <div className="flex flex-col space-y-3 w-full max-w-md">
          {puzzle.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(option)}
              className={`p-3 rounded border transition ${
                selectedOption === option
                  ? 'bg-yellow-400 text-black border-yellow-500'
                  : 'bg-gray-600 text-white border-gray-500 hover:bg-yellow-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <button
        disabled={!selectedOption}
        onClick={() => onSolve(selectedOption)}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
      >
        Submit Answer
      </button>
    </div>
  );
}
