import React from "react";
import CRTFrame from "./CRTFrame";

const WelcomeScreen = ({ onEnterSimulation }) => {
  return (
    <CRTFrame>
      <main className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-screen-sm w-full">
          <h1 className="text-4xl sm:text-5xl mb-4">Welcome to Gorstan</h1>
          <p className="mb-6 text-base sm:text-lg">A quantum narrative experiment</p>

          <div className="flex flex-col gap-3 items-center">
            <button
              aria-label="Enter Simulation"
              onClick={onEnterSimulation}
              className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl transition-shadow duration-200 shadow-lg hover:shadow-green-500"
            >
              Enter Simulation
            </button>

            <a
              href="https://www.buymeacoffee.com/gorstan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy Me a Coffee"
              className="underline text-green-300 hover:text-green-200"
            >
              Buy Me a Coffee
            </a>

            <a
              href="https://www.amazon.co.uk/dp/B0DH3LNS9J"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Findlater's Corner Book Link"
              className="underline text-green-300 hover:text-green-200"
            >
              Read Findlater’s Corner
            </a>

            <a
              href="https://www.amazon.co.uk/dp/B0DTK79DS3"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Quantum Lattice Book Link"
              className="underline text-green-300 hover:text-green-200"
            >
              Read Quantum Lattice
            </a>
          </div>
        </div>
      </main>
    </CRTFrame>
  );
};

export default WelcomeScreen;