
import React from 'react';

export default function WelcomeScreen({ onBegin }) {
  return (
    <div className="min-h-screen bg-black text-green-300 font-mono flex flex-col items-center justify-center space-y-6 px-4">
      <img
        src="/images/gorstan-icon.png"
        alt="Gorstan Icon"
        className="w-32 h-32 mb-4 opacity-90 hover:scale-105 transition-transform duration-300"
      />
      <h1 className="text-3xl lg:text-4xl font-bold tracking-wide text-purple-400">Welcome to Gorstan</h1>
      <p className="text-sm max-w-xl text-center">
        You stand at the edge of a multiverse held together by quantum threads, ancient lies, and suspicious coffee.
      </p>

      <div className="text-green-300 text-sm mt-6 text-center space-y-2">
        <p>📚 Read the Gorstan Chronicles:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="https://yourbooklink.com/findlaters-corner" target="_blank" className="hover:underline">Findlater’s Corner</a></li>
          <li><a href="https://yourbooklink.com/the-last-veil" target="_blank" className="hover:underline">The Last Veil</a></li>
          <li><a href="https://yourbooklink.com/quantum-lattice" target="_blank" className="hover:underline">Quantum Lattice</a></li>
        </ul>
        <p>☕ Fuel the multiverse: <a href="https://www.buymeacoffee.com/gorstan" target="_blank" className="underline hover:text-yellow-300">Buy me a Gorstan Coffee</a></p>
      </div>

      <button
        className="mt-6 bg-purple-800 hover:bg-purple-600 text-white px-6 py-2 rounded shadow-lg"
        onClick={onBegin}
      >
        Enter the Simulation
      </button>
    </div>
  );
}
