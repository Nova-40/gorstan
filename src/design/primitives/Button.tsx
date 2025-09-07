/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

import React from 'react';
import { useTheme } from '../ThemeProvider';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: 'var(--font-size-sm)', padding: 'var(--space-1) var(--space-2)' },
  md: { fontSize: 'var(--font-size-base)', padding: 'var(--space-2) var(--space-3)' },
  lg: { fontSize: 'var(--font-size-lg)', padding: 'var(--space-3) var(--space-4)' }
};

function variantStyle(variant: ButtonVariant, _biome: string): React.CSSProperties {
  const accent = `var(--color-text-primary)`; // using bright green for now; future biome accent mapping
  switch (variant) {
    case 'solid':
      return { background: accent, color: 'var(--color-text-inverse)', border: '1px solid ' + accent };
    case 'outline':
      return { background: 'transparent', color: accent, border: '1px solid ' + accent };
    case 'ghost':
      return { background: 'transparent', color: accent, border: '1px solid transparent' };
    case 'danger':
      return { background: 'var(--color-danger-500)', color: '#fff', border: '1px solid var(--color-danger-500)' };
  }
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  fullWidth,
  iconLeft,
  iconRight,
  loading,
  style,
  disabled,
  ...rest
}) => {
  const { biome, reducedMotion } = useTheme();
  const vs = variantStyle(variant, biome);
  return (
    <button
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        fontFamily: 'var(--font-family-sans)',
        fontWeight: 600,
        lineHeight: 'var(--line-height-tight)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: reducedMotion ? undefined : 'background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast)',
        boxShadow: 'var(--elevation-sm)',
        userSelect: 'none',
        width: fullWidth ? '100%' : undefined,
        position: 'relative',
        ...(sizeStyles[size]),
        ...vs,
        ...(disabled ? { opacity: 0.55, cursor: 'not-allowed' } : {}),
        ...style
      }}
      onMouseDown={e => {
        if (!reducedMotion && !disabled) (e.currentTarget.style.transform = 'translateY(1px) scale(0.985)');
      }}
      onMouseUp={e => {
        if (!reducedMotion && !disabled) (e.currentTarget.style.transform = 'translateY(0) scale(1)');
      }}
      onMouseLeave={e => {
        if (!reducedMotion && !disabled) (e.currentTarget.style.transform = 'translateY(0) scale(1)');
      }}
      {...rest}
    >
      {loading && (
        <span style={{
          width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block',
          animation: reducedMotion ? undefined : 'gds-spin 0.9s linear infinite'
        }} />
      )}
      {iconLeft && <span style={{ display: 'inline-flex' }}>{iconLeft}</span>}
      <span style={{ flex: '0 1 auto' }}>{children}</span>
      {iconRight && <span style={{ display: 'inline-flex' }}>{iconRight}</span>}
    </button>
  );
};

// Simple keyframes injection (only once)
const ensureKeyframes = (() => {
  let done = false;
  return () => {
    if (done) return; done = true;
    const style = document.createElement('style');
    style.innerHTML = `@keyframes gds-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`;
    document.head.appendChild(style);
  };
})();
ensureKeyframes();
