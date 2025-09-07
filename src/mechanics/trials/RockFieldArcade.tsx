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
  RockFieldArcade – Asteroids-like avoidance mini-game for Rock Field trial
  - Player moves horizontally across a field of moving rocks
  - Blue safety squares: rocks bounce off (or shatter if small)
  - Smaller rocks move faster
  /*
    RockFieldArcade – Asteroids-like avoidance mini‑game for the Rock Field trial
    Features implemented:
    - Randomised safety zones (blue squares) each run
    - Rocks wrap screen edges, collide with each other (naive O(n²))
    - Entering a safety zone: large rocks split (max 2 generations) else bounce
    - Smaller fragments move faster
    - Player survives for durationMs to trigger success, any collision triggers fail
  */
  import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
  import { audioManager } from '../../audio/sfx';

  interface Rock {
    id: number;
    x: number; // 0..1
    y: number; // 0..1
    vx: number; // per second (normalized)
    vy: number; // per second (normalized)
    size: number; // render radius (px)
    radius: number; // collision radius (normalized, approx size/height)
    splits?: number; // lineage split depth
    shattered?: boolean; // fading out
    fade?: number; // fade progress 0..1
  }

  interface RockFieldArcadeProps {
    width?: number;
    height?: number;
    rockCount?: number;
    onSuccess?: () => void;
    onFail?: () => void;
    durationMs?: number;
  }

  const MAX_ROCKS = 120;

  function generateSafetyZones(count = 3): Array<[number, number, number, number]> {
    const zones: Array<[number, number, number, number]> = [];
    let attempts = 0;
    while (zones.length < count && attempts < 60) {
      attempts++;
      const w = 0.14 + Math.random() * 0.09; // 14% - 23%
      const h = 0.11 + Math.random() * 0.09; // 11% - 20%
      const x = Math.random() * (1 - w);
      const y = Math.random() * (1 - h);
      const overlaps = zones.some(([ox, oy, ow, oh]) => {
        const ix = Math.max(0, Math.min(x + w, ox + ow) - Math.max(x, ox));
        const iy = Math.max(0, Math.min(y + h, oy + oh) - Math.max(y, oy));
        const inter = ix * iy;
        return inter > (w * h) * 0.5; // heavy overlap
      });
      if (!overlaps) zones.push([x, y, w, h]);
    }
    return zones;
  }

  export const RockFieldArcade: React.FC<RockFieldArcadeProps> = ({
    width = 640,
    height = 400,
    rockCount = 22,
    onSuccess,
    onFail,
    durationMs = 15000
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(true);
    const lastTs = useRef<number | null>(null);

    const playerRef = useRef({ x: 0.08, y: 0.5, r: 0.025 });
    const rocksRef = useRef<Rock[]>([]);
    const nextId = useRef(0);
    const failTriggered = useRef(false);
    const successTriggered = useRef(false);
    const glideStarted = useRef(false);

    const zones = useMemo(() => generateSafetyZones(3), [rockCount]);

    // Create initial rocks
    useEffect(() => {
      const list: Rock[] = [];
      for (let i = 0; i < rockCount; i++) {
        const size = 12 + Math.random() * 24; // 12-36
        const speedBase = 0.055 + (36 - size) / 650; // smaller => faster
        const dir = Math.random() * Math.PI * 2;
        list.push({
          id: nextId.current++,
          x: Math.random(),
          y: Math.random(),
          vx: Math.cos(dir) * speedBase,
          vy: Math.sin(dir) * speedBase,
          size,
          radius: size / height,
          splits: 0
        });
      }
      rocksRef.current = list;
    }, [rockCount, height]);

    // Input
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (!running) return;
        const p = playerRef.current;
        const step = 0.04;
        if (['ArrowUp', 'w', 'W'].includes(e.key)) p.y = Math.max(0, p.y - step);
        if (['ArrowDown', 's', 'S'].includes(e.key)) p.y = Math.min(1, p.y + step);
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) p.x = Math.max(0, p.x - step);
        if (['ArrowRight', 'd', 'D'].includes(e.key)) p.x = Math.min(1, p.x + step);
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [running]);

    const triggerFail = useCallback(() => {
      if (failTriggered.current) return;
      failTriggered.current = true;
      setRunning(false);
      onFail && onFail();
    }, [onFail]);

    const update = useCallback((dt: number) => {
      const rocks = rocksRef.current;
      const player = playerRef.current;

      // Rock-rock collisions (naive)
      for (let i = 0; i < rocks.length; i++) {
        const a = rocks[i];
        if (!a || a.shattered) continue;
        for (let j = i + 1; j < rocks.length; j++) {
          const b = rocks[j];
          if (!b || b.shattered) continue;
          const dx = b.x - a.x; const dy = b.y - a.y;
          const rsum = a.radius + b.radius;
          if (dx * dx + dy * dy < rsum * rsum) {
            const tvx = a.vx; const tvy = a.vy;
            a.vx = b.vx; a.vy = b.vy;
            b.vx = tvx; b.vy = tvy;
            const dist = Math.sqrt(dx * dx + dy * dy) || rsum;
            const overlap = (rsum - dist) * 0.5;
            const nx = dx / dist; const ny = dy / dist;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
          }
        }
      }

      // Move & interactions
      const newRocks: Rock[] = [];
      for (const r of rocks) {
        if (r.shattered) {
          r.fade = (r.fade ?? 0) + dt * 0.8;
          continue;
        }
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        if (r.x < -0.06) r.x = 1.06;
        if (r.x > 1.06) r.x = -0.06;
        if (r.y < -0.06) r.y = 1.06;
        if (r.y > 1.06) r.y = -0.06;

        // Safety zones
        for (const [zx, zy, zw, zh] of zones) {
          if (r.x > zx && r.x < zx + zw && r.y > zy && r.y < zy + zh) {
            const canSplit = r.size > 16 && (r.splits || 0) < 2 && rocks.length + newRocks.length < MAX_ROCKS - 1;
            if (canSplit) {
              const childSize = r.size * (0.55 + Math.random() * 0.12); // 55-67%
              const speedBoost = 1.25 + Math.random() * 0.35;
              for (let c = 0; c < 2; c++) {
                const dir = Math.random() * Math.PI * 2;
                const speedBase = (0.06 + (36 - childSize) / 600) * speedBoost;
                newRocks.push({
                  id: nextId.current++,
                  x: r.x + (Math.random() * 0.04 - 0.02),
                  y: r.y + (Math.random() * 0.04 - 0.02),
                  vx: Math.cos(dir) * speedBase,
                  vy: Math.sin(dir) * speedBase,
                  size: childSize,
                  radius: childSize / height,
                  splits: (r.splits || 0) + 1
                });
              }
              r.shattered = true;
              audioManager.playSFX?.('rockShatter');
            } else {
              // bounce
              r.vx *= -1; r.vy *= -1;
              r.x += r.vx * dt * 1.5;
              r.y += r.vy * dt * 1.5;
              audioManager.playSFX?.('rockBounce');
            }
            break;
          }
        }

        // Player collision
        const dx = r.x - player.x; const dy = r.y - player.y;
        const rad = r.radius + player.r;
        if (!r.shattered && dx * dx + dy * dy < rad * rad) {
          triggerFail();
          break;
        }
      }

      if (newRocks.length) rocks.push(...newRocks);
      // Remove fully faded shards
      rocksRef.current = rocks.filter(r => !r.shattered || (r.fade ?? 0) < 1);
    }, [zones, height, triggerFail]);

    const renderFrame = useCallback((ctx: CanvasRenderingContext2D) => {
      const w = ctx.canvas.width; const h = ctx.canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#02070a';
      ctx.fillRect(0, 0, w, h);

      // Zones
      for (const [x, y, zw, zh] of zones) {
        ctx.fillStyle = 'rgba(56,189,248,0.15)';
        ctx.fillRect(x * w, y * h, zw * w, zh * h);
        ctx.strokeStyle = 'rgba(56,189,248,0.35)';
        ctx.strokeRect(x * w, y * h, zw * w, zh * h);
      }

      // Rocks
      for (const r of rocksRef.current) {
        if (r.shattered) {
          const alpha = 1 - Math.min(1, r.fade ?? 0);
          if (alpha <= 0) continue;
          ctx.fillStyle = `rgba(148,163,184,${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(r.x * w, r.y * h, r.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        const grad = ctx.createRadialGradient(r.x * w, r.y * h, r.size * 0.2, r.x * w, r.y * h, r.size);
        grad.addColorStop(0, '#8b949e');
        grad.addColorStop(1, '#30363d');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(r.x * w, r.y * h, r.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player
      const p = playerRef.current;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r * h, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.stroke();

      // HUD
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`Survive: ${Math.max(0, (durationMs - elapsed) / 1000).toFixed(1)}s`, 10, 16);
      ctx.fillText('WASD / Arrows to move', 10, 32);
    }, [zones, elapsed, durationMs]);

    // Loop
    useEffect(() => {
      if (!running) return;
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      if (!glideStarted.current) { glideStarted.current = true; audioManager.playSFX?.('rockGlide'); }
      let frame: number;
      const loop = (ts: number) => {
        if (!running) return;
        if (lastTs.current == null) lastTs.current = ts;
        const dtMs = ts - lastTs.current; lastTs.current = ts;
        const dt = dtMs / 1000;
        setElapsed(e => e + dtMs);
        update(dt);
        renderFrame(ctx);
        if (!successTriggered.current && elapsed + dtMs >= durationMs) {
          successTriggered.current = true;
          setRunning(false);
          onSuccess && onSuccess();
          return;
        }
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(frame);
    }, [running, update, renderFrame, elapsed, durationMs, onSuccess]);

    // Fallback timer (coarse) to keep elapsed progressing if tab throttled
    useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setElapsed(e => e + 100), 500);
      return () => { clearInterval(id); };
    }, [running]);

    useEffect(() => () => { glideStarted.current = false; }, []);

    return <canvas ref={canvasRef} width={width} height={height} className="w-full max-w-[800px] border border-cyan-600 rounded bg-black shadow-lg" />;
  };

  export default RockFieldArcade;
