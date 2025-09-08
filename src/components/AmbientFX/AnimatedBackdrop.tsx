import React, { useEffect, useRef, useState } from 'react';

export type FXType = 'particles' | 'blink-led' | 'crt-scroller' | 'floating-orb' | 'static-overlay';

export interface FXBase {
  type: FXType;
  id: string;
  opacity?: number;
  zIndex?: number;
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  size?: {
    width?: string;
    height?: string;
  };
}

interface ParticlesFX extends FXBase {
  type: 'particles';
  count?: number;
  color?: string;
  speed?: number;
  particleSize?: number;
}

interface BlinkLedFX extends FXBase {
  type: 'blink-led';
  color?: string;
  interval?: number;
}

interface CRTScrollerFX extends FXBase {
  type: 'crt-scroller';
  text?: string;
  color?: string;
  speed?: number;
}

interface FloatingOrbFX extends FXBase {
  type: 'floating-orb';
  color?: string;
  orbSize?: number;
  speed?: number;
}

interface StaticOverlayFX extends FXBase {
  type: 'static-overlay';
  opacity?: number;
  pattern?: string;
}

export type FXLayer = ParticlesFX | BlinkLedFX | CRTScrollerFX | FloatingOrbFX | StaticOverlayFX;

export interface RoomFXSpec {
  baseImage: string;
  layers: FXLayer[];
}

interface AnimatedBackdropProps {
  spec: RoomFXSpec;
  className?: string;
}

// Particles component
const Particles: React.FC<ParticlesFX> = ({ count = 20, color = '#00ffff', speed = 1, particleSize = 2, opacity = 0.6 }) => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number; id: number }>>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {return;}

    const initialParticles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      id: i
    }));
    setParticles(initialParticles);

    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 100) % 100,
        y: (particle.y + particle.vy + 100) % 100
      })));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particleSize}px`,
            height: `${particleSize}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${particleSize * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  );
};

// Blinking LED component
const BlinkLed: React.FC<BlinkLedFX> = ({ color = '#ff0000', interval = 1000, opacity = 0.8, position, size }) => {
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsOn(true);
      return;
    }

    const timer = setInterval(() => {
      setIsOn(prev => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div
      className="absolute rounded-full"
      style={{
        ...position,
        width: size?.width || '8px',
        height: size?.height || '8px',
        backgroundColor: isOn ? color : 'transparent',
        boxShadow: isOn ? `0 0 10px ${color}` : 'none',
        opacity,
        transition: 'all 0.1s ease',
      }}
    />
  );
};

// CRT Scroller component
const CRTScroller: React.FC<CRTScrollerFX> = ({ text, color = '#00ff00', speed = 50, opacity = 0.3, size }) => {
  const [scrollText, setScrollText] = useState('');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setScrollText(text || 'SYSTEM_READY');
      return;
    }

    const charset = "░▒▓*#/|\\\\<>_=-+{}[]()01";
    const lines = Array.from({ length: 5 }, () => 
      Array.from({ length: 20 }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
    );

    const currentText = text || 'SYSTEM_READY';
    let index = 0;

    const updateScroll = () => {
      const displayLines = lines.map((line, i) => {
        if (i === 2) { // Middle line shows the actual text
          return currentText.slice(index, index + 20).padEnd(20, ' ');
        }
        return line;
      });

      setScrollText(displayLines.join("\\n"));
      index = (index + 1) % (currentText.length + 20);
    };

    const timer = setInterval(updateScroll, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  const backgroundImage = `data:text/plain;charset=utf-8,${encodeURIComponent(scrollText)}`;

  return (
    <div
      className="absolute font-mono text-xs leading-tight"
      style={{
        width: size?.width || '100%',
        height: size?.height || '100%',
        color,
        opacity,
        backgroundImage: `url("${backgroundImage}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '20px 100px',
        whiteSpace: 'pre',
        overflow: 'hidden',
      }}
    />
  );
};

// Floating Orb component
const FloatingOrb: React.FC<FloatingOrbFX> = ({ color = '#ffffff', orbSize = 20, speed = 1, opacity = 0.4, position }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {return;}

    const animate = () => {
      timeRef.current += 0.02 * speed;
      setOffset({
        x: Math.sin(timeRef.current) * 10,
        y: Math.cos(timeRef.current * 0.7) * 15,
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  return (
    <div
      className="absolute rounded-full"
      style={{
        ...position,
        width: `${orbSize}px`,
        height: `${orbSize}px`,
        backgroundColor: color,
        boxShadow: `0 0 ${orbSize}px ${color}`,
        opacity,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

// Static Overlay component
const StaticOverlay: React.FC<StaticOverlayFX> = ({ opacity = 0.1, pattern = 'dots' }) => {
  const patternStyle = {
    dots: {
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
    lines: {
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
    },
    grid: {
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
    },
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        ...patternStyle[pattern as keyof typeof patternStyle],
        opacity,
      }}
    />
  );
};

// Main AnimatedBackdrop component
const AnimatedBackdrop: React.FC<AnimatedBackdropProps> = ({ spec, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ willChange: "transform, opacity" }}>
      {/* Base image */}
      <img
        src={spec.baseImage}
        alt="Room backdrop"
        className="w-full h-full object-cover"
      />
      
      {/* FX Layers */}
      {spec.layers.map((layer) => {
        const LayerComponent = (() => {
          switch (layer.type) {
            case 'particles':
              return <Particles key={layer.id} {...layer} />;
            case 'blink-led':
              return <BlinkLed key={layer.id} {...layer} />;
            case 'crt-scroller':
              return <CRTScroller key={layer.id} {...layer} />;
            case 'floating-orb':
              return <FloatingOrb key={layer.id} {...layer} />;
            case 'static-overlay':
              return <StaticOverlay key={layer.id} {...layer} />;
            default:
              return null;
          }
        })();

        return (
          <div
            key={layer.id}
            className="absolute inset-0"
            style={{
              zIndex: layer.zIndex || 1,
              ...layer.position,
            }}
          >
            {LayerComponent}
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedBackdrop;
