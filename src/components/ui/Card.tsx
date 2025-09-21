/**
 * Card Component
 * Provides consistent card layouts with elevation and spacing
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const cardVariants = {
  default: 'bg-gray-800 shadow-md border border-neutral-200',
  elevated: 'bg-gray-800 shadow-lg border border-gray-700',
  outlined: 'bg-gray-800 border-2 border-neutral-300',
  ghost: 'bg-gray-800/60 ring-0',
  flat: 'bg-neutral-50',
};

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const cardSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', size = 'md', className, children, onClick, onKeyDown, ...props }, ref) => {
    // If the card is interactive (has onClick), make it keyboard-activatable and announce as a group for accessibility
    const isInteractive = typeof onClick === 'function';

    const handleKeyDown = (e: any) => {
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        (onClick as any)(e);
      }
      if (typeof onKeyDown === 'function') onKeyDown(e);
    };

    return (
      <div
        ref={ref}
        role={isInteractive ? 'group' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        onClick={onClick}
        className={cn(
          'rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors',
          cardVariants[variant],
          cardPadding[padding],
          cardSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mt-4 pt-4 border-t border-neutral-200', className)} {...props}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';
