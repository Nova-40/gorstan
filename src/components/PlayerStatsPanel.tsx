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

// Gorstan and characters (c) Geoff Webster 2025
// User interface panel display.

import './PlayerStatsPanel.css';

import React, { useState } from 'react';

import { Heart, Star, Package, Share2, Calendar, BarChart3 } from 'lucide-react';

import { useGameState } from '../state/gameState';
import ProgressDashboard from './ProgressDashboard';
import CollectionDisplay from './CollectionDisplay';
import ChallengeSystem from './ChallengeSystem';
import SocialSharing from './SocialSharing';









const PlayerStatsPanel: React.FC = () => {
  const { state } = useGameState();
  const { player } = state;
  const [activeModal, setActiveModal] = useState<'progress' | 'collection' | 'challenges' | 'sharing' | null>(null);

  const healthPercentage = (player.health / (player.maxHealth || 100)) * 100;
  const healthColor = healthPercentage > 70 ? '#00ff00' :
                     healthPercentage > 30 ? '#ffff00' : '#ff0000';

  // Score color and rating based on current score
  const getScoreColor = (score: number) => {
    if (score >= 1000) return '#ff69b4'; // Legendary - hot pink
    if (score >= 600) return '#9370db';  // Master - medium slate blue
    if (score >= 300) return '#20b2aa';  // Explorer - light sea green
    if (score >= 100) return '#ffd700';  // Rookie - gold
    if (score >= 0) return '#87ceeb';    // Neutral - sky blue
    return '#ff6347';                    // Negative - tomato red
  };

  const getScoreRating = (score: number) => {
    if (score >= 1000) return 'Legendary';
    if (score >= 600) return 'Master';
    if (score >= 300) return 'Explorer';
    if (score >= 100) return 'Rookie';
    if (score >= 0) return 'Novice';
    return 'Chaotic';
  };

  const currentScore = player.score || 0;
  const scoreColor = getScoreColor(currentScore);
  const scoreRating = getScoreRating(currentScore);

// JSX return block or main return
  return (
    <div className="player-stats-panel">
      <div className="stats-header">Player Stats</div>

      <div className="stat-item">
        <Heart size={16} style={{ color: healthColor }} />
        <span className="stat-label">Health:</span>
        <span className="stat-value" style={{ color: healthColor }}>
          {player.health}/{player.maxHealth || 100}
        </span>
        <div className="health-bar">
          <div
            className="health-fill"
            style={{
              width: `${healthPercentage}%`,
              backgroundColor: healthColor
            }}
          />
        </div>
      </div>

      <div className="stat-item">
        <Star size={16} style={{ color: scoreColor }} />
        <span className="stat-label">Score:</span>
        <span className="stat-value" style={{ color: scoreColor }}>
          {currentScore}
        </span>
        <span className="score-rating" style={{ color: scoreColor, fontSize: '0.8em', marginLeft: '8px' }}>
          ({scoreRating})
        </span>
      </div>



      <div className="stat-item">
        <span className="stat-label">Rooms Visited:</span>
        <span className="stat-value">
          {player.visitedRooms?.length || 0}
        </span>
      </div>

      {/* Enhanced Feature Buttons */}
      <div className="feature-buttons" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => setActiveModal('progress')}
          className="feature-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            backgroundColor: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '4px',
            color: '#D1D5DB',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4B5563';
            e.currentTarget.style.borderColor = '#6B7280';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.borderColor = '#4B5563';
          }}
        >
          <BarChart3 size={14} />
          Progress Dashboard
        </button>

        <button
          onClick={() => setActiveModal('collection')}
          className="feature-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            backgroundColor: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '4px',
            color: '#D1D5DB',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4B5563';
            e.currentTarget.style.borderColor = '#6B7280';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.borderColor = '#4B5563';
          }}
        >
          <Package size={14} />
          Collection ({(player.inventory?.length || 0)})
        </button>

        <button
          onClick={() => setActiveModal('challenges')}
          className="feature-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            backgroundColor: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '4px',
            color: '#D1D5DB',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4B5563';
            e.currentTarget.style.borderColor = '#6B7280';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.borderColor = '#4B5563';
          }}
        >
          <Calendar size={14} />
          Challenges
        </button>

        <button
          onClick={() => setActiveModal('sharing')}
          className="feature-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            backgroundColor: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '4px',
            color: '#D1D5DB',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4B5563';
            e.currentTarget.style.borderColor = '#6B7280';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.borderColor = '#4B5563';
          }}
        >
          <Share2 size={14} />
          Share Journey
        </button>
      </div>

      {/* Modals */}
      <ProgressDashboard 
        isOpen={activeModal === 'progress'} 
        onClose={() => setActiveModal(null)} 
      />
      <CollectionDisplay 
        isOpen={activeModal === 'collection'} 
        onClose={() => setActiveModal(null)} 
      />
      <ChallengeSystem 
        isOpen={activeModal === 'challenges'} 
        onClose={() => setActiveModal(null)} 
      />
      <SocialSharing 
        isOpen={activeModal === 'sharing'} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
};

export default PlayerStatsPanel;
