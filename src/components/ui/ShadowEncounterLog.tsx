/**
 * Shadow Encounter Log Component
 * Displays history of shadow encounters and interactions
 */

import React, { useState } from 'react';
import { type ShadowEncounter, type ShadowInteraction } from '../../types/shadowEncounters';

interface ShadowEncounterLogProps {
  encounters: ShadowEncounter[];
  interactions: ShadowInteraction[];
  maxEntries?: number;
  className?: string;
}

const ShadowEncounterLog: React.FC<ShadowEncounterLogProps> = ({
  encounters,
  interactions,
  maxEntries = 20,
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'encounters' | 'interactions'>('all');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  // Combine and sort encounters and interactions by timestamp
  const allEntries = React.useMemo(() => {
    const entries: Array<{ type: 'encounter' | 'interaction'; data: ShadowEncounter | ShadowInteraction; timestamp: number }> = [];
    
    if (filter === 'all' || filter === 'encounters') {
      encounters.forEach(encounter => {
        entries.push({
          type: 'encounter',
          data: encounter,
          timestamp: encounter.startTime
        });
      });
    }
    
    if (filter === 'all' || filter === 'interactions') {
      interactions.forEach(interaction => {
        entries.push({
          type: 'interaction',
          data: interaction,
          timestamp: interaction.timestamp
        });
      });
    }
    
    return entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxEntries);
  }, [encounters, interactions, filter, maxEntries]);

  const toggleExpanded = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getOutcomeIcon = (outcome?: string) => {
    switch (outcome) {
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'escape': return '🏃';
      default: return '⏳';
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'observe': return '👁️';
      case 'approach': return '🚶';
      case 'retreat': return '🔙';
      case 'activate': return '⚡';
      case 'communicate': return '💬';
      case 'hide': return '🫥';
      case 'banish': return '✨';
      case 'study': return '🔍';
      default: return '❓';
    }
  };

  const getEncounterTypeColor = (type: string) => {
    switch (type) {
      case 'observation': return 'text-blue-400';
      case 'interaction': return 'text-green-400';
      case 'challenge': return 'text-yellow-400';
      case 'chase': return 'text-red-400';
      case 'stealth': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const renderEncounterEntry = (encounter: ShadowEncounter, isExpanded: boolean) => (
    <div key={encounter.id} className="border-l-4 border-purple-500 pl-3 mb-3">
      <div 
        className="cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
        onClick={() => toggleExpanded(encounter.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getOutcomeIcon(encounter.outcome)}</span>
            <span className={`font-medium ${getEncounterTypeColor(encounter.encounterType)}`}>
              {encounter.encounterType.charAt(0).toUpperCase() + encounter.encounterType.slice(1)} Encounter
            </span>
            <span className="text-xs text-gray-400">
              Difficulty {encounter.difficulty}/10
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {formatTimestamp(encounter.startTime)}
            {encounter.duration && ` • ${formatDuration(encounter.duration)}`}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-300 space-y-1">
            <div>Entity: {encounter.entityId}</div>
            <div>Room: {encounter.roomId}</div>
            {encounter.playerActions.length > 0 && (
              <div>Actions: {encounter.playerActions.join(', ')}</div>
            )}
            {encounter.outcome && (
              <div className="text-xs text-gray-400">
                Outcome: {encounter.outcome}
              </div>
            )}
            {encounter.rewards && (
              <div className="text-xs text-green-400">
                Rewards: +{encounter.rewards.experienceGained} XP
                {encounter.rewards.quantumBonus > 0 && `, +${encounter.rewards.quantumBonus}% discovery bonus`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderInteractionEntry = (interaction: ShadowInteraction, isExpanded: boolean) => (
    <div key={`${interaction.entityId}_${interaction.timestamp}`} className="border-l-4 border-cyan-500 pl-3 mb-3">
      <div 
        className="cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
        onClick={() => toggleExpanded(`${interaction.entityId}_${interaction.timestamp}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getInteractionIcon(interaction.type)}</span>
            <span className={`font-medium ${interaction.result.success ? 'text-green-400' : 'text-red-400'}`}>
              {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
            </span>
            <span className="text-xs text-gray-400">
              {interaction.result.success ? 'Success' : 'Failed'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {formatTimestamp(interaction.timestamp)}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-300 space-y-1">
            <div>Entity: {interaction.entityId}</div>
            <div>Effect: {interaction.result.effect}</div>
            <div>Response: {interaction.result.entityResponse}</div>
            <div className="text-xs text-gray-400">
              Stress change: {interaction.result.stressChange > 0 ? '+' : ''}{interaction.result.stressChange}
            </div>
            <div className="text-xs text-green-400">
              Experience: +{interaction.result.experienceGained} XP
            </div>
            {interaction.result.artifactEffectiveness !== undefined && (
              <div className="text-xs text-purple-400">
                Artifact effectiveness: {interaction.result.artifactEffectiveness}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Shadow Encounter Log</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('encounters')}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              filter === 'encounters' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Encounters
          </button>
          <button
            onClick={() => setFilter('interactions')}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              filter === 'interactions' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Interactions
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {allEntries.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No shadow encounters recorded yet.
          </div>
        ) : (
          allEntries.map(entry => {
            const entryId = entry.type === 'encounter' 
              ? (entry.data as ShadowEncounter).id
              : `${(entry.data as ShadowInteraction).entityId}_${entry.timestamp}`;
            
            const isExpanded = expandedEntries.has(entryId);
            
            return entry.type === 'encounter'
              ? renderEncounterEntry(entry.data as ShadowEncounter, isExpanded)
              : renderInteractionEntry(entry.data as ShadowInteraction, isExpanded);
          })
        )}
      </div>

      {allEntries.length >= maxEntries && (
        <div className="text-xs text-gray-400 text-center mt-3 border-t border-gray-700 pt-3">
          Showing last {maxEntries} entries
        </div>
      )}
    </div>
  );
};

export default ShadowEncounterLog;
