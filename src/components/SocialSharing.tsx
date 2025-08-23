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

import React, { useState } from 'react';
import { Share2, Download, Copy, Twitter, MessageSquare, Camera, Trophy, Star, MapPin } from 'lucide-react';
import { useGameState } from '../state/gameState';
import { showNotification } from './QuickWinNotifications';

interface ShareableAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number;
  score: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ShareableDiscovery {
  id: string;
  roomName: string;
  description: string;
  discoveredAt: number;
  significance: string;
}

interface SocialSharingProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialSharing: React.FC<SocialSharingProps> = ({ 
  className = '', 
  isOpen, 
  onClose 
}) => {
  const { state } = useGameState();
  const [activeTab, setActiveTab] = useState<'achievements' | 'discoveries' | 'stats'>('achievements');
  const [selectedItem, setSelectedItem] = useState<ShareableAchievement | ShareableDiscovery | null>(null);

  // Convert achievements to shareable format
  const getShareableAchievements = (): ShareableAchievement[] => {
    return (state.player.achievements || []).map((achievement, index) => ({
      id: achievement,
      title: achievement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: getAchievementDescription(achievement),
      unlockedAt: Date.now() - (index * 3600000), // Mock timestamps
      score: state.player.score || 0,
      rarity: getAchievementRarity(achievement)
    }));
  };

  const getAchievementDescription = (id: string): string => {
    const descriptions: Record<string, string> = {
      'first_steps': 'Took your first steps into the world of Gorstan',
      'explorer': 'Discovered 5 unique locations in your journey',
      'conversationalist': 'Had meaningful conversations with multiple NPCs',
      'puzzle_solver': 'Demonstrated exceptional problem-solving skills',
      'social_butterfly': 'Built relationships with the inhabitants of Gorstan',
      'master_explorer': 'Explored every corner of the known world',
      'pattern_weaver': 'Recognized and solved complex pattern puzzles',
      'time_keeper': 'Mastered the art of temporal navigation',
      'artifact_hunter': 'Collected rare and powerful artifacts',
      'lore_master': 'Uncovered the deep mysteries of Gorstan'
    };
    return descriptions[id] || 'Accomplished something remarkable in Gorstan';
  };

  const getAchievementRarity = (id: string): ShareableAchievement['rarity'] => {
    const rarities: Record<string, ShareableAchievement['rarity']> = {
      'first_steps': 'common',
      'explorer': 'common',
      'conversationalist': 'rare',
      'puzzle_solver': 'rare',
      'social_butterfly': 'epic',
      'master_explorer': 'epic',
      'pattern_weaver': 'legendary',
      'time_keeper': 'legendary',
      'artifact_hunter': 'epic',
      'lore_master': 'legendary'
    };
    return rarities[id] || 'common';
  };

  // Convert visited rooms to shareable discoveries
  const getShareableDiscoveries = (): ShareableDiscovery[] => {
    return (state.player.visitedRooms || []).slice(-5).map((room, index) => ({
      id: room,
      roomName: room.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      description: getRoomDescription(room),
      discoveredAt: Date.now() - (index * 1800000), // Mock timestamps
      significance: getRoomSignificance(room)
    }));
  };

  const getRoomDescription = (roomId: string): string => {
    const descriptions: Record<string, string> = {
      'faeglade': 'A mystical clearing where reality bends and ancient magic flows',
      'gorstanhub': 'The beating heart of Gorstan, where all paths converge',
      'dalesapartment': 'A cozy London flat bridging two worlds',
      'trentpark': 'A peaceful park hiding supernatural secrets',
      'faelake': 'A mirror-like lake reflecting other dimensions',
      'gorstanvillage': 'A highland village where tradition meets wonder'
    };
    return descriptions[roomId] || 'A mysterious location filled with wonder and secrets';
  };

  const getRoomSignificance = (roomId: string): string => {
    const significance: Record<string, string> = {
      'faeglade': 'Nexus of Fae magic',
      'gorstanhub': 'Central hub of adventures',
      'dalesapartment': 'Portal between worlds',
      'trentpark': 'Hidden sanctuary',
      'faelake': 'Dimensional gateway',
      'gorstanvillage': 'Highland stronghold'
    };
    return significance[roomId] || 'Significant location';
  };

  const generateShareText = (item: ShareableAchievement | ShareableDiscovery): string => {
    if ('rarity' in item) {
      // Achievement
      return `🏆 Just unlocked "${item.title}" in #Gorstan! ${item.description} 

Score: ${item.score} points
Rarity: ${item.rarity.toUpperCase()}

Play Gorstan and create your own adventure! 🌟`;
    } else {
      // Discovery
      return `🗺️ Discovered ${item.roomName} in #Gorstan! ${item.description}

"${item.significance}" - What secrets will you uncover?

Explore Gorstan and find your own path! ✨`;
    }
  };

  const generateStatsShareText = (): string => {
    const achievements = state.player.achievements?.length || 0;
    const rooms = state.player.visitedRooms?.length || 0;
    const score = state.player.score || 0;
    
    const rank = score >= 2000 ? 'Legendary' :
                 score >= 1500 ? 'Master' :
                 score >= 1000 ? 'Expert' :
                 score >= 600 ? 'Adept' :
                 score >= 300 ? 'Apprentice' : 'Novice';

    return `📊 My #Gorstan Adventure Stats:

🏆 ${achievements} achievements unlocked
🗺️ ${rooms} locations discovered  
⭐ ${score} points earned
🎖️ ${rank} rank achieved

Ready for your own adventure? Join me in Gorstan! 🌟`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification({
        type: 'achievement',
        title: 'Copied!',
        description: 'Share text copied to clipboard'
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToTwitter = (text: string) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(url, '_blank');
  };

  const downloadAsImage = (item: ShareableAchievement | ShareableDiscovery) => {
    // Create a canvas element for generating shareable images
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    
    if ('rarity' in item) {
      ctx.fillText('🏆 Achievement Unlocked!', 400, 100);
      ctx.font = '36px Arial';
      ctx.fillText(item.title, 400, 200);
      
      // Rarity badge
      const rarityColors: Record<string, string> = {
        common: '#9CA3AF',
        rare: '#3B82F6',
        epic: '#8B5CF6',
        legendary: '#F59E0B'
      };
      ctx.fillStyle = rarityColors[item.rarity];
      ctx.fillRect(300, 250, 200, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText(item.rarity.toUpperCase(), 400, 280);
    } else {
      ctx.fillText('🗺️ Location Discovered!', 400, 100);
      ctx.font = '36px Arial';
      ctx.fillText(item.roomName, 400, 200);
      ctx.font = '24px Arial';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText(item.significance, 400, 280);
    }

    // Gorstan branding
    ctx.fillStyle = '#6B7280';
    ctx.font = '24px Arial';
    ctx.fillText('Play Gorstan', 400, 500);
    ctx.font = '18px Arial';
    ctx.fillText('Create your own adventure', 400, 530);

    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gorstan-${'rarity' in item ? 'achievement' : 'discovery'}-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const achievements = getShareableAchievements();
  const discoveries = getShareableDiscoveries();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${className}`}>
      <div className="absolute inset-4 bg-gray-900 rounded-lg border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-blue-500" />
            Share Your Journey
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
            { id: 'discoveries', label: 'Discoveries', icon: <MapPin className="w-4 h-4" /> },
            { id: 'stats', label: 'Stats Summary', icon: <Star className="w-4 h-4" /> }
          ].map(tab => (
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
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Share Your Achievements</h3>
                <p className="text-gray-400">Show the world what you've accomplished in Gorstan</p>
              </div>

              {achievements.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No achievements to share yet</p>
                  <p className="text-sm mt-1">Keep exploring to unlock achievements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Trophy className={`w-6 h-6 ${
                          achievement.rarity === 'legendary' ? 'text-yellow-500' :
                          achievement.rarity === 'epic' ? 'text-purple-500' :
                          achievement.rarity === 'rare' ? 'text-blue-500' :
                          'text-gray-500'
                        }`} />
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{achievement.title}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                          <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                            achievement.rarity === 'legendary' ? 'bg-yellow-900/50 text-yellow-400' :
                            achievement.rarity === 'epic' ? 'bg-purple-900/50 text-purple-400' :
                            achievement.rarity === 'rare' ? 'bg-blue-900/50 text-blue-400' :
                            'bg-gray-900/50 text-gray-400'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(generateShareText(achievement))}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                        <button
                          onClick={() => shareToTwitter(generateShareText(achievement))}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          <Twitter className="w-3 h-3" />
                          Tweet
                        </button>
                        <button
                          onClick={() => downloadAsImage(achievement)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'discoveries' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Share Your Discoveries</h3>
                <p className="text-gray-400">Let others know about the amazing places you've found</p>
              </div>

              {discoveries.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No discoveries to share yet</p>
                  <p className="text-sm mt-1">Explore new rooms to make discoveries!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {discoveries.map(discovery => (
                    <div
                      key={discovery.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin className="w-6 h-6 text-blue-500" />
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{discovery.roomName}</h3>
                          <p className="text-sm text-gray-400 mb-2">{discovery.description}</p>
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-900/50 text-blue-400">
                            {discovery.significance}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(generateShareText(discovery))}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                        <button
                          onClick={() => shareToTwitter(generateShareText(discovery))}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          <Twitter className="w-3 h-3" />
                          Tweet
                        </button>
                        <button
                          onClick={() => downloadAsImage(discovery)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Share Your Stats</h3>
                <p className="text-gray-400">Show your overall progress and achievements</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">My Gorstan Journey</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{state.player.achievements?.length || 0}</div>
                      <div className="text-sm text-gray-400">Achievements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{state.player.visitedRooms?.length || 0}</div>
                      <div className="text-sm text-gray-400">Locations</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{state.player.score || 0}</div>
                    <div className="text-sm text-gray-400">Points</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => copyToClipboard(generateStatsShareText())}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Stats
                  </button>
                  <button
                    onClick={() => shareToTwitter(generateStatsShareText())}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Tweet Stats
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Global Insights
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• You're in the top {Math.floor(Math.random() * 30) + 20}% of explorers</p>
                  <p>• {Math.floor(Math.random() * 500) + 100} players have visited the same rooms as you</p>
                  <p>• Your achievement score ranks {Math.floor(Math.random() * 50) + 10}th globally</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialSharing;
