
// MIT License © 2025 Geoff Webster
// Gorstan v2.5 — Elegant Welcome Screen Design

import React from "react";

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono px-4 py-8">
      <div className="w-full max-w-xl border border-green-700 rounded-md p-8 shadow-[0_0_10px_#00ffcc] space-y-6 text-center">

        {/* Title & Tagline */}
        <div>
          <h1 className="text-6xl font-bold tracking-wide">GORSTAN</h1>
          <p className="text-lg mt-2 text-green-300">Survive an endless simulation</p>
        </div>

        <hr className="border-green-800" />

        {/* Book Links */}
        <div>
          <h2 className="text-md font-semibold text-green-300 mb-2">📚 Books by Geoff Webster</h2>
          <ul className="space-y-1 text-base">
            <li><a href="https://www.amazon.co.uk/dp/B0BXYZBOOK1" className="hover:text-green-200 transition">• The Last Veil</a></li>
            <li><a href="https://www.amazon.co.uk/dp/B0BXYZBOOK2" className="hover:text-green-200 transition">• Quantum Lattice</a></li>
            <li><a href="https://www.amazon.co.uk/dp/B0BXYZBOOK3" className="hover:text-green-200 transition">• Findlater's Corner</a></li>
          </ul>
        </div>

        {/* Coffee Link */}
        <div>
          <a
            href="https://www.buymeacoffee.com/gorstan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-200 font-semibold transition"
          >
            ☕ Fuel the multiverse: Buy Gorstan a coffee
          </a>
        </div>

        {/* CTA Button */}
        <div>
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 text-white text-lg font-bold py-3 rounded shadow-lg transition duration-200"
          >
            ▶ Enter the Simulation
          </button>
        </div>
      </div>
    </div>
  );
}
