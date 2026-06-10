/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  Trap Management Modal with Interactive Timer System
*/

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wrench, Clock, Shield, Search } from 'lucide-react';
import { useGameState } from '../state/gameState';
import { getTrapByRoom } from '../engine/trapController';
import { canPlayerDisarmTrap } from '../engine/trapDetection';
import Modal from './Modal';
import './TrapManagementModal.css';

interface TrapManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomId: string;
  onIssueCommand: (command: string) => void;
}

interface TrapManagementState {
  timeRemaining: number;
  isAnalyzing: boolean;
  isDisarming: boolean;
  hasAnalyzed: boolean;
  disarmMethod: string | null;
  trapDetails: any;
  playerActions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

const TrapManagementModal: React.FC<TrapManagementModalProps> = ({
  isOpen,
  onClose,
  currentRoomId,
  onIssueCommand,
}) => {
  const { state } = useGameState();
  const [managementState, setManagementState] = useState<TrapManagementState>({
    timeRemaining: 30, // 30 seconds timer
    isAnalyzing: false,
    isDisarming: false,
    hasAnalyzed: false,
    disarmMethod: null,
    trapDetails: null,
    playerActions: [],
    riskLevel: 'medium',
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyzeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disarmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get trap information
  const trap = getTrapByRoom(currentRoomId);
  const playerTraits = state.player.traits || [];
  const playerItems = state.player.inventory || [];

  // Initialize trap details and timer when modal opens
  useEffect(() => {
    if (isOpen && trap) {
      // Reset state
      setManagementState((prev) => ({
        ...prev,
        timeRemaining: 30,
        hasAnalyzed: false,
        disarmMethod: null,
        trapDetails: trap,
        playerActions: [],
        riskLevel:
          trap.severity === 'lethal'
            ? 'extreme'
            : trap.severity === 'severe'
              ? 'high'
              : trap.severity === 'light'
                ? 'low'
                : 'medium',
      }));

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setManagementState((prev) => {
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            // Time's up! Trap triggers
            handleTimeExpired();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (analyzeTimeoutRef.current) {
        clearTimeout(analyzeTimeoutRef.current);
      }
      if (disarmTimeoutRef.current) {
        clearTimeout(disarmTimeoutRef.current);
      }
    };
  }, [isOpen, trap, onClose, onIssueCommand]);

  const handleTimeExpired = useCallback(() => {
    onIssueCommand('trigger trap');
    onClose();
  }, [onIssueCommand, onClose]);

  const handleAnalyzeTrap = useCallback(() => {
    if (managementState.isAnalyzing || managementState.hasAnalyzed) {
      return;
    }

    setManagementState((prev) => ({ ...prev, isAnalyzing: true }));

    // Add analysis action
    setManagementState((prev) => ({
      ...prev,
      playerActions: [...prev.playerActions, '🔍 Analyzing trap mechanics...'],
    }));

    analyzeTimeoutRef.current = setTimeout(() => {
      const disarmResult = canPlayerDisarmTrap(trap!, playerTraits, playerItems);
      onIssueCommand('inspect trap');

      setManagementState((prev) => ({
        ...prev,
        isAnalyzing: false,
        hasAnalyzed: true,
        disarmMethod: disarmResult.canDisarm ? disarmResult.method || null : null,
        playerActions: [
          ...prev.playerActions,
          disarmResult.canDisarm
            ? `✅ Analysis complete! Method: ${disarmResult.method} (Success chance: ${Math.round((disarmResult.chance || 0.3) * 100)}%)`
            : '❌ Analysis complete! You lack the skills/tools to safely disarm this trap.',
        ],
      }));
    }, 2000); // 2 second analysis time
  }, [managementState.isAnalyzing, managementState.hasAnalyzed, trap, playerTraits, playerItems, onIssueCommand]);

  const handleDisarmAttempt = useCallback(() => {
    if (
      !managementState.hasAnalyzed ||
      !managementState.disarmMethod ||
      managementState.isDisarming
    ) {
      return;
    }

    setManagementState((prev) => ({ ...prev, isDisarming: true }));

    // Add disarming action
    setManagementState((prev) => ({
      ...prev,
      playerActions: [
        ...prev.playerActions,
        `🔧 Attempting disarmament using ${prev.disarmMethod}...`,
      ],
    }));

    disarmTimeoutRef.current = setTimeout(() => {
      onIssueCommand('disarm trap');

      setManagementState((prev) => ({
        ...prev,
        isDisarming: false,
        playerActions: [...prev.playerActions, '🎉 Disarm command issued. Check the console for the outcome.'],
      }));

      setTimeout(() => onClose(), 1500);
    }, 3000); // 3 second disarming time
  }, [managementState, onIssueCommand, onClose]);

  const handlePanicEscape = useCallback(() => {
    onIssueCommand('escape trap');
    onClose();
  }, [onIssueCommand, onClose]);

  if (!isOpen || !trap || trap.triggered) {
    return null;
  }

  return (
    <Modal visible={isOpen} onClose={onClose} title="⚠️ Trap Management" pinned={true}>
      <div className="trap-management-modal">
        {/* Timer Display - Time to disarm the trap */}
        <div className={`timer-display ${managementState.timeRemaining <= 10 ? 'urgent' : ''}`}>
          <Clock size={24} />
          <span className="timer-text">
            Disarm time: {managementState.timeRemaining}s remaining
          </span>
          <div className="timer-bar">
            <div
              className="timer-fill"
              style={{
                width: `${(managementState.timeRemaining / 30) * 100}%`,
                backgroundColor:
                  managementState.timeRemaining <= 10
                    ? '#ef4444'
                    : managementState.timeRemaining <= 20
                      ? '#f59e0b'
                      : '#10b981',
              }}
            />
          </div>
        </div>

        {/* Trap Information */}
        <div className="trap-info">
          <div className="trap-icon">
            <img src="/images/Caution.png" alt="Trap Warning" className="caution-icon" />
          </div>
          <div className="trap-details">
            <h3>{trap.name || 'Unknown Trap'}</h3>
            <p className="trap-description">
              {trap.description || 'A dangerous mechanism blocks your path.'}
            </p>
            <div className={`risk-level risk-${managementState.riskLevel}`}>
              Risk Level: {managementState.riskLevel.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="analyze-button"
            onClick={handleAnalyzeTrap}
            disabled={managementState.isAnalyzing || managementState.hasAnalyzed}
          >
            <Search size={16} />
            {managementState.isAnalyzing
              ? 'Analyzing...'
              : managementState.hasAnalyzed
                ? 'Analyzed'
                : 'Analyze Trap (2s)'}
          </button>

          <button
            className="disarm-button"
            onClick={handleDisarmAttempt}
            disabled={
              !managementState.hasAnalyzed ||
              !managementState.disarmMethod ||
              managementState.isDisarming
            }
          >
            <Wrench size={16} />
            {managementState.isDisarming ? 'Disarming...' : 'Disarm Trap (3s)'}
          </button>

          <button className="escape-button" onClick={handlePanicEscape}>
            <Shield size={16} />
            Panic Escape (50% chance)
          </button>
        </div>

        {/* Action Log */}
        <div className="action-log">
          <h4>Action Log:</h4>
          <div className="log-entries">
            {managementState.playerActions.map((action, index) => (
              <div key={index} className="log-entry">
                {action}
              </div>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="help-text">
          <p>
            ⚠️ You have {managementState.timeRemaining} seconds before the trap automatically
            triggers!
          </p>
          <p>📋 Analyze the trap first to determine disarmament options.</p>
          <p>🔧 Disarmament success depends on your skills and tools.</p>
        </div>
      </div>
    </Modal>
  );
};

export default TrapManagementModal;
