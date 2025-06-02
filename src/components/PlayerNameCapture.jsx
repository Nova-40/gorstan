
import React, { useState } from "react";

const PlayerNameCapture = ({ onNameSubmit, onShowInstructions }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (skip = false) => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    localStorage.setItem("playerName", name);
    onNameSubmit(name, skip);
  };

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-screen-sm w-full">
        <h2 className="text-3xl sm:text-4xl mb-4">Enter Your Name</h2>

        <div className="flex flex-col items-center gap-4">
          <label htmlFor="nameInput" className="sr-only">
            Player Name
          </label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`px-4 py-2 rounded bg-gray-900 text-green-300 border ${
              error ? "border-red-500" : "border-green-500"
            } focus:outline-none focus:ring-2 focus:ring-green-400`}
            placeholder="Type your name..."
            aria-label="Player Name"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-2xl transition-shadow duration-200 shadow-lg hover:shadow-green-500"
            aria-label="Submit Name"
          >
            Start
          </button>

          <button
            onClick={onShowInstructions}
            className="underline text-green-300 hover:text-green-200"
            aria-label="Show Instructions"
          >
            Instructions
          </button>
        </div>
      </div>
    </main>
  );
};

export default PlayerNameCapture;
