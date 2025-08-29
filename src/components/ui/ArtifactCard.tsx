/**
 * Artifact Card Component
 * Displays artifact information with activation controls and progress
 */

import React from 'react';
import { type QuantumArtifact } from '../../types/quantumMagic';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Tooltip } from './Tooltip';
import { cn } from '../../utils/cn';

export interface ArtifactCardProps {
  artifact: QuantumArtifact;
  isActive: boolean;
  canActivate: boolean;
  onActivate?: (artifactId: string) => void;
  onDeactivate?: (artifactId: string) => void;
  onViewDetails?: (artifact: QuantumArtifact) => void;
  compact?: boolean;
  className?: string;
}

const elementColors = {
  void: 'bg-purple-900 text-purple-100',
  flux: 'bg-blue-900 text-blue-100',
  resonance: 'bg-green-900 text-green-100',
  entropy: 'bg-red-900 text-red-100',
  nexus: 'bg-yellow-900 text-yellow-100',
};

const tierStyles = {
  shard: 'border-gray-400',
  relic: 'border-blue-400',
  nexus: 'border-purple-400',
  legendary: 'border-yellow-400 shadow-yellow-400/20',
};

export const ArtifactCard: React.FC<ArtifactCardProps> = ({
  artifact,
  isActive,
  canActivate,
  onActivate,
  onDeactivate,
  onViewDetails,
  compact = false,
  className,
}) => {
  const experiencePercent = artifact.maxLevel > 1 
    ? Math.round((artifact.experience / (artifact.level * 200 + 100)) * 100)
    : 100;

  const handleToggleActive = () => {
    if (isActive) {
      onDeactivate?.(artifact.id);
    } else if (canActivate) {
      onActivate?.(artifact.id);
    }
  };

  if (compact) {
    return (
      <div className={cn(
        'artifact-card-compact',
        'flex items-center gap-space-3 p-space-3 rounded-lg border',
        tierStyles[artifact.tier],
        isActive ? 'bg-color-surface-elevated' : 'bg-color-surface',
        className
      )}>
        {/* Element indicator */}
        <div className={cn(
          'w-4 h-4 rounded-full',
          elementColors[artifact.element]
        )} />
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-space-2">
            <span className="font-medium text-color-text-primary truncate">
              {artifact.name}
            </span>
            <Badge variant="outline" className="text-xs">
              Lv.{artifact.level}
            </Badge>
          </div>
          <p className="text-body-xs text-color-text-secondary truncate">
            {artifact.description}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-space-2">
          {isActive && (
            <Badge variant="success" className="text-xs">Active</Badge>
          )}
          <Button
            variant={isActive ? "outline" : "primary"}
            size="sm"
            onClick={handleToggleActive}
            disabled={!isActive && !canActivate}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card 
      variant={isActive ? "elevated" : "outlined"}
      className={cn(
        'artifact-card',
        tierStyles[artifact.tier],
        isActive && 'ring-2 ring-color-primary',
        className
      )}
    >
      <div className="p-space-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-space-3">
          <div className="flex items-center gap-space-3">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
              elementColors[artifact.element]
            )}>
              {(artifact.element && artifact.element[0] ? artifact.element[0].toUpperCase() : '?')}
            </div>
            <div>
              <h3 className="text-heading-sm font-semibold text-color-text-primary">
                {artifact.name}
              </h3>
              <div className="flex items-center gap-space-2 mt-space-1">
                <Badge variant="outline">
                  {artifact.tier.charAt(0).toUpperCase() + artifact.tier.slice(1)}
                </Badge>
                <Badge variant="secondary">
                  Level {artifact.level}
                </Badge>
                {isActive && (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-body-sm text-color-text-secondary mb-space-4">
          {artifact.description}
        </p>

        {/* Experience Progress */}
        {artifact.maxLevel > 1 && (
          <div className="mb-space-4">
            <div className="flex items-center justify-between text-body-xs text-color-text-tertiary mb-space-1">
              <span>Experience</span>
              <span>{experiencePercent}%</span>
            </div>
            <div className="w-full bg-color-surface-elevated rounded-full h-2">
              <div 
                className="bg-color-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${experiencePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Effects */}
        <div className="mb-space-4">
          <h4 className="text-body-sm font-medium text-color-text-primary mb-space-2">
            Effects:
          </h4>
          <div className="space-y-space-1">
            {artifact.effects.map((effect, index) => (
              <div key={index} className="text-body-xs text-color-text-secondary">
                • {effect.description}
              </div>
            ))}
          </div>
        </div>

        {/* Discovery Info */}
        {artifact.discoveryLocation && (
          <div className="mb-space-4 p-space-2 bg-color-surface-elevated rounded text-body-xs">
            <span className="text-color-text-tertiary">Discovered in: </span>
            <span className="text-color-text-secondary">{artifact.discoveryRoute}</span>
          </div>
        )}

        {/* Synergies */}
        {artifact.synergies && artifact.synergies.length > 0 && (
          <div className="mb-space-4">
            <h4 className="text-body-sm font-medium text-color-text-primary mb-space-2">
              Synergizes with:
            </h4>
            <div className="flex flex-wrap gap-space-1">
              {artifact.synergies.map((synergyId) => (
                <Badge key={synergyId} variant="outline" className="text-xs">
                  {synergyId.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-space-3">
          <Button
            variant={isActive ? "outline" : "primary"}
            onClick={handleToggleActive}
            disabled={!isActive && !canActivate}
            className="flex-1"
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
          
          {onViewDetails && (
            <Tooltip content="View detailed lore and mechanics">
              <Button
                variant="ghost"
                onClick={() => onViewDetails(artifact)}
              >
                Details
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Activation limit warning */}
        {!canActivate && !isActive && (
          <p className="text-body-xs text-color-text-tertiary mt-space-2 text-center">
            Maximum artifacts active (3/3)
          </p>
        )}
      </div>
    </Card>
  );
};
