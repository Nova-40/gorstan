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

import React from 'react';
import { Trophy, Target, Map, Star, Award, TrendingUp } from 'lucide-react';
import { useGameState } from '../state/gameState';
import { achievements } from '../logic/achievementEngine';

interface ProgressDashboardProps {
  className?: string;
  compact?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  className = '', 
  compact = false,
  isOpen = true,
  onClose
}) => {
  const { state } = useGameState();
  
  // If used as modal and not open, return null
  if (onClose && !isOpen) return null;
  
  // Calculate achievement progress - use existing game state structure
  const unlockedAchievements = (state.player as any).achievements?.length || 0;
  const totalAchievements = achievements.length;
  const achievementProgress = (unlockedAchievements / totalAchievements) * 100;
  
  // Calculate room exploration progress
  const visitedRooms = state.player.visitedRooms?.length || 0;
  const explorationProgress = Math.min((visitedRooms / 20) * 100, 100); // Assume ~20 total rooms
  
  // Calculate level based on score
  const score = state.player.score || 0;
  const level = Math.floor(score / 200) + 1; // Level up every 200 points
  const nextLevelScore = level * 200;
  const currentLevelProgress = ((score % 200) / 200) * 100;
  
  // Calculate miniquest completion - use a reasonable estimation
  const completedMiniquests = (state.player as any).completedMiniquests?.length || 
                             Math.floor((state.player.score || 0) / 50); // Estimate based on score
  const miniquestProgress = Math.min((completedMiniquests / 15) * 100, 100); // Estimate 15 total miniquests visible
  
  // Determine player rank based on score
  const getRank = (score: number): { name: string; color: string; icon: React.ReactNode } => {
    if (score >= 2000) return { name: 'Legendary', color: 'text-purple-400', icon: <Star className="w-4 h-4" /> };
    if (score >= 1500) return { name: 'Master', color: 'text-orange-400', icon: <Award className="w-4 h-4" /> };
    if (score >= 1000) return { name: 'Expert', color: 'text-yellow-400', icon: <Trophy className="w-4 h-4" /> };
    if (score >= 600) return { name: 'Adept', color: 'text-green-400', icon: <Target className="w-4 h-4" /> };
    if (score >= 300) return { name: 'Apprentice', color: 'text-blue-400', icon: <TrendingUp className="w-4 h-4" /> };
    return { name: 'Novice', color: 'text-gray-400', icon: <Map className="w-4 h-4" /> };
  };
  
  const rank = getRank(score);
  
  if (compact) {
    return (
      <div className={`bg-gray-900 border border-gray-700 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {rank.icon}
            <span className={`text-sm font-bold ${rank.color}`}>Level {level}</span>
            <span className="text-xs text-gray-400">({rank.name})</span>
          </div>
          <span className="text-sm text-gray-300">{score} pts</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-400">Achievements</div>
            <div className="text-green-400">{unlockedAchievements}/{totalAchievements}</div>
          </div>
          <div>
            <div className="text-gray-400">Rooms</div>
            <div className="text-blue-400">{visitedRooms}</div>
          </div>
        </div>
      </div>
    );
  }

  // Modal wrapper
  if (onClose) {
    return (
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${className}`}>
        <div className="absolute inset-4 bg-gray-900 rounded-lg border border-gray-700 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {rank.icon}
              Progress Dashboard
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <ProgressDashboard compact={false} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {rank.icon}
          Progress Dashboard
        </h3>
        <div className="text-right">
          <div className={`text-lg font-bold ${rank.color}`}>Level {level}</div>
          <div className="text-sm text-gray-400">{rank.name}</div>
        </div>
      </div>
      
      {/* Level Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Level Progress</span>
          <span className="text-gray-400">{score} / {nextLevelScore} pts</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${currentLevelProgress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Achievements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-300">Achievements</span>
            <span className="text-xs text-gray-500">{unlockedAchievements}/{totalAchievements}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${achievementProgress}%` }}
            />
          </div>
        </div>
        
        {/* Exploration */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-300">Exploration</span>
            <span className="text-xs text-gray-500">{visitedRooms} rooms</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${explorationProgress}%` }}
            />
          </div>
        </div>
        
        {/* Miniquests */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-300">Miniquests</span>
            <span className="text-xs text-gray-500">{completedMiniquests} completed</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${miniquestProgress}%` }}
            />
          </div>
        </div>
        
        {/* Current Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-300">Total Score</span>
            <span className="text-xs text-gray-500">{score} points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${rank.color} bg-gray-800`}>
              {rank.name}
            </div>
            {score > 0 && (
              <div className="text-xs text-gray-400">
                +{Math.floor(score / 10)} sessions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
