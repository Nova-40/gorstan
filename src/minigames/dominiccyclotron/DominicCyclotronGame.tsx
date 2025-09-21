import React, { useEffect, useRef, useState } from "react";
import type { MiniQuestProps, MiniQuestResult } from "../core/MiniQuestTypes";
import "../../styles/minigames/miniquest.css";

export default function DominicCyclotronGame({ onComplete, onCancel, seed }: MiniQuestProps) {
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const start = useRef(Date.now());
  const tappedRef = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running) return;
      if (e.key === ' ' || e.key === 'Enter') {
        tappedRef.current += 1;
        setScore(s => s + 10);
      }
      if (e.key === 'Escape') {
        setRunning(false);
        onCancel();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, onCancel]);

  useEffect(() => {
    // game ends after 15s (short demo)
    const t = setTimeout(() => {
      setRunning(false);
      const res: MiniQuestResult = { questId: 'dominicCyclotron', outcome: 'win', score, durationMs: Date.now() - start.current, metadata: { taps: tappedRef.current } } as any;
      onComplete(res);
    }, 15000);
    return () => clearTimeout(t);
  }, [score, onComplete]);

  return (
    <div className="miniquest-screen" role="application" aria-label="Dominic Cyclotron Swim">
      <div className="miniquest-topbar">Dominic — Cyclotron Swim <button onClick={() => onCancel()}>ESC</button></div>
      <div className="miniquest-console">
        <p>Swim as fast as you can — repeatedly press Space/Enter to power Dominic through the cyclotron.</p>
        <p>Time remaining: 15s · Score: {score}</p>
      </div>
      <div className="miniquest-controls">
        <button onClick={() => { setRunning(false); onComplete({ questId: 'dominicCyclotron', outcome: 'abort', score, durationMs: Date.now() - start.current } as any); }}>Abort</button>
      </div>
    </div>
  );
}
