// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// PlayerNameCapture.jsx — Captures player name and provides access to instructions and debug panel

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AeviraControlPanel from './AeviraControlPanel';

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
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [accessHintSeen, setAccessHintSeen] = useState(false);
  const [debugUnlocked, setDebugUnlocked] = useState(false);
  const [showStandardInstructions, setShowStandardInstructions] = useState(false);
  const [showDebugInstructions, setShowDebugInstructions] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  const handleShowInstructionsClick = (e) => {
    if (e.ctrlKey) {
      setShowDebugInstructions(true);
    } else {
      setShowStandardInstructions(true);
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
            title="Click for instructions. Ctrl+Click for debug codes."
          >
            Instructions
          </button>
        </div>
      </form>

      {showStandardInstructions && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 border rounded shadow-xl z-50 max-w-md transition-all duration-300 ease-out">
          <h2 className="text-lg font-semibold mb-2">🎮 Game Instructions</h2>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li title="Move by typing or clicking direction buttons">Use on-screen buttons or type commands like <code>north</code>, <code>look</code>, <code>use</code>.</li>
            <li title="Speak with characters to gain hints and lore">Interact with NPCs by typing <code>talk to</code> or <code>ask</code>.</li>
            <li title="Items can be picked up if visible in the room">Pick up items with <code>take [item]</code> or <code>pick up</code>.</li>
            <li title="Type inventory or click the icon to see what you're carrying">Inventory: type <code>inventory</code> or click the 🧳 icon.</li>
            <li title="Ayla will appear and help if you type 'help'">Use <code>help</code> to summon Ayla for contextual hints.</li>
          </ul>
          <button
            className="mt-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            onClick={() => setShowStandardInstructions(false)}
          >
            🔙 Return
          </button>
        </div>
      )}

      {showDebugInstructions && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 border rounded shadow-xl z-50 max-w-md transition-all duration-300 ease-out">
          <h2 className="text-lg font-bold mb-2">🧪 Debug & Cheat Codes</h2>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li title="Toggles debug features like trap visibility"><code>/debug</code> – Enable debug mode</li>
            <li title="Lists currently seeded trap rooms"><code>/traps</code> – Show trap locations</li>
            <li title="Reveals or hides all exits from a room"><code>/doors</code> / <code>/doorsoff</code> – Reveal/hide room exits</li>
            <li title="Manually triggers a multiverse reset"><code>/reset</code> – Manual game reset</li>
            <li title="Bypasses reset room sequence"><code>I defy the dome</code> – Force-reset shortcut</li>
            <li title="Type Geoff as your name to unlock god mode">Enter <code>Geoff</code> as your name to enable god mode</li>
          </ul>
          <button
            className="mt-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            onClick={() => setShowDebugInstructions(false)}
          >
            🔙 Return
          </button>
        </div>
      )}

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





