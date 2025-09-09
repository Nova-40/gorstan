/**
 * Objective List Component
 * Displays current objectives with progress tracking and accessibility
 */

import { cn } from '../../utils/cn';
import { Badge } from './Badge';

export interface Objective {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

export interface ObjectiveListProps {
  objectives: Objective[];
  title?: string;
  compact?: boolean;
  className?: string;
  onObjectiveClick?: (objective: Objective) => void;
}

export function ObjectiveList({
  objectives,
  title = 'Objectives',
  compact = false,
  className,
  onObjectiveClick,
}: ObjectiveListProps) {
  const completedCount = objectives.filter((obj) => obj.completed).length;
  const totalCount = objectives.length;

  return (
    <div className={cn('bg-gray-800 rounded-lg shadow-sm border border-neutral-200', className)}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <Badge variant="secondary" size="sm">
            {completedCount}/{totalCount}
          </Badge>
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mt-2">
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
                aria-label={`${completedCount} of ${totalCount} objectives completed`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Objectives list */}
      <div
        className={cn('divide-y divide-neutral-100', compact ? 'p-2' : 'p-4')}
        role="list"
        aria-live="polite"
      >
        {objectives.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p>No objectives available</p>
          </div>
        ) : (
          objectives.map((objective) => (
            <ObjectiveItem
              key={objective.id}
              objective={objective}
              compact={compact}
              onClick={onObjectiveClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ObjectiveItemProps {
  objective: Objective;
  compact: boolean;
  onClick?: (objective: Objective) => void;
}

function ObjectiveItem({ objective, compact, onClick }: ObjectiveItemProps) {
  const isInteractive = !!onClick;

  const handleClick = () => {
    if (onClick) {
      onClick(objective);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 py-3',
        isInteractive && 'cursor-pointer hover:bg-neutral-50 rounded-md px-2 -mx-2',
        isInteractive &&
          'focus:outline-none focus:bg-neutral-50 focus:ring-2 focus:ring-primary-500',
        compact && 'py-2',
      )}
      role={isInteractive ? 'button' : 'listitem'}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyPress={isInteractive ? handleKeyPress : undefined}
      aria-describedby={objective.description ? `${objective.id}-description` : undefined}
    >
      {/* Completion indicator */}
      <div className="flex-shrink-0 mt-0.5">
        {objective.completed ? (
          <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm font-medium',
              objective.completed ? 'text-neutral-500 line-through' : 'text-neutral-900',
              compact && 'text-xs',
            )}
          >
            {objective.title}
          </h4>

          <div className="flex items-center gap-1">
            {!objective.required && (
              <Badge variant="secondary" size="sm">
                Optional
              </Badge>
            )}

            {objective.progress && (
              <Badge variant="outline" size="sm">
                {objective.progress.current}/{objective.progress.total}
              </Badge>
            )}
          </div>
        </div>

        {objective.description && !compact && (
          <p
            id={`${objective.id}-description`}
            className={cn(
              'mt-1 text-sm',
              objective.completed ? 'text-neutral-400' : 'text-neutral-600',
            )}
          >
            {objective.description}
          </p>
        )}

        {/* Progress bar for individual objective */}
        {objective.progress && !objective.completed && (
          <div className="mt-2">
            <div className="w-full bg-neutral-100 rounded-full h-1.5">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(objective.progress.current / objective.progress.total) * 100}%`,
                }}
                aria-label={`${objective.progress.current} of ${objective.progress.total} completed`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
