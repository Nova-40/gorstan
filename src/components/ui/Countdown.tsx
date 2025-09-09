/**
 * Countdown Component
 * Displays a countdown timer with warning states and accessibility
 */

import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export interface CountdownProps {
  totalSeconds: number;
  onTick?: (remainingSeconds: number) => void;
  onWarning?: (remainingSeconds: number) => void;
  onComplete?: () => void;
  warningThreshold?: number; // seconds before showing warning
  criticalThreshold?: number; // seconds before showing critical state
  isPaused?: boolean;
  className?: string;
  format?: 'digital' | 'circular';
  showMilliseconds?: boolean;
}

export function Countdown({
  totalSeconds,
  onTick,
  onWarning,
  onComplete,
  warningThreshold = 60,
  criticalThreshold = 10,
  isPaused = false,
  className,
  format = 'digital',
  showMilliseconds: _showMilliseconds = false,
}: CountdownProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
    setHasWarned(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newValue = Math.max(0, prev - 1);

        // Trigger callbacks
        onTick?.(newValue);

        if (newValue <= warningThreshold && !hasWarned) {
          setHasWarned(true);
          onWarning?.(newValue);
        }

        if (newValue === 0) {
          onComplete?.();
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds, onTick, onWarning, onComplete, warningThreshold, hasWarned]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateStyles = () => {
    if (remainingSeconds <= criticalThreshold) {
      return 'text-danger-600 bg-danger-50 border-danger-200 animate-pulse';
    }
    if (remainingSeconds <= warningThreshold) {
      return 'text-warning-600 bg-warning-50 border-warning-200';
    }
    return 'text-neutral-700 bg-neutral-50 border-neutral-200';
  };

  const getAriaLabel = () => {
    const timeString = formatTime(remainingSeconds);
    const state =
      remainingSeconds <= criticalThreshold
        ? 'critical'
        : remainingSeconds <= warningThreshold
          ? 'warning'
          : 'normal';
    return `Time remaining: ${timeString}. Status: ${state}`;
  };

  if (format === 'circular') {
    const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    const circumference = 2 * Math.PI * 45; // radius = 45

    return (
      <div className={cn('relative w-24 h-24', className)}>
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-neutral-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={cn(
              remainingSeconds <= criticalThreshold
                ? 'text-danger-500'
                : remainingSeconds <= warningThreshold
                  ? 'text-warning-500'
                  : 'text-primary-500',
            )}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'text-sm font-bold text-center',
              remainingSeconds <= criticalThreshold
                ? 'text-danger-600'
                : remainingSeconds <= warningThreshold
                  ? 'text-warning-600'
                  : 'text-neutral-700',
            )}
            aria-label={getAriaLabel()}
            role="timer"
            aria-live="polite"
          >
            {formatTime(remainingSeconds)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center px-3 py-2 rounded-md border text-sm font-mono',
        getStateStyles(),
        isPaused && 'opacity-60',
        className,
      )}
      role="timer"
      aria-label={getAriaLabel()}
      aria-live="polite"
    >
      {isPaused && (
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}

      <span className="tabular-nums">{formatTime(remainingSeconds)}</span>

      {remainingSeconds <= criticalThreshold && (
        <span className="ml-2 animate-pulse" aria-hidden="true">
          ⚠️
        </span>
      )}
    </div>
  );
}
