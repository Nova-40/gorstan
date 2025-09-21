const lastRun = new Map<string, number>();

export function canTrigger(roomId: string, miniId: string, cooldownSec = 0): boolean {
  if (!cooldownSec || cooldownSec <= 0) return true;
  const key = `${roomId}:${miniId}`;
  const now = Date.now();
  const last = lastRun.get(key) ?? 0;
  return (now - last) >= cooldownSec * 1000;
}

export function stampTrigger(roomId: string, miniId: string) {
  const key = `${roomId}:${miniId}`;
  lastRun.set(key, Date.now());
}

// Expose clear for testing
export function _clearCooldowns() {
  lastRun.clear();
}
