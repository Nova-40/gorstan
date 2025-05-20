// /src/components/WelcomeScreen.jsx
// MIT License © 2025 Geoff Webster
// Welcome screen component for Gorstan

import React from "react";

export default function WelcomeScreen({ onBegin }) {
  const handleBegin = () => {
    try {
      if (typeof onBegin === "function") {
        onBegin();
      } else {
        throw new Error("onBegin prop is not a function.");
      }
    } catch (err) {
      console.error("❌ WelcomeScreen: Error in onBegin callback.", err);
      alert("Unable to start the adventure. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">🌀 Welcome to Gorstan</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Reality is questionable. Coffee is warm. Step forward, if you dare...
      </p>
      <button
        onClick={handleBegin}
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded shadow"
      >
        Enter Gorstan
      </button>
    </div>
  );
}
