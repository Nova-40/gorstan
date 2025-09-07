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

/*
  AttractMode – lightweight rotating teaser scenes.
  Displays cycling text until user interacts.
*/
import React, { useEffect, useState } from 'react';

const SCENES: string[] = [
  'Arcade combat against shifting, formless slithering shadows',
  'Teleportation across the lattice',
  'Glitchrealm anomalies emerging',
  'Artifact resonance building',
  'Narrative choice ripples forming'
];

const FEATURES = [
  { title: 'Exploration', blurb: '100+ handcrafted narrative rooms' },
  { title: 'Adaptive Lore', blurb: 'World reacts to your curiosity' },
  { title: 'Arcade Pulses', blurb: 'Short skill bursts – instant feedback' },
  { title: 'Glitch Events', blurb: 'Reality fractures become opportunities' },
  { title: 'Ayla Guidance', blurb: 'Supportive AI companion voice' }
];

interface AttractModeProps { onExit: () => void }

export const AttractMode: React.FC<AttractModeProps> = ({ onExit }) => {
  const [scene, setScene] = useState(0);
  const [feature, setFeature] = useState(0);

  useEffect(() => {
    const exit = () => onExit();
    window.addEventListener('keydown', exit);
    window.addEventListener('mousedown', exit);
    window.addEventListener('touchstart', exit);
    return () => {
      window.removeEventListener('keydown', exit);
      window.removeEventListener('mousedown', exit);
      window.removeEventListener('touchstart', exit);
    };
  }, [onExit]);

  useEffect(() => {
    const id = setInterval(() => setScene(s => (s + 1) % SCENES.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setFeature(f => (f + 1) % FEATURES.length), 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden select-none font-mono text-emerald-200">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        <div className="transition-opacity duration-700 text-lg md:text-2xl font-semibold tracking-wide max-w-2xl">
          {SCENES[scene]}
        </div>
      </div>
      {/* Rotating feature badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        {(() => { const f = FEATURES[feature] ? FEATURES[feature]! : FEATURES[0]!; return (
        <div className="px-4 py-2 rounded-full bg-emerald-900/40 border border-emerald-500/30 backdrop-blur-sm shadow shadow-emerald-500/20 text-xs md:text-sm tracking-wide whitespace-nowrap transition-all duration-500">
          {f.title}: <span className="opacity-80">{f.blurb}</span>
        </div> ); })()}
      </div>
      {/* Subscribe CTA */}
      <div className="absolute bottom-20 w-full flex justify-center">
        <button
          onClick={() => { try { dispatchEvent(new CustomEvent('open-patreon-dialog')); } catch {} }}
          className="px-5 py-2 rounded-lg bg-fuchsia-700/40 hover:bg-fuchsia-600/50 active:bg-fuchsia-800/50 border border-fuchsia-400/40 text-fuchsia-200 text-sm font-semibold tracking-wide shadow shadow-fuchsia-500/25 backdrop-blur-md"
        >
          Subscribe & Unlock More
        </button>
      </div>
      <div className="absolute bottom-6 w-full text-center text-[11px] md:text-sm opacity-80 tracking-wide">
        Press any key to enter the lattice
      </div>
    </div>
  );
};

export default AttractMode;
