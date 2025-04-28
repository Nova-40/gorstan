// /src/App.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { rooms } from './engine/rooms';
import ErrorBoundary from './ErrorBoundary';
import PuzzleUI from './components/PuzzleUI';

const game = new GameEngine();

export default function App() {
  const [command, setCommand] = useState('');
  const [gameLog, setGameLog] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (playerName) {
      game.setPlayerName(playerName);
      game.currentRoom = 'centralpark';
      const startRoom = rooms[game.currentRoom];
      if (startRoom?.description) {
        setGameLog((prev) => [...prev, { type: 'system', text: startRoom.description }]);
      }
      game.updateStoryProgress('gameStarted');
    }
  }, [playerName]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [gameLog]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [command, playerName]);

  const handleCommand = () => {
    const trimmedCommand = command.trim().toLowerCase();
    if (!trimmedCommand) return;

    const newHistory = [...commandHistory, command];
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length);
    setGameLog((prev) => [...prev.slice(-99), { type: 'player', text: `> ${command}` }]);

    // Handle "walk" command early
    if (trimmedCommand === 'walk') {
      autoWalkGame(game);
      setCommand('');
      return;
    }

    // Handle "solve" command
    if (trimmedCommand.startsWith('solve')) {
      const puzzleName = trimmedCommand.split(' ')[1];
      const puzzle = game.puzzles[puzzleName];
      if (puzzle?.options) {
        setActivePuzzle(puzzle);
        setCommand('');
        return;
      }
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: 'Puzzle not found.' }]);
      setCommand('');
      return;
    }

    try {
      const result = game.processCommand(command);
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result.message }]);
    } catch (error) {
      setGameLog((prev) => [
        ...prev.slice(-99),
        { type: 'system', text: `An error occurred: ${error.message}` },
      ]);
    }

    setCommand('');
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

  const handlePuzzleSolve = (selectedOption) => {
    if (!activePuzzle) return;

    const result = activePuzzle.solve(selectedOption);
    setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result }]);

    if (result.includes('trapdoor') || result.includes('dissolves into a glowing medallion')) {
      setActivePuzzle(null);
      if (result.includes('trapdoor')) {
        game.currentRoom = 'crossing2';
        setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: rooms['crossing2'].description }]);
      }
    }
  };

  const getMessageClass = (entry) => {
    if (entry.type === 'player') return 'text-gray-400 italic';
    if (entry.text.startsWith('Ayla says:')) return 'text-yellow-300 font-handwriting bg-yellow-100 p-2 rounded-md';
    if (entry.text.toLowerCase().includes('hidden hatch opens') || entry.text.toLowerCase().includes('secret passage')) {
      return 'text-blue-400 animate-pulse font-bold';
    }
    return '';
  };

  if (!playerName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Gorstan</h1>
        <input
          className="border p-2 mb-2"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          ref={inputRef}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {rooms[game.currentRoom]?.image && (
          <div className="mb-2">
            <img src={rooms[game.currentRoom].image} alt="Room" className="w-full max-w-lg rounded shadow" />
          </div>
        )}

        <div
          ref={logRef}
          className="bg-black text-green-400 p-4 w-full max-w-2xl h-64 overflow-y-auto rounded shadow mb-4 scroll-smooth"
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
              placeholder="Enter a command"
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






