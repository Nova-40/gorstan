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

// Input.ts - unified runner input abstraction (keyboard now, extendable to gamepad/touch)
import { useEffect, useRef, useState } from 'react';
// Re-declare RunnerInput locally to decouple from heavy core import for tree-shake friendliness
export interface RunnerInput { laneDelta: -1 | 0 | 1; jump: boolean; slide: boolean; }

const neutral: RunnerInput = { laneDelta: 0, jump: false, slide: false };

export function useRunnerInput(): RunnerInput {
  const [input, setInput] = useState<RunnerInput>(neutral);
  const pending = useRef<RunnerInput>(neutral);

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      if (e.repeat) return;
  // Instrument input latency
  try { (window as any).gorstanMetrics?.noteInput?.(e.timeStamp ? performance.now() - (performance.now() - e.timeStamp) : performance.now()); } catch {}
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A': pending.current = { ...pending.current, laneDelta: -1 }; break;
        case 'ArrowRight': case 'd': case 'D': pending.current = { ...pending.current, laneDelta: 1 }; break;
        case 'ArrowUp': case 'w': case 'W': case ' ': pending.current = { ...pending.current, jump: true }; break;
        case 'ArrowDown': case 's': case 'S': pending.current = { ...pending.current, slide: true }; break;
      }
      setInput(pending.current);
    }
    function keyup(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A': case 'ArrowRight': case 'd': case 'D': pending.current = { ...pending.current, laneDelta: 0 }; break;
        case 'ArrowUp': case 'w': case 'W': case ' ': pending.current = { ...pending.current, jump: false }; break;
        case 'ArrowDown': case 's': case 'S': pending.current = { ...pending.current, slide: false }; break;
      }
      setInput(pending.current);
    }
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    return () => { window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); };
  }, []);

  // TODO: add gamepad + touch + swipe logic later
  return input;
}
