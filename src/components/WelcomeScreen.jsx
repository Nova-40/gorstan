// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// WelcomeScreen.jsx — Entry screen for Gorstan with CRT frame and external links

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CRTFrame from './CRTFrame';

/**
 * WelcomeScreen
 * Entry screen for Gorstan. Clears local storage and presents intro, links, and entry button.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onEnterSimulation - Handler to start the simulation.
 * @returns {JSX.Element}
 */
const WelcomeScreen = ({ onEnterSimulation }) => {
  useEffect(() => {
    // Clear local storage on entry to ensure a fresh simulation state
    localStorage.clear();
  }, []);

  return (
    <CRTFrame>
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
        <img
          src="/images/rabbit-logo.png"
          alt="Lavender Rabbit"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h1 className="text-4xl sm:text-5xl mb-4">Welcome to Gorstan</h1>
        <p className="mb-4 max-w-xl text-base sm:text-lg">
          A quantum narrative experiment that defies logic, common sense, and perhaps even causality.
        </p>
        <p className="mb-2 text-sm">
          Enjoy the journey. Break the rules. And maybe... buy Geoff a coffee or read one of his books.
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="https://www.buymeacoffee.com/gorstan"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-300"
          >
            ☕ Buy a Coffee
          </a>
          <a
            href="https://www.amazon.co.uk/dp/B0DH3LNS9J"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-300"
          >
            📘 Findlater’s Corner
          </a>
          <a
            href="https://www.amazon.co.uk/dp/B0DTK79DS3"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-300"
          >
            📗 Quantum Lattice
          </a>
        </div>
        <button
          onClick={onEnterSimulation}
          className="mt-8 bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl shadow-lg hover:shadow-green-500 transition"
          type="button"
        >
          Enter Simulation
        </button>
      </div>
    </CRTFrame>
  );
};

WelcomeScreen.propTypes = {
  /** Handler to start the simulation */
  onEnterSimulation: PropTypes.func.isRequired,
};

export default WelcomeScreen;

/*
Review summary:
- ✅ Syntax is correct and all JSX blocks are closed.
- ✅ Efficient: No redundant logic; localStorage cleared only on mount.
- ✅ JSDoc comments for component, props, and logic.
- ✅ PropTypes validation after function closure.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
- ✅ Tailwind classes for consistent UI and accessibility.
*/