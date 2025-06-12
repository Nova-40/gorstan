// Gorstan Game Module — v3.1.1
// MIT License © 2025 Geoff Webster
// AeviraControlPanel.jsx — Player stats, traits, traps, moods, and debug logs panel

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * AeviraControlPanel
 * Displays player stats, traits, trap awareness, NPC mood shifts, and debug logs.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.playerStats - Player stats object (health, energy, mood).
 * @param {Array<string>} props.traits - Player trait strings.
 * @param {Array<string>} props.traps - Active trap names.
 * @param {Array<{name: string, mood: string}>} props.moodShifts - NPC mood changes.
 * @param {boolean} [props.debug=false] - Show debug info if true.
 * @param {Function} [props.onClose] - Optional close handler.
 * @returns {JSX.Element}
 */
const AeviraControlPanel = ({
  playerStats,
  traits,
  traps,
  moodShifts,
  debug = false,
  onClose
}) => {
  const [logs, setLogs] = useState([]);

  // Log debug info when playerStats, traits, or debug changes
  useEffect(() => {
    if (debug) {
      setLogs((prev) => [
        ...prev,
        `Debug active: Stats monitored at ${new Date().toLocaleTimeString()}`,
      ]);
    }
  }, [playerStats, traits, debug]);

  return (
    <div className="rounded-xl border p-4 shadow-lg bg-black text-green-400 font-mono w-full max-w-md mx-auto">
      {/* Header with optional close button */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">🧠 Aevira Control Panel</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-300 hover:text-green-100 text-sm"
            aria-label="Close control panel"
            type="button"
          >
            [X]
          </button>
        )}
      </div>

      {/* Player Stats */}
      {playerStats ? (
        <ul className="text-sm space-y-1">
          <li>❤️ Health: {playerStats.health}</li>
          <li>⚡ Energy: {playerStats.energy}</li>
          <li>😐 Mood: {playerStats.mood}</li>
        </ul>
      ) : (
        <p className="text-sm italic text-yellow-300">Stats unavailable.</p>
      )}

      {/* Traits */}
      {traits && traits.length > 0 && (
        <div className="mt-3">
          <p className="font-semibold">Traits:</p>
          <ul className="list-disc list-inside text-sm">
            {traits.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Trap Awareness (debug only) */}
      {debug && traps && traps.length > 0 && (
        <div className="mt-3">
          <p className="font-semibold">Active Traps:</p>
          <ul className="list-disc list-inside text-sm">
            {traps.map((trap, index) => (
              <li key={index}>{trap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* NPC Mood Shifts (debug only) */}
      {debug && moodShifts && moodShifts.length > 0 && (
        <div className="mt-3">
          <p className="font-semibold">NPC Mood Shifts:</p>
          <ul className="list-disc list-inside text-sm">
            {moodShifts.map((entry, index) => (
              <li key={index}>{entry.name}: {entry.mood}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Debug Logs (debug only) */}
      {debug && logs.length > 0 && (
        <div className="mt-4 text-xs text-green-500 border-t border-green-700 pt-2">
          <p className="font-bold">[Debug Logs]</p>
          <ul className="list-disc list-inside">
            {logs.slice(-5).map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

AeviraControlPanel.propTypes = {
  playerStats: PropTypes.shape({
    health: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    energy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mood: PropTypes.string,
  }),
  traits: PropTypes.arrayOf(PropTypes.string),
  traps: PropTypes.arrayOf(PropTypes.string),
  moodShifts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      mood: PropTypes.string,
    })
  ),
  debug: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AeviraControlPanel;

