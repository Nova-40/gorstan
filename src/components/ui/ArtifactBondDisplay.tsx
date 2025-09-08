/**
 * Artifact Bond Display Component
 * Shows the relationship between player and artifact
 */

import React, { useState } from 'react';
import { type ArtifactBond, type ArtifactCommunication } from '../../types/artifactArc';

interface ArtifactBondDisplayProps {
  bond: ArtifactBond;
  recentCommunications: ArtifactCommunication[];
  onAddNote?: (note: string) => void;
  className?: string;
}

const ArtifactBondDisplay: React.FC<ArtifactBondDisplayProps> = ({
  bond,
  recentCommunications,
  onAddNote,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const getBondLevelColor = (level: number) => {
    if (level >= 80) {return 'text-purple-400 bg-purple-900';}
    if (level >= 60) {return 'text-blue-400 bg-blue-900';}
    if (level >= 40) {return 'text-green-400 bg-green-900';}
    if (level >= 20) {return 'text-yellow-400 bg-yellow-900';}
    return 'text-gray-400 bg-gray-900';
  };

  const getBondTypeDescription = (type: string) => {
    switch (type) {
      case 'resonance': return 'Initial connection and harmony';
      case 'mastery': return 'Skilled partnership and understanding';
      case 'symbiosis': return 'Deep mutual dependence and growth';
      case 'transcendence': return 'Unified consciousness and purpose';
      default: return 'Unknown bond type';
    }
  };

  const getPersonalityBar = (trait: string, value: number) => (
    <div key={trait} className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="capitalize">{trait}</span>
        <span>{value.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            trait === 'communicative' ? 'bg-blue-500' :
            trait === 'protective' ? 'bg-green-500' :
            trait === 'autonomous' ? 'bg-purple-500' :
            'bg-orange-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {return `${days}d ${hours}h ago`;}
    if (hours > 0) {return `${hours}h ago`;}
    return 'Recently';
  };

  const getTotalExperience = () => {
    return Object.values(bond.experiences).reduce((sum, exp) => sum + exp, 0);
  };

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim());
      setNewNote('');
      setShowNoteInput(false);
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'whisper': return '🌙';
      case 'feeling': return '💫';
      case 'vision': return '👁️';
      case 'symbol': return '✨';
      case 'direct': return '💬';
      default: return '❓';
    }
  };

  return (
    <div className={`bg-gray-800 border border-gray-600 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          Artifact Bond: {bond.artifactId.replace(/_/g, ' ')}
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showDetails ? '▼' : '▶'}
        </button>
      </div>

      {/* Bond Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Bond Level</span>
          <span className={`text-sm font-bold ${getBondLevelColor(bond.bondLevel).split(' ')[0]}`}>
            {bond.bondLevel.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getBondLevelColor(bond.bondLevel).split(' ')[1]}`}
            style={{ width: `${bond.bondLevel}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {getBondTypeDescription(bond.bondType)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <div className="text-lg font-bold text-blue-400">{getTotalExperience()}</div>
          <div className="text-xs text-gray-400">Total Experience</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-400">
            {Math.floor((Date.now() - bond.formationTime) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-xs text-gray-400">Days Together</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-400">{recentCommunications.length}</div>
          <div className="text-xs text-gray-400">Communications</div>
        </div>
      </div>

      {/* Recent Communications */}
      {recentCommunications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-300 mb-2">Recent Communications</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentCommunications.slice(-3).map((comm, index) => (
              <div key={index} className="text-xs bg-gray-700 rounded p-2">
                <div className="flex items-center space-x-2 mb-1">
                  <span>{getCommunicationIcon(comm.communicationType)}</span>
                  <span className="text-gray-400 capitalize">{comm.communicationType}</span>
                </div>
                <div className="text-gray-200 italic">"{comm.message}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-4 border-t border-gray-600 pt-4">
          {/* Personality Traits */}
          {bond.personality && (
            <div>
              <h4 className="text-sm font-bold text-gray-300 mb-3">Artifact Personality</h4>
              <div className="space-y-2">
                {Object.entries(bond.personality).map(([trait, value]) =>
                  getPersonalityBar(trait, value)
                )}
              </div>
            </div>
          )}

          {/* Experience Breakdown */}
          <div>
            <h4 className="text-sm font-bold text-gray-300 mb-3">Shared Experiences</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Discoveries:</span>
                <span className="ml-2 text-blue-400">{bond.experiences.discoveries}</span>
              </div>
              <div>
                <span className="text-gray-400">Visions:</span>
                <span className="ml-2 text-purple-400">{bond.experiences.visions}</span>
              </div>
              <div>
                <span className="text-gray-400">Combat Uses:</span>
                <span className="ml-2 text-red-400">{bond.experiences.combatUses}</span>
              </div>
              <div>
                <span className="text-gray-400">Emergency:</span>
                <span className="ml-2 text-orange-400">{bond.experiences.emergencyActivations}</span>
              </div>
            </div>
          </div>

          {/* Bond History */}
          <div>
            <h4 className="text-sm font-bold text-gray-300 mb-2">Bond History</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Formed: {formatTimeAgo(bond.formationTime)}</div>
              <div>Last Interaction: {formatTimeAgo(bond.lastInteraction)}</div>
              <div>Bond Type: <span className="capitalize text-gray-300">{bond.bondType}</span></div>
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-300">Personal Notes</h4>
              {onAddNote && (
                <button
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Add Note
                </button>
              )}
            </div>
            
            {showNoteInput && (
              <div className="mb-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a personal note about this artifact..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactBondDisplay;
