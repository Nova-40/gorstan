// Game Component
// This component serves as the main interface for the game. It initializes the GameEngine, processes player commands, and displays game output.

import React, { useState, useEffect, useRef } from "react";
import { GameEngine } from "./GameEngine";

console.log("🎮 Game.jsx mounted");

export default function Game({ startRoom = "controlnexus" }) {
  // Reference to the GameEngine instance
  const engineRef = useRef(null);

  // State to track the output log displayed to the player
  const [output, setOutput] = useState([]);

  // State to track the player's current command input
  const [command, setCommand] = useState("");

  // Initialize the GameEngine and set the starting room
  useEffect(() => {
    try {
      const engine = new GameEngine(); // Create a new GameEngine instance
      engine.currentRoom = startRoom; // Set the starting room
      engineRef.current = engine; // Store the engine instance in a ref

      console.log("✅ GameEngine created, starting in:", startRoom);

      // Get the initial room description
      const introText = engine.describeCurrentRoom?.() || "⚠️ No room description available.";
      console.log("🧪 Room description:", introText);

      // Set the initial output log
      setOutput([introText]);

      // Log the engineRef after initialization
      console.log("🎮 Game component loaded, engineRef:", engineRef.current);
    } catch (err) {
      // Handle errors during GameEngine initialization
      console.error("❌ GameEngine failed to start:", err);
      setOutput(["❌ GameEngine failed to start.", err.message]);
    }
  }, [startRoom]); // Re-run this effect if the starting room changes

  // Handle player commands
  const handleCommand = () => {
    if (!command.trim()) return; // Ignore empty commands

    try {
      // Process the command using the GameEngine
      const result = engineRef.current.processCommand(command);

      // Update the output log with the command and the result
      setOutput((prev) => [...prev, `> ${command}`, result]);
    } catch (err) {
      // Handle errors during command processing
      console.error("❌ Error processing command:", err);
      setOutput((prev) => [...prev, `> ${command}`, "❌ Error processing command."]);
    }

    // Clear the command input field
    setCommand("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-mono space-y-4">
      {/* Output Log */}
      <div className="bg-gray-800 p-4 rounded shadow-md max-w-2xl mx-auto">
        {output.length === 0 ? (
          <p className="text-yellow-300">⏳ Waiting for engine output...</p>
        ) : (
          output.map((line, index) => (
            <div key={index}>{line}</div> // Render each line of output
          ))
        )}
      </div>

      {/* Command Input */}
      <div className="flex justify-center space-x-2">
        <input
          className="bg-gray-100 text-black px-3 py-2 rounded w-1/2"
          value={command} // Bind the input value to the command state
          onChange={(e) => setCommand(e.target.value)} // Update the command state on input change
          onKeyDown={(e) => e.key === "Enter" && handleCommand()} // Handle "Enter" key to submit the command
          placeholder="Type a command..." // Placeholder text for the input field
        />
        <button
          onClick={handleCommand} // Handle button click to submit the command
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Go
        </button>
      </div>
    </div>
  );
}