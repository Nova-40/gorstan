/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// Gorstan and characters (c) Geoff Webster 2025
// Game module.

import React from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const buttonVariants = {
  primary: 'bg-console text-background border-console hover:bg-console/90 focus:ring-console',
  secondary: 'bg-surface text-console border-text hover:bg-surface/90 focus:ring-text',
  outline: 'bg-transparent text-console border-console hover:bg-console/10 focus:ring-console',
  danger: 'bg-error text-background border-error hover:bg-error/90 focus:ring-error',
};

const buttonSizes = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}: ButtonProps) => (
  <button 
    {...props} 
    className={cn(
      // Base styles
      'inline-flex items-center justify-center font-mono font-medium',
      'border rounded-lg transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Variant styles
      buttonVariants[variant],
      // Size styles
      buttonSizes[size],
      // Custom className
      className
    )}
  >
    {children}
  </button>
);
