/**
 * In-Game HUD Component
 * Displays route progress, timing, and objectives during gameplay
 */

import React, { useState } from 'react';
import { type RouteManifest } from '../types/routes';
import { ObjectiveList } from './ui/ObjectiveList';
import { Countdown } from './ui/Countdown';
import { RouteBadge } from './ui/RouteBadge';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { cn } from '../utils/cn';
import { useTimebox, useObjectives } from '../services';

interface InGameHUDProps {
  route: RouteManifest;
  onPause?: () => void;
  onExit?: () => void;
  onSkipObjective?: (nodeId: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

export const InGameHUD: React.FC<InGameHUDProps> = ({
  route,
  onPause,
  onExit,
  onSkipObjective,
  isCollapsed = false,
  className,
}) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);

  // Services
  const { state: timeboxState, pause: pauseTimer } = useTimebox(
    {
      targetMinutes: route.targetMinutes,
      warningThresholds: route.targetMinutes === 10 ? [5, 2, 1] : 
                         route.targetMinutes === 30 ? [10, 5, 2] : 
                         [3, 1],
      allowOvertime: true,
      overtimeGracePeriod: route.targetMinutes === 10 ? 2 : 
                           route.targetMinutes === 30 ? 5 : 3,
    },
    {
      onWarning: (state) => {
        // Show warning notifications
        console.log('Time warning:', state.remainingMinutes, 'minutes remaining');
      },
      onOvertime: (state) => {
        console.log('Overtime:', state.currentMinutes - state.targetMinutes, 'minutes over');
      },
      onExpired: () => {
        console.log('Time expired - adventure ending');
      },
    }
  );

  const { progress: objectivesProgress } = useObjectives(route, {
    onObjectiveComplete: (objective, _progress) => {
      console.log('Objective completed:', objective.label);
    },
    onRouteComplete: (progress) => {
      console.log('Route completed!', progress.completionRate + '% done');
    },
  });

  const handlePause = () => {
    pauseTimer();
    onPause?.();
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    onExit?.();
    setShowExitModal(false);
  };

  const handleSkip = (nodeId: string) => {
    onSkipObjective?.(nodeId);
  };

  const getRouteType = (routeId: string): 'demo' | 'short10' | 'short30' | 'full' => {
    if (routeId === 'demo') return 'demo';
    if (routeId === 'full') return 'full';
    if (routeId.startsWith('short10')) return 'short10';
    if (routeId.startsWith('short30')) return 'short30';
    return 'demo';
  };

  // Collapsed view for minimal distraction
  if (isCollapsed) {
    return (
      <div className={cn(
        'in-game-hud-collapsed',
        'fixed top-space-4 right-space-4 z-50',
        'flex items-center gap-space-3',
        className
      )}>
        <Card variant="elevated" className="px-space-3 py-space-2">
          <div className="flex items-center gap-space-2 text-body-sm">
            {timeboxState && route.targetMinutes < 999 && (
              <Countdown
                totalSeconds={timeboxState.remainingMinutes * 60}
                warningThreshold={300}
                criticalThreshold={60}
                format="digital"
                className="font-mono"
              />
            )}
            <span className="text-color-text-tertiary">•</span>
            <span className="text-color-text-secondary">
              {objectivesProgress?.completedRequired}/{objectivesProgress?.required}
            </span>
          </div>
        </Card>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowObjectivesModal(true)}
          className="bg-color-surface text-color-text-primary"
        >
          Objectives
        </Button>
      </div>
    );
  }

  // Full HUD view
  return (
    <>
      <div className={cn(
        'in-game-hud',
        'fixed top-0 left-0 right-0 z-40',
        'bg-color-surface border-b border-color-border',
        'shadow-elevation-md',
        className
      )}>
        <div className="container mx-auto px-space-4 py-space-3">
          <div className="flex items-center justify-between">
            {/* Route Info */}
            <div className="flex items-center gap-space-4">
              <RouteBadge 
                routeType={getRouteType(route.id)}
                difficulty={route.difficulty}
                duration={route.targetMinutes}
              />
              <div>
                <h2 className="text-heading-sm font-semibold text-color-text-primary">
                  {route.label}
                </h2>
                <div className="flex items-center gap-space-2 text-body-xs text-color-text-secondary">
                  <span>Progress: {objectivesProgress?.completedRequired}/{objectivesProgress?.required}</span>
                  {route.hintPolicy !== 'off' && (
                    <>
                      <span>•</span>
                      <span>Hints: {route.hintPolicy}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Timer and Actions */}
            <div className="flex items-center gap-space-3">
              {timeboxState && route.targetMinutes < 999 && (
                <div className="flex items-center gap-space-2">
                  <Badge variant={
                    timeboxState.isOvertime ? 'danger' :
                    timeboxState.warningLevel === 'critical' ? 'warning' :
                    'info'
                  }>
                    {timeboxState.remainingMinutes}m left
                  </Badge>
                  <Countdown
                    totalSeconds={timeboxState.remainingMinutes * 60}
                    warningThreshold={300}
                    criticalThreshold={60}
                    format="digital"
                    className="font-mono text-body-lg"
                  />
                </div>
              )}
              
              <div className="flex gap-space-2">
                <Button variant="outline" size="sm" onClick={handlePause}>
                  Pause
                </Button>
                <Button variant="ghost" size="sm" onClick={handleExit}>
                  Exit
                </Button>
              </div>
            </div>
          </div>

          {/* Objectives Bar */}
          <div className="mt-space-3 border-t border-color-border pt-space-3">
            <ObjectiveList
              objectives={objectivesProgress?.objectives.slice(0, 3).map(obj => ({
                id: obj.id,
                title: obj.label,
                ...(obj.description && { description: obj.description }),
                completed: obj.completed,
                required: obj.required,
                ...(obj.progress && { 
                  progress: {
                    current: obj.progress,
                    total: 100
                  }
                })
              })) || []}
              compact={true}
              className="text-body-sm"
            />
            {route.allowedSkips && route.allowedSkips > 0 && (
              <div className="mt-space-2 text-body-xs text-color-text-tertiary">
                Skips available: {route.allowedSkips}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Adventure?"
        className="max-w-md"
      >
        <div className="space-y-space-4">
          <p className="text-body-md text-color-text-secondary">
            Are you sure you want to exit? Your progress will be saved, but you'll need to restart the adventure.
          </p>
          
          <div className="flex gap-space-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowExitModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmExit}
            >
              Exit Adventure
            </Button>
          </div>
        </div>
      </Modal>

      {/* Objectives Detail Modal */}
      <Modal
        isOpen={showObjectivesModal}
        onClose={() => setShowObjectivesModal(false)}
        title="Adventure Objectives"
        className="max-w-2xl"
      >
        <div className="space-y-space-4">
          <div className="flex items-center gap-space-3">
            <Badge variant="info">
              {objectivesProgress?.completedRequired}/{objectivesProgress?.required} Required
            </Badge>
            <Badge variant="secondary">
              {objectivesProgress?.completed}/{objectivesProgress?.total} Total
            </Badge>
            <Badge variant="success">
              {objectivesProgress?.completionRate}% Complete
            </Badge>
          </div>

          <ObjectiveList
            objectives={objectivesProgress?.objectives.map(obj => ({
              id: obj.id,
              title: obj.label,
              ...(obj.description && { description: obj.description }),
              completed: obj.completed,
              required: obj.required,
              ...(obj.progress && { 
                progress: {
                  current: obj.progress,
                  total: 100
                }
              })
            })) || []}
            onObjectiveClick={(objective) => {
              if (!objective.completed && !objective.required) {
                handleSkip(objective.id);
              }
            }}
            className="max-h-96 overflow-y-auto"
          />
          
          {route.allowedSkips && route.allowedSkips > 0 && (
            <div className="mt-space-3 text-body-sm text-color-text-secondary">
              <strong>Skip Options:</strong> Click on optional objectives to skip them.
              Skips remaining: {route.allowedSkips}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setShowObjectivesModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
