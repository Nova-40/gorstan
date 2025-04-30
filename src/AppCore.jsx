// AppCore Component
// This component handles the introductory sequence of the game, including:
// - A welcome screen with options to start the intro or explore external links.
// - A pre-intro scene describing the player's situation.
// - A crossing sequence where the player must decide to "Jump" or "Wait".
// - Logic for handling user decisions, timeouts, and resetting the scene.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppCore({ setHasCoffee }) {
  // State variables
  const [stage, setStage] = useState(0); // Tracks the current stage of the crossing sequence
  const [showButtons, setShowButtons] = useState(false); // Determines whether the decision buttons are visible
  const [wasTooSlow, setWasTooSlow] = useState(false); // Tracks if the user was too slow to decide
  const [welcomeMode, setWelcomeMode] = useState(true); // Whether the welcome screen is displayed
  const [preIntro, setPreIntro] = useState(false); // Whether the pre-intro scene is displayed
  const [resetting, setResetting] = useState(false); // Whether the scene is resetting
  const [showSplat, setShowSplat] = useState(false); // Whether the "SPLAT" message is displayed
  const navigate = useNavigate(); // React Router's navigation hook

  // Effect to handle timeout when buttons are shown
  useEffect(() => {
    if (showButtons) {
      const timeout = setTimeout(() => {
        handleTimeout(); // Trigger timeout logic if no decision is made
      }, 10000); // 10 seconds to wait before the truck hits
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [showButtons]);

  // Start the intro sequence
  const startIntro = () => {
    setWelcomeMode(false); // Hide the welcome screen
    setPreIntro(true); // Show the pre-intro scene
  };

  // Start the crossing sequence
  const startCrossing = () => {
    setPreIntro(false); // Hide the pre-intro scene
    const audio = new Audio("/horn.mp3"); // Play a horn sound
    audio.play().catch(() => {}); // Catch any errors (e.g., autoplay restrictions)
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
      } else {
        clearInterval(interval); // Clear the interval when all stages are complete
      }
    }, 1500); // Progress every 1.5 seconds
  };

  // Handle timeout when no decision is made
  const handleTimeout = () => {
    if (setHasCoffee) setHasCoffee(false); // Update coffee state if applicable
    setWasTooSlow(true); // Mark the user as too slow
    setShowButtons(false); // Hide buttons
    setShowSplat(true); // Show the "SPLAT" message
    setTimeout(() => setResetting(true), 2000); // Start resetting after 2 seconds
    setTimeout(() => {
      setResetting(false); // Stop resetting
      setWasTooSlow(false); // Reset the "too slow" state
      setShowSplat(false); // Hide the "SPLAT" message
      setShowButtons(true); // Show buttons again
    }, 5500); // Reset after 5.5 seconds
  };

  // Handle the "Wait" button click
  const handleWait = () => {
    handleTimeout(); // Trigger the timeout logic
  };

  // Handle the "Jump" button click
  const handleJump = () => {
    navigate("/controlnexus"); // Navigate to the next part of the game
  };

  // Render the current stage of the crossing sequence
  const renderStage = () => {
    if (showSplat) {
      return (
        <div className="text-red-500 text-4xl animate-bounce">
          💥 SPLAT 💥
          <div className="text-sm text-gray-300 mt-2 italic">
            Fortunately, your coffee seems to land upright without a drop being spilt — a small mercy in a cruel day.
            <span className="block mt-1 text-xs text-amber-400 animate-pulse">
              It even seems to glow faintly... almost as if it's important.
            </span>
          </div>
        </div>
      );
    }
    if (resetting) {
      return (
        <div className="text-blue-400 text-xl animate-pulse">
          Please hold... Multiversal reality is resetting...
        </div>
      );
    }
    if (wasTooSlow) {
      return (
        <div className="text-red-600 text-lg animate-pulse">
          Oh dear. Your prevarication hasn't ended well.<br />
          The truck that was barrelling along has just collided with you.<br />
          Fortunately, something somewhere in the multiverse still needs you...
        </div>
      );
    }
    switch (stage) {
      case 0:
        return <div className="text-white">You are standing at the edge of something strange...</div>;
      case 1:
        return <div className="text-white">A sound grows louder.</div>;
      case 2:
        return <div className="text-white">Metal. Thunder. Momentum.</div>;
      case 3:
        return <div className="text-yellow-400 text-2xl animate-bounce">Decide. Now.</div>;
      default:
        return null; // Return nothing for invalid stages
    }
  };

  // Render the welcome screen
  if (welcomeMode) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Gorstan</h1>
        <p className="text-lg">A strange tale unfolds across the multiverse...</p>
        <div className="space-x-4">
          <button
            onClick={startIntro}
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-xl shadow"
          >
            Start Intro
          </button>
          <a
            href="https://www.buymeacoffee.com/gorstan"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl shadow"
          >
            ☕ Buy Me a Coffee
          </a>
          <a
            href="https://www.geoffwebsterbooks.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow"
          >
            📚 Read the Books
          </a>
        </div>
      </div>
    );
  }

  // Render the pre-intro scene
  if (preIntro) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center space-y-6">
        <p className="text-xl max-w-xl">
          You've been having a good day. Walking to the station to get home, you grabbed a coffee from Findlater's Coffee Shop and started to cross the road at Findlater's Corner.<br /><br />
          You didn’t notice that big yellow truck that’s barrelling along towards you...
        </p>
        <button
          onClick={startCrossing}
          className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-xl shadow"
        >
          🚨 Continue
        </button>
      </div>
    );
  }

  // Render the crossing sequence
  return (
    <div
      className="relative w-full h-screen bg-black text-center flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/crossing.png)' }}
    >
      <div className="bg-black bg-opacity-60 p-6 rounded-xl shadow-xl">
        {renderStage()}
        {showButtons && (
          <div className="mt-6 space-x-4">
            <button
              onClick={handleWait}
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-800"
            >
              Wait
            </button>
            <button
              onClick={handleJump}
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