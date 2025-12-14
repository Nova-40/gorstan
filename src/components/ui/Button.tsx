import React from 'react';

export interface UIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const UIButton: React.FC<UIButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-semibold transition-all';
  const variants: Record<string, string> = {
    primary: 'btn-primary px-4 py-2',
    secondary: 'btn-secondary px-3 py-1',
    ghost: 'btn-ghost px-2 py-1',
    danger: 'btn-danger px-3 py-1',
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default UIButton;

// Primary/Secondary convenience wrappers
export const PrimaryButton: React.FC<UIButtonProps> = ({ children, className, ...props }) => (
  <UIButton variant="primary" className={`px-4 py-2 ${className || ''}`} {...props}>
    {children}
  </UIButton>
);

export const SecondaryButton: React.FC<UIButtonProps> = ({ children, className, ...props }) => (
  <UIButton variant="secondary" className={`px-3 py-1 ${className || ''}`} {...props}>
    {children}
  </UIButton>
);
/**
 * Enhanced Button Component
 * Provides consistent button styling across the application with full accessibility support
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

  const buttonVariants = {
  primary: 'btn-primary shadow-md',
  secondary: 'btn-secondary shadow-sm',
  danger: 'btn-danger shadow-md',
  success: 'bg-green-600 text-white shadow-md',
  warning: 'bg-yellow-500 text-white shadow-md',
  ghost: 'btn-ghost',
  outline: 'border-2 border-[var(--gorstan-cyan)] text-[var(--gorstan-cyan)]',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2 text-base font-medium',
  lg: 'px-6 py-3 text-lg font-semibold',
  xl: 'px-8 py-4 text-xl font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',

          // Variant styles
          buttonVariants[variant],

          // Size styles
          buttonSizes[size],

          // Width
          fullWidth && 'w-full',

          // Loading state
          loading && 'cursor-wait',

          className,
        )}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span>{loading ? loadingText : children}</span>

        {!loading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
