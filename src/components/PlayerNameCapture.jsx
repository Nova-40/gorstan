// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// PlayerNameCapture.jsx — Captures player name and provides access to instructions and debug panel

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AeviraControlPanel from './AeviraControlPanel';
import InstructionsScreen from './InstructionsScreen';

/**
 * PlayerNameCapture
 * Captures the player's name and provides access to instructions and (via secret combo) debug panel.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onNameSubmit - Callback invoked with the player's name.
 * @returns {JSX.Element}
 */
const PlayerNameCapture = ({ onNameSubmit }) => {
  const [name, setName] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [accessHintSeen, setAccessHintSeen] = useState(false);
  const [debugUnlocked, setDebugUnlocked] = useState(false);

  // Listen for secret key combo (Ctrl+Alt+0) to toggle debug panel if accessHintSeen is true
  useEffect(() => {
    const handleKeyCombo = (e) => {
      if (e.ctrlKey && e.altKey && e.key === '0' && accessHintSeen) {
        setShowControlPanel((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyCombo);
    return () => {
      document.removeEventListener('keydown', handleKeyCombo);
    };
  }, [accessHintSeen]);

  /**
   * Handles form submission for player name.
   * Calls onNameSubmit with trimmed name if not empty.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  /**
   * Handles the Show/Hide Instructions button.
   * If Ctrl is held, unlocks debug panel (one-time) and shows it.
   * Otherwise, toggles instructions panel.
   */
  const handleShowInstructionsClick = (e) => {
    if (e.ctrlKey) {
      if (!debugUnlocked) {
        // eslint-disable-next-line no-console
        console.log('%c👀 Debug access unlocked', 'color: limegreen; font-weight: bold;');
        setDebugUnlocked(true);
      }
      setAccessHintSeen(true);
      setShowControlPanel(true);
      setShowHints(false);
    } else {
      setShowHints((prev) => !prev);
      setShowControlPanel(false);
    }
  };

  return (
    <div className="border-4 border-green-500 rounded-xl p-6 bg-black text-green-300 max-w-lg mx-auto mt-10 font-mono shadow-2xl">
      <h1 className="text-2xl mb-4 font-bold">Enter Your Name</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-green-400 rounded bg-black text-green-200 placeholder-green-500"
          placeholder="e.g., Dale, Ayla, Geoff..."
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Begin
          </button>
          <button
            type="button"
            onClick={handleShowInstructionsClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {showHints ? 'Hide Instructions' : 'Show Instructions'}
          </button>
        </div>
      </form>

      {/* Show instructions overlay if toggled */}
      {showHints && (
        <div className="mt-4">
          <InstructionsScreen onReturn={() => setShowHints(false)} />
        </div>
      )}

      {/* Show debug control panel if toggled */}
      {showControlPanel && (
        <div className="mt-4">
          <AeviraControlPanel onClose={() => setShowControlPanel(false)} />
        </div>
      )}
    </div>
  );
};

PlayerNameCapture.propTypes = {
  /** Callback invoked with the player's name */
  onNameSubmit: PropTypes.func.isRequired,
};

export default PlayerNameCapture;

/*
Review summary:
- ✅ Syntax is correct and all JSX blocks are closed.
- ✅ Defensive: Handles empty name, secret debug combo, and toggling overlays.
- ✅ JSDoc comments for component, props, and handlers.
- ✅ PropTypes validation after function closure.
- ✅ No dead code or unused props.
- ✅ Structure is modular and ready for integration.
- ✅ Tailwind classes for consistent UI and accessibility.
*/





