/**
 * Badge Component
 * Provides small status indicators and labels
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const badgeVariants = {
  default: 'bg-neutral-100 text-neutral-800',
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-neutral-100 text-neutral-600',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  danger: 'bg-danger-100 text-danger-800',
  info: 'bg-info-100 text-info-800',
  outline: 'border border-neutral-300 text-neutral-700 bg-transparent',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          badgeVariants[variant],
          badgeSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
