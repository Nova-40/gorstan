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
import { RetroBar } from './ui/RetroBar';
import { useGameState } from '../state/gameState';
// Lazy-load achievements to avoid pulling achievementEngine into main bundle
const loadAchievements = async () => {
  try { const mod = await import('../logic/achievementEngine'); return (mod as any).achievements || []; } catch { return []; }
};

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
  
  // Achievements (lazy) placeholder values until loaded
  const unlockedAchievements = (state.player as any).achievements?.length || 0;
  const [totalAchievements, setTotalAchievements] = React.useState<number>(0);
  React.useEffect(()=>{ let mounted = true; loadAchievements().then(list=>{ if(mounted) setTotalAchievements(list.length); }); return ()=>{ mounted=false; }; },[]);
  const achievementProgress = totalAchievements ? (unlockedAchievements / totalAchievements) * 100 : 0;
  
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
  <div className={`retro-panel ${className}`}>
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
  <div className={`retro-panel p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-console-bright tracking-wide">
          {rank.icon}
          Progress Dashboard
        </h3>
        <div className="text-right font-mono">
          <div className={`text-lg font-bold ${rank.color} drop-shadow-[0_0_4px_rgba(0,255,200,0.4)]`}>L{level}</div>
          <div className="text-xs opacity-70 uppercase tracking-wider text-console-dim">{rank.name}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <RetroBar
          value={currentLevelProgress / 100}
          label={`LEVEL PROGRESS (${score}/${nextLevelScore})`}
          intent="default"
          height={8}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Achievements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono">
            <Trophy className="w-4 h-4 text-amber-300 drop-shadow-[0_0_4px_rgba(255,200,0,0.4)]" />
            <span className="text-xs tracking-wide text-console-bright">ACHIEVEMENTS</span>
          </div>
          <RetroBar value={achievementProgress/100} intent="warning" height={8} showValue />
        </div>
        
        {/* Exploration */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono">
            <Map className="w-4 h-4 text-cyan-300" />
            <span className="text-xs tracking-wide text-console-bright">EXPLORATION</span>
          </div>
          <RetroBar value={explorationProgress/100} intent="default" height={8} showValue />
        </div>
        
        {/* Miniquests */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono">
            <Target className="w-4 h-4 text-emerald-300" />
            <span className="text-xs tracking-wide text-console-bright">MINIQUESTS</span>
          </div>
          <RetroBar value={miniquestProgress/100} intent="success" height={8} showValue />
        </div>
        
        {/* Current Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono">
            <Star className="w-4 h-4 text-fuchsia-400" />
            <span className="text-xs tracking-wide text-console-bright">TOTAL SCORE</span>
            <span className="text-[10px] text-console-dim">{score}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <div className={`px-2 py-0.5 rounded border border-console-glow/30 bg-black/40 ${rank.color}`}>{rank.name}</div>
            {score > 0 && (<div className="text-console-dim">+{Math.floor(score / 10)} SESSIONS</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
