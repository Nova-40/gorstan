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

// GameLoop.ts - Fixed timestep game loop scaffold
export interface GameLoopControls { pause: () => void; resume: () => void; stop: () => void; isRunning: () => boolean; }

export type UpdateFn = (dtMs: number, frame: number) => void;
export type RenderFn = (interp: number) => void;

export function startGameLoop(update: UpdateFn, render: RenderFn, opts: { fps?: number } = {}): GameLoopControls {
  const targetFps = opts.fps ?? 60;
  const dt = 1000 / targetFps; // fixed timestep in ms
  let acc = 0;
  let last = performance.now();
  let frame = 0;
  let running = true;
  let paused = false;
  let rafId: number;

  function loop(now: number) {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (paused) { last = now; return; }
    acc += now - last;
    last = now;
    // clamp to avoid spiral of death
    if (acc > 1000) acc = 1000;
    while (acc >= dt) {
      update(dt, frame++);
      acc -= dt;
    }
    const interp = acc / dt;
    render(interp);
  }
  rafId = requestAnimationFrame(loop);

  return {
    pause: () => { paused = true; },
    resume: () => { if (paused) { paused = false; last = performance.now(); } },
    stop: () => { running = false; cancelAnimationFrame(rafId); },
    isRunning: () => running && !paused,
  };
}
