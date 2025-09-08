/**
 * Puzzle Solver Interface Component
 * Main interface for solving logic puzzles with quantum artifact integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  type LogicPuzzle,
  type PuzzleSession,
  type SequencePuzzle,
  type QuantumPuzzle
} from '../../types/logicPuzzles';

interface PuzzleSolverProps {
  puzzle: LogicPuzzle;
  session: PuzzleSession;
  onMove: (action: string, data: any, artifactStates?: { [artifactId: string]: any }) => void;
  onHint: (hintIndex: number) => void;
  onComplete?: (result: any) => void;
  onClose: () => void;
  availableArtifacts?: { [artifactId: string]: any };
  className?: string;
}

const PuzzleSolver: React.FC<PuzzleSolverProps> = ({
  puzzle,
  session,
  onMove,
  onHint,
  onClose,
  availableArtifacts = {},
  className = ''
}) => {
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [artifactStates, setArtifactStates] = useState<{ [artifactId: string]: any }>({});
  const [quantumResonance, setQuantumResonance] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!session.endTime) {
        setElapsedTime(Date.now() - session.startTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session.startTime, session.endTime]);

  // Initialize artifact states
  useEffect(() => {
    if (puzzle.quantumAspects) {
      const initialStates: { [artifactId: string]: any } = {};
      puzzle.quantumAspects.requiredArtifacts.forEach(artifactId => {
        if (availableArtifacts[artifactId]) {
          initialStates[artifactId] = {
            active: false,
            resonance: 0,
            energy: availableArtifacts[artifactId].energy || 100,
            element: availableArtifacts[artifactId].element
          };
        }
      });
      setArtifactStates(initialStates);
    }
  }, [puzzle.quantumAspects, availableArtifacts]);

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleMove = useCallback((action: string, data: any) => {
    onMove(action, data, artifactStates);
  }, [onMove, artifactStates]);

  const handleHintRequest = (hintIndex: number) => {
    onHint(hintIndex);
    const hint = puzzle.puzzle.hints[hintIndex];
    if (hint !== undefined) {
      setCurrentHint(hint);
    }
    setShowHints(true);
  };

  const handleArtifactActivation = (artifactId: string, interactionType: string) => {
    if (!artifactStates[artifactId]) {return;}

    const newStates = {
      ...artifactStates,
      [artifactId]: {
        ...artifactStates[artifactId],
        active: !artifactStates[artifactId].active,
        resonance: artifactStates[artifactId].active ? 0 : 0.8
      }
    };

    setArtifactStates(newStates);
    
    // Update quantum resonance
    const totalResonance = Object.values(newStates).reduce((sum, state: any) => 
      sum + (state.active ? state.resonance : 0), 0
    );
    setQuantumResonance(totalResonance);

    // Send quantum interaction move
    handleMove('quantum_interaction', {
      artifactId,
      interactionType,
      resonance: totalResonance
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'trivial': return 'text-green-400';
      case 'easy': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      case 'quantum': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const renderPuzzleContent = () => {
    switch (puzzle.type) {
      case 'sequence':
        return <SequencePuzzleRenderer 
          puzzleData={puzzle.puzzle.data as SequencePuzzle}
          onMove={handleMove}
        />;
      case 'grid':
        return <div className="text-center text-gray-400 py-8">
          Grid puzzles coming soon...
        </div>;
      case 'logic':
        return <div className="text-center text-gray-400 py-8">
          Logic puzzles coming soon...
        </div>;
      case 'cipher':
        return <div className="text-center text-gray-400 py-8">
          Cipher puzzles coming soon...
        </div>;
      case 'quantum':
      case 'artifact':
        return <QuantumPuzzleRenderer 
          puzzleData={puzzle.puzzle.data as QuantumPuzzle}
          artifactStates={artifactStates}
          onMove={handleMove}
          onArtifactActivation={handleArtifactActivation}
        />;
      default:
        return <div className="text-gray-400">Unsupported puzzle type: {puzzle.type}</div>;
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 ${className}`}>
      <div className="max-w-6xl w-full h-full max-h-[95vh] bg-gray-800 border border-gray-600 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-white">{puzzle.title}</h1>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`capitalize font-medium ${getDifficultyColor(puzzle.difficulty)}`}>
                  {puzzle.difficulty}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 capitalize">{puzzle.type}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {puzzle.progression.timeConstraints?.timeLimit && (
              <div className="text-sm text-gray-300">
                Limit: {formatTime(puzzle.progression.timeConstraints.timeLimit)}
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Puzzle Description */}
        <div className="p-4 border-b border-gray-600 bg-gray-750">
          <p className="text-gray-200">{puzzle.description}</p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Puzzle Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderPuzzleContent()}
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-600 flex flex-col">
            {/* Progress Info */}
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-sm font-bold text-gray-300 mb-3">Progress</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Moves:</span>
                  <span className="text-white">{session.progress.moves.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mistakes:</span>
                  <span className="text-red-400">{session.progress.mistakes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hints Used:</span>
                  <span className="text-yellow-400">{session.progress.hintsUsed.length}</span>
                </div>
                {session.result && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-green-400">{session.result.score}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantum Artifacts */}
            {puzzle.quantumAspects && (
              <div className="p-4 border-b border-gray-600">
                <h3 className="text-sm font-bold text-gray-300 mb-3">Quantum Artifacts</h3>
                <div className="space-y-3">
                  {puzzle.quantumAspects.requiredArtifacts.map(artifactId => {
                    const state = artifactStates[artifactId];
                    if (!state) {return null;}

                    return (
                      <div key={artifactId} className="bg-gray-700 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white capitalize">
                            {artifactId.replace(/_/g, ' ')}
                          </span>
                          <button
                            onClick={() => handleArtifactActivation(artifactId, 'channel')}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              state.active 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                            }`}
                          >
                            {state.active ? 'Active' : 'Activate'}
                          </button>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Resonance:</span>
                            <span className="text-blue-400">{(state.resonance * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Energy:</span>
                            <span className="text-green-400">{state.energy}%</span>
                          </div>
                        </div>
                        
                        {state.active && (
                          <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${state.resonance * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {quantumResonance > 0 && (
                    <div className="mt-3 p-2 bg-purple-900 rounded border border-purple-600">
                      <div className="text-xs text-purple-200">
                        Total Quantum Resonance: {(quantumResonance * 100).toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hints */}
            <div className="p-4 border-b border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300">Hints</h3>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                >
                  {showHints ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showHints && (
                <div className="space-y-2">
                  {puzzle.puzzle.hints.map((hintText, index) => (
                    <div key={index}>
                      <button
                        onClick={() => handleHintRequest(index)}
                        disabled={session.progress.hintsUsed.includes(index)}
                        className={`w-full text-left p-2 text-xs rounded transition-colors ${
                          session.progress.hintsUsed.includes(index)
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        }`}
                      >
                        Hint {index + 1}
                        {session.progress.hintsUsed.includes(index) && (
                          <span className="ml-2 text-yellow-400">✓</span>
                        )}
                      </button>
                      {session.progress.hintsUsed.includes(index) && (
                        <div className="mt-1 p-2 text-xs text-blue-300 bg-gray-800 rounded">
                          {hintText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {currentHint && (
                <div className="mt-3 p-3 bg-yellow-900 border border-yellow-600 rounded">
                  <div className="text-xs text-yellow-200">{currentHint}</div>
                </div>
              )}
            </div>

            {/* Rewards Preview */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-300 mb-3">Completion Rewards</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-green-400">+{puzzle.progression.rewards.experience}</span>
                </div>
                {puzzle.progression.rewards.quantumResonance && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantum Resonance:</span>
                    <span className="text-blue-400">+{puzzle.progression.rewards.quantumResonance}</span>
                  </div>
                )}
                {puzzle.progression.rewards.artifactProgression && (
                  <div className="mt-2">
                    <div className="text-gray-400 mb-1">Artifact Progress:</div>
                    {Object.entries(puzzle.progression.rewards.artifactProgression).map(([id, amount]) => (
                      <div key={id} className="flex justify-between ml-2">
                        <span className="text-gray-500 capitalize">{id.replace(/_/g, ' ')}:</span>
                        <span className="text-purple-400">+{amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder renderers for different puzzle types
const SequencePuzzleRenderer: React.FC<{ puzzleData: SequencePuzzle; onMove: (action: string, data: any) => void }> = ({ puzzleData, onMove }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white">Complete the Sequence</h3>
    <div className="flex space-x-2 flex-wrap">
      {puzzleData.sequence.map((value, index) => (
        <div
          key={index}
          className={`w-16 h-16 border-2 border-gray-600 rounded flex items-center justify-center text-lg font-bold ${
            value === null ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-white'
          }`}
        >
          {value === null ? (
            <input
              type="number"
              className="w-full h-full bg-transparent text-center text-white outline-none"
              onChange={(e) => onMove('fill_sequence', { index, value: parseInt(e.target.value) || 0 })}
            />
          ) : (
            String(value)
          )}
        </div>
      ))}
    </div>
    <div className="text-sm text-gray-400">
      Pattern: {puzzleData.pattern.rule}
    </div>
  </div>
);

// QuantumPuzzleRenderer component  
const QuantumPuzzleRenderer: React.FC<{ 
  puzzleData: QuantumPuzzle; 
  artifactStates: { [artifactId: string]: any };
  onMove: (action: string, data: any) => void;
  onArtifactActivation: (artifactId: string, interactionType: string) => void;
}> = ({ puzzleData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white">Quantum Resonance Challenge</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-700 rounded p-4">
        <h4 className="font-bold text-blue-300 mb-2">Quantum State</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Superposition:</span>
            <span className={puzzleData.quantumState.superposition ? 'text-green-400' : 'text-red-400'}>
              {puzzleData.quantumState.superposition ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700 rounded p-4">
        <h4 className="font-bold text-green-300 mb-2">Target State</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Entangled:</span>
            <span className="text-green-400">{puzzleData.quantumGates.target.entangled ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PuzzleSolver;
