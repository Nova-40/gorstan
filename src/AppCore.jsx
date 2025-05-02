// AppCore Component
// This component handles the introductory sequence of the game, including:
// - Welcome screen
// - Pre-intro setup
// - Crossing sequence with SPLAT or jump
// - Multiverse reset logic
// - Post-reset: pickup coffee, wait, jump
// - Transition to the Control Nexus

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppCore({ setHasCoffee, setShowIntro }) {
  // State variables
  const [stage, setStage] = useState("welcome"); // Tracks the current stage of the intro sequence
  const [showButtons, setShowButtons] = useState(false); // Determines if decision buttons are visible
  const [wasTooSlow, setWasTooSlow] = useState(false); // Tracks if the player was too slow to act
  const [hasCoffee, setLocalCoffee] = useState(false); // Tracks if the player has picked up the coffee
  const navigate = useNavigate(); // React Router's navigation hook

  // Effect to handle timeout for the crossing buttons
  useEffect(() => {
    if (stage === "crossingButtons") {
      const timeout = setTimeout(() => handleTimeout(), 10000); // 10 seconds to act
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [stage]);

  // Start the intro sequence
  const startIntro = () => setStage("preIntro");

  // Advance through the crossing sequence stages
  const advanceCrossing = () => {
    const stages = ["crossing1", "crossing2", "crossing3", "crossingButtons"];
    let i = 0;
    const interval = setInterval(() => {
      setStage(stages[i]);
      i++;
      if (i === stages.length) clearInterval(interval); // Stop advancing after the last stage
    }, 1500); // Progress every 1.5 seconds
  };

  // Handle timeout when the player fails to act
  const handleTimeout = () => {
    setWasTooSlow(true); // Mark the player as too slow
    if (setHasCoffee) setHasCoffee(false); // Update coffee state
    setLocalCoffee(false); // Reset local coffee state
    setStage("splat"); // Show SPLAT message
    setTimeout(() => setStage("resetAfterSplat"), 3000); // Reset after 3 seconds
  };

  // Handle the "Jump" action
  const handleJump = () => {
    setShowIntro(false); // Hide the intro screen
    navigate("/controlnexus"); // Navigate to the Control Nexus
  };

  return (
    <div>
      {/* Render logic for the intro sequence */}
      {/* Add your JSX rendering logic here */}
    </div>
  );
}