// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// WelcomeScreen.jsx
// Welcome screen component for Gorstan. Presents the intro and a start button.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, arrow function).
     - Efficient and readable; no unused variables.
     - Naming is clear and consistent.
     - Could memoize for performance, but not necessary for a static screen.
  3. 💬 COMMENTS & DOCUMENTATION
     - Added module and function-level comments.
     - MIT license and version header included.
     - PropTypes added for clarity.
  4. 🤝 INTEGRATION CHECK
     - Expects `onBegin` prop (function) from parent (AppCore).
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Added a links section for book/donation (optional, see TODO).
     - Defensive error handling for `onBegin`.
     - Could add unit tests for button click and error handling.
*/

import React from "react";
import PropTypes from "prop-types";

/**
 * WelcomeScreen Component
 * Displays the welcome screen for the Gorstan application.
 * Includes a button to start the intro sequence and (optionally) links to external resources.
 *
 * @param {Object} props
 * @param {Function} props.onBegin - Function to handle starting the intro sequence.
 */
export default function WelcomeScreen({ onBegin }) {
  /**
   * Handles the "Enter Gorstan" button click.
   * Defensive: Checks if onBegin is a function before calling.
   */
  const handleBegin = () => {
    try {
      if (typeof onBegin === "function") {
        onBegin();
      } else {
        throw new Error("onBegin prop is not a function.");
      }
    } catch (err) {
      console.error("❌ WelcomeScreen: Error in onBegin callback.", err);
      alert("Unable to start the adventure. Please try again.");
    }
  };

  // TODO: Optionally add links to books/donation if desired for UX.
  // const renderLinks = () => (
  //   <div className="mt-6 text-center text-sm space-y-2">
  //     <p>
  //       Explore the world of Gorstan in book form:
  //       <a
  //         href="https://www.thegorstanchronicles.com/book-showcase"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-yellow-400 underline hover:text-yellow-300 ml-1"
  //       >
  //         Visit the showcase
  //       </a>
  //     </p>
  //     <p>
  //       Like the game? Buy the author a coffee:
  //       <a
  //         href="https://www.buymeacoffee.com/gorstan"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-yellow-400 underline hover:text-yellow-300 ml-1"
  //       >
  //         Donate
  //       </a>
  //     </p>
  //   </div>
  // );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">🌀 Welcome to Gorstan</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Reality is questionable. Coffee is warm. Step forward, if you dare...
      </p>
      <button
        onClick={handleBegin}
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded shadow"
        aria-label="Begin the adventure"
        type="button"
      >
        Enter Gorstan
      </button>
      {/* {renderLinks()} */}
    </div>
  );
}

WelcomeScreen.propTypes = {
  onBegin: PropTypes.func.isRequired,
};
