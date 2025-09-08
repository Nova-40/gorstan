/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Accessible radial countdown component for idle autostart
*/

import React, { useEffect, useRef, useState } from "react";

interface Props { 
  totalMs: number; 
  className?: string;
}

export default function RadialCountdown({ totalMs, className = "" }: Props) {
  const [msLeft, setMsLeft] = useState(totalMs);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    function onReset(e: CustomEvent) { 
      setMsLeft(e.detail.total); 
      startRef.current = null; 
    }
    
    window.addEventListener("idle-countdown-reset", onReset as EventListener);
    return () => window.removeEventListener("idle-countdown-reset", onReset as EventListener);
  }, []);

  useEffect(() => {
    const tick = (t: number) => {
      if (!startRef.current) {startRef.current = t;}
      const elapsed = t - startRef.current;
      const left = Math.max(0, totalMs - elapsed);
      setMsLeft(left);
      
      if (left > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    
    rafRef.current = requestAnimationFrame(tick);
    return () => { 
      if (rafRef.current) {cancelAnimationFrame(rafRef.current);} 
    };
  }, [totalMs]);

  const progress = 1 - msLeft / totalMs; // 0..1
  const circumference = 283; // circumference for r=45 (approx)
  const dashOffset = Math.max(0, circumference - circumference * progress);

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationStyle = prefersReducedMotion ? {} : {
    transition: 'stroke-dashoffset 0.1s ease-out'
  };

  return (
    <div 
      aria-hidden 
      className={`fixed bottom-4 right-4 opacity-70 select-none pointer-events-none ${className}`} 
      style={{width: 96, height: 96}}
    >
      <svg 
        viewBox="0 0 100 100" 
        role="img" 
        aria-label={`Idle countdown: ${Math.ceil(msLeft / 1000)} seconds remaining`}
        className="w-full h-full"
      >
        {/* Background track */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="var(--idle-track)" 
          strokeWidth="6" 
          fill="none"
        />
        
        {/* Progress circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#idleGradient)"
          strokeWidth="6" 
          fill="none" 
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={animationStyle}
          transform="rotate(-90 50 50)" // Start from top
        />
        
        <defs>
          <linearGradient id="idleGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--idle-blue)"/>
            <stop offset="100%" stopColor="var(--console-text)"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
