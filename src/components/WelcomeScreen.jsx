// WelcomeScreen.jsx
// Welcome screen for the Gorstan React application.
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import React from "react";
import PropTypes from "prop-types";

/**
 * WelcomeScreen Component
 * Displays the welcome screen for the Gorstan application.
 * Includes a button to start the intro sequence and links to external resources.
 *
 * Props:
 * - onStartIntro: Function to handle starting the intro sequence.
 */
export default function WelcomeScreen({ onStartIntro }) {
  if (typeof onStartIntro !== "function") {
    console.error("❌ Invalid prop: 'onStartIntro' must be a function.");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-4xl font-bold">Error</h1>
        <p className="text-red-400">The application encountered an issue. Please reload the page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-6">
      {/* Title */}
      <h1 className="text-4xl font-bold">Welcome to Gorstan</h1>
      <p className="italic">Simulated reality engaged. Try not to break it.</p>

      {/* Start Button */}
      <div className="flex space-x-4">
        <button
          onClick={onStartIntro}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          Enter Gorstan
        </button>
      </div>

      {/* Links Section */}
      <div className="mt-6 text-center text-sm space-y-2">
        <p>
          Explore the world of Gorstan in book form:
          <a
            href="https://www.geoffwebsterbooks.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 underline hover:text-yellow-300 ml-1"
          >
            Visit Geoff’s Books
          </a>
        </p>
        <p>
          Love the game? You can
          <a
            href="https://www.buymeacoffee.com/gorstan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 underline hover:text-yellow-300 ml-1"
          >
            buy me a coffee
          </a>
          and fuel the multiverse.
        </p>
      </div>
    </div>
  );
}

// PropTypes for type-checking
WelcomeScreen.propTypes = {
  onStartIntro: PropTypes.func.isRequired, // Function to handle starting the intro sequence
};