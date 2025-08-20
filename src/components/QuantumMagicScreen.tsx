/**
 * Quantum Magic Screen Component
 * Main interface for managing artifacts, skills, and progression
 */

import React, { useState } from 'react';
import { type QuantumProgression, type QuantumArtifact } from '../types/quantumMagic';
import { ArtifactCard } from './ui/ArtifactCard';
import { SkillTree } from './ui/SkillTree';
import { DiscoveryModal } from './ui/DiscoveryModal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { cn } from '../utils/cn';

export interface QuantumMagicScreenProps {
  progression: QuantumProgression;
  onActivateArtifact: (artifactId: string) => boolean;
  onDeactivateArtifact: (artifactId: string) => boolean;
  onDiscoveryComplete: (discoveryId: string) => void;
  onDismissDiscoveries: () => void;
  pendingDiscoveries: any[];
  onClose?: () => void;
  className?: string;
}

type TabType = 'artifacts' | 'skills' | 'progress';

export const QuantumMagicScreen: React.FC<QuantumMagicScreenProps> = ({
  progression,
  onActivateArtifact,
  onDeactivateArtifact,
  onDiscoveryComplete,
  onDismissDiscoveries,
  pendingDiscoveries,
  onClose,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('artifacts');
  const [selectedArtifact, setSelectedArtifact] = useState<QuantumArtifact | null>(null);
  const [showArtifactDetails, setShowArtifactDetails] = useState(false);

  const artifacts = Array.from(progression.artifacts.values());
  const skills = progression.skills;
  const activeArtifacts = progression.activeArtifacts;

  const canActivateMore = activeArtifacts.length < 3;

  const handleArtifactDetails = (artifact: QuantumArtifact) => {
    setSelectedArtifact(artifact);
    setShowArtifactDetails(true);
  };

  // Calculate completion statistics
  const totalRouteCompletions = 
    progression.routeCompletions.demo +
    progression.routeCompletions.short10.length +
    progression.routeCompletions.short30.length +
    progression.routeCompletions.full;

  const totalSkillLevels = Array.from(skills.values())
    .reduce((sum, skill) => sum + skill.currentLevel, 0);

  return (
    <>
      <div className={cn(
        'quantum-magic-screen',
        'flex flex-col h-full bg-color-background',
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-space-6 border-b border-color-border">
          <div>
            <h1 className="text-heading-xl font-bold text-color-text-primary mb-space-2">
              Quantum Magic
            </h1>
            <div className="flex items-center gap-space-4">
              <Badge variant="primary" className="text-sm">
                Level {progression.quantumLevel}
              </Badge>
              <span className="text-body-md text-color-text-secondary">
                {progression.totalExperience.toLocaleString()} XP
              </span>
              <span className="text-body-sm text-color-text-tertiary">
                {artifacts.length} Artifacts • {Array.from(skills.values()).length} Skills
              </span>
            </div>
          </div>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-color-border">
          <button
            className={cn(
              'px-space-6 py-space-4 text-body-md font-medium border-b-2 transition-colors',
              activeTab === 'artifacts'
                ? 'border-color-primary text-color-primary'
                : 'border-transparent text-color-text-secondary hover:text-color-text-primary'
            )}
            onClick={() => setActiveTab('artifacts')}
          >
            Artifacts ({artifacts.length})
          </button>
          <button
            className={cn(
              'px-space-6 py-space-4 text-body-md font-medium border-b-2 transition-colors',
              activeTab === 'skills'
                ? 'border-color-primary text-color-primary'
                : 'border-transparent text-color-text-secondary hover:text-color-text-primary'
            )}
            onClick={() => setActiveTab('skills')}
          >
            Skills ({Array.from(skills.values()).length})
          </button>
          <button
            className={cn(
              'px-space-6 py-space-4 text-body-md font-medium border-b-2 transition-colors',
              activeTab === 'progress'
                ? 'border-color-primary text-color-primary'
                : 'border-transparent text-color-text-secondary hover:text-color-text-primary'
            )}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-space-6">
          {activeTab === 'artifacts' && (
            <div>
              {/* Active Artifacts Section */}
              {activeArtifacts.length > 0 && (
                <div className="mb-space-8">
                  <h2 className="text-heading-lg font-bold text-color-text-primary mb-space-4">
                    Active Artifacts ({activeArtifacts.length}/3)
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-4">
                    {activeArtifacts.map((artifactId) => {
                      const artifact = progression.artifacts.get(artifactId);
                      if (!artifact) return null;
                      return (
                        <ArtifactCard
                          key={artifactId}
                          artifact={artifact}
                          isActive={true}
                          canActivate={false}
                          onDeactivate={onDeactivateArtifact}
                          onViewDetails={handleArtifactDetails}
                          compact={false}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Artifacts Section */}
              <div>
                <h2 className="text-heading-lg font-bold text-color-text-primary mb-space-4">
                  Artifact Collection
                </h2>
                
                {artifacts.length === 0 ? (
                  <Card variant="outlined" className="p-space-8 text-center">
                    <div className="text-4xl mb-space-4">🔮</div>
                    <h3 className="text-heading-md font-semibold text-color-text-primary mb-space-2">
                      No Artifacts Discovered
                    </h3>
                    <p className="text-body-md text-color-text-secondary">
                      Explore routes and solve puzzles to discover your first quantum artifacts!
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-4">
                    {artifacts.map((artifact) => (
                      <ArtifactCard
                        key={artifact.id}
                        artifact={artifact}
                        isActive={activeArtifacts.includes(artifact.id)}
                        canActivate={canActivateMore}
                        onActivate={onActivateArtifact}
                        onDeactivate={onDeactivateArtifact}
                        onViewDetails={handleArtifactDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <SkillTree skills={skills} />
          )}

          {activeTab === 'progress' && (
            <div className="space-y-space-6">
              {/* Overall Progress */}
              <Card variant="elevated" className="p-space-6">
                <h2 className="text-heading-lg font-bold text-color-text-primary mb-space-4">
                  Quantum Mastery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-6">
                  <div className="text-center">
                    <div className="text-heading-xl font-bold text-color-primary mb-space-1">
                      {progression.quantumLevel}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      Quantum Level
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-heading-xl font-bold text-color-primary mb-space-1">
                      {progression.totalExperience.toLocaleString()}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      Total Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-heading-xl font-bold text-color-primary mb-space-1">
                      {artifacts.length}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      Artifacts Found
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-heading-xl font-bold text-color-primary mb-space-1">
                      {totalSkillLevels}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      Skill Levels
                    </div>
                  </div>
                </div>
              </Card>

              {/* Route Completions */}
              <Card variant="elevated" className="p-space-6">
                <h3 className="text-heading-md font-semibold text-color-text-primary mb-space-4">
                  Route Completions ({totalRouteCompletions})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-4">
                  <div className="text-center p-space-4 bg-color-surface-elevated rounded">
                    <div className="text-heading-lg font-bold text-color-text-primary mb-space-1">
                      {progression.routeCompletions.demo}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      Demo Runs
                    </div>
                  </div>
                  <div className="text-center p-space-4 bg-color-surface-elevated rounded">
                    <div className="text-heading-lg font-bold text-color-text-primary mb-space-1">
                      {progression.routeCompletions.short10.length}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      10-min Adventures
                    </div>
                  </div>
                  <div className="text-center p-space-4 bg-color-surface-elevated rounded">
                    <div className="text-heading-lg font-bold text-color-text-primary mb-space-1">
                      {progression.routeCompletions.short30.length}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      30-min Adventures
                    </div>
                  </div>
                  <div className="text-center p-space-4 bg-color-surface-elevated rounded">
                    <div className="text-heading-lg font-bold text-color-text-primary mb-space-1">
                      {progression.routeCompletions.full}
                    </div>
                    <div className="text-body-sm text-color-text-secondary">
                      Full Game
                    </div>
                  </div>
                </div>
              </Card>

              {/* Element Affinity */}
              <Card variant="elevated" className="p-space-6">
                <h3 className="text-heading-md font-semibold text-color-text-primary mb-space-4">
                  Element Affinity
                </h3>
                <div className="grid grid-cols-5 gap-space-4">
                  {['void', 'flux', 'resonance', 'entropy', 'nexus'].map((element) => {
                    const artifactCount = artifacts.filter(a => a.element === element).length;
                    const skillCount = Array.from(skills.values()).filter(s => s.element === element).length;
                    return (
                      <div key={element} className="text-center">
                        <div className="text-2xl mb-space-2">
                          {element === 'void' ? '🌌' :
                           element === 'flux' ? '⚡' :
                           element === 'resonance' ? '🔮' :
                           element === 'entropy' ? '🌪️' : '⭐'}
                        </div>
                        <div className="text-heading-sm font-semibold text-color-text-primary mb-space-1">
                          {element.charAt(0).toUpperCase() + element.slice(1)}
                        </div>
                        <div className="text-body-xs text-color-text-secondary">
                          {artifactCount} artifacts • {skillCount} skills
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Discoveries */}
              <Card variant="elevated" className="p-space-6">
                <h3 className="text-heading-md font-semibold text-color-text-primary mb-space-4">
                  Discovery Log
                </h3>
                <div className="text-body-md text-color-text-secondary">
                  <p>Total Discoveries: {progression.discoveries.length}</p>
                  <p className="mt-space-2">
                    Preferred Element: {progression.preferredElement.charAt(0).toUpperCase() + progression.preferredElement.slice(1)}
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Artifact Details Modal */}
      <Modal
        isOpen={showArtifactDetails}
        onClose={() => setShowArtifactDetails(false)}
        title={selectedArtifact?.name || ''}
        className="max-w-2xl"
      >
        {selectedArtifact && (
          <div className="space-y-space-4">
            <div className="flex items-center gap-space-3">
              <Badge variant="outline">
                {selectedArtifact.tier.charAt(0).toUpperCase() + selectedArtifact.tier.slice(1)}
              </Badge>
              <Badge variant="secondary">
                {selectedArtifact.element.charAt(0).toUpperCase() + selectedArtifact.element.slice(1)} Element
              </Badge>
              <Badge variant="info">
                Level {selectedArtifact.level}/{selectedArtifact.maxLevel}
              </Badge>
            </div>

            <p className="text-body-md text-color-text-secondary">
              {selectedArtifact.description}
            </p>

            <div className="p-space-4 bg-color-surface-elevated rounded">
              <h4 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                Quantum Lore
              </h4>
              <p className="text-body-sm text-color-text-secondary italic">
                "{selectedArtifact.lore}"
              </p>
            </div>

            <div>
              <h4 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                Effects:
              </h4>
              <div className="space-y-space-2">
                {selectedArtifact.effects.map((effect, index) => (
                  <div key={index} className="p-space-3 bg-color-surface-elevated rounded">
                    <span className="font-medium text-color-text-primary">
                      {effect.type.replace(/_/g, ' ').toUpperCase()}:
                    </span>
                    <span className="ml-space-2 text-color-text-secondary">
                      {effect.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedArtifact.synergies && selectedArtifact.synergies.length > 0 && (
              <div>
                <h4 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
                  Synergizes with:
                </h4>
                <div className="flex flex-wrap gap-space-2">
                  {selectedArtifact.synergies.map((synergyId) => (
                    <Badge key={synergyId} variant="outline">
                      {synergyId.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedArtifact.discoveryLocation && (
              <div className="text-body-sm text-color-text-tertiary">
                <span>Discovered in:</span>
                <span className="ml-space-2 font-medium">
                  {selectedArtifact.discoveryRoute} • {selectedArtifact.discoveryLocation}
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setShowArtifactDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Discovery Modal */}
      <DiscoveryModal
        discoveries={pendingDiscoveries}
        onComplete={onDiscoveryComplete}
        onDismissAll={onDismissDiscoveries}
      />
    </>
  );
};
