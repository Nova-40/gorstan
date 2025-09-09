/**
 * Route Badge Component
 * Displays route information with difficulty and duration indicators
 */

import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Badge } from './Badge';

export interface RouteBadgeProps {
  routeType: 'demo' | 'short10' | 'short30' | 'full';
  difficulty?: 'story' | 'normal' | 'veteran';
  duration?: number; // in minutes
  className?: string;
  children?: ReactNode;
}

const routeTypeVariants = {
  demo: { label: 'Demo', variant: 'info' as const, icon: '🎮' },
  short10: { label: '10-Min', variant: 'primary' as const, icon: '⚡' },
  short30: { label: '30-Min', variant: 'secondary' as const, icon: '🎯' },
  full: { label: 'Full Game', variant: 'success' as const, icon: '🏰' },
};

const difficultyVariants = {
  story: { label: 'Story', color: 'text-success-600', icon: '📖' },
  normal: { label: 'Normal', color: 'text-warning-600', icon: '⚔️' },
  veteran: { label: 'Veteran', color: 'text-danger-600', icon: '💀' },
};

export function RouteBadge({
  routeType,
  difficulty,
  duration,
  className,
  children,
}: RouteBadgeProps) {
  const routeConfig = routeTypeVariants[routeType];
  const difficultyConfig = difficulty ? difficultyVariants[difficulty] : null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={routeConfig.variant} size="md">
        <span className="mr-1" aria-hidden="true">
          {routeConfig.icon}
        </span>
        {routeConfig.label}
      </Badge>

      {difficulty && difficultyConfig && (
        <Badge variant="outline" size="sm">
          <span className="mr-1" aria-hidden="true">
            {difficultyConfig.icon}
          </span>
          <span className={difficultyConfig.color}>{difficultyConfig.label}</span>
        </Badge>
      )}

      {duration && (
        <Badge variant="secondary" size="sm">
          <span className="mr-1" aria-hidden="true">
            ⏱️
          </span>
          {duration}m
        </Badge>
      )}

      {children}
    </div>
  );
}
