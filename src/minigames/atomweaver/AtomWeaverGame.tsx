import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MiniQuestProps } from "../core/MiniQuestTypes";
import { AtomWeaverState, AtomPiece } from "./atomWeaverTypes";
import { randomPiece } from "./atomWeaverLogic";
import "../../styles/minigames/miniquest.css";

const COLS = 10;
const ROWS = 20;

function emptyGrid(): string[] {
  return Array.from({ length: ROWS }, () => "".padEnd(COLS, ' '));
}

export function AtomWeaverGame({ onComplete, onCancel, seed, roomId }: MiniQuestProps) {
  const [grid, setGrid] = useState<string[]>(() => emptyGrid());
  const [current, setCurrent] = useState<{x:number,y:number,cell:AtomPiece} | null>(null);
  const [score, setScore] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(true);
  const tickRef = useRef<number | null>(null);
  const startTime = useRef<number>(Date.now());

  const spawn = useCallback(() => {
    const piece = randomPiece(seed);
    setCurrent({ x: Math.floor(COLS/2), y: 0, cell: piece });
  }, [seed]);

  useEffect(() => {
    // start game
    setGrid(emptyGrid());
    setScore(0);
    spawn();
    setRunning(true);
    const interval = setInterval(() => {
      setCurrent(prev => {
        if (!prev) return prev;
        // move down
        return { ...prev, y: prev.y + 1 };
      });
    }, 700);
    tickRef.current = interval as unknown as number;
    return () => {
      clearInterval(interval);
    };
  }, [spawn]);

  // clamp and lock piece into grid when y >= ROWS
  useEffect(() => {
    if (!current) return;
    if (current.y >= ROWS) {
      // lock piece into grid at final position
      setGrid(g => {
        const copy = [...g];
        const row = copy[ROWS - 1] || "".padEnd(COLS, ' ');
        const chars = row.split("");
        const x = Math.max(0, Math.min(COLS-1, current.x));
        chars[x] = current.cell;
        copy[ROWS - 1] = chars.join("");
        return copy;
      });
      setScore(s => s + 100);
      // spawn next
      spawn();
    }
  }, [current, spawn]);

  // keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!running) return;
      if (!current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setCurrent(c => c ? { ...c, x: Math.max(0, c.x - 1) } : c);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setCurrent(c => c ? { ...c, x: Math.min(COLS - 1, c.x + 1) } : c);
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        setCurrent(c => c ? { ...c, y: c.y + 1 } : c);
      }
      if (e.key === 'Escape') {
        setRunning(false);
        onCancel();
      }
      if (e.key === ' ') {
        // hard drop
        setCurrent(c => c ? { ...c, y: ROWS } : c);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, current, onCancel]);

  const gridDisplay = useMemo(() => {
    // render ASCII with current piece
    const out = [...grid];
    if (current) {
      const y = Math.max(0, Math.min(ROWS-1, current.y));
      const row = out[y] ?? "".padEnd(COLS, ' ');
      const chars = row.split("");
      const x = Math.max(0, Math.min(COLS-1, current.x));
      chars[x] = current.cell;
      out[y] = chars.join("");
    }
    return out.join('\n');
  }, [grid, current]);

  const finish = useCallback((outcome: 'win'|'loss'|'abort') => {
    setRunning(false);
    const duration = Date.now() - startTime.current;
    const result: any = { questId: 'atomWeaver', outcome, score, durationMs: duration, metadata: {} };
    onComplete(result);
  }, [onComplete, score]);

  return (
    <div className="miniquest-screen" role="application">
      <div className="miniquest-topbar">Atom Weaver — Fusion Rush
        <div>
          <span>Score: {score}</span>
          <button onClick={() => finish('abort')} style={{ marginLeft: 12 }}>ESC</button>
        </div>
      </div>
      <div className="miniquest-console" style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
        {gridDisplay}
      </div>
      <div className="miniquest-controls">
        <small>Controls: ←/A, →/D, ↓/S, Space (drop), Esc (quit)</small>
        <div>
          <button onClick={() => finish('win')}>Force Win</button>
        </div>
      </div>
    </div>
  );
}
