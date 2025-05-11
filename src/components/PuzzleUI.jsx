// src/components/PuzzleUI.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import { useState } from "react";
import PropTypes from "prop-types";

/**
 * PuzzleUI Component
 * Renders a puzzle interface with a description, options, and a submit button.
 *
 * Props:
 * - puzzle: An object containing the puzzle description and options.
 * - onSolve: A callback function triggered when the puzzle is solved.
 */
export default function PuzzleUI({ puzzle, onSolve }) {
  const [selectedOption, setSelectedOption] = useState(""); // Tracks the currently selected option
  const [error, setError] = useState(null); // Tracks any errors during puzzle interaction

  // If no puzzle is provided, render a fallback message
  if (!puzzle) {
    return (
      <div className="flex items-center justify-center bg-gray-800 p-6 rounded shadow-md">
        <p className="text-gray-500 italic">(No puzzle available)</p>
      </div>
    );
  }

  /**
   * Handles the submission of the selected option.
   */
  const handleSolve = () => {
    if (!selectedOption) {
      setError("No option selected. Please choose an answer before submitting.");
      return; // Prevent further execution
    }

    try {
      onSolve(selectedOption); // Trigger the onSolve callback with the selected option
      setSelectedOption(""); // Reset the selected option after submission
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("❌ Error solving puzzle:", err);
      setError("An unexpected error occurred. Please try again."); // Display a generic error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded shadow-md mb-4">
      {/* Puzzle Title */}
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Puzzle:</h2>

      {/* Puzzle Description */}
      <p className="text-green-400 mb-6 text-center">{puzzle.description}</p>

      {/* Puzzle Options */}
      {puzzle.options && puzzle.options.length > 0 ? (
        <div className="flex flex-col space-y-3 w-full max-w-md">
          {puzzle.options.map((option) => (
            <button
              key={option} // Use the option text as the key
              onClick={() => setSelectedOption(option)} // Set the selected option when clicked
              className={`p-3 rounded border transition ${
                selectedOption === option
                  ? "bg-yellow-400 text-black border-yellow-500"
                  : "bg-gray-600 text-white border-gray-500 hover:bg-yellow-500"
              }`}
              aria-label={`Option: ${option}`} // Add aria-label for accessibility
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">(No options available)</p>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Submit Button */}
      <button
        disabled={!selectedOption || !puzzle.options || puzzle.options.length === 0} // Disable if no option is selected or no options are available
        onClick={handleSolve} // Handle the submission of the selected option
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
        aria-label="Submit Answer" // Add aria-label for accessibility
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