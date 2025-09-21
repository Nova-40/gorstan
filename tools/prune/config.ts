export const PRUNE_CONFIG = {
  projectRoot: "../../",
  entryGlobs: [
    "src/main.tsx",
    "src/index.tsx",
    "src/App.tsx"
  ],
  keepAlwaysGlobs: [
    "vite.config.ts",
    "vite.config.*.ts",
    "tsconfig*.json",
    "eslint*.{js,cjs,ts}",
    "postcss.config.*",
    "tailwind.config.*",
    "next.config.*",
    "webpack.config.*",
    "jest.config.*",
    "vitest.config.*",
    "types/**/*.d.ts",
    "**/*.d.ts"
  ],
  assetDirs: [
    "public",
    "assets",
    "src/assets",
    "static"
  ],
  testLikeGlobs: [
    "**/__tests__/**",
    "**/__mocks__/**",
    "**/*.test.{ts,tsx,js,jsx}",
    "**/*.spec.{ts,tsx,js,jsx}",
    "**/*.stories.{ts,tsx,js,jsx}",
    "**/*.story.{ts,tsx,js,jsx}",
    "**/*.e2e.{ts,tsx,js,jsx}",
    "**/*.snap",
    "**/*.mdx",
    "**/*.fixture.{ts,tsx,js,jsx}",
    "**/*.{play,preview}.{ts,tsx}"
  ],
  candidateGlobs: [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  keepRuntimeGlobs: [
    "src/**/index.ts",
    "src/**/index.tsx"
  ],
  assetExtensions: [
    ".png",".jpg",".jpeg",".gif",".webp",".svg",
    ".mp3",".ogg",".wav",
    ".mp4",".webm",
    ".css",".scss",
    ".glb",".gltf"
  ],
  outDir: "tools/prune/out",
  usedListFile: "used.json",
  unusedListFile: "unused.json",
  reportFile: "report.txt",
};
