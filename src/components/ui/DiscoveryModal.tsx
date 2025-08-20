/**
 * Discovery Modal Component
 * Displays quantum magic discoveries with animations and lore
 */

import React, { useState, useEffect } from 'react';
import { type QuantumDiscovery } from '../../types/quantumMagic';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

export interface DiscoveryModalProps {
  discoveries: QuantumDiscovery[];
  onComplete: (discoveryId: string) => void;
  onDismissAll: () => void;
  className?: string;
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  uncommon: 'bg-green-100 text-green-800 border-green-300',
  rare: 'bg-blue-100 text-blue-800 border-blue-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const elementIcons = {
  void: '🌌',
  flux: '⚡',
  resonance: '🔮',
  entropy: '🌪️',
  nexus: '⭐',
};

const discoveryTypeIcons = {
  artifact: '💎',
  lore: '📜',
  skill_unlock: '🧠',
  synergy: '✨',
};

interface SingleDiscoveryProps {
  discovery: QuantumDiscovery;
  onNext: () => void;
  isLast: boolean;
}

const SingleDiscovery: React.FC<SingleDiscoveryProps> = ({
  discovery,
  onNext,
  isLast,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Animate reveal after short delay
    const timer = setTimeout(() => setIsRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center space-y-space-6">
      {/* Discovery Type Icon */}
      <div className={cn(
        'mx-auto w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-500',
        'bg-gradient-to-br from-color-primary/20 to-color-primary/10',
        isRevealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      )}>
        {discoveryTypeIcons[discovery.type]}
      </div>

      {/* Discovery Info */}
      <div className={cn(
        'space-y-space-3 transition-all duration-700 delay-200',
        isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}>
        <div className="flex items-center justify-center gap-space-3">
          <Badge 
            variant="outline" 
            className={cn('text-sm', rarityColors[discovery.rarity])}
          >
            {discovery.rarity}
          </Badge>
          <span className="text-2xl">{elementIcons[discovery.element]}</span>
        </div>

        <h2 className="text-heading-lg font-bold text-color-text-primary">
          {discovery.title}
        </h2>

        <p className="text-body-lg text-color-text-secondary max-w-md mx-auto">
          {discovery.description}
        </p>
      </div>

      {/* Additional Info based on type */}
      <div className={cn(
        'transition-all duration-700 delay-400',
        isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}>
        {discovery.type === 'artifact' && discovery.artifactId && (
          <div className="p-space-4 bg-color-surface-elevated rounded-lg max-w-md mx-auto">
            <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
              Quantum Artifact Acquired
            </h3>
            <p className="text-body-sm text-color-text-secondary">
              This artifact has been added to your collection and can be activated in your quantum inventory.
            </p>
          </div>
        )}

        {discovery.type === 'skill_unlock' && discovery.skillId && (
          <div className="p-space-4 bg-color-surface-elevated rounded-lg max-w-md mx-auto">
            <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
              New Quantum Skill Unlocked
            </h3>
            <p className="text-body-sm text-color-text-secondary">
              This skill is now available in your skill tree and can be upgraded with experience.
            </p>
          </div>
        )}

        {discovery.type === 'synergy' && discovery.synergyPartners && (
          <div className="p-space-4 bg-color-surface-elevated rounded-lg max-w-md mx-auto">
            <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
              Quantum Synergy Activated!
            </h3>
            <p className="text-body-sm text-color-text-secondary mb-space-2">
              Your active artifacts are resonating together, enhancing their effects.
            </p>
            <div className="flex flex-wrap gap-space-1 justify-center">
              {discovery.synergyPartners.map((partnerId) => (
                <Badge key={partnerId} variant="outline" className="text-xs">
                  {partnerId.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {discovery.type === 'lore' && discovery.loreText && (
          <div className="p-space-4 bg-color-surface-elevated rounded-lg max-w-lg mx-auto">
            <h3 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
              Quantum Lore Fragment
            </h3>
            <p className="text-body-sm text-color-text-secondary italic">
              "{discovery.loreText}"
            </p>
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className={cn(
        'text-body-xs text-color-text-tertiary transition-all duration-700 delay-600',
        isRevealed ? 'opacity-100' : 'opacity-0'
      )}>
        Discovered in: {discovery.routeId} • {discovery.nodeId}
      </div>

      {/* Continue Button */}
      <div className={cn(
        'transition-all duration-700 delay-800',
        isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}>
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className="min-w-32"
        >
          {isLast ? 'Continue Adventure' : 'Next Discovery'}
        </Button>
      </div>
    </div>
  );
};

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  discoveries,
  onComplete,
  onDismissAll,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(discoveries.length > 0);

  useEffect(() => {
    setIsOpen(discoveries.length > 0);
    setCurrentIndex(0);
  }, [discoveries]);

  const handleNext = () => {
    const currentDiscovery = discoveries[currentIndex];
    if (currentDiscovery) {
      onComplete(currentDiscovery.id);
    }

    if (currentIndex < discoveries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All discoveries shown
      setIsOpen(false);
      onDismissAll();
    }
  };

  const handleSkipAll = () => {
    discoveries.forEach(discovery => onComplete(discovery.id));
    setIsOpen(false);
    onDismissAll();
  };

  const currentDiscovery = discoveries[currentIndex];

  if (!isOpen || !currentDiscovery) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing until discovery is acknowledged
      title=""
      className={cn('max-w-2xl', className)}
    >
      <div className="p-space-6">
        {/* Progress indicator */}
        {discoveries.length > 1 && (
          <div className="mb-space-6">
            <div className="flex items-center justify-between text-body-sm text-color-text-tertiary mb-space-2">
              <span>Discovery {currentIndex + 1} of {discoveries.length}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipAll}
                className="text-color-text-tertiary hover:text-color-text-secondary"
              >
                Skip All
              </Button>
            </div>
            <div className="w-full bg-color-surface-elevated rounded-full h-1">
              <div 
                className="bg-color-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / discoveries.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Current Discovery */}
        <SingleDiscovery
          discovery={currentDiscovery}
          onNext={handleNext}
          isLast={currentIndex === discoveries.length - 1}
        />
      </div>
    </Modal>
  );
};
