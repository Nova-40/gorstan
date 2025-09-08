import React from 'react';
import { IS_DEMO } from '../config/mode';

interface DemoRibbonProps {
  className?: string;
}

export default function DemoRibbon({ className = '' }: DemoRibbonProps) {
  if (!IS_DEMO) {return null;}

  const ribbonStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    background: 'linear-gradient(90deg, #ffe08a, #ffd166)',
    color: '#000',
    padding: '6px 10px',
    fontWeight: 700,
    fontSize: '14px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #f0a500'
  };

  return (
    <div style={ribbonStyle} className={className}>
      ✨ Gorstan — Demo ✨
      <span style={{ marginLeft: '10px', fontSize: '12px', fontWeight: 400, opacity: 0.8 }}>
        Experience a curated 15-minute journey
      </span>
    </div>
  );
}
