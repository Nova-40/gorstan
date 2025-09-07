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

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeProvider';

export interface ProgressRingProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'stroke'> {
  size?: number;
  thickness?: number;
  value: number; // 0-1
  trackColor?: string;
  color?: string;
  glow?: boolean;
  label?: string | number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ size=40, thickness=4, value, trackColor='rgba(255,255,255,0.08)', color='var(--color-text-primary)', glow, label, ...rest }) => {
  const stroke = thickness;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, value)) * c;
  const { reducedMotion } = useTheme();
  const fgRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (reducedMotion || !fgRef.current) return;
    fgRef.current.style.transition = 'stroke-dasharray var(--duration-normal) var(--ease-out)';
  }, [reducedMotion]);
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} {...rest}>
        <circle cx={size/2} cy={size/2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle ref={fgRef} cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${c-dash}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} filter={glow ? 'drop-shadow(0 0 4px rgba(57,255,20,0.7))' : undefined} />
      </svg>
      {label !== undefined && (
        <span style={{ position: 'absolute', fontFamily: 'var(--font-family-mono)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>{label}</span>
      )}
    </div>
  );
};
