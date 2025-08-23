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
// Game module.

import { GameAction } from '../types/GameTypes';
















let globalDispatch: React.Dispatch<GameAction> | null = null;
let lastScore = 0; // Track last score for milestone detection



// --- Function: initializeScoreManager ---
export function initializeScoreManager(dispatch: React.Dispatch<GameAction>): void {
  globalDispatch = dispatch;
}



// --- Function: updateScore ---
export function updateScore(delta: number): void {
  if (globalDispatch) {
    const newScore = lastScore + delta;
    globalDispatch({ type: 'UPDATE_SCORE', payload: delta });

    // Check for score milestones
    checkScoreMilestones(lastScore, newScore);
    
    // Check for level ups
    checkLevelUp(lastScore, newScore);
    
    lastScore = newScore;
    
    if (delta > 0) {
      globalDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `score-gain-${Date.now()}`,
          text: `+${delta} points`,
          type: 'system',
          timestamp: Date.now(),
        }
      });

      // Trigger notification for score gains
      if (delta >= 25) { // Only for meaningful gains
        const event = new CustomEvent('gorstan-notification', {
          detail: {
            type: 'score_milestone',
            title: `+${delta} Points!`,
            description: getScoreGainMessage(delta),
            points: delta,
            duration: 3000
          }
        });
        window.dispatchEvent(event);
      }
    } else if (delta < 0) {
      globalDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: `score-loss-${Date.now()}`,
          text: `${delta} points`,
          type: 'error',
          timestamp: Date.now(),
        }
      });
    }
  }
}

// --- Function: checkScoreMilestones ---
function checkScoreMilestones(oldScore: number, newScore: number): void {
  const milestones = [100, 300, 500, 750, 1000, 1500, 2000];
  
  for (const milestone of milestones) {
    if (oldScore < milestone && newScore >= milestone) {
      // Trigger milestone notification
      const event = new CustomEvent('gorstan-notification', {
        detail: {
          type: 'score_milestone',
          title: `Milestone Reached!`,
          description: `You've reached ${milestone} points!`,
          points: 0,
          duration: 5000
        }
      });
      window.dispatchEvent(event);
      break; // Only trigger one milestone at a time
    }
  }
}

// --- Function: checkLevelUp ---
function checkLevelUp(oldScore: number, newScore: number): void {
  const oldLevel = Math.floor(oldScore / 200) + 1;
  const newLevel = Math.floor(newScore / 200) + 1;
  
  if (newLevel > oldLevel) {
    // Trigger level up notification
    const event = new CustomEvent('gorstan-notification', {
      detail: {
        type: 'level_up',
        title: `Level Up!`,
        description: `You've reached Level ${newLevel}!`,
        points: 0,
        duration: 6000
      }
    });
    window.dispatchEvent(event);
  }
}

// --- Function: getScoreGainMessage ---
function getScoreGainMessage(points: number): string {
  if (points >= 100) return 'Excellent work!';
  if (points >= 75) return 'Great achievement!';
  if (points >= 50) return 'Well done!';
  if (points >= 25) return 'Nice work!';
  return 'Good job!';
}



// --- Function: setScore ---
export function setScore(value: number): void {
  if (globalDispatch) {
    globalDispatch({ type: 'SET_SCORE', payload: value });
  }
}



// --- Function: resetScore ---
export function resetScore(): void {
  if (globalDispatch) {
    globalDispatch({ type: 'RESET_SCORE' });
    globalDispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: `score-reset-${Date.now()}`,
        text: 'Score reset to 0',
        type: 'system',
        timestamp: Date.now(),
      }
    });
  }
}



// --- Function: getCurrentScore ---
export function getCurrentScore(): number {
  
  
  return 0;
}



// --- Function: applyScoreBonus ---
export function applyScoreBonus(reason: string, amount: number): void {
  if (globalDispatch) {
    updateScore(amount);
    globalDispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: `score-bonus-${Date.now()}`,
        text: `Bonus: ${reason} (+${amount} points)`,
        type: 'achievement',
        timestamp: Date.now(),
      }
    });
  }
}



// --- Function: applyScorePenalty ---
export function applyScorePenalty(reason: string, amount: number): void {
  if (globalDispatch) {
    updateScore(-Math.abs(amount)); 
    globalDispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: `score-penalty-${Date.now()}`,
        text: `Penalty: ${reason} (-${Math.abs(amount)} points)`,
        type: 'error',
        timestamp: Date.now(),
      }
    });
  }
}
