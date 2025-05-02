// AppCore Component (Refined Intro Logic)
// This component handles the full game introduction sequence:
// - Welcome screen
// - Pre-intro monologue
// - Crossing with SPLAT or Jump
// - Reset scene if SPLAT
// - Post-reset decisions: pick up coffee, jump, or wait
// - Final transition into controlnexus

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppCore({ setHasCoffee, setShowIntro }) {
  const [stage, setStage] = useState("welcome");
  const [showButtons, setShowButtons] = useState(false);
  const [wasTooSlow, setWasTooSlow] = useState(false);
  const [hasCoffee, setLocalCoffee] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === "crossingButtons") {
      const timeout = setTimeout(() => handleTimeout(), 10000);
      return () => clearTimeout(timeout);
    }
  }, [stage]);

  const startIntro = () => setStage("preIntro");

  const advanceCrossing = () => {
    const stages = ["crossing1", "crossing2", "crossing3", "crossingButtons"];
    let i = 0;
    const interval = setInterval(() => {
      setStage(stages[i]);
      i++;
      if (i === stages.length) clearInterval(interval);
    }, 1500);
  };

  const handleTimeout = () => {
    setWasTooSlow(true);
    if (setHasCoffee) setHasCoffee(false);
    setLocalCoffee(false);
    setStage("splat");
    setTimeout(() => setStage("resetAfterSplat"), 3000);
  };

  const handleJump = () => {
    setShowIntro(false);
    navigate("/controlnexus");
  };

  const handlePickupCoffee = () => {
    setLocalCoffee(true);
    if (setHasCoffee) setHasCoffee(true);
  };

  const handleWaitAfterReset = () => {
    setStage("falling");
    setTimeout(() => handleJump(), 2000);
  };

  return (
    <div className="p-4 text-white text-center">
      {stage === "welcome" && (
        <>
          <h1 className="text-3xl mb-4">Welcome to Gorstan</h1>
          <p>Simulated reality engaged. Try not to break it.</p>
          <button onClick={startIntro} className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Begin
          </button>
        </>
      )}

      {stage === "preIntro" && (
        <>
          <p className="mb-4">You sense something is wrong. The air smells like static.</p>
          <button onClick={advanceCrossing} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
            Proceed
          </button>
        </>
      )}

      {stage === "crossing1" && <p>A horn blares in the distance...</p>}
      {stage === "crossing2" && <p>It’s getting louder. Yellow... <strong>TRUCK!!!</strong></p>}
      {stage === "crossing3" && <p>Metal and momentum converge—</p>}

      {stage === "crossingButtons" && (
        <>
          <p className="mb-2">Do something!</p>
          <div className="space-x-4">
            <button onClick={handleJump} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              Jump
            </button>
            <button onClick={handleTimeout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
              Wait
            </button>
          </div>
        </>
      )}

      {stage === "splat" && (
        <h1 className="text-6xl text-red-600 mt-10">SPLAT.</h1>
      )}

      {stage === "resetAfterSplat" && (
        <>
          <p className="mt-6 mb-2">Multiverse resetting...</p>
          <p className="mb-4">You awaken. Your coffee stands perfectly upright.</p>
          <div className="space-y-2">
            {!hasCoffee && (
              <button onClick={handlePickupCoffee} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">
                Pick up Coffee
              </button>
            )}
            <div className="space-x-4">
              <button onClick={handleJump} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Jump
              </button>
              <button onClick={handleWaitAfterReset} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                Wait
              </button>
            </div>
          </div>
        </>
      )}

      {stage === "falling" && (
        <p className="mt-6 italic">You feel the ground shift. Did something push you?</p>
      )}
    </div>
  );
}


