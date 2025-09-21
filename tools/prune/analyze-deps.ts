import { Project, ScriptTarget, ModuleResolutionKind, SyntaxKind } from "ts-morph";
import { globby } from "globby";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as fss from "node:fs";
import { fileURLToPath } from "node:url";
import { PRUNE_CONFIG } from "./config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const R = (p: string) => path.resolve(__dirname, PRUNE_CONFIG.projectRoot, p);

const ensureDir = async (dir: string) => fs.mkdir(dir, { recursive: true });

const isAsset = (filePath: string) =>
  PRUNE_CONFIG.assetExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));

async function exists(p: string) { try { await fs.access(p); return true; } catch { return false; } }
function existsSync(p: string) { try { fss.accessSync(p); return true; } catch { return false; } }

function addKnownExtensions(p: string): string[] {
  const outs = [p];
  const exts = [".ts",".tsx",".js",".jsx",".mjs",".cjs", ...PRUNE_CONFIG.assetExtensions];
  for (const ext of exts) if (!p.endsWith(ext)) outs.push(p + ext);
  if (!p.endsWith("/index")) {
    outs.push(path.join(p, "index.ts"));
    outs.push(path.join(p, "index.tsx"));
  }
  return outs;
}

function tryResolveModule(sfPath: string, spec: string): string[] {
  const base = path.dirname(sfPath);
  const candidates = [
    spec,
    `${spec}.ts`, `${spec}.tsx`,
    path.join(spec, "index.ts"),
    path.join(spec, "index.tsx"),
  ];

  const resolved: string[] = [];
  for (const c of candidates) {
    const rel = c.startsWith(".") || c.startsWith("/") ? path.resolve(base, c) : c;
    const withExt = addKnownExtensions(rel);
    for (const w of withExt) if (existsSync(w)) resolved.push(path.resolve(w));
  }
  return Array.from(new Set(resolved));
}

async function findTsConfig(): Promise<string|undefined> {
  const tryPaths = ["tsconfig.json","./tsconfig.json","../tsconfig.json","../../tsconfig.json"].map(R);
  for (const p of tryPaths) if (await exists(p)) return p;
  return undefined;
}

async function main() {
  const outDir = R(PRUNE_CONFIG.outDir);
  await ensureDir(outDir);

  const entryPaths = (await Promise.all(PRUNE_CONFIG.entryGlobs.map(g => globby(R(g))))).flat();
  const candidateFiles = (await Promise.all(PRUNE_CONFIG.candidateGlobs.map(g => globby(R(g))))).flat();

  const keepAlways = new Set((await Promise.all(PRUNE_CONFIG.keepAlwaysGlobs.map(g => globby(R(g))))).flat().map(p => path.resolve(p)));
  const keepRuntime = new Set((await Promise.all(PRUNE_CONFIG.keepRuntimeGlobs.map(g => globby(R(g))))).flat().map(p => path.resolve(p)));

  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2022,
      moduleResolution: ModuleResolutionKind.NodeNext,
      skipLibCheck: true,
      jsx: 2,
      baseUrl: R("."),
    },
    tsConfigFilePath: await findTsConfig(),
    skipAddingFilesFromTsConfig: false,
  });

  candidateFiles.forEach(f => project.addSourceFileAtPathIfExists(f));

  const used = new Set<string>();
  const visitQueue: string[] = [];

  for (const e of entryPaths) {
    const abs = path.resolve(e);
    if (await exists(abs)) { used.add(abs); visitQueue.push(abs); }
  }

  while (visitQueue.length) {
    const current = visitQueue.pop()!;
    const sf = project.getSourceFile(current);
    if (!sf) continue;

    // static imports
    for (const imp of sf.getImportDeclarations()) {
      const spec = imp.getModuleSpecifierValue();
      const resolved = tryResolveModule(current, spec);
      for (const r of resolved) {
        if (isAsset(r)) continue;
        if (/\.(ts|tsx)$/.test(r) && !used.has(r)) { used.add(r); visitQueue.push(r); }
      }
    }

    // dynamic imports
    sf.forEachDescendant(node => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const ce = node.asKind(SyntaxKind.CallExpression)!;
        const callee = ce.getExpression().getText();
        if (callee === "import") {
          const arg = ce.getArguments()[0]?.getText()?.replace(/['"`]/g, "");
          if (arg) {
            const resolved = tryResolveModule(current, arg);
            for (const r of resolved) {
              if (isAsset(r)) continue;
              if (/\.(ts|tsx)$/.test(r) && !used.has(r)) { used.add(r); visitQueue.push(r); }
            }
          }
        }
      }
    });
  }

  // Keep lists
  for (const k of keepAlways) used.add(k);
  for (const k of keepRuntime) used.add(k);

  const absCandidates = new Set(candidateFiles.map(f => path.resolve(f)));
  const unused = [...absCandidates].filter(f => !used.has(f));

  const usedOut = path.join(outDir, PRUNE_CONFIG.usedListFile);
  const unusedOut = path.join(outDir, PRUNE_CONFIG.unusedListFile);
  const reportOut = path.join(outDir, PRUNE_CONFIG.reportFile);

  await fs.writeFile(usedOut, JSON.stringify([...used].sort(), null, 2));
  await fs.writeFile(unusedOut, JSON.stringify(unused.sort(), null, 2));
  await fs.writeFile(reportOut, [
    `=== PRUNE ANALYSIS REPORT ===`,
    `Entries:`,
    ...entryPaths.map(p => `  - ${p}`),
    ``,
    `Used .ts/.tsx files: ${[...used].filter(f => /\.(ts|tsx)$/.test(f)).length}`,
    `Unused .ts/.tsx files: ${unused.length}`,
    ``,
    `Keep-always matched: ${keepAlways.size}`,
    `Keep-runtime matched: ${keepRuntime.size}`,
    ``,
    `Output:`,
    `  used:   ${usedOut}`,
    `  unused: ${unusedOut}`,
  ].join("\n"));

  console.log("Analysis complete.");
  console.log(`Used list:   ${path.relative(R("."), usedOut)}`);
  console.log(`Unused list: ${path.relative(R("."), unusedOut)}`);
  console.log(`Report:      ${path.relative(R("."), reportOut)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
