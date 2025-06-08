// Gorstan Game Module — v3.0.0
// LogHistory.jsx — v1.0
// MIT License © 2025 Geoff Webster
// Simple component to display log messages

import React from "react";
import PropTypes from "prop-types";

const LogHistory = ({ log }) => {
  if (!Array.isArray(log)) return null;

  return (
    <div className="w-full max-w-screen-md bg-gray-900 border border-green-600 p-3 mt-4 rounded shadow-inner">
      <h2 className="text-green-400 text-lg mb-2">📜 Log</h2>
      <div className="text-green-200 text-sm max-h-64 overflow-y-auto space-y-1">
        {log.map((entry, index) => (
          <div key={index} className="whitespace-pre-wrap">{entry}</div>
        ))}
      </div>
    </div>
  );
};

LogHistory.propTypes = {
  log: PropTypes.arrayOf(PropTypes.string),
};

export default LogHistory;