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

// Provides lightweight directional + action commands using the Gamepad API
// Non-blocking, safe to include broadly.

import { useEffect, useRef } from 'react';

export interface GamepadControlsOptions {
  enabled: boolean;               // Whether polling is active
  issueCommand: (command: string) => void; // e.g., 'go north', 'look'
  onMeta?: (action: 'pause') => void;      // Meta actions (pause via Start)
  log?: (message: string) => void;         // Optional logger (adds system message)
}

const AXIS_THRESHOLD = 0.55;      // Deadzone threshold for sticks
const MOVE_COOLDOWN_MS = 260;     // Minimum ms between movement commands
const BTN_COOLDOWN_MS = 380;      // Generic button debounce

export function useGamepadControls({ enabled, issueCommand, onMeta, log }: GamepadControlsOptions) {
  const rafRef = useRef<number | null>(null);
  const lastAxisDir = useRef<string | null>(null);
  const lastMoveTs = useRef<number>(0);
  const lastBtnTs = useRef<Record<number, number>>({});
  const announced = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const loop = () => {
      const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
      if (pads.length && !announced.current) {
        log?.('[Controller] Connected. Use D-Pad / Left Stick to move. A: Look, B: Inventory, X: Look, Y: Help, Start: Pause');
        announced.current = true;
      } else if (!pads.length) {
        announced.current = false;
      }
      const gp = pads[0] as Gamepad | undefined;
      if (gp) {
        handleAxes(gp);
        handleButtons(gp);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const handleAxes = (gp: Gamepad) => {
      // Prefer D-Pad buttons (12-15), fallback to left stick axes (0,1)
      let x = 0, y = 0;
      if (gp.buttons[12]?.pressed) y = -1; else if (gp.buttons[13]?.pressed) y = 1;
      if (gp.buttons[14]?.pressed) x = -1; else if (gp.buttons[15]?.pressed) x = 1;
      if (!x && !y && gp.axes.length >= 2) {
        const ax: number = gp.axes[0] ?? 0;
        const ay: number = gp.axes[1] ?? 0;
        if (Math.abs(ax) > AXIS_THRESHOLD) x = Math.sign(ax);
        if (Math.abs(ay) > AXIS_THRESHOLD) y = Math.sign(ay);
      }
      // Resolve primary direction (no diagonals)
      if (x && y) {
        if (Math.abs(y) >= Math.abs(x)) x = 0; else y = 0;
      }
      let dir: string | null = null;
      if (y === -1) dir = 'north';
      else if (y === 1) dir = 'south';
      else if (x === -1) dir = 'west';
      else if (x === 1) dir = 'east';

      const now = Date.now();
      if (dir) {
        const changed = dir !== lastAxisDir.current;
        const cooled = now - lastMoveTs.current > MOVE_COOLDOWN_MS;
        if ((changed || cooled)) {
          issueCommand(`go ${dir}`);
          lastAxisDir.current = dir;
          lastMoveTs.current = now;
        }
      } else {
        lastAxisDir.current = null; // reset after neutral
      }
    };

    const handleButtons = (gp: Gamepad) => {
      const now = Date.now();
      const press = (idx: number, action: () => void) => {
        const btn = gp.buttons[idx];
        if (!btn || !btn.pressed) return;
        const last = lastBtnTs.current[idx] || 0;
        if (now - last < BTN_COOLDOWN_MS) return;
        lastBtnTs.current[idx] = now;
        action();
      };
      press(0, () => issueCommand('look'));       // A
      press(1, () => issueCommand('inventory'));  // B
      press(2, () => issueCommand('look'));       // X
      press(3, () => issueCommand('help'));       // Y
      press(9, () => onMeta?.('pause'));          // Start / Options
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [enabled, issueCommand, onMeta, log]);
}
