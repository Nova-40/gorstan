/**
 * Shadow Encounters Screen Component
 * Main interface for managing shadow encounters
 */

import React, { useState, useEffect, useCallback } from 'react';
import ShadowEntityDisplay from './ui/ShadowEntityDisplay';
import ShadowEncounterLog from './ui/ShadowEncounterLog';
import { 
  type ShadowEntity, 
  type ShadowEncounter, 
  type ShadowInteraction,
  type ShadowInteractionType,
  type ShadowEvent
} from '../types/shadowEncounters';

interface ShadowEncountersScreenProps {
  shadowService: any; // ShadowEncounterService type would be imported
  quantumArtifacts: string[];
  onClose: () => void;
  className?: string;
}

const ShadowEncountersScreen: React.FC<ShadowEncountersScreenProps> = ({
  shadowService,
  quantumArtifacts,
  onClose,
  className = ''
}) => {
  const [activeEntities, setActiveEntities] = useState<ShadowEntity[]>([]);
  // @ts-ignore - activeEncounters for future use
  const [activeEncounters, setActiveEncounters] = useState<ShadowEncounter[]>([]);
  const [encounterHistory, setEncounterHistory] = useState<ShadowEncounter[]>([]);
  const [interactionHistory, setInteractionHistory] = useState<ShadowInteraction[]>([]);
  const [playerStress, setPlayerStress] = useState(0);
  const [playerFear, setPlayerFear] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'active' | 'log' | 'status'>('active');
  const [recentEvent, setRecentEvent] = useState<ShadowEvent | null>(null);

  // Update state from shadow service
  const updateFromService = useCallback(() => {
    if (!shadowService) return;
    
    setActiveEntities(shadowService.getActiveEntities());
    setActiveEncounters(shadowService.getActiveEncounters());
    setEncounterHistory(shadowService.getEncounterHistory());
    setPlayerStress(shadowService.getPlayerStress());
    setPlayerFear(shadowService.getPlayerFearLevel());
    
    const state = shadowService.getShadowState();
    setInteractionHistory(state.interactionHistory || []);
  }, [shadowService]);

  // Handle shadow events
  const handleShadowEvent = useCallback((event: ShadowEvent) => {
    setRecentEvent(event);
    updateFromService();
    
    // Clear event after showing it
    setTimeout(() => setRecentEvent(null), 5000);
  }, [updateFromService]);

  // Set up event listener and initial load
  useEffect(() => {
    if (!shadowService) return;
    
    shadowService.addEventListener(handleShadowEvent);
    updateFromService();
    
    return () => {
      shadowService.removeEventListener(handleShadowEvent);
    };
  }, [shadowService, handleShadowEvent, updateFromService]);

  const handleInteraction = (entityId: string, interactionType: ShadowInteractionType, artifactIds?: string[]) => {
    if (!shadowService) return;
    
    const interaction = shadowService.interactWithShadow(entityId, interactionType, artifactIds || []);
    if (interaction) {
      updateFromService();
    }
  };

  const getStressColor = (stress: number) => {
    if (stress > 80) return 'text-red-400';
    if (stress > 60) return 'text-orange-400';
    if (stress > 40) return 'text-yellow-400';
    if (stress > 20) return 'text-blue-400';
    return 'text-green-400';
  };

  const getFearDescription = (fear: number) => {
    if (fear > 80) return 'Overwhelming dread';
    if (fear > 60) return 'Significant unease';
    if (fear > 40) return 'Growing anxiety';
    if (fear > 20) return 'Mild apprehension';
    return 'Calm and composed';
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'spawn': return '👻';
      case 'manifest': return '🌟';
      case 'interact': return '🤝';
      case 'banish': return '✨';
      case 'escape': return '🏃';
      case 'victory': return '🏆';
      default: return '❓';
    }
  };

  const getEventMessage = (event: ShadowEvent) => {
    switch (event.type) {
      case 'spawn':
        return `A shadow entity has appeared in ${event.details.roomId}`;
      case 'victory':
        return `Successfully dealt with shadow entity (${event.details.experienceGained} XP gained)`;
      case 'escape':
        return `Shadow entity escaped from encounter`;
      default:
        return `Shadow event: ${event.type}`;
    }
  };

  return (
    <div className={`bg-gray-900 text-white min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shadow Encounters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Recent Event Notification */}
      {recentEvent && (
        <div className="bg-purple-900 border-b border-purple-700 p-3 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getEventIcon(recentEvent.type)}</span>
            <span className="text-purple-200">{getEventMessage(recentEvent)}</span>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Stress:</span>
              <span className={`font-bold ${getStressColor(playerStress)}`}>
                {playerStress}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Fear:</span>
              <span className="text-purple-400">{getFearDescription(playerFear)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Active Entities:</span>
              <span className="text-cyan-400">{activeEntities.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Artifacts Available:</span>
            <span className="text-yellow-400">{quantumArtifacts.length}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'active'
                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Active Encounters ({activeEntities.length})
          </button>
          <button
            onClick={() => setSelectedTab('log')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'log'
                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Encounter Log
          </button>
          <button
            onClick={() => setSelectedTab('status')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'status'
                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Status & Stats
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {selectedTab === 'active' && (
          <div>
            {activeEntities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No active shadow encounters</div>
                <div className="text-sm text-gray-500">
                  Shadows may appear based on your actions, quantum artifacts, and time spent in rooms.
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {activeEntities.map(entity => (
                  <ShadowEntityDisplay
                    key={entity.id}
                    entity={entity}
                    playerStress={playerStress}
                    availableArtifacts={quantumArtifacts}
                    onInteract={handleInteraction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'log' && (
          <ShadowEncounterLog
            encounters={encounterHistory}
            interactions={interactionHistory}
            maxEntries={50}
          />
        )}

        {selectedTab === 'status' && (
          <div className="space-y-6">
            {/* Player Status */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">Player Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Stress Level</div>
                  <div className={`text-2xl font-bold ${getStressColor(playerStress)}`}>
                    {playerStress}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        playerStress > 80 ? 'bg-red-500' :
                        playerStress > 60 ? 'bg-orange-500' :
                        playerStress > 40 ? 'bg-yellow-500' :
                        playerStress > 20 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${playerStress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Fear Level</div>
                  <div className="text-2xl font-bold text-purple-400">{playerFear}%</div>
                  <div className="text-sm text-gray-300">{getFearDescription(playerFear)}</div>
                </div>
              </div>
            </div>

            {/* Encounter Statistics */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">Encounter Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{encounterHistory.length}</div>
                  <div className="text-sm text-gray-400">Total Encounters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {encounterHistory.filter(e => e.outcome === 'success').length}
                  </div>
                  <div className="text-sm text-gray-400">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {encounterHistory.filter(e => e.outcome === 'escape').length}
                  </div>
                  <div className="text-sm text-gray-400">Escaped</div>
                </div>
              </div>
            </div>

            {/* Quantum Artifacts */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">Available Quantum Artifacts</h3>
              {quantumArtifacts.length === 0 ? (
                <div className="text-gray-400">No quantum artifacts available</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {quantumArtifacts.map(artifactId => (
                    <div
                      key={artifactId}
                      className="bg-purple-900 border border-purple-700 rounded px-3 py-2 text-sm"
                    >
                      {artifactId.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShadowEncountersScreen;
