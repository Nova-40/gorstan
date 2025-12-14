// Simple founders storage helper
export function readFounders(): string[] {
  try {
    const raw = localStorage.getItem('gorstan.founders');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch (e) {
      // fallback to CSV
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
  } catch (e) {
    return [];
  }
  return [];
}

export function addFounder(name: string) {
  if (!name) return;
  const current = readFounders();
  if (current.includes(name)) return;
  current.push(name);
  try { localStorage.setItem('gorstan.founders', JSON.stringify(current)); } catch (e) { /* ignore */ }
}

export function clearFounders() {
  try { localStorage.removeItem('gorstan.founders'); } catch (e) { /* ignore */ }
}

export default { readFounders, addFounder, clearFounders };
