import React from "react";
import { MiniQuestProps } from "../core/MiniQuestTypes";
import "../../styles/minigames/miniquest.css";

export function ColliderRoyaleGame({ onComplete, onCancel }: MiniQuestProps) {
  return (
    <div className="miniquest-screen">
      <div className="miniquest-topbar">Collider Royale (stub) <button onClick={onCancel}>ESC</button></div>
      <div className="miniquest-console">TODO: particle collider</div>
      <div className="miniquest-controls">
        <button onClick={() => onComplete({ questId: "colliderRoyale", outcome: "abort", score: 0, durationMs:0 })}>Abort</button>
      </div>
    </div>
  );
}
