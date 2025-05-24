
import React, { useState } from 'react';
import TeletypeConsole from './TeletypeConsole';

export default function TeletypeIntro({ playerName = "Player", onChoice }) {
  const [showChoices, setShowChoices] = useState(false);

  const lines = [
    `Good day, ${playerName}.`,
    "It's another ordinary afternoon—or so it appears.",
    "You clutch your coffee. It’s hot, bitter, somehow comforting.",
    "A breeze whispers of something... not quite right.",
    "You look up.",
    "A BIG YELLOW TRUCK comes out of nowhere, hurtling toward you at a rate of knots.",
    "Its horn blares, a sound torn from some other dimension.",
    "Time slows. People around you freeze. Birds hang in the air.",
    "Your instincts scream—",
    "Do something.",
    "Anything.",
    "Now."
  ];

  const handleComplete = () => {
    setShowChoices(true);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mb-6">
        <TeletypeConsole lines={lines} onCompleteLastLine={handleComplete} />
      </div>

      {showChoices && (
        <div className="flex flex-col gap-3 text-center">
          <button
            className="bg-purple-800 hover:bg-purple-600 text-white px-6 py-2 rounded"
            onClick={() => onChoice('jump')}
          >
            Jump
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded"
            onClick={() => onChoice('wait')}
          >
            Wait
          </button>
          <button
            className="bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-2 rounded"
            onClick={() => onChoice('sip')}
          >
            Sip Coffee
          </button>
        </div>
      )}
    </div>
  );
}
