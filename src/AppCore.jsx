
import { useEffect } from "react";

export function quitGame(gameState, setShowIntro) {
  gameState.resetGame();
  gameState.hasStarted = false;
  gameState.currentRoom = null;
  setShowIntro(true);
}

export default function AppCore({ setShowIntro }) {
  const startIntro = () => {
    try {
      if (window.gameState) {
        window.gameState.currentRoom = 'introstreet1';
        window.gameState.hasStarted = true;
      }
      setShowIntro(false);
    } catch (err) {
      console.error("❌ Error starting intro:", err);
    }
  };

  useEffect(() => {
    if (window.gameState) {
      window.gameState.quitGame = (gs) => quitGame(gs, setShowIntro);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-10">
      <div className="max-w-xl w-full text-center space-y-6">
        <a href="/controlnexus" className="block mt-2 text-sm text-yellow-400 underline hover:text-yellow-300">
          Debug: skip to game
        </a>
        <h1 className="text-4xl font-bold">Welcome to Gorstan</h1>
        <p className="italic">Simulated reality engaged. Try not to break it.</p>
        <button onClick={startIntro} className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
          Begin
        </button>
      </div>
    </div>
  );
}
