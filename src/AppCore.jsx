// /src/AppCore.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0
// /src/AppCore.jsx
import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { rooms } from './engine/rooms';
import ErrorBoundary from './ErrorBoundary';
import PuzzleUI from './components/PuzzleUI';
import MovementPanel from './components/MovementPanel';
import './tailwind.css';

const game = new GameEngine();

export default function AppCore() {
  const [command, setCommand] = useState('');
  const [gameLog, setGameLog] = useState([]);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [scene, setScene] = useState('');
  const terminalRef = useRef(null);

  useEffect(() => {
    game.setOutputHandler(setGameLog);
    game.setPuzzleHandler(setActivePuzzle);
    game.setSceneHandler(setScene);
  }, []);

  const handleCommand = (cmd) => {
    if (!cmd.trim()) return;
    setCommandHistory([...commandHistory, cmd]);
    setHistoryIndex(-1);
    setCommand('');
    game.handleCommand(cmd);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(command);
    } else if (e.key === 'ArrowUp') {
      const newIndex = Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCommand(commandHistory[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
      setHistoryIndex(newIndex);
      setCommand(commandHistory[newIndex] || '');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black p-4 rounded shadow-md" ref={terminalRef}>
            {gameLog.map((entry, index) => (
              <div key={index} className="mb-2 whitespace-pre-wrap">{entry}</div>
            ))}
          </div>
          <input
            type="text"
            className="w-full mt-4 p-2 text-black rounded"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
          />
          {activePuzzle && <PuzzleUI puzzle={activePuzzle} onComplete={game.handlePuzzleComplete} />}
          <MovementPanel scene={scene} onMove={game.handleMove} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
