// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// PlayerNameCapture.jsx — Name input stage

import React, { useState } from "react";

export default function PlayerNameCapture({ onNameEntered }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onNameEntered(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 text-center mt-20">
      <label className="text-green-300 text-lg">Enter your name:</label>
      <input
        type="text"
        className="px-4 py-2 bg-black border border-green-500 text-green-200 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-1 border border-green-500 rounded hover:bg-green-700"
      >
        Confirm
      </button>
    </form>
  );
}
