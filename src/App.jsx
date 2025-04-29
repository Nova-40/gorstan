// /src/App.jsx
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

// App Component
// This is the main component of the Gorstan game. It manages the game state, player interactions, and renders the UI.
// Features include:
// - Command input for interacting with the game.
// - A game log to display messages.
// - A movement panel for directional navigation.
// - Puzzle solving and player name input functionality.

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { rooms } from './engine/rooms';
import ErrorBoundary from './ErrorBoundary';
import PuzzleUI from './components/PuzzleUI';
import MovementPanel from './components/MovementPanel';
import './tailwind.css';

// Initialize the game engine
const game = new GameEngine();

export default function App() {
  // State variables
  const [command, setCommand] = useState(''); // Current command input
  const [gameLog, setGameLog] = useState([]); // Log of game messages
  const [playerNameInput, setPlayerNameInput] = useState(''); // Player name input field
  const [playerName, setPlayerName] = useState(''); // Player's name
  const [commandHistory, setCommandHistory] = useState([]); // History of entered commands
  const [historyIndex, setHistoryIndex] = useState(-1); // Index for navigating command history
  const [activePuzzle, setActivePuzzle] = useState(null); // Current active puzzle
  const [showIntro, setShowIntro] = useState(true); // Whether to show the intro screen
  const [showHelp, setShowHelp] = useState(false);
  const logRef = useRef(null); // Reference to the game log for auto-scrolling
  const inputRef = useRef(null); // Reference to the input field for auto-focus

  // Start the game by setting the player's name and initializing the game state
  const startGame = () => {
    if (!playerNameInput.trim()) return;
    const trimmedName = playerNameInput.trim();
    setPlayerName(trimmedName);
    game.setPlayerName(trimmedName);
    game.currentRoom = 'intro';
    setGameLog([{ type: 'system', text: `The truck barrels toward you, ${trimmedName}... A portal shimmers open!` }]);
    game.updateStoryProgress('gameStarted');
  };

  // Auto-scroll the game log to the latest entry
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [gameLog]);

  // Automatically focus the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [command, playerName, activePuzzle]);

  // Handle player commands
  const handleCommand = () => {
    const trimmedCommand = command.trim().toLowerCase();
    if (!trimmedCommand) return;

    const newHistory = [...commandHistory, command];
    setCommandHistory(newHistory);
    setHistoryIndex(newHistory.length);
    setGameLog((prev) => [...prev.slice(-99), { type: 'player', text: `> ${command}` }]);

    try {
      const result = game.processCommand(trimmedCommand);
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result.message }]);
    } catch (error) {
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: `An error occurred: ${error.message}` }]);
    }

    setCommand('');
  };

  // Handle keyboard navigation for command history
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

  // Determine the CSS class for log messages
  const getMessageClass = (entry) => {
    if (game.currentRoom === 'intro') return 'text-green-400 bg-black p-4 text-xl font-mono animate-pulse';
    if (entry.type === 'player') return 'text-gray-400 italic';
    if (entry.text.startsWith('Ayla says:')) return 'text-yellow-300 font-handwriting bg-yellow-100 p-2 rounded-md';
    if (entry.text.toLowerCase().includes('hidden hatch opens') || entry.text.toLowerCase().includes('secret passage')) {
      return 'text-blue-400 animate-pulse font-bold';
    }
    return '';
  };

  // Handle puzzle solving
  const handlePuzzleSolve = (input) => {
    const result = activePuzzle.solve(input);
    setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result }]);
    setActivePuzzle(null);
  };

  // Handle movement commands from the MovementPanel
  const handlePanelMove = (cmd) => {
    try {
      const result = game.processCommand(cmd);
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: result.message }]);
    } catch (error) {
      setGameLog((prev) => [...prev.slice(-99), { type: 'system', text: `An error occurred: ${error.message}` }]);
    }
  };

  // Render the intro screen
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center p-8 z-50 transition-opacity duration-700 ease-in-out">
        <h1 className="text-4xl mb-6 font-bold animate-pulse">Welcome to Gorstan</h1>
        <p className="mb-2">🎮 <strong>How to Play:</strong> Use commands to explore rooms, solve puzzles, and talk to NPCs.</p>
        <p className="mb-2">🎯 <strong>Objectives:</strong> Discover hidden rooms, find secrets, and reveal the multiverse story.</p>
        <p className="mb-2">📚 <strong>Books:</strong> <a href="https://www.amazon.co.uk/s?k=Gorstan+Chronicles" target="_blank" rel="noopener noreferrer" className="underline text-yellow-300">The Gorstan Chronicles</a></p>
        <p className="mb-4">☕ <strong>Support:</strong> <a href="https://www.buymeacoffee.com/gorstan" target="_blank" rel="noopener noreferrer" className="underline text-green-300">Buy Me a Coffee</a></p>
        <div className="space-x-4">
          <button onClick={() => setShowHelp(true)} className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded">Help</button>
          <button onClick={() => setShowIntro(false)} className="bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded">Start</button>
        </div>

        {showHelp && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl mb-4">Help</h2>
            <p className="mb-2">Type commands like "look", "go north", "use [item]", or "talk to [NPC]" to interact.</p>
            <p className="mb-4">Explore thoroughly and pay attention to clues!</p>
            <button onClick={() => setShowHelp(false)} className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded">Close Help</button>
          </div>
        )}
      </div>
    );
  }

  // Render the player name input screen
  if (!playerName) {
    return (
      <div className="h-screen bg-black flex flex-col justify-center items-center text-green-400 font-mono">
        <h1 className="text-4xl mb-4 animate-pulse">Gorstan Awaits...</h1>
        <div className="flex space-x-2">
          <input
            className="border border-green-400 p-2 text-white bg-black placeholder-green-300"
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

  // Render the main game interface
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

        {playerName && game.currentRoom !== 'intro' && (
          <MovementPanel
            currentRoom={game.currentRoom}
            onMoveCommand={handlePanelMove}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

