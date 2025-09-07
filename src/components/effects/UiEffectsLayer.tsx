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

/**
 * UiEffectsLayer – listens to ui:glitch & ui:teleport events and renders transient overlays.
 * Purely presentational; internal state pruned automatically.
 */
import React, { useEffect, useState } from 'react';

interface EffectInstance { id: string; kind: string; expires: number; payload?: any }

const TTL = { glitch: 450, fractal: 650, trek: 650 } as const;

export const UiEffectsLayer: React.FC = () => {
  const [effects, setEffects] = useState<EffectInstance[]>([]);

  useEffect(() => {
    const add = (kind: string, payload: any, ttl: number) => {
      const id = `${kind}-${Math.random().toString(36).slice(2)}`;
      setEffects(prev => [...prev, { id, kind, expires: Date.now() + ttl, payload }]);
      setTimeout(() => setEffects(prev => prev.filter(e => e.id !== id)), ttl + 60);
    };
    const handleGlitch = (e: Event) => { add('glitch', (e as CustomEvent).detail, TTL.glitch); };
    const handleTeleport = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (detail.mode === 'fractal') add('fractal', detail, TTL.fractal);
      else if (detail.mode === 'trek') add('trek', detail, TTL.trek);
    };
    document.addEventListener('ui:glitch', handleGlitch as any);
    document.addEventListener('ui:teleport', handleTeleport as any);
    return () => {
      document.removeEventListener('ui:glitch', handleGlitch as any);
      document.removeEventListener('ui:teleport', handleTeleport as any);
    };
  }, []);

  if (!effects.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[580] select-none">
      {effects.map(e => {
        switch (e.kind) {
          case 'glitch': return <GlitchSpark key={e.id} intensity={e.payload?.intensity ?? 0.6} />;
          case 'fractal': return <FractalTeleport key={e.id} />;
          case 'trek': return <TrekTeleport key={e.id} />;
          default: return null;
        }
      })}
    </div>
  );
};

const GlitchSpark: React.FC<{ intensity: number }> = ({ intensity }) => {
  const size = 40 + Math.round(intensity * 60);
  const top = Math.random() * 70 + 10;
  const left = Math.random() * 70 + 10;
  return (
    <div className="absolute animate-ui-glitch mix-blend-screen" style={{ top: `${top}vh`, left: `${left}vw`, width: size, height: size }}>
      <div className="w-full h-full bg-gradient-to-br from-cyan-400/70 via-fuchsia-400/50 to-transparent rounded-full blur-[2px]" />
    </div>
  );
};

const FractalTeleport: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center animate-ui-teleport-fractal">
    <div className="w-[420px] h-[420px] rounded-full border border-fuchsia-400/40 bg-[radial-gradient(circle_at_30%_30%,rgba(217,70,239,0.25),transparent_70%)] shadow-[0_0_40px_-10px_rgba(217,70,239,0.5)]" />
  </div>
);

const TrekTeleport: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center animate-ui-teleport-trek">
    <div className="w-[360px] h-[360px] border border-cyan-300/40 rounded-[30%] backdrop-blur-sm shadow-[0_0_50px_-8px_rgba(34,211,238,0.6)] bg-gradient-to-br from-cyan-300/10 to-transparent" />
  </div>
);

export default UiEffectsLayer;
