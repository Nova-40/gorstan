// Gorstan Game Module — v3.0.0
import React, { useState } from "react";
import Modal from "./components/Modal";
import SystemAccessHintsPanel from "./components/SystemAccessHintsPanel";
import { parseCommand } from "./engine/commandParser";

const GameEngine = ({ gameState }) => {
  const [modalContent, setModalContent] = useState(null);
  const [output, setOutput] = useState("");

  const handleInput = (input) => {
    const result = parseCommand(input, gameState, setModalContent);
    if (result !== null) {
      setOutput(result);
    }
  };

  return (
    <div className="p-4 text-green-400 bg-black min-h-screen font-mono">
      <SystemAccessHintsPanel />
      <div className="mt-4">
         {/* input removed for single bar enforcement */ }
</div>
    </div>
  );
};

export default GameEngine;
