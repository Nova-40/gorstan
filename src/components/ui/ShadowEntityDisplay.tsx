/**
 * Shadow Entity Display Component
 * Shows active shadow entities with interaction options
 */

import React, { useState } from 'react';
import { type ShadowEntity, type ShadowInteractionType } from '../../types/shadowEncounters';

interface ShadowEntityDisplayProps {
  entity: ShadowEntity;
  playerStress: number;
  availableArtifacts: string[];
  onInteract: (
    entityId: string,
    interactionType: ShadowInteractionType,
    artifactIds?: string[],
  ) => void;
  className?: string;
}

const ShadowEntityDisplay: React.FC<ShadowEntityDisplayProps> = ({
  entity,
  playerStress,
  availableArtifacts,
  onInteract,
  className = '',
}) => {
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const getEntityOpacity = () => {
    return Math.max(0.2, entity.stats.manifestation / 100);
  };

  const getEntitySizeClass = () => {
    switch (entity.type) {
      case 'whisper':
        return 'text-sm';
      case 'wraith':
        return 'text-base';
      case 'shade':
        return 'text-lg';
      case 'umbral':
        return 'text-xl';
      case 'void_spawn':
        return 'text-2xl';
      default:
        return 'text-base';
    }
  };

  const getEntityColorClass = () => {
    switch (entity.type) {
      case 'whisper':
        return 'text-gray-400 border-gray-500';
      case 'wraith':
        return 'text-purple-400 border-purple-500';
      case 'shade':
        return 'text-blue-400 border-blue-500';
      case 'umbral':
        return 'text-red-400 border-red-500';
      case 'void_spawn':
        return 'text-black border-black dark:text-white dark:border-white';
      default:
        return 'text-gray-400 border-gray-500';
    }
  };

  const getBehaviorDescription = () => {
    switch (entity.behavior) {
      case 'passive':
        return 'observing quietly';
      case 'curious':
        return 'watching with interest';
      case 'territorial':
        return 'guarding this space';
      case 'aggressive':
        return 'moving menacingly';
      case 'mimic':
        return 'copying your movements';
      case 'phase':
        return 'flickering in and out';
      case 'collective':
        return 'moving as one entity';
      default:
        return 'present';
    }
  };

  const getStressEffect = () => {
    if (playerStress > 80) {
      return 'The shadow seems more solid and threatening.';
    }
    if (playerStress > 50) {
      return 'Your stress makes the shadow more noticeable.';
    }
    if (playerStress > 20) {
      return "You feel uneasy in the shadow's presence.";
    }
    return 'The shadow appears calm and distant.';
  };

  const handleInteraction = (interactionType: ShadowInteractionType) => {
    const artifactIds =
      interactionType === 'activate' || interactionType === 'banish' ? selectedArtifacts : [];

    onInteract(entity.id, interactionType, artifactIds);

    // Reset artifact selection after use
    if (artifactIds.length > 0) {
      setSelectedArtifacts([]);
    }
  };

  const toggleArtifactSelection = (artifactId: string) => {
    setSelectedArtifacts((prev) =>
      prev.includes(artifactId) ? prev.filter((id) => id !== artifactId) : [...prev, artifactId],
    );
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 transition-all duration-500 ${getEntityColorClass()} ${className}`}
      style={{ opacity: getEntityOpacity() }}
    >
      {/* Entity Header */}
      <div className={`font-bold ${getEntitySizeClass()} mb-2`}>
        <span className="shadow-text">{entity.name}</span>
        <span className="ml-2 text-xs opacity-75">({entity.type})</span>
      </div>

      {/* Entity Description */}
      <div className="text-sm text-gray-300 mb-3">{entity.description}</div>

      {/* Behavior Status */}
      <div className="text-xs text-gray-400 mb-3 italic">
        {getBehaviorDescription()} • {getStressEffect()}
      </div>

      {/* Entity Stats (if details shown) */}
      {showDetails && (
        <div className="text-xs text-gray-400 mb-3 space-y-1">
          <div>Manifestation: {entity.stats.manifestation}%</div>
          <div>Aggression: {entity.stats.aggression}%</div>
          <div>Awareness: {entity.stats.awareness}%</div>
          <div>Weaknesses: {entity.weaknesses.join(', ')}</div>
        </div>
      )}

      {/* Artifact Selection (for quantum interactions) */}
      {availableArtifacts.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">Available Quantum Artifacts:</div>
          <div className="flex flex-wrap gap-1">
            {availableArtifacts.map((artifactId) => (
              <button
                key={artifactId}
                onClick={() => toggleArtifactSelection(artifactId)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selectedArtifacts.includes(artifactId)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {artifactId.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => handleInteraction('observe')}
          className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Observe
        </button>

        <button
          onClick={() => handleInteraction('approach')}
          className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          Approach
        </button>

        <button
          onClick={() => handleInteraction('retreat')}
          className="text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
        >
          Retreat
        </button>

        {availableArtifacts.length > 0 && (
          <>
            <button
              onClick={() => handleInteraction('activate')}
              disabled={selectedArtifacts.length === 0}
              className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Activate ({selectedArtifacts.length})
            </button>

            <button
              onClick={() => handleInteraction('banish')}
              disabled={selectedArtifacts.length === 0}
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              Banish
            </button>
          </>
        )}

        <button
          onClick={() => handleInteraction('communicate')}
          className="text-xs px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
        >
          Communicate
        </button>

        <button
          onClick={() => handleInteraction('hide')}
          className="text-xs px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Hide
        </button>

        <button
          onClick={() => handleInteraction('study')}
          className="text-xs px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
        >
          Study
        </button>
      </div>

      {/* Details Toggle */}
      <div className="text-right">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-400 hover:text-gray-300 underline"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
  );
};

export default ShadowEntityDisplay;
