export type Mode = 'dev' | 'demo' | 'beta' | 'prod';

export const MODE: Mode = (import.meta.env.VITE_GORSTAN_MODE as Mode) ?? 'dev';

export const IS_DEMO = MODE === 'demo';
export const IS_DEV = MODE === 'dev';
export const IS_BETA = MODE === 'beta';
export const IS_PROD = MODE === 'prod';

export const STORAGE_PREFIX = IS_DEMO ? 'gorstan.demo.' : 'gorstan.';

export const CONFIG = {
  mode: MODE,
  isDemo: IS_DEMO,
  isDev: IS_DEV,
  isBeta: IS_BETA,
  isProd: IS_PROD,
  storagePrefix: STORAGE_PREFIX,
  
  // Demo-specific configuration
  demo: {
    hintCadence: IS_DEMO ? 6000 : 15000, // 6s in demo, 15s in full game
    showRibbon: IS_DEMO,
    reducedAnimations: true,
    defaultSfxOff: IS_DEMO,
  }
} as const;
