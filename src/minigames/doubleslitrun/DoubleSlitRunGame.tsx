import React, { useState } from "react";
import { MiniQuestProps } from "../core/MiniQuestTypes";
import "../../styles/minigames/miniquest.css";

export function DoubleSlitRunGame({ onComplete, onCancel }: MiniQuestProps) {
  const [focus, setFocus] = useState<"particle"|"wave">("particle");
  return (
    <div className="miniquest-screen">
      <div className="miniquest-topbar">Double-Slit Run (stub) <button onClick={onCancel}>ESC</button></div>
      <div className="miniquest-console">TODO: dual-entity corridor run\nCurrent focus: {focus}</div>
      <div className="miniquest-controls">
        <button onClick={() => setFocus(f => f === "particle" ? "wave" : "particle")}>Switch Focus</button>
        <button onClick={() => onComplete({ questId: "doubleSlitRun", outcome: "abort", score: 0, durationMs:0 })}>Abort</button>
      </div>
    </div>
  );
}
