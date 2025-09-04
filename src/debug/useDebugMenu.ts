import { useState } from 'react';

// Minimal hook per new demo debug menu requirements
export function useDebugMenu() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false), toggle: () => setOpen(v => !v) } as const;
}
