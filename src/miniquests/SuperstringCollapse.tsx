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
  SuperstringCollapse Mini-Quest
  Self‑contained arcade style mini‑quest.
*/
import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface MiniQuestProps {
  onComplete: (success: boolean, reward?: string) => void;
  debugMode?: boolean;
}

type Frequency = 'Low' | 'Mid' | 'High';
interface Enemy {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  freq: Frequency;
  alive: boolean;
}

interface Boss {
  hp: number; // 3 phases (Low,Mid,High)
  phase: number; // 0..2
  cooldown: number;
  alive: boolean;
}

const FREQS: Frequency[] = ['Low','Mid','High'];
const FREQ_COLOR: Record<Frequency,string> = { Low: '#e63946', Mid: '#f1c40f', High: '#3498db' };

const CANVAS_W = 420;
const CANVAS_H = 260;

const SuperstringCollapse: React.FC<MiniQuestProps> = ({ onComplete, debugMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [running, setRunning] = useState(true);
  const [entropy, setEntropy] = useState(0); // 0..100
  const [wave, setWave] = useState(1);
  const [combo, setCombo] = useState(0);
  const [frequency, setFrequency] = useState<Frequency>('Low');
  const enemiesRef = useRef<Enemy[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const keys = useRef<Record<string,boolean>>({});
  const player = useRef({ x: CANVAS_W/2, y: CANVAS_H/2, speed: 2.2 });
  const distortTimer = useRef(0);
  const messageRef = useRef<string|undefined>('You find yourself drawn into a vibrating lattice of light...');

  const endGame = useCallback((success: boolean) => {
    if (!running) return;
    setRunning(false);
    cancelAnimationFrame(frameRef.current!);
    if (success) {
      messageRef.current = 'Two universes part. Your string stabilises... for now.';
      onComplete(true, 'fragment:TheoryOfEverything');
    } else {
      messageRef.current = 'Your string unravels into entropy.';
      onComplete(false);
    }
  }, [onComplete, running]);

  const spawnWave = useCallback(() => {
    const count = 4 + wave * 2;
    const newEnemies: Enemy[] = [];
    for (let i=0;i<count;i++) {
      const edge = Math.random();
      let x = 0, y = 0;
      if (edge < 0.25) { x = Math.random()*CANVAS_W; y = -10; }
      else if (edge < 0.5) { x = CANVAS_W+10; y = Math.random()*CANVAS_H; }
      else if (edge < 0.75) { x = Math.random()*CANVAS_W; y = CANVAS_H+10; }
      else { x = -10; y = Math.random()*CANVAS_H; }
      const angle = Math.atan2(player.current.y - y, player.current.x - x);
      const speed = 0.6 + Math.random()*0.4 + wave*0.05;
  const freq = FREQS[i % FREQS.length] as Frequency; // length guarded
  newEnemies.push({ id: Date.now()+i, x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, freq, alive: true });
    }
    enemiesRef.current.push(...newEnemies);
  }, [wave]);

  const spawnBoss = useCallback(() => {
    bossRef.current = { hp: 3, phase: 0, cooldown: 180, alive: true };
  }, []);

  // Autoplay debug AI
  useEffect(() => {
    if (!debugMode) return;
    const id = setInterval(() => {
  setFrequency(prev => FREQS[(FREQS.indexOf(prev)+1)%FREQS.length] as Frequency);
    }, 900);
    return () => clearInterval(id);
  }, [debugMode]);

  // Key handlers
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') {
  setFrequency(prev => FREQS[(FREQS.indexOf(prev)+2)%FREQS.length] as Frequency); // reverse
      } else if (e.key === 'x' || e.key === 'X') {
  setFrequency(prev => FREQS[(FREQS.indexOf(prev)+1)%FREQS.length] as Frequency);
      } else {
        keys.current[e.key] = true;
      }
    };
    const up = (e: KeyboardEvent) => { delete keys.current[e.key]; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const updatePlayer = () => {
    const p = player.current;
    if (keys.current['ArrowLeft']) p.x -= p.speed;
    if (keys.current['ArrowRight']) p.x += p.speed;
    if (keys.current['ArrowUp']) p.y -= p.speed;
    if (keys.current['ArrowDown']) p.y += p.speed;
    // Clamp
    p.x = Math.max(10, Math.min(CANVAS_W-10, p.x));
    p.y = Math.max(10, Math.min(CANVAS_H-10, p.y));
  };

  const handleCollisions = () => {
    const p = player.current;
    for (const enemy of enemiesRef.current) {
      if (!enemy.alive) continue;
      const dx = enemy.x - p.x; const dy = enemy.y - p.y;
      if (dx*dx + dy*dy < 18*18) {
        if (enemy.freq === frequency) {
          enemy.alive = false;
          setCombo(c => {
            const nc = c+1; if (nc>1) messageRef.current = `Harmonic chain x${nc}!`; return nc; });
        } else {
          setEntropy(e => Math.min(100, e + 18));
          setCombo(0);
          if (entropy + 18 >= 100) endGame(false);
        }
      }
    }
    enemiesRef.current = enemiesRef.current.filter(e => e.alive);
  };

  const updateBoss = () => {
    const boss = bossRef.current; if (!boss || !boss.alive) return;
    boss.cooldown--;
    if (boss.cooldown <= 0) {
      boss.cooldown = 180; // new phase attack
      boss.phase = (boss.phase + 1) % 3;
    }
    // Shockwaves -> simple entropy pulses
    if (boss.cooldown % 45 === 0) {
      setEntropy(e => {
        const next = Math.min(100, e + 5); if (next >= 100) endGame(false); return next; });
    }
    // Player match to damage
    if (frequency === FREQS[boss.phase]) {
      boss.hp--;
      boss.phase = (boss.phase + 1) % 3;
      messageRef.current = 'Frequency lock achieved!';
  if (boss.hp <= 0) { boss.alive = false; endGame(true); }
    }
  };

  const applyDistortions = () => {
    distortTimer.current++;
    if (distortTimer.current % 360 === 0) {
      // wrap effect: teleport enemies randomly
      enemiesRef.current.forEach(e => { e.x = (e.x + Math.random()*80 - 40 + CANVAS_W) % CANVAS_W; e.y = (e.y + Math.random()*80 - 40 + CANVAS_H) % CANVAS_H; });
    }
  };

  const step = () => {
    updatePlayer();
    handleCollisions();
    applyDistortions();

    // Waves
    if (!bossRef.current && enemiesRef.current.length === 0) {
      if (wave < 5) {
        setWave(w => w+1);
        spawnWave();
      } else if (wave === 5) {
        setWave(6);
        spawnBoss();
        messageRef.current = 'A giant brane approaches...';
      }
    }

    updateBoss();
    render();
    if (running) frameRef.current = requestAnimationFrame(step);
  };

  const render = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0,0,CANVAS_W,CANVAS_H);

    // Background grid slight pulse
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let x=0;x<CANVAS_W;x+=20){ ctx.fillStyle = '#222'; ctx.fillRect(x,0,2,CANVAS_H);}    
    for (let y=0;y<CANVAS_H;y+=20){ ctx.fillStyle = '#222'; ctx.fillRect(0,y,CANVAS_W,2);}    
    ctx.restore();

    // Player (glowing line/arc)
    ctx.save();
    ctx.strokeStyle = FREQ_COLOR[frequency];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(player.current.x, player.current.y, 14, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();

    // Enemies
    for (const e of enemiesRef.current) {
      ctx.save();
      ctx.fillStyle = FREQ_COLOR[e.freq];
      ctx.beginPath();
      ctx.arc(e.x, e.y, 10 + Math.sin(Date.now()/200 + e.id)*2, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      e.x += e.vx; e.y += e.vy;
    }

    // Boss
    const boss = bossRef.current;
    if (boss && boss.alive) {
      ctx.save();
      ctx.strokeStyle = '#9b59b6';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(CANVAS_W/2, 60, 40, 0, Math.PI*2);
      ctx.stroke();
  ctx.fillStyle = FREQ_COLOR[FREQS[boss.phase] as Frequency];
      ctx.beginPath();
      ctx.arc(CANVAS_W/2, 60, 20 + Math.sin(Date.now()/300)*4, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    // UI overlay
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Wave: ${wave}`, 10, 14);
    ctx.fillText(`Entropy: ${entropy}%`, 90, 14);
    ctx.fillText(`Combo: ${combo}`, 210, 14);
    ctx.fillText(`Freq: ${frequency}`, 300, 14);
    if (messageRef.current) ctx.fillText(messageRef.current, 10, CANVAS_H - 10);

    // Entropy bar
    ctx.fillStyle = '#444';
    ctx.fillRect(10, 18, 150, 6);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(10, 18, 150 * (entropy/100), 6);
  };

  useEffect(() => {
    spawnWave();
    frameRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frameRef.current!);
      // cleanup
      enemiesRef.current = [];
      bossRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-2 text-sm text-white flex flex-col gap-2">
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="bg-black rounded shadow" />
      <div className="flex gap-4">
        <span>Arrow keys move • Z/X change frequency • Match enemy frequency to collapse</span>
        <button onClick={() => endGame(false)} className="ml-auto px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">Exit</button>
      </div>
    </div>
  );
};

export default SuperstringCollapse;
