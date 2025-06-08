// Gorstan Game Module — v3.0.0
import React, { useEffect } from 'react';
import CRTFrame from './CRTFrame';

const WelcomeScreen = ({ onEnterSimulation }) => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <CRTFrame>
       <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
        <img src="/images/rabbit-logo.png" alt="Lavender Rabbit" className="w-16 h-16 mx-auto mb-4" />
<h1 className="text-4xl sm:text-5xl mb-4">Welcome to Gorstan</h1>
        <p className="mb-4 max-w-xl text-base sm:text-lg">
          A quantum narrative experiment that defies logic, common sense, and perhaps even causality.
        </p>
        <p className="mb-2 text-sm">
          Enjoy the journey. Break the rules. And maybe... buy Geoff a coffee or read one of his books.
        </p>
        <div className="flex gap-4 mt-6">
          <a href="https://www.buymeacoffee.com/gorstan" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">☕ Buy a Coffee</a>
          <a href="https://www.amazon.co.uk/dp/B0DH3LNS9J" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">📘 Findlater’s Corner</a>
          <a href="https://www.amazon.co.uk/dp/B0DTK79DS3" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">📗 Quantum Lattice</a>
        </div>
        <button onClick={onEnterSimulation} className="mt-8 bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl shadow-lg hover:shadow-green-500 transition">
          Enter Simulation
        </button>
      </div>
    </CRTFrame>
  );
};

export default WelcomeScreen;