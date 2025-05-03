import React from "react";
import PropTypes from "prop-types";

/**
 * CodexPanel Component
 * This component displays a list of codex entries, providing players with lore or important information.
 * It handles empty states gracefully and ensures proper rendering of codex entries.
 *
 * Props:
 * - codex: An array of codex entries, where each entry is an object with a `title` and optional `description`.
 */
export default function CodexPanel({ codex }) {
  try {
    // If no codex data is provided, render a fallback message
    if (!codex || !Array.isArray(codex)) {
      throw new Error("Invalid codex data. Please provide a valid array of entries.");
    }

    return (
      <div className="border border-green-700 p-4 rounded shadow-md bg-gray-900">
        {/* Codex Title */}
        <div className="font-bold mb-2 text-green-300 text-lg">Codex</div>

        {/* Codex Entries */}
        <ul className="list-disc list-inside text-sm text-green-400">
          {codex.length > 0 ? (
            codex.map((entry, i) => (
              <li key={i} className="mb-2">
                <span className="font-semibold">{entry.title || entry}</span>
                {entry.description && (
                  <p className="text-gray-400 text-xs mt-1">{entry.description}</p>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-500">(No codex entries available)</li>
          )}
        </ul>
      </div>
    );
  } catch (err) {
    console.error("❌ Error rendering CodexPanel:", err);
    return (
      <div className="border border-red-700 p-4 rounded shadow-md bg-gray-900">
        <div className="font-bold text-red-500">Error</div>
        <p className="text-gray-400 text-sm">Failed to load the codex. Please try again later.</p>
      </div>
    );
  }
}

// PropTypes for type-checking
CodexPanel.propTypes = {
  codex: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired, // The title of the codex entry
      description: PropTypes.string, // Optional description for the codex entry
    })
  ).isRequired,
};
