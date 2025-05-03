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
  const [crossingWarning, setCrossingWarning] = useState(false); // Tracks if the crossing warning is active
  const [truckTextIndex, setTruckTextIndex] = useState(Math.floor(Math.random() * 2)); // Random truck message
  const navigate = useNavigate(); // React Router's navigation hook

  const truckMessages = [
    "A yellow truck thunders toward you.",
    "The lights are too bright. The sound too loud. It’s happening again."
  ];

  // Effect to handle timeout for the crossing buttons
  useEffect(() => {
    if (stage === "crossingButtons") {
      try {
        const warningTimeout = setTimeout(() => setCrossingWarning(true), 6000); // Show warning after 6 seconds
        const splatTimeout = setTimeout(() => handleTimeout(), 10000); // Trigger SPLAT after 10 seconds
        return () => {
          clearTimeout(warningTimeout);
          clearTimeout(splatTimeout);
        };
      } catch (err) {
        console.error("❌ Error in crossingButtons timeout:", err);
      }
    }
  }, [stage]);

  // Start the intro sequence
  const startIntro = () => {
    try {
      setStage("preIntro");
    } catch (err) {
      console.error("❌ Error starting intro:", err);
    }
  };

  // Advance through the crossing sequence stages
  const advanceCrossing = () => {
    try {
      const stages = ["crossing1", "crossing2", "crossing3", "crossingButtons"];
      let i = 0;
      const interval = setInterval(() => {
        setStage(stages[i]);
        i++;
        if (i === stages.length) clearInterval(interval); // Stop advancing after the last stage
      }, 1500); // Progress every 1.5 seconds
    } catch (err) {
      console.error("❌ Error advancing crossing sequence:", err);
    }
  };

  // Handle timeout when the player fails to act
  const handleTimeout = () => {
    try {
      setWasTooSlow(true); // Mark the player as too slow
      if (setHasCoffee) setHasCoffee(false); // Update coffee state
      setLocalCoffee(false); // Reset local coffee state
      setStage("splat"); // Show SPLAT message
      setTimeout(() => setStage("resetAfterSplat"), 3000); // Reset after 3 seconds
    } catch (err) {
      console.error("❌ Error handling timeout:", err);
    }
  };

  // Handle the "Jump" action
  const handleJump = () => {
    try {
      setShowIntro(false); // Hide the intro screen
      navigate("/controlnexus"); // Navigate to the Control Nexus
    } catch (err) {
      console.error("❌ Error handling jump action:", err);
    }
  };

  // Handle picking up the coffee
  const handlePickupCoffee = () => {
    try {
      setLocalCoffee(true);
      if (setHasCoffee) setHasCoffee(true);
    } catch (err) {
      console.error("❌ Error picking up coffee:", err);
    }
  };

  // Handle waiting after the multiverse reset
  const handleWaitAfterReset = () => {
    try {
      setStage("falling");
      setTimeout(() => handleJump(), 2000); // Automatically jump after 2 seconds
    } catch (err) {
      console.error("❌ Error handling wait after reset:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-10">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Welcome Screen */}
        {stage === "welcome" && (
          <>
            <a href="/controlnexus" className="block mt-2 text-sm text-yellow-400 underline hover:text-yellow-300">
              Debug: skip to game
            </a>
            <h1 className="text-4xl font-bold">Welcome to Gorstan</h1>
            <p className="italic">Simulated reality engaged. Try not to break it.</p>
            <button onClick={startIntro} className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Begin
            </button>
          </>
        )}

        {/* Pre-Intro Scene */}
        {stage === "preIntro" && (
          <>
            <p>You sense something is wrong. The air smells like static.</p>
            <button onClick={advanceCrossing} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded">
              Proceed
            </button>
          </>
        )}

        {/* Crossing Sequence */}
        {stage === "crossing1" && <p>A horn blares in the distance...</p>}
        {stage === "crossing2" && <p>{truckMessages[truckTextIndex]}</p>}
        {stage === "crossing3" && <p>Metal and momentum converge—</p>}

        {/* Crossing Buttons */}
        {stage === "crossingButtons" && (
          <>
            <p>Do something!</p>
            {crossingWarning && (
              <>
                <p className="text-yellow-400">⚠ You feel the universe hesitate...</p>
                <p className="italic text-sm">Ayla: “Bold choice. Just stand there. Surely nothing bad will happen...”</p>
              </>
            )}
            <div className="flex justify-center space-x-4">
              <button onClick={handleJump} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded">
                Jump
              </button>
              <button onClick={handleTimeout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded">
                Wait
              </button>
            </div>
          </>
        )}

        {/* SPLAT Message */}
        {stage === "splat" && (
          <h1 className="text-6xl text-red-600 font-extrabold animate-pulse">SPLAT.</h1>
        )}

        {/* Reset After SPLAT */}
        {stage === "resetAfterSplat" && (
          <>
            <p className="text-xl animate-pulse">Multiverse resetting...</p>
            <p>You awaken. Your coffee stands perfectly upright.</p>
            <p className="italic text-gray-400">This has happened before... hasn’t it?</p>
            {!hasCoffee && (
              <button onClick={handlePickupCoffee} className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded">
                Pick up Coffee
              </button>
            )}
            <div className="flex justify-center space-x-4">
              <button onClick={handleJump} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded">
                Jump
              </button>
              <button onClick={handleWaitAfterReset} className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded">
                Wait
              </button>
            </div>
          </>
        )}

        {/* Falling State */}
        {stage === "falling" && (
          <p className="italic">You feel the ground shift. Did something push you?</p>
        )}
      </div>
    </div>
  );
}

