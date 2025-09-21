import React, { useMemo, useState } from "react";
import { getMiniQuestById } from "./MiniQuestRegistry";
import { MiniQuestId, MiniQuestResult } from "./MiniQuestTypes";
import "../../styles/minigames/miniquest.css";

export function MiniQuestOverlay({
  questId, roomId, seed, onClose, onResult
}: {
  questId: MiniQuestId; roomId?: string; seed?: string;
  onClose: () => void;
  onResult: (r: MiniQuestResult) => void;
}) {
  const spec = useMemo(() => getMiniQuestById(questId), [questId]);
  const [visible, setVisible] = useState(true);
  if (!spec) return null;
  const Game = spec.mount;
  return visible ? (
    <div className="miniquest-overlay" role="dialog" aria-modal="true">
      <Game
        roomId={roomId}
        seed={seed}
        onCancel={() => { setVisible(false); onClose(); }}
        onComplete={(r) => { setVisible(false); onResult(r); onClose(); }}
      />
    </div>
  ) : null;
}
