/* Shared radial progress ring with dynamic color progression */
import React, { useId } from 'react';

export interface RadialProgressRingProps {
  /** Progress 0..1 */
  progress: number;
  /** Pixel width/height (square) */
  size?: number;
  /** Stroke width in px */
  strokeWidth?: number;
  /** Color mode */
  mode?: 'spectrum' | 'solid' | 'gradient';
  /** Solid color (when mode === 'solid') */
  color?: string;
  /** Gradient colors (when mode === 'gradient') */
  gradientColors?: string[]; // at least 2
  /** Optional aria label override */
  label?: string;
  /** Optional className */
  className?: string;
  /** Optional enable center pulse */
  pulse?: boolean;
  /** Optional title tooltip */
  title?: string;
}

function spectrumColor(p: number): string {
  // Clamp
  const pct = Math.min(1, Math.max(0, p)) * 100;
  if (pct < 50) {
    const t = pct / 50; // green -> yellow
    const r = Math.round(34 + (234 - 34) * t);
    const g = Math.round(197 + (179 - 197) * t);
    const b = Math.round(94 + (8 - 94) * t);
    return `rgb(${r},${g},${b})`;
  } else if (pct < 75) {
    const t = (pct - 50) / 25; // yellow -> orange
    const r = Math.round(234 + (249 - 234) * t);
    const g = Math.round(179 + (115 - 179) * t);
    const b = Math.round(8 + (22 - 8) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = (pct - 75) / 25; // orange -> red
    const r = Math.round(249 + (220 - 249) * t);
    const g = Math.round(115 + (38 - 115) * t);
    const b = Math.round(22 + (38 - 22) * t);
    return `rgb(${r},${g},${b})`;
  }
}

export const RadialProgressRing: React.FC<RadialProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 4,
  mode = 'spectrum',
  color = 'rgb(34,197,94)',
  gradientColors = ['#22c55e', '#f59e0b', '#ef4444'],
  label,
  className = '',
  pulse = true,
  title
}) => {
  const radius = (size / 2) - strokeWidth - 2; // small padding
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(1, Math.max(0, progress)) * circumference);
  const strokeColor = mode === 'spectrum' ? spectrumColor(progress) : color;
  const gradientId = useId();
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const strokeProps = mode === 'gradient'
    ? { stroke: `url(#grad-${gradientId})` }
    : { stroke: strokeColor };

  return (
    <div className={`relative`} style={{ width: size, height: size }} aria-label={label || `Progress ${(progress * 100).toFixed(0)}%`} title={title}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>        
        <defs>
          {mode === 'gradient' && (
            <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {gradientColors.map((c, i) => (
                <stop key={i} offset={`${(i / (gradientColors.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </linearGradient>
          )}
        </defs>
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          {...strokeProps}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 6px ${strokeColor}90)`,
            transition: prefersReduced ? 'none' : 'stroke 250ms linear, stroke-dashoffset 120ms linear'
          }}
        />
      </svg>
  {pulse && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          <div
            className="rounded-full animate-pulse"
            style={{ width: size * 0.1, height: size * 0.1, background: strokeColor, boxShadow: `0 0 6px ${strokeColor}, 0 0 12px ${strokeColor}55` }}
          />
        </div>
      )}
      <div className={className} />
    </div>
  );
};

export default RadialProgressRing;
