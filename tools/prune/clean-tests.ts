import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PRUNE_CONFIG } from "./config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const R = (p: string) => path.resolve(__dirname, PRUNE_CONFIG.projectRoot, p);

const DRY_RUN = process.argv.includes("--no-dry-run") ? false : true;

async function main() {
  const matches = new Set<string>();
  for (const g of PRUNE_CONFIG.testLikeGlobs) {
    // use a simple glob resolution to avoid adding another dependency here; rely on node's fs
    // This intentionally naive approach is good enough to identify test-like files in src/
    if (g.startsWith("src/")) {
      const globPath = R(g.replace(/\*\*/g, "").replace(/\*/g, ""));
      try {
        const stat = await fs.stat(globPath);
        if (stat.isFile()) matches.add(globPath);
      } catch {
        // ignore missing
      }
    }
  }

  if (DRY_RUN) {
    console.log("Dry-run test cleanup. Would delete:");
    for (const m of matches) console.log("  -", path.relative(R("."), m));
    console.log(`Files: ${matches.size}`);
    console.log("Run with --no-dry-run to actually delete test/story files.");
    return;
  }

  for (const m of matches) {
    await fs.rm(m, { force: true });
    console.log("Deleted test file:", path.relative(R("."), m));
  }

  console.log(`Deleted ${matches.size} test/story files.`);
}

main().catch(e => { console.error(e); process.exit(1); });
