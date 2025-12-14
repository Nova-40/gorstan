// Custom ambient module declarations for tests and Vite runtime imports
declare module '/public/images/_optimized.json' {
  const value: Record<string, any>;
  export default value;
}

declare module '/public/images/*' {
  const value: Record<string, any>;
  export default value;
}

declare module '@/lib/optimized' {
  export function pickOptimized(manifest: Record<string, any>, opts?: { width?: number; height?: number }): string;
}

declare module '/public/images/_optimized.js' {
  const value: Record<string, any>;
  export default value;
}

export {};
