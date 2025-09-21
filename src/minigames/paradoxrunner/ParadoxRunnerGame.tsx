import React from "react";
import { MiniQuestProps } from "../core/MiniQuestTypes";
import "../../styles/minigames/miniquest.css";

export function ParadoxRunnerGame({ onComplete, onCancel }: MiniQuestProps) {
  return (
    <div className="miniquest-screen">
      <div className="miniquest-topbar">Paradox Runner (stub) <button onClick={onCancel}>ESC</button></div>
      <div className="miniquest-console">TODO: runner with echoes</div>
      <div className="miniquest-controls">
        <button onClick={() => onComplete({ questId: "paradoxRunner", outcome: "abort", score: 0, durationMs:0 })}>Abort</button>
      </div>
    </div>
  );
}
