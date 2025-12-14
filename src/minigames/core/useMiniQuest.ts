import { useState, useCallback } from "react";
import { MiniQuestId, MiniQuestResult } from "./MiniQuestTypes";

export function useMiniQuest() {
  // exactOptionalPropertyTypes is enabled in this repo; optional props must allow undefined explicitly
  const [active, setActive] = useState<{id: MiniQuestId, roomId?: string | undefined, seed?: string | undefined} | null>(null);

  const launch = useCallback((id: MiniQuestId, roomId?: string, seed?: string) => {
    setActive({ id, roomId, seed });
  }, []);

  const clear = useCallback(() => setActive(null), []);

  const handleResult = useCallback((r: MiniQuestResult, cb?: (res: MiniQuestResult) => void) => {
    if (cb) cb(r);
  }, []);

  return {
    active,
    launch,
    clear,
    handleResult,
  };
}
