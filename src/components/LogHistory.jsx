
// Gorstan Game Module — v3.1.0
// LogHistory.jsx — Refactored UI log panel

import React from "react";
import PropTypes from "prop-types";

const LogHistory = ({ log }) => {
  if (!Array.isArray(log)) return null;

  return (
    <div className="fixed right-0 bottom-2 w-1/3 max-w-xs bg-black bg-opacity-80 border border-green-600 p-2 rounded text-xs overflow-y-scroll max-h-[6rem] leading-tight">
      {log.slice(-4).map((entry, index) => (
        <div key={index} className="text-green-300">
          {entry}
        </div>
      ))}
    </div>
  );
};

LogHistory.propTypes = {
  log: PropTypes.array.isRequired,
};

export default LogHistory;
