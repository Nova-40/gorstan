/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Target, Calendar, Star, Award, Timer } from 'lucide-react';
import { useGameState } from '../state/gameState';
import { showNotification } from './QuickWinNotifications';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'speed_run' | 'score_attack' | 'exploration' | 'puzzle_master' | 'social';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit?: number; // in seconds
  targetScore?: number;
  requirements: string[];
  rewards: {
    points: number;
    title?: string;
    badge?: string;
  };
  isDaily?: boolean;
  expiresAt?: number; // timestamp
  progress?: number;
  completed?: boolean;
}

interface DailyObjective {
  id: string;
  title: string;
  description: string;
  type: 'visit_rooms' | 'complete_miniquests' | 'earn_points' | 'talk_to_npcs' | 'solve_puzzles';
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  expiresAt: number;
}

interface ChallengeSystemProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChallengeSystem: React.FC<ChallengeSystemProps> = ({
  className = '',
  isOpen,
  onClose,
}) => {
  const { state } = useGameState();
  const [activeTab, setActiveTab] = useState<'challenges' | 'daily' | 'leaderboard'>('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [dailyObjectives, setDailyObjectives] = useState<DailyObjective[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);

  // Generate daily objectives
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('gorstan_daily_date');

    if (savedDate !== today) {
      // Generate new daily objectives
      const newObjectives = generateDailyObjectives();
      setDailyObjectives(newObjectives);
      localStorage.setItem('gorstan_daily_date', today);
      localStorage.setItem('gorstan_daily_objectives', JSON.stringify(newObjectives));
    } else {
      // Load existing objectives
      const saved = localStorage.getItem('gorstan_daily_objectives');
      if (saved) {
        setDailyObjectives(JSON.parse(saved));
      }
    }
  }, []);

  const generateDailyObjectives = (): DailyObjective[] => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const objectives = [
      {
        id: 'daily_rooms',
        title: 'Explorer',
        description: 'Visit 3 different rooms',
        type: 'visit_rooms' as const,
        target: 3,
        current: 0,
        reward: 50,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
      {
        id: 'daily_quests',
        title: 'Quest Seeker',
        description: 'Complete 2 miniquests',
        type: 'complete_miniquests' as const,
        target: 2,
        current: 0,
        reward: 75,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
      {
        id: 'daily_points',
        title: 'Point Collector',
        description: 'Earn 100 points',
        type: 'earn_points' as const,
        target: 100,
        current: 0,
        reward: 25,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
    ];

    return objectives;
  };

  const predefinedChallenges: Challenge[] = [
    {
      id: 'speed_demo',
      title: 'Demo Speedrun',
      description: 'Complete the demo route in under 5 minutes',
      type: 'speed_run',
      difficulty: 'medium',
      timeLimit: 300,
      requirements: ['Complete demo route', 'Under 5 minutes'],
      rewards: { points: 200, title: 'Speed Demon', badge: 'speedrun_bronze' },
    },
    {
      id: 'score_master',
      title: 'Score Master',
      description: 'Achieve 500 points in a single session',
      type: 'score_attack',
      difficulty: 'hard',
      targetScore: 500,
      requirements: ['Earn 500 points', 'Single session'],
      rewards: { points: 300, title: 'High Scorer', badge: 'score_master' },
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Have conversations with 5 different NPCs',
      type: 'social',
      difficulty: 'easy',
      requirements: ['Talk to 5 NPCs', 'Build relationships'],
      rewards: { points: 150, title: 'Conversationalist', badge: 'social_expert' },
    },
    {
      id: 'puzzle_genius',
      title: 'Puzzle Genius',
      description: 'Solve 3 puzzles without using hints',
      type: 'puzzle_master',
      difficulty: 'expert',
      requirements: ['Solve 3 puzzles', 'No hints used'],
      rewards: { points: 400, title: 'Puzzle Master', badge: 'brain_trust' },
    },
    {
      id: 'explorer_elite',
      title: 'Elite Explorer',
      description: 'Discover 10 rooms in 15 minutes',
      type: 'exploration',
      difficulty: 'hard',
      timeLimit: 900,
      requirements: ['Visit 10 rooms', 'Under 15 minutes'],
      rewards: { points: 350, title: 'Elite Explorer', badge: 'exploration_master' },
    },
  ];

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'ChronoWalker', score: 2450, title: 'Legendary' },
    { rank: 2, name: 'MysticSeeker', score: 2100, title: 'Master' },
    { rank: 3, name: 'QuestMaster', score: 1875, title: 'Expert' },
    { rank: 4, name: 'You', score: state.player.score || 0, title: 'Adept' },
    { rank: 5, name: 'StoryTeller', score: 1204, title: 'Adept' },
  ];

  const getDifficultyColor = (difficulty: Challenge['difficulty']): string => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 border-green-500';
      case 'medium':
        return 'text-yellow-400 border-yellow-500';
      case 'hard':
        return 'text-orange-400 border-orange-500';
      case 'expert':
        return 'text-red-400 border-red-500';
      default:
        return 'text-gray-400 border-gray-500';
    }
  };

  const getTimeRemaining = (expiresAt: number): string => {
    const now = Date.now();
    const remaining = expiresAt - now;

    if (remaining <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenges((prev) => [...prev, { ...challenge, progress: 0 }]);
    showNotification({
      type: 'achievement',
      title: 'Challenge Started!',
      description: `You've begun: ${challenge.title}`,
      points: 0,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${className}`}>
      <div className="absolute inset-4 bg-gray-900 rounded-lg border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Challenges & Objectives
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'challenges', label: 'Challenges', icon: <Trophy className="w-4 h-4" /> },
            { id: 'daily', label: 'Daily Objectives', icon: <Calendar className="w-4 h-4" /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Award className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-900/50 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Test Your Skills</h3>
                <p className="text-gray-400">
                  Complete challenges to earn exclusive rewards and titles
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {predefinedChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`bg-gray-800 rounded-lg p-4 border-l-4 ${getDifficultyColor(challenge.difficulty)} hover:bg-gray-750 transition-colors`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white">{challenge.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getDifficultyColor(challenge.difficulty).replace('text-', 'bg-').replace('border-', '').replace('-400', '-900/50').replace('-500', '-900/50')}`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">{challenge.description}</p>

                    <div className="space-y-2 mb-4">
                      {challenge.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                          <Target className="w-3 h-3" />
                          {req}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-400">
                          +{challenge.rewards.points} pts
                        </span>
                        {challenge.rewards.title && (
                          <span className="text-xs text-purple-400 ml-2">
                            "{challenge.rewards.title}"
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => startChallenge(challenge)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Start
                      </button>
                    </div>

                    {challenge.timeLimit && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Timer className="w-3 h-3" />
                        Time limit: {Math.floor(challenge.timeLimit / 60)}m{' '}
                        {challenge.timeLimit % 60}s
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Daily Objectives</h3>
                <p className="text-gray-400">Complete these objectives before they reset!</p>
              </div>

              {dailyObjectives.map((objective) => (
                <div
                  key={objective.id}
                  className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                    objective.completed ? 'border-green-500 bg-green-900/10' : 'border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-bold ${objective.completed ? 'text-green-400' : 'text-white'}`}
                    >
                      {objective.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">
                        {getTimeRemaining(objective.expiresAt)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{objective.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className={objective.completed ? 'text-green-400' : 'text-blue-400'}>
                        {Math.min(objective.current, objective.target)} / {objective.target}
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          objective.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${Math.min((objective.current / objective.target) * 100, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-400">+{objective.reward} pts</span>
                      </div>

                      {objective.completed && (
                        <span className="text-sm text-green-400 font-medium">Completed!</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Global Leaderboard</h3>
                <p className="text-gray-400">See how you rank against other players</p>
              </div>

              <div className="space-y-2">
                {leaderboardData.map((player, index) => (
                  <div
                    key={player.rank}
                    className={`bg-gray-800 rounded-lg p-4 flex items-center gap-4 ${
                      player.name === 'You' ? 'border border-blue-500 bg-blue-900/10' : ''
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold w-8 text-center ${
                        player.rank === 1
                          ? 'text-yellow-500'
                          : player.rank === 2
                            ? 'text-gray-400'
                            : player.rank === 3
                              ? 'text-orange-500'
                              : 'text-gray-500'
                      }`}
                    >
                      {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${player.name === 'You' ? 'text-blue-400' : 'text-white'}`}
                        >
                          {player.name}
                        </span>
                        <span className="text-sm text-gray-400">({player.title})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">{player.score}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="font-bold text-white mb-2">Your Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Current Score:</span>
                    <span className="text-yellow-400 ml-2">{state.player.score || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Achievements:</span>
                    <span className="text-green-400 ml-2">
                      {state.player.achievements?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rooms Visited:</span>
                    <span className="text-blue-400 ml-2">
                      {state.player.visitedRooms?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Current Rank:</span>
                    <span className="text-purple-400 ml-2">
                      #{leaderboardData.find((p) => p.name === 'You')?.rank || 'Unranked'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSystem;
