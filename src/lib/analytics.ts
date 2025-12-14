export const track = (event: string, data: Record<string, unknown> = {}) => {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('analytics', { detail: { event, ...data } }));
    }
  } catch {}
};
