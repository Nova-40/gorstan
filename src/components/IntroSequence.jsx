// IntroSequence Component
// This component renders the introductory sequence of the game.
// It progresses through multiple stages, prompting the user to make a decision (e.g., "Jump" or "Wait").
// If the user is too slow to decide, a message is displayed, and the sequence resets.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroSequence({ setHasCoffee, setShowIntro }) 
  {
  // State variables
  const [stage, setStage] = useState(0); // Tracks the current stage of the intro sequence
  const [showButtons, setShowButtons] = useState(false); // Determines whether the decision buttons are visible
  const [wasTooSlow, setWasTooSlow] = useState(false); // Tracks if the user was too slow to decide
  const navigate = useNavigate(); // React Router's navigation hook

  // Effect to progress through the intro stages
  useEffect(() => {
    const stages = [
      () => setStage(1), // Stage 1: Initial message
      () => setStage(2), // Stage 2: Sound grows louder
      () => setStage(3), // Stage 3: Metal and momentum
      () => setShowButtons(true), // Final stage: Show decision buttons
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < stages.length) {
        stages[idx++](); // Progress through the stages
      }
    }, 1500); // Progress every 1.5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Effect to handle timeout when buttons are shown
  useEffect(() => {
    if (showButtons) {
      const timeout = setTimeout(() => {
        setWasTooSlow(true); // Mark the user as too slow
        setShowButtons(false); // Hide buttons
        setTimeout(() => {
          setWasTooSlow(false); // Reset the "too slow" state
          setShowButtons(true); // Show buttons again
        }, 2500); // Reset after 2.5 seconds
      }, 5000); // User has 5 seconds to decide
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [showButtons]);

  // Handle the "Jump" button click
  const handleJump = () => {
    if (setShowIntro) setShowIntro(false);  // ensures the game begins
    navigate("/controlnexus");
  };

  // Render the current stage of the intro sequence
  const renderStage = () => {
    if (wasTooSlow) {
      return (
        <div className="text-red-700 text-xl animate-pulse">
          You didn’t move fast enough.
        </div>
      );
    }
    switch (stage) {
      case 0:
        return (
          <div className="text-white">
            You are standing at the edge of something strange...
          </div>
        );
      case 1:
        return <div className="text-white">A sound grows louder.</div>;
      case 2:
        return <div className="text-white">Metal. Thunder. Momentum.</div>;
      case 3:
        return (
          <div className="text-yellow-400 text-2xl animate-bounce">
            Decide. Now.
          </div>
        );
      default:
        return null; // Return nothing for invalid stages
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-black text-center flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/crossing.png)" }} // Background image for the intro
    >
      <div className="bg-black bg-opacity-60 p-6 rounded-xl shadow-xl">
        {/* Render the current stage */}
        {renderStage()}
        {/* Show decision buttons if applicable */}
        {showButtons && (
          <div className="mt-6 space-x-4">
            <button
              onClick={() => setWasTooSlow(true)} // Simulate "Wait" action
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-800"
            >
              Wait
            </button>
            <button
              onClick={handleJump} // Handle "Jump" action
              className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-800"
            >
              Jump
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
