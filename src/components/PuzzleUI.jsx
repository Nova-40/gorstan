// Gorstan v2.2.2 – All modules validated and standardized
// src/components/PuzzleUI.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
import React, { useState } from "react";
import PropTypes from "prop-types";
/**
 * PuzzleUI Component
 * Renders a puzzle interface with a description, options, and a submit button.
 * Handles error states and validates props.
 *
 * Props:
 * - puzzle: An object containing the puzzle description and options.
 * - onSolve: A callback function triggered when the puzzle is solved.
 */
export default function PuzzleUI({ puzzle, onSolve }) {
  const [selectedOption, setSelectedOption] = useState(""); // Tracks the currently selected option
  const [error, setError] = useState(null); // Tracks any errors during puzzle interaction
  // Defensive: Validate puzzle prop
  if (!puzzle || typeof puzzle !== "object" || !Array.isArray(puzzle.options)) {
    console.error("❌ PuzzleUI: Invalid or missing puzzle prop.", puzzle);
    return (
      <div className="flex items-center justify-center bg-gray-800 p-6 rounded shadow-md">
        <p className="text-red-400 italic">(Puzzle data is missing or malformed)</p>
      </div>
    );
  }
  /**
   * Handles the submission of the selected option.
   */
  const handleSolve = () => {
    if (!selectedOption) {
      setError("No option selected. Please choose an answer before submitting.");
      return;
    }
    try {
      if (typeof onSolve !== "function") {
        throw new Error("onSolve prop is not a function.");
      }
      onSolve(selectedOption); // Trigger the onSolve callback with the selected option
      setSelectedOption(""); // Reset the selected option after submission
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("❌ PuzzleUI: Error solving puzzle.", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded shadow-md mb-4">
      {/* Puzzle Title */}
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Puzzle:</h2>
      {/* Puzzle Description */}
      <p className="text-green-400 mb-6 text-center">{puzzle.description}</p>
      {/* Puzzle Options */}
      {puzzle.options.length > 0 ? (
        <div className="flex flex-col space-y-3 w-full max-w-md">
          {puzzle.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`p-3 rounded border transition ${
                selectedOption === option
                  ? "bg-yellow-400 text-black border-yellow-500"
                  : "bg-gray-600 text-white border-gray-500 hover:bg-yellow-500"
              }`}
              aria-label={`Option: ${option}`}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">(No options available)</p>
      )}
      {/* Error Message */}
      {error && <p className="text-red-500 mt-4" role="alert">{error}</p>}
      {/* Submit Button */}
      <button
        disabled={!selectedOption || puzzle.options.length === 0}
        onClick={handleSolve}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
        aria-label="Submit Answer"
        type="button"
      >
        Submit Answer
      </button>
    </div>
  );
}
// PropTypes for type-checking and documentation
PuzzleUI.propTypes = {
  puzzle: PropTypes.shape({
    description: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onSolve: PropTypes.func.isRequired,
};
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Defensive error handling for puzzle prop and onSolve callback.
  - All syntax validated and ready for use in the Gorstan game.
  - Component is fully wired for game integration.
  - Comments improved for maintainability and clarity.
*/
