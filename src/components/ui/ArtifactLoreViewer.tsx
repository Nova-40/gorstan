/**
 * Artifact Lore Viewer Component
 * Displays artifact lore entries with immersive presentation
 */

import React, { useState, useEffect } from 'react';
import { type ArtifactLoreEntry } from '../../types/artifactArc';

interface ArtifactLoreViewerProps {
  loreEntry: ArtifactLoreEntry;
  onClose: () => void;
  onUnlockReward?: (experienceGain: number) => void;
  className?: string;
}

const ArtifactLoreViewer: React.FC<ArtifactLoreViewerProps> = ({
  loreEntry,
  onClose,
  onUnlockReward,
  className = '',
}) => {
  const [isReading, setIsReading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (isReading) {
      const words = loreEntry.content.split(' ').length;
      const readingTime = Math.max(10000, words * 200); // Minimum 10 seconds, ~200ms per word

      const progressInterval = setInterval(() => {
        setReadingProgress((prev) => {
          const next = prev + 100 / (readingTime / 100);
          if (next >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setShowRewards(true);
              if (onUnlockReward) {
                const experienceReward = Math.floor(words / 10) * 10; // 10 XP per 10 words
                onUnlockReward(experienceReward);
              }
            }, 500);
            return 100;
          }
          return next;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [isReading, loreEntry.content, onUnlockReward]);

  const getStyleClasses = () => {
    switch (loreEntry.style) {
      case 'historical':
        return 'bg-amber-900 border-amber-600 text-amber-100';
      case 'personal':
        return 'bg-blue-900 border-blue-600 text-blue-100';
      case 'mysterious':
        return 'bg-purple-900 border-purple-600 text-purple-100';
      case 'scientific':
        return 'bg-gray-900 border-gray-600 text-gray-100';
      case 'mystical':
        return 'bg-indigo-900 border-indigo-600 text-indigo-100';
      case 'cautionary':
        return 'bg-red-900 border-red-600 text-red-100';
      case 'prophetic':
        return 'bg-green-900 border-green-600 text-green-100';
      default:
        return 'bg-gray-900 border-gray-600 text-gray-100';
    }
  };

  const getArcIcon = () => {
    switch (loreEntry.arc) {
      case 'origin':
        return '🌟';
      case 'discovery':
        return '🔍';
      case 'mastery':
        return '⚡';
      case 'awakening':
        return '👁️';
      case 'evolution':
        return '🦋';
      case 'legacy':
        return '📜';
      case 'synthesis':
        return '🔮';
      default:
        return '📖';
    }
  };

  const getSignificanceColor = () => {
    switch (loreEntry.metadata.significance) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 ${className}`}
    >
      <div
        className={`max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border-2 ${getStyleClasses()}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getArcIcon()}</span>
              <h2 className="text-2xl font-bold">{loreEntry.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm opacity-75">
            <div>
              <span className="capitalize">{loreEntry.arc}</span> •
              <span className="capitalize ml-1">{loreEntry.style}</span>
            </div>
            <div className={`font-medium ${getSignificanceColor()}`}>
              {loreEntry.metadata.significance.toUpperCase()}
            </div>
            {loreEntry.metadata.author && <div>by {loreEntry.metadata.author}</div>}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-96">
          {!isReading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{getArcIcon()}</div>
              <h3 className="text-xl mb-6">Begin Reading?</h3>
              <button
                onClick={() => setIsReading(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start Reading
              </button>
            </div>
          ) : (
            <div>
              {/* Reading Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Reading Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>

              {/* Lore Content */}
              <div className="prose prose-invert max-w-none">
                {formatContent(loreEntry.content)}
              </div>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        {isReading && (
          <div className="p-4 border-t border-opacity-50 text-sm opacity-75">
            <div className="grid grid-cols-2 gap-4">
              {loreEntry.metadata.timestamp && (
                <div>
                  <span className="font-medium">Time Period:</span> {loreEntry.metadata.timestamp}
                </div>
              )}
              {loreEntry.metadata.location && (
                <div>
                  <span className="font-medium">Location:</span> {loreEntry.metadata.location}
                </div>
              )}
              {loreEntry.metadata.discoveryMethod && (
                <div>
                  <span className="font-medium">Discovery Method:</span>{' '}
                  {loreEntry.metadata.discoveryMethod}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rewards Panel */}
        {showRewards && (
          <div className="p-4 bg-green-900 bg-opacity-50 border-t border-green-600">
            <div className="text-center">
              <div className="text-green-400 font-bold mb-2">Knowledge Acquired!</div>
              <div className="text-sm">
                Your understanding of {loreEntry.artifactId.replace(/_/g, ' ')} has deepened.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactLoreViewer;
