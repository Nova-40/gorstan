// Gorstan v2.2.2 – StatusPanel: Traits, Stats, and Game Info
import React from "react";

export default function StatusPanel({ traits, score, room, inventory, cycleCount, debugMode, traps }) {
  return (
    <div className="fixed top-4 right-4 z-50 w-80 border-2 border-green-400 rounded-2xl p-4 font-mono bg-slate-900 text-green-100 shadow-xl slide-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-green-300">📊 Status</h3>
      </div>
      <hr className="border-green-700 my-2" />
      <div>
        <strong className="text-green-300">🧠 Traits:</strong>
        <ul className="pl-4 list-disc text-lime-300">
          {Object.keys(traits || {}).map((t) => (
            <li key={t} title={traitDescriptions[t] || "No description"}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong className="text-green-300">🎯 Score:</strong> <span className="text-yellow-300">{score}</span>
      </div>
      <div>
        <strong className="text-green-300">🗺️ Room:</strong> <span className="text-blue-300">{room}</span>
      </div>
      <div>
        <strong className="text-green-300">🎒 Items:</strong>
        <ul className="pl-4 list-disc text-yellow-200">
          {inventory?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong className="text-green-300">🔄 Reset Cycles:</strong> <span className="text-red-300">{cycleCount || 0} / 7</span>
      </div>
      {debugMode && (
        <div className="text-cyan-300 text-sm mt-2">
          DEBUG: Traps active in {traps.length} room(s)
        </div>
      )}
    </div>
  );
}

const traitDescriptions = {
  curious: "You inspect everything closely.",
  reckless: "You often act before thinking.",
  ambitious: "You seek high rewards.",
  diplomatic: "You avoid conflict where possible.",
  greedy: "You tend to take more than needed.",
  hesitated: "You froze in the face of danger.",
};
