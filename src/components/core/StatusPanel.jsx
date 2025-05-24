// MIT License © 2025 Geoff Webster
// Gorstan v2.5

import React from 'react';

export default function StatusPanel({ score }) {
  return (
    <div className="fixed top-2 right-2 bg-black bg-opacity-70 px-4 py-2 rounded text-green-300 text-sm z-50">
      Score: {score}
    </div>
  );
}
