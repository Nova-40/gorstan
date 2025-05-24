// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// WelcomeScreen.jsx — Initial welcome screen

import React from "react";

export default function WelcomeScreen({ onBegin }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <h1 className="text-4xl font-bold text-green-300">☕ Welcome to Gorstan</h1>
      <p className="text-md text-green-400">A quantum choice awaits. Proceed carefully.</p>
      <button
        className="mt-4 px-6 py-2 border border-green-500 rounded hover:bg-green-700"
        onClick={onBegin}
      >
        Begin
      </button>
    </div>
  );
}
