/**
 * Artifact Journal Interface Component
 * Manages artifact lore, visions, communications, and personal notes
 */

import React, { useState, useMemo } from 'react';
import ArtifactLoreViewer from './ArtifactLoreViewer';
import ArtifactBondDisplay from './ArtifactBondDisplay';
import ArtifactVisionViewer from './ArtifactVisionViewer';
import { 
  type ArtifactArchive,
  type ArtifactLoreEntry,
  type ArtifactVision,
  type ArtifactBond
} from '../../types/artifactArc';

interface ArtifactJournalProps {
  archive: ArtifactArchive;
  bonds: ArtifactBond[];
  onClose: () => void;
  onAddNote?: (artifactId: string, note: string) => void;
  className?: string;
}

type TabType = 'lore' | 'visions' | 'bonds' | 'communications' | 'research';

const ArtifactJournal: React.FC<ArtifactJournalProps> = ({
  archive,
  bonds,
  onClose,
  onAddNote,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('lore');
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [selectedLore, setSelectedLore] = useState<ArtifactLoreEntry | null>(null);
  const [selectedVision, setSelectedVision] = useState<ArtifactVision | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'importance'>('date');

  // Get unique artifacts from archive
  const artifacts = useMemo(() => {
    const artifactSet = new Set<string>();
    
    // Add artifacts from Maps
    Array.from(archive.unlockedLore.values()).forEach(lore => artifactSet.add(lore.artifactId));
    archive.experiencedVisions.forEach(vision => artifactSet.add(vision.artifactId));
    archive.communications.forEach(comm => artifactSet.add(comm.artifactId));
    bonds.forEach(bond => artifactSet.add(bond.artifactId));
    
    return Array.from(artifactSet).sort();
  }, [archive, bonds]);

  // Filter and sort content based on current settings
  const getFilteredLore = () => {
    let lore = Array.from(archive.unlockedLore.values());
    
    if (selectedArtifact) {
      lore = lore.filter((entry: ArtifactLoreEntry) => entry.artifactId === selectedArtifact);
    }
    
    if (searchTerm) {
      lore = lore.filter((entry: ArtifactLoreEntry) => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return lore.sort((a: ArtifactLoreEntry, b: ArtifactLoreEntry) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title);
        case 'importance': return (b.metadata.significance === 'critical' ? 4 : b.metadata.significance === 'high' ? 3 : b.metadata.significance === 'medium' ? 2 : 1) - (a.metadata.significance === 'critical' ? 4 : a.metadata.significance === 'high' ? 3 : a.metadata.significance === 'medium' ? 2 : 1);
        case 'date':
        default: return new Date(b.metadata.timestamp || 0).getTime() - new Date(a.metadata.timestamp || 0).getTime();
      }
    });
  };

  const getFilteredVisions = () => {
    let visions = archive.experiencedVisions;
    
    if (selectedArtifact) {
      visions = visions.filter(vision => vision.artifactId === selectedArtifact);
    }
    
    if (searchTerm) {
      visions = visions.filter(vision => 
        vision.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vision.content.narrative.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return visions.sort((a, b) => a.id.localeCompare(b.id));
  };

  const getFilteredCommunications = () => {
    let communications = archive.communications;
    
    if (selectedArtifact) {
      communications = communications.filter(comm => comm.artifactId === selectedArtifact);
    }
    
    if (searchTerm) {
      communications = communications.filter(comm => 
        comm.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return communications.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
  };

  const getTabCount = (tab: TabType) => {
    switch (tab) {
      case 'lore': return getFilteredLore().length;
      case 'visions': return getFilteredVisions().length;
      case 'bonds': return bonds.length;
      case 'communications': return getFilteredCommunications().length;
      case 'research': return Object.keys(archive.personalNotes).length;
      default: return 0;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lore':
        return (
          <div className="space-y-4">
            {getFilteredLore().map((lore) => {
              // Simple completion tracking - could be enhanced
              const isCompleted = false; // Placeholder since readingProgress isn't in the type
              
              return (
                <div 
                  key={lore.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors cursor-pointer"
                  onClick={() => setSelectedLore(lore)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-white">{lore.title}</h3>
                        {isCompleted && <span className="text-green-400 text-sm">✓ Read</span>}
                      </div>
                      <div className="text-sm text-gray-300 mb-2">
                        Arc: <span className="capitalize">{lore.arc}</span> • 
                        Style: <span className="capitalize">{lore.style}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Significance: <span className="capitalize">{lore.metadata.significance}</span>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {lore.style === 'historical' ? '📜' :
                       lore.style === 'mystical' ? '🔮' :
                       lore.style === 'scientific' ? '🔬' :
                       lore.style === 'personal' ? '💭' :
                       lore.style === 'mysterious' ? '🌙' :
                       lore.style === 'cautionary' ? '⚠️' :
                       '🌟'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'visions':
        return (
          <div className="space-y-4">
            {getFilteredVisions().map((vision) => (
              <div 
                key={vision.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors cursor-pointer"
                onClick={() => setSelectedVision(vision)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-white">{vision.id.replace(/_/g, ' ')}</h3>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        vision.visionType === 'memory' ? 'bg-amber-900 text-amber-200' :
                        vision.visionType === 'prophecy' ? 'bg-purple-900 text-purple-200' :
                        vision.visionType === 'warning' ? 'bg-red-900 text-red-200' :
                        vision.visionType === 'guidance' ? 'bg-blue-900 text-blue-200' :
                        'bg-gray-900 text-gray-200'
                      }`}>
                        {vision.visionType}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Duration: {vision.duration}ms • Intensity: {vision.intensity}/10
                    </div>
                  </div>
                  <div className="text-2xl">
                    {vision.visionType === 'memory' ? '🔮' :
                     vision.visionType === 'prophecy' ? '🌟' :
                     vision.visionType === 'echo' ? '🌊' :
                     vision.visionType === 'warning' ? '⚠️' :
                     vision.visionType === 'guidance' ? '🧭' : '👁️'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'bonds':
        return (
          <div className="space-y-4">
            {bonds.map((bond) => {
              const communications = getFilteredCommunications().filter(
                comm => comm.artifactId === bond.artifactId
              ).slice(0, 5);
              
              return (
                <ArtifactBondDisplay
                  key={bond.artifactId}
                  bond={bond}
                  recentCommunications={communications}
                  onAddNote={onAddNote ? (note) => onAddNote(bond.artifactId, note) : undefined}
                />
              );
            })}
          </div>
        );

      case 'communications':
        return (
          <div className="space-y-4">
            {getFilteredCommunications().map((comm, index) => (
              <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">
                    {comm.communicationType === 'whisper' ? '🌙' :
                     comm.communicationType === 'feeling' ? '💫' :
                     comm.communicationType === 'vision' ? '👁️' :
                     comm.communicationType === 'symbol' ? '✨' :
                     '💬'}
                  </span>
                  <span className="font-bold text-white capitalize">{comm.communicationType}</span>
                  <span className="text-sm text-gray-400">
                    from {comm.artifactId.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-gray-200 mb-2 italic">"{comm.message}"</div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Context: {comm.context.situation}</span>
                  <span>Trigger: {comm.context.trigger}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'research':
        return (
          <div className="space-y-4">
            {Object.entries(archive.personalNotes).map(([artifactId, notes]) => (
              <div key={artifactId} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3 capitalize">
                  {artifactId.replace(/_/g, ' ')} Research Notes
                </h3>
                <div className="space-y-2">
                  {notes.map((note, index) => (
                    <div key={index} className="text-sm text-gray-200 p-2 bg-gray-800 rounded">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-40 ${className}`}>
      <div className="max-w-6xl w-full h-full max-h-[90vh] bg-gray-800 border border-gray-600 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h1 className="text-2xl font-bold text-white">Artifact Journal</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-600 space-y-4">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search lore, visions, communications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
            <select
              value={selectedArtifact || ''}
              onChange={(e) => setSelectedArtifact(e.target.value || null)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">All Artifacts</option>
              {artifacts.map(artifact => (
                <option key={artifact} value={artifact}>
                  {artifact.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="importance">Sort by Importance</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1">
            {(['lore', 'visions', 'bonds', 'communications', 'research'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="capitalize">{tab}</span>
                <span className="ml-2 text-sm bg-gray-600 px-1 rounded">
                  {getTabCount(tab)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      {selectedLore && (
        <ArtifactLoreViewer
          loreEntry={selectedLore}
          onClose={() => setSelectedLore(null)}
          onUnlockReward={() => setSelectedLore(null)}
        />
      )}

      {selectedVision && (
        <ArtifactVisionViewer
          vision={selectedVision}
          onClose={() => setSelectedVision(null)}
          onComplete={() => setSelectedVision(null)}
        />
      )}
    </div>
  );
};

export default ArtifactJournal;
