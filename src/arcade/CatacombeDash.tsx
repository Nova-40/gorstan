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

// CatacombeDash.tsx - root component wiring the arcade runner (early scaffold)
import { useEffect, useRef, useState } from 'react';
import '@/instrumentation/gorstanMetrics';
import { startGameLoop } from './engine/GameLoop';
import { useRunnerInput } from './engine/Input';
import { createInitialState, DEFAULT_CONFIG, step, type GameState } from './core/RunnerState';
import type { LevelSlice } from './core/Entities';
import { HUD } from './ui/HUD';
import { ModeSelect } from './ui/ModeSelect';
import { PauseMenu } from './ui/PauseMenu';
import { GameOver } from './ui/GameOver';

export const CatacombeDash: React.FC = () => {
  const [mode, setMode] = useState<GameState['mode'] | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const input = useRunnerInput();
  const loopRef = useRef<ReturnType<typeof startGameLoop> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!mode) return;
    const initial = createInitialState(DEFAULT_CONFIG, Date.now() & 0xffff, mode);
    setState(initial);
    // start loop
    loopRef.current?.stop();
    loopRef.current = startGameLoop((dt) => {
      setState(s => s ? step(s, input, dt) : s);
      (window as any).gorstanMetrics?.noteFrame();
    }, () => render());
    return () => { loopRef.current?.stop(); };
  }, [mode, input.laneDelta, input.jump, input.slide]);

  // resize canvas
  useEffect(() => {
    function resize() { const cvs = canvasRef.current; if (!cvs) return; cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize);
  }, []);

  function render() {
    const s = state; if (!s) return;
    const cvs = canvasRef.current; if (!cvs) return; const ctx = cvs.getContext('2d'); if (!ctx) return;
    const w = cvs.width; const h = cvs.height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#041410'; ctx.fillRect(0,0,w,h);
    const laneW = 100; // visual separation
    // Draw lanes
    ctx.strokeStyle = '#0d3022'; ctx.lineWidth = 2;
    for (let i=0;i<3;i++){ const x = w/2 + (i-1)*laneW; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    const cameraZ = s.runner.z;
    const drawSlices: LevelSlice[] = s.slices.filter(sl => sl.zEnd > cameraZ - 20 && sl.zStart < cameraZ + 200);
    // Perspective helper
    const laneX = (lane: number) => w/2 + (lane-1)*laneW;
    const zToY = (z: number) => h - ((z - cameraZ) * 2.2 + 120);
    // Collectibles
    for (const slice of drawSlices) {
      for (const c of slice.collectibles) {
        const y = zToY(c.z); if (y < -40 || y > h) continue;
        ctx.fillStyle = c.type === 'fragment' ? '#ffd54f' : '#9c6bff';
        ctx.beginPath(); ctx.arc(laneX(c.lane), y, c.type==='fragment'?6:9,0,Math.PI*2); ctx.fill();
      }
    }
    // Hazards
    for (const slice of drawSlices) {
      for (const hz of slice.hazards) {
        const y = zToY(hz.z); if (y < -60 || y > h) continue;
        ctx.save();
        ctx.translate(laneX(hz.lane), y);
        let color = '#ff5252';
        if (hz.kind==='pit') color = '#444'; else if (hz.kind==='wall') color = '#ff9f1c'; else if (hz.kind==='schrodinger') color = (hz.active ?? true)? '#c2185b':'#555';
        ctx.fillStyle = color;
        if (hz.kind==='pit') { ctx.fillRect(-28,-8,56,16); }
        else if (hz.kind==='wall') { ctx.fillRect(-30,-30,60,60); }
        else { ctx.beginPath(); ctx.arc(0,0,22,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      }
    }
    // Shadows
    for (const slice of drawSlices) {
      for (const sh of slice.shadows) {
        const y = zToY(sh.z); if (y < -40 || y > h) continue;
        ctx.fillStyle = sh.mood==='hunt'? '#f72585': sh.mood==='scatter'? '#4895ef':'#b5179e';
        ctx.beginPath(); ctx.arc(laneX(sh.lane), y, 14, 0, Math.PI*2); ctx.fill();
      }
    }
    // Entropy wave
    const waveY = zToY(s.entropyZ);
    ctx.fillStyle = 'rgba(255,0,120,0.15)';
    ctx.fillRect(0, waveY, w, h-waveY);
    ctx.fillStyle = '#ff006e'; ctx.fillRect(0, waveY-2, w, 2);
    // Runner
    const runnerX = laneX(s.runner.lane);
    const runnerY = zToY(s.runner.z) - s.runner.y*8;
    ctx.fillStyle = s.runner.isPhasing ? '#7ef9ff' : '#3af77c';
    ctx.beginPath(); ctx.arc(runnerX, runnerY, 20, 0, Math.PI*2); ctx.fill();
  }

  if (!mode) return <ModeSelect onSelect={setMode} />;
  if (!state) return null;
  // const entropyGap = state.runner.z - state.entropyZ; // removed unused variable to satisfy TS6133
  return <div className="relative w-full h-full" data-beat={state.isGameOver? 'gameover':'arcade'}>
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
    <HUD state={state} />
    <PauseMenu visible={false} onResume={()=>{}} onQuit={()=>setMode(null)} />
  <GameOver visible={state.isGameOver} state={state} onRetry={()=> setMode(mode)} onQuit={()=> setMode(null)} />
  </div>;
};

export default CatacombeDash;
