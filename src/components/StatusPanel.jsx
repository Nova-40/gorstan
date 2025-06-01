
import React from "react";

const traitDescriptions = {
  curious: "Reveals hidden clues and trap hints.",
  ambitious: "Increases score gain from achievements.",
  seeker: "Composite: Combines curiosity and ambition.",
  // Add more as needed
};

const StatusPanel = ({ state }) => {
  return (
    <div className="border-2 border-green-400 p-4 text-sm rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Player Status</h3>
      <p className="mb-1">
        <strong>Score:</strong> {state.score}
      </p>

      <div className="mb-2">
        <strong>Traits:</strong>
        <ul className="ml-4 list-disc text-green-300">
          {(state.traits || []).map((trait, idx) => (
            <li key={idx} title={traitDescriptions[trait] || "No description"}>
              {trait}
            </li>
          ))}
        </ul>
      </div>

      {state.flags && Object.keys(state.flags).length > 0 && (
        <div className="mb-2">
          <strong>Flags:</strong>
          <ul className="ml-4 list-disc text-yellow-300">
            {Object.entries(state.flags).map(([key, value], idx) => (
              <li key={idx} title={`Value: ${value}`}>
                {key}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.log && state.log.length > 0 && (
        <div className="mt-3 text-green-200">
          <strong>Recent Events:</strong>
          <ul className="ml-4 list-disc text-xs">
            {state.log.slice(-3).map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusPanel;
