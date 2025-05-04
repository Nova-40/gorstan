
import { useState } from 'react';
import AppCore from './AppCore';
import Game from './engine/Game'; // Adjust this import if your game lives elsewhere

export default function App() {
  const [showIntro, setShowIntro] = useState(!window.gameState?.hasStarted);

  return (
    <>
      {showIntro ? (
        <AppCore setShowIntro={setShowIntro} />
      ) : (
        <Game />
      )}
    </>
  );
}
