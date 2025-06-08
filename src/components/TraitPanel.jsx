// Gorstan Game Module — v3.0.0
import React, { useContext } from 'react';
import { GameContext } from '../engine/GameContext';
import { traits as allTraits } from '../data/traits';

const TraitPanel = ({ fullscreen, toggleFullscreen }) => {
  const { state } = useContext(GameContext);
  const unlocked = state.traits || [];

  const panelClass = fullscreen
    ? "fixed inset-0 bg-white p-6 z-50 overflow-auto"
    : "fixed right-2 bottom-4 w-56 p-4 bg-white border-2 border-indigo-500 rounded-xl shadow-lg z-50 text-xs";

  return (
    <div className={panelClass}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold">🧬 Traits</h2>
        <button
          onClick={toggleFullscreen}
          className="text-indigo-600 hover:text-indigo-800 text-xs"
        >
          {fullscreen ? "⤢ Windowed" : "⤢ Fullscreen"}
        </button>
      </div>
      {unlocked.length === 0 ? (
        <p className="text-gray-500 text-center">No traits yet</p>
      ) : (
        <ul className="space-y-2">
          {unlocked.map((trait) => (
            <li key={trait}>
              <span className="font-semibold" title={allTraits[trait]?.description}>
                {allTraits[trait]?.name || trait}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TraitPanel;