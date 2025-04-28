// /src/App.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { rooms } from './engine/rooms';
import ErrorBoundary from './ErrorBoundary';
import PuzzleUI from './components/PuzzleUI';
import './tailwind.css';

const game = new GameEngine();

export default function App() {
  const [command, setCommand] = useState('');
  const [gameLog, setGameLog] = useState([]);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  const startGame = () => {
    if (!playerNameInput.trim()) return;
    setPlayerName(playerNameInput.trim());
    game.setPlayerName(playerNameInput.trim());
    game.currentRoom = 'intro';
    setGameLog([{ type: 'system', text: `The truck barrels toward you, ${playerNameInput.trim()}... A portal shimmers open!` }]);
    game.updateStoryProgress('gameStarted');
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [gameLog]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [command, playerName, activePuzzle]);

  const handleCommand = () => {
    const trimmedCommand = command.trim().toLowerCase();
    if (!trimmedCommand) return;

    const newHistory = [...commandHistory, command];
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length);
    setGameLog((prev) => [...prev.slice(-99), { type: 'player', text: `> ${command}` }]);

    try {
      const result = game.processCommand(command);
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result.message }]);
    } catch (error) {
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: `An error occurred: ${error.message}` }]);
    }

    setCommand('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setCommand(commandHistory[historyIndex - 1] || '');
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setCommand(commandHistory[historyIndex + 1] || '');
      } else {
        setHistoryIndex(commandHistory.length);
        setCommand('');
      }
    }
  };

  const getMessageClass = (entry) => {
    if (game.currentRoom === 'intro') return 'text-green-400 bg-black p-4 text-xl font-mono animate-pulse';
    if (entry.type === 'player') return 'text-gray-400 italic';
    if (entry.text.startsWith('Ayla says:')) return 'text-yellow-300 font-handwriting bg-yellow-100 p-2 rounded-md';
    if (entry.text.toLowerCase().includes('hidden hatch opens') || entry.text.toLowerCase().includes('secret passage')) {
      return 'text-blue-400 animate-pulse font-bold';
    }
    return '';
  };

  const handlePuzzleSolve = (input) => {
    const result = activePuzzle.solve(input);
    setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result }]);
    setActivePuzzle(null);
  };

  if (!playerName) {
    return (
      <div className="h-screen bg-black flex flex-col justify-center items-center text-green-400 font-mono">
        <h1 className="text-4xl mb-4 animate-pulse">Welcome to Gorstan</h1>
        <div className="flex space-x-2">
          <input
            className="border border-green-400 p-2 text-black"
            placeholder="Enter your name..."
            value={playerNameInput}
            onChange={(e) => setPlayerNameInput(e.target.value)}
            ref={inputRef}
          />
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          >
            Start Adventure
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${game.currentRoom === 'intro' ? 'bg-black' : 'bg-gray-900'} text-green-400 font-mono p-4 flex flex-col items-center`}>
        {rooms[game.currentRoom]?.image && (
          <div className="mb-2 animate-fadeIn">
            <img src={rooms[game.currentRoom].image} alt="Room" className="w-full max-w-lg rounded shadow" />
          </div>
        )}

        <div
          ref={logRef}
          className="bg-black text-green-400 p-4 w-full max-w-2xl h-72 overflow-y-auto rounded shadow mb-4 scroll-smooth"
        >
          {gameLog.map((entry, idx) => (
            <div key={idx} className={getMessageClass(entry)}>
              {entry.text}
            </div>
          ))}
        </div>

        {activePuzzle ? (
          <PuzzleUI puzzle={activePuzzle} onSolve={handlePuzzleSolve} />
        ) : (
          <div className="flex w-full max-w-2xl">
            <input
              ref={inputRef}
              className="border p-2 flex-1"
              placeholder={game.currentRoom === 'intro' ? 'Type jump!' : 'Enter a command...'}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleCommand} className="bg-green-600 text-white p-2 ml-2 hover:bg-green-700 transition">
              Go
            </button>
          </div>
        )}

        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Explore more of Gorstan in{' '}
            <a
              href="https://www.amazon.co.uk/s?k=Gorstan+Chronicles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              The Gorstan Chronicles
            </a>
            .
          </p>
          <p>
            Enjoying the adventure?{' '}
            <a
              href="https://www.buymeacoffee.com/gorstan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline"
            >
              Buy me a coffee!
            </a>
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

