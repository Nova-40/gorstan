/**
 * Artifact Vision Viewer Component
 * Displays artifact visions in an immersive presentation
 */

import React, { useState } from 'react';
import { type ArtifactVision } from '../../types/artifactArc';

interface ArtifactVisionViewerProps {
  vision: ArtifactVision;
  onClose: () => void;
  onComplete?: () => void;
  className?: string;
}

const ArtifactVisionViewer: React.FC<ArtifactVisionViewerProps> = ({
  vision,
  onClose,
  onComplete,
  className = '',
}) => {
  const [currentView, setCurrentView] = useState<'narrative' | 'imagery' | 'emotions' | 'symbols'>(
    'narrative',
  );

  const getVisionTypeStyle = (type: string) => {
    switch (type) {
      case 'memory':
        return {
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3), rgba(160, 82, 45, 0.1))',
          border: 'border-amber-600',
          glow: 'shadow-amber-500/30',
        };
      case 'prophecy':
        return {
          background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.3), rgba(138, 43, 226, 0.1))',
          border: 'border-purple-600',
          glow: 'shadow-purple-500/30',
        };
      case 'echo':
        return {
          background: 'linear-gradient(135deg, rgba(0, 100, 0, 0.3), rgba(34, 139, 34, 0.1))',
          border: 'border-green-600',
          glow: 'shadow-green-500/30',
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(220, 20, 60, 0.1))',
          border: 'border-red-600',
          glow: 'shadow-red-500/30',
        };
      case 'guidance':
        return {
          background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.3), rgba(30, 144, 255, 0.1))',
          border: 'border-blue-600',
          glow: 'shadow-blue-500/30',
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(105, 105, 105, 0.3), rgba(169, 169, 169, 0.1))',
          border: 'border-gray-600',
          glow: 'shadow-gray-500/30',
        };
    }
  };

  const getVisionIcon = (type: string) => {
    switch (type) {
      case 'memory':
        return '🔮';
      case 'prophecy':
        return '🌟';
      case 'echo':
        return '🌊';
      case 'warning':
        return '⚠️';
      case 'guidance':
        return '🧭';
      default:
        return '👁️';
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      onClose();
    }
  };

  const style = getVisionTypeStyle(vision.visionType);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 ${className}`}
    >
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-lg border-2 ${style.border} ${style.glow} shadow-2xl`}
        style={{ background: style.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getVisionIcon(vision.visionType)}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{vision.id.replace(/_/g, ' ')}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span className="capitalize">{vision.visionType}</span>
                <span>•</span>
                <span>Intensity: {vision.intensity}/10</span>
                <span>•</span>
                <span>Duration: {Math.round(vision.duration / 1000)}s</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Vision Content Navigation */}
        <div className="flex border-b border-gray-600">
          {(['narrative', 'imagery', 'emotions', 'symbols'] as const).map((viewType) => (
            <button
              key={viewType}
              onClick={() => setCurrentView(viewType)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                currentView === viewType
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {viewType}
            </button>
          ))}
        </div>

        {/* Vision Content Display */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentView === 'narrative' && (
            <div className="text-lg leading-relaxed text-white">{vision.content.narrative}</div>
          )}

          {currentView === 'imagery' && (
            <div className="space-y-4">
              {vision.content.imagery && vision.content.imagery.length > 0 ? (
                vision.content.imagery.map((image, index) => (
                  <div
                    key={index}
                    className="p-4 bg-black bg-opacity-30 rounded border border-gray-600"
                  >
                    <div className="text-gray-200 italic">{image}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center">No visual imagery recorded</div>
              )}
            </div>
          )}

          {currentView === 'emotions' && (
            <div className="space-y-4">
              {vision.content.emotions && vision.content.emotions.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {vision.content.emotions.map((emotion, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded text-center">
                      <div className="text-lg text-blue-300 capitalize">{emotion}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center">No emotional resonance recorded</div>
              )}
            </div>
          )}

          {currentView === 'symbols' && (
            <div className="space-y-4">
              {vision.content.symbols && vision.content.symbols.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {vision.content.symbols.map((symbol, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded text-center">
                      <div className="text-2xl mb-2">✨</div>
                      <div className="text-sm text-gray-300">{symbol}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center">No symbolic elements recorded</div>
              )}
            </div>
          )}
        </div>

        {/* Aftermath Information */}
        {vision.aftermath && (
          <div className="p-4 border-t border-gray-600 bg-black bg-opacity-20">
            <h3 className="text-sm font-bold text-gray-300 mb-2">Vision Aftermath</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {vision.aftermath.experienceGain && (
                <div>
                  <span className="text-gray-400">Experience Gained:</span>
                  <span className="ml-2 text-green-400">+{vision.aftermath.experienceGain}</span>
                </div>
              )}
              {vision.aftermath.stressChange && (
                <div>
                  <span className="text-gray-400">Stress Change:</span>
                  <span
                    className={`ml-2 ${vision.aftermath.stressChange > 0 ? 'text-red-400' : 'text-green-400'}`}
                  >
                    {vision.aftermath.stressChange > 0 ? '+' : ''}
                    {vision.aftermath.stressChange}
                  </span>
                </div>
              )}
              {vision.aftermath.artifactBondIncrease && (
                <div>
                  <span className="text-gray-400">Bond Increase:</span>
                  <span className="ml-2 text-blue-400">
                    +{vision.aftermath.artifactBondIncrease}
                  </span>
                </div>
              )}
              {vision.aftermath.unlockedLore && vision.aftermath.unlockedLore.length > 0 && (
                <div>
                  <span className="text-gray-400">Unlocked Lore:</span>
                  <span className="ml-2 text-purple-400">
                    {vision.aftermath.unlockedLore.length} entries
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trigger Conditions */}
        <div className="p-4 border-t border-gray-600 text-xs text-gray-400">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Artifact:</span>{' '}
              {vision.artifactId.replace(/_/g, ' ')}
            </div>
            <div>
              <span className="font-semibold">Type:</span>
              <span className="capitalize ml-1">{vision.visionType}</span>
            </div>
          </div>
          {vision.triggerConditions && (
            <div className="mt-2 space-y-1">
              {vision.triggerConditions.quantumResonance && (
                <div>Quantum Resonance: {vision.triggerConditions.quantumResonance}</div>
              )}
              {vision.triggerConditions.timeOfDay && (
                <div>Time: {vision.triggerConditions.timeOfDay}</div>
              )}
              {vision.triggerConditions.roomType && (
                <div>Location: {vision.triggerConditions.roomType}</div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-600 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Mark as Experienced
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtifactVisionViewer;
