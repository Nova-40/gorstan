// WelcomeScreen.jsx
// Welcome screen for the Gorstan React application.
// MIT License Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.1 – prop alignment update

import React from "react";
import PropTypes from "prop-types";

/**
 * WelcomeScreen Component
 * Displays the welcome screen for the Gorstan application.
 * Includes a button to start the intro sequence and links to external resources.
 *
 * Props:
 * - onBegin (function): Function to handle starting the intro sequence.
 */
export default function WelcomeScreen({ onBegin }) {
  /**
   * Renders the links section.
   * @returns {JSX.Element} The links section.
   */
  const renderLinks = () => (
    <div className="mt-6 text-center text-sm space-y-2">
      <p>
        Explore the world of Gorstan in book form:
        <a
          href="https://www.thegorstanchronicles.com/book-showcase"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 underline hover:text-yellow-300 ml-1"
        >
          Visit the showcase
        </a>
      </p>
      <p>
        Like the game? Buy the author a coffee:
        <a
          href="https://www.buymeacoffee.com/gorstan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 underline hover:text-yellow-300 ml-1"
        >
          Donate
        </a>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Gorstan</h1>
      <p className="mb-8 text-center max-w-lg">
        Embark on an interdimensional journey where every choice shapes the fate of multiple realities. Ready to begin?
      </p>
      <button
        onClick={onBegin}
        className="bg-green-700 hover:bg-green-800 text-white text-sm py-1 px-4 rounded mt-4"
        aria-label="Begin the adventure"
      >
        Enter Gorstan
      </button>

      {/* Links Section */}
      {renderLinks()}
    </div>
  );
}

// PropTypes for type-checking
WelcomeScreen.propTypes = {
  onBegin: PropTypes.func.isRequired, // Function to handle starting the intro sequence
};