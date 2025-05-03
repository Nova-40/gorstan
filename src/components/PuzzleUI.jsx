// src/components/PuzzleUI.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// PuzzleUI Component
// This component renders a puzzle interface for the player, allowing them to interact with puzzles by selecting options and submitting answers.

import { useState } from 'react';
import PropTypes from 'prop-types';

export default function PuzzleUI({ puzzle, onSolve }) {
  const [selectedOption, setSelectedOption] = useState(''); // Tracks the currently selected option
  const [error, setError] = useState(null); // Tracks any errors during puzzle interaction

  // If no puzzle is provided, render nothing
  if (!puzzle) return null;

  /**
   * Handles the submission of the selected option.
   */
  const handleSolve = () => {
    try {
      if (!selectedOption) {
        throw new Error('No option selected. Please choose an answer before submitting.');
      }
      onSolve(selectedOption); // Trigger the onSolve callback with the selected option
      setSelectedOption(''); // Reset the selected option after submission
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('❌ Error solving puzzle:', err);
      setError(err.message); // Display the error message to the user
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded shadow-md mb-4">
      {/* Puzzle Title */}
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Puzzle:</h2>

      {/* Puzzle Description */}
      <p className="text-green-400 mb-6 text-center">{puzzle.description}</p>

      {/* Puzzle Options */}
      {puzzle.options && (
        <div className="flex flex-col space-y-3 w-full max-w-md">
          {puzzle.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(option)} // Set the selected option when clicked
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

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Submit Button */}
      <button
        disabled={!selectedOption} // Disable the button if no option is selected
        onClick={handleSolve} // Handle the submission of the selected option
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
      >
        Submit Answer
      </button>
    </div>
  );
}

// PropTypes for type-checking
PuzzleUI.propTypes = {
  puzzle: PropTypes.shape({
    description: PropTypes.string.isRequired, // The puzzle description
    options: PropTypes.arrayOf(PropTypes.string).isRequired, // The puzzle options
  }).isRequired,
  onSolve: PropTypes.func.isRequired, // Callback function triggered when the puzzle is solved
};
