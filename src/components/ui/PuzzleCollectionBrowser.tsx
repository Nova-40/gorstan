/**
 * Puzzle Collection Browser Component
 * Browse and select puzzle collections and individual puzzles
 */

import React, { useState } from 'react';
import {
  type LogicPuzzle,
  type PuzzleCollection,
  type AdaptiveDifficulty,
  type PuzzleDifficulty,
  type PuzzleType,
} from '../../types/logicPuzzles';

interface PuzzleCollectionBrowserProps {
  collections: PuzzleCollection[];
  puzzles: LogicPuzzle[];
  playerDifficulty?: AdaptiveDifficulty;
  onSelectPuzzle: (puzzle: LogicPuzzle) => void;
  onSelectCollection?: (collection: PuzzleCollection) => void;
  onGeneratePuzzle?: (type: PuzzleType, difficulty: PuzzleDifficulty) => void;
  onClose: () => void;
  className?: string;
}

type ViewMode = 'collections' | 'puzzles' | 'recommended' | 'generator';

const PuzzleCollectionBrowser: React.FC<PuzzleCollectionBrowserProps> = ({
  collections,
  puzzles,
  playerDifficulty,
  onSelectPuzzle,
  onGeneratePuzzle,
  onClose,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('collections');
  const [selectedCollection, setSelectedCollection] = useState<PuzzleCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<PuzzleDifficulty | 'all'>('all');
  const [filterType, setFilterType] = useState<PuzzleType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'completion' | 'recent'>('name');

  // Filter and sort puzzles
  const getFilteredPuzzles = () => {
    let filtered = puzzles;

    if (selectedCollection) {
      filtered = puzzles.filter((p) => selectedCollection.puzzles.includes(p.id));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.metadata.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty === filterDifficulty);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((p) => p.type === filterType);
    }

    // Sort puzzles
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = ['trivial', 'easy', 'medium', 'hard', 'expert', 'quantum'];
          return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
        case 'completion':
          return (
            b.analytics.completions / Math.max(1, b.analytics.attempts) -
            a.analytics.completions / Math.max(1, a.analytics.attempts)
          );
        case 'recent':
          return b.metadata.created - a.metadata.created;
        default:
          return 0;
      }
    });
  };

  const getRecommendedPuzzles = () => {
    if (!playerDifficulty) {
      return puzzles.slice(0, 5);
    }

    return puzzles
      .filter((p) => {
        // Filter by recommended difficulty and types
        return (
          playerDifficulty.recommendations.suggestedTypes.includes(p.type) &&
          p.difficulty === playerDifficulty.recommendations.nextDifficulty
        );
      })
      .slice(0, 10);
  };

  const getDifficultyColor = (difficulty: PuzzleDifficulty) => {
    switch (difficulty) {
      case 'trivial':
        return 'text-green-400 bg-green-900';
      case 'easy':
        return 'text-blue-400 bg-blue-900';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900';
      case 'hard':
        return 'text-orange-400 bg-orange-900';
      case 'expert':
        return 'text-red-400 bg-red-900';
      case 'quantum':
        return 'text-purple-400 bg-purple-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  const getTypeIcon = (type: PuzzleType) => {
    switch (type) {
      case 'sequence':
        return '🔢';
      case 'grid':
        return '⬜';
      case 'logic':
        return '🧠';
      case 'cipher':
        return '🔐';
      case 'quantum':
        return '⚛️';
      case 'artifact':
        return '💎';
      case 'hybrid':
        return '🔗';
      default:
        return '❓';
    }
  };

  const getCollectionProgress = (collection: PuzzleCollection) => {
    const collectionPuzzles = puzzles.filter((p) => collection.puzzles.includes(p.id));
    const completed = collectionPuzzles.filter((p) => p.analytics.completions > 0).length;
    return { completed, total: collectionPuzzles.length };
  };

  const renderCollectionView = () => (
    <div className="space-y-4">
      {collections.map((collection) => {
        const progress = getCollectionProgress(collection);
        const completionRate = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

        return (
          <div
            key={collection.id}
            className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedCollection(collection);
              setViewMode('puzzles');
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{collection.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded capitalize ${
                      collection.theme === 'tutorial'
                        ? 'bg-green-900 text-green-200'
                        : collection.theme === 'quantum'
                          ? 'bg-purple-900 text-purple-200'
                          : collection.theme === 'master'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-gray-900 text-gray-200'
                    }`}
                  >
                    {collection.theme}
                  </span>
                </div>

                <p className="text-gray-300 mb-3">{collection.description}</p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-gray-400">
                    {progress.completed}/{progress.total} puzzles completed
                  </div>
                  <div className="text-gray-400">
                    {collection.analytics.completionRate.toFixed(0)}% completion rate
                  </div>
                  {collection.analytics.averageTime > 0 && (
                    <div className="text-gray-400">
                      Avg: {Math.round(collection.analytics.averageTime / 60000)}min
                    </div>
                  )}
                </div>

                {completionRate > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-2xl mb-2">
                  {collection.theme === 'tutorial'
                    ? '📚'
                    : collection.theme === 'quantum'
                      ? '⚛️'
                      : collection.theme === 'master'
                        ? '👑'
                        : '🧩'}
                </div>
                <div className="text-xs text-gray-400">{collection.puzzles.length} puzzles</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPuzzleList = (puzzleList: LogicPuzzle[]) => (
    <div className="space-y-3">
      {puzzleList.map((puzzle) => {
        const completionRate =
          puzzle.analytics.attempts > 0
            ? (puzzle.analytics.completions / puzzle.analytics.attempts) * 100
            : 0;

        return (
          <div
            key={puzzle.id}
            className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors cursor-pointer"
            onClick={() => onSelectPuzzle(puzzle)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-2xl">{getTypeIcon(puzzle.type)}</div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-white">{puzzle.title}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${getDifficultyColor(puzzle.difficulty)}`}
                    >
                      {puzzle.difficulty}
                    </span>
                    {puzzle.quantumAspects && (
                      <span className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-200">
                        Quantum
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 mb-2">{puzzle.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Type: {puzzle.type}</span>
                    <span>Attempts: {puzzle.analytics.attempts}</span>
                    <span>Success: {completionRate.toFixed(0)}%</span>
                    {puzzle.analytics.averageTime > 0 && (
                      <span>Avg: {Math.round(puzzle.analytics.averageTime / 60000)}min</span>
                    )}
                  </div>

                  {puzzle.quantumAspects && (
                    <div className="mt-2">
                      <div className="text-xs text-purple-300">
                        Required Artifacts: {puzzle.quantumAspects.requiredArtifacts.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-green-400 font-bold">
                  +{puzzle.progression.rewards.experience} XP
                </div>
                {puzzle.progression.rewards.quantumResonance && (
                  <div className="text-xs text-blue-400">
                    +{puzzle.progression.rewards.quantumResonance} QR
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPuzzleGenerator = () => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Generate Custom Puzzle</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Puzzle Type</label>
            <select className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white">
              <option value="sequence">Sequence</option>
              <option value="grid">Grid</option>
              <option value="logic">Logic</option>
              <option value="cipher">Cipher</option>
              <option value="quantum">Quantum</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white">
              <option value="trivial">Trivial</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
              <option value="quantum">Quantum</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-300">Include Quantum Integration</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-300">Adaptive to Player Level</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-gray-300">Time Constraints</span>
          </label>
        </div>

        <button
          onClick={() => onGeneratePuzzle && onGeneratePuzzle('sequence', 'medium')}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Generate Puzzle
        </button>
      </div>

      {playerDifficulty && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Player Analysis</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Level:</span>
              <span className="ml-2 text-white">{playerDifficulty.currentLevel.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-gray-400">Confidence:</span>
              <span className="ml-2 text-white">
                {(playerDifficulty.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">Recommended:</span>
              <span className="ml-2 text-yellow-400 capitalize">
                {playerDifficulty.recommendations.nextDifficulty}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Preferred Types:</span>
              <span className="ml-2 text-blue-400">
                {playerDifficulty.recommendations.suggestedTypes.join(', ')}
              </span>
            </div>
          </div>

          {playerDifficulty.recommendations.skillGaps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-gray-300 mb-2">Areas for Improvement</h4>
              <div className="space-y-1">
                {playerDifficulty.recommendations.skillGaps.map((gap, index) => (
                  <div key={index} className="text-xs text-orange-400">
                    • {gap}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 ${className}`}
    >
      <div className="max-w-6xl w-full h-full max-h-[90vh] bg-gray-800 border border-gray-600 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h1 className="text-2xl font-bold text-white">Logic Puzzles</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-600">
          {[
            { mode: 'collections' as ViewMode, label: 'Collections', icon: '📚' },
            { mode: 'puzzles' as ViewMode, label: 'All Puzzles', icon: '🧩' },
            { mode: 'recommended' as ViewMode, label: 'Recommended', icon: '⭐' },
            { mode: 'generator' as ViewMode, label: 'Generator', icon: '⚙️' },
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        {(viewMode === 'puzzles' || viewMode === 'recommended') && (
          <div className="p-4 border-b border-gray-600 space-y-4">
            {/* Search */}
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search puzzles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as PuzzleDifficulty | 'all')}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="all">All Difficulties</option>
                <option value="trivial">Trivial</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
                <option value="quantum">Quantum</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as PuzzleType | 'all')}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="all">All Types</option>
                <option value="sequence">Sequence</option>
                <option value="grid">Grid</option>
                <option value="logic">Logic</option>
                <option value="cipher">Cipher</option>
                <option value="quantum">Quantum</option>
                <option value="artifact">Artifact</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="name">Sort by Name</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="completion">Sort by Success Rate</option>
                <option value="recent">Sort by Recent</option>
              </select>
            </div>

            {selectedCollection && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedCollection(null);
                    setViewMode('collections');
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  ← Back to Collections
                </button>
                <span className="text-gray-400">|</span>
                <span className="text-white font-medium">{selectedCollection.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'collections' && renderCollectionView()}
          {viewMode === 'puzzles' && renderPuzzleList(getFilteredPuzzles())}
          {viewMode === 'recommended' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Recommended for You</h2>
              {renderPuzzleList(getRecommendedPuzzles())}
            </div>
          )}
          {viewMode === 'generator' && renderPuzzleGenerator()}
        </div>
      </div>
    </div>
  );
};

export default PuzzleCollectionBrowser;
