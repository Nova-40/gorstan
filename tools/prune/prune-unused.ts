import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PRUNE_CONFIG } from "./config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const R = (p: string) => path.resolve(__dirname, PRUNE_CONFIG.projectRoot, p);

const DRY_RUN = process.argv.includes("--no-dry-run") ? false : true;

async function main() {
  const unusedPath = R(`${PRUNE_CONFIG.outDir}/${PRUNE_CONFIG.unusedListFile}`);
  const raw = await fs.readFile(unusedPath, "utf8");
  const unused: string[] = JSON.parse(raw);

  const deletions: string[] = [];
  for (const f of unused) {
    const rel = path.relative(R("."), f);
    if (!rel.startsWith("src/")) continue;
    if (!/\.(ts|tsx)$/.test(rel)) continue;
    deletions.push(f);
  }

  if (DRY_RUN) {
    console.log("Dry-run mode (default). Would delete:");
    deletions.forEach(d => console.log("  -", path.relative(R("."), d)));
    console.log(`Files: ${deletions.length}`);
    console.log("Run with --no-dry-run to delete.");
    return;
  }

  for (const d of deletions) {
    await fs.rm(d, { force: true });
    console.log("Deleted", path.relative(R("."), d));
  }
  console.log(`Deleted ${deletions.length} files.`);
}

main().catch(e => { console.error(e); process.exit(1); });
