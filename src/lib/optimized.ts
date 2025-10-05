export function pickOptimized(src: string, manifest: Record<string, any>) {
  const m = manifest[src] || manifest[src.replace(/\\/g, '/')] || {};
  // normalized fields: avif, webp, webm, mp4, fallback
  return {
    avif: m.avif ?? null,
    webp: m.webp ?? null,
    webm: m.webm ?? null,
    mp4: m.mp4 ?? null,
    fallback: src,
    sizes: m.sizes || {}
  };
}
