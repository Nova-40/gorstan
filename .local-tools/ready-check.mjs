#!/usr/bin/env node
// .local-tools/ready-check.mjs
// Gorstan Ready Check: verifies build, tests, coverage, budgets, and basic lore/NPC wiring.

import { exec as _exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import zlib from "zlib";

const exec = promisify(_exec);
const root = process.cwd();
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");

// --------- Config (tweak if needed) ---------
const PKG_MANAGER = "pnpm";                       // or "npm" if you prefer
const INITIAL_JS_BUDGET_GZ = 250 * 1024;          // 250 KB
const PER_ZONE_BUDGET_GZ = 200 * 1024;            // 200 KB
const ZONES = ["controlnexus","glitchrealm","elfhame","mazezone","stantonharcourt"];
const MAYBE_E2E = true;                            // set false if you don’t want e2e run here
// --------------------------------------------

// Pretty ticks
const ok = (t) => `✅ ${t}`;
const bad = (t) => `❌ ${t}`;
const warn = (t) => `⚠️ ${t}`;

let allGood = true;
const results = [];

async function run(name, cmd, required = true) {
  try {
    const { stdout, stderr } = await exec(cmd, { cwd: root, maxBuffer: 10 * 1024 * 1024 });
    results.push(ok(`${name}\n${stdout.trim() ? stdout.trim() : "(ok)"}`));
    return { ok: true, stdout, stderr };
  } catch (e) {
    const out = `${e.stdout || ""}${e.stderr || e.message || ""}`.trim();
    const msg = `${name}\n${out || "(failed)"}`;
    if (required) {
      results.push(bad(msg));
      allGood = false;
    } else {
      results.push(warn(msg));
    }
    return { ok: false, error: e };
  }
}

function gzipSize(buf) {
  return zlib.gzipSync(buf).length;
}

function lsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir).map(n => path.join(dir, n));
  const files = [];
  for (const p of entries) {
    const st = fs.statSync(p);
    if (st.isFile()) files.push(p);
    else if (st.isDirectory()) files.push(...lsFiles(p));
  }
  return files;
}

function human(n) {
  if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(2) + " MB";
  if (n >= 1024) return (n / 1024).toFixed(1) + " KB";
  return `${n} B`;
}

function findFirst(patterns, files) {
  for (const ptn of patterns) {
    const f = files.find(f => new RegExp(ptn).test(path.basename(f)));
    if (f) return f;
  }
  return null;
}

async function analyzeDist() {
  const out = { initialJsGz: 0, cssGz: 0, perZone: {}, largest: [] };

  if (!fs.existsSync(distDir)) {
    results.push(warn("No dist/ found — budgets cannot be checked. (Run build first)"));
    return out;
  }

  const files = lsFiles(distDir);
  const js = files.filter(f => f.endsWith(".js"));
  const css = files.filter(f => f.endsWith(".css"));

  // Compute gz sizes
  const jsGz = js.map(f => ({ f, gz: gzipSize(fs.readFileSync(f)) }));
  const cssGz = css.map(f => ({ f, gz: gzipSize(fs.readFileSync(f)) }));

  // Heuristic: "initial" = index-*.js plus other root bootstrap files if present.
  const indexLike = jsGz.filter(({ f }) => /(^|\/)index-[A-Za-z0-9]+\.js$/.test(f));
  const bootstrapLike = jsGz.filter(({ f }) => /(^|\/)(main|app|bootstrap)-[A-Za-z0-9]+\.js$/.test(f));
  const initialSet = [...indexLike, ...bootstrapLike];
  const uniq = new Map(initialSet.map(o => [o.f, o]));
  out.initialJsGz = [...uniq.values()].reduce((sum, x) => sum + x.gz, 0);

  // CSS total gz
  out.cssGz = cssGz.reduce((s, x) => s + x.gz, 0);

  // Per-zone chunks: match filename containing the zone id
  for (const z of ZONES) {
    const zFiles = jsGz.filter(({ f }) => new RegExp(`${z}`, "i").test(path.basename(f)));
    out.perZone[z] = zFiles.reduce((s, x) => s + x.gz, 0);
  }

  // Largest 10 chunks by gz
  out.largest = jsGz
    .sort((a, b) => b.gz - a.gz)
    .slice(0, 10)
    .map(({ f, gz }) => ({ name: path.basename(f), gz }));

  // Report
  if (out.initialJsGz > 0) {
    if (out.initialJsGz <= INITIAL_JS_BUDGET_GZ) {
      results.push(ok(`Initial JS gzip: ${human(out.initialJsGz)} (budget ≤ ${human(INITIAL_JS_BUDGET_GZ)})`));
    } else {
      results.push(bad(`Initial JS gzip: ${human(out.initialJsGz)} (exceeds budget ≤ ${human(INITIAL_JS_BUDGET_GZ)})`));
      allGood = false;
    }
  } else {
    results.push(warn("Initial JS gzip could not be determined (no index-*.js found)."));
  }

  for (const [zone, gz] of Object.entries(out.perZone)) {
    if (gz === 0) continue; // zone chunk may be lazy or absent — do not fail
    if (gz <= PER_ZONE_BUDGET_GZ) {
      results.push(ok(`Zone '${zone}' gzip: ${human(gz)} (budget ≤ ${human(PER_ZONE_BUDGET_GZ)})`));
    } else {
      results.push(bad(`Zone '${zone}' gzip: ${human(gz)} (exceeds budget ≤ ${human(PER_ZONE_BUDGET_GZ)})`));
      allGood = false;
    }
  }

  results.push(
    `Top JS chunks (gz):\n` +
    out.largest.map(x => `  • ${x.name} — ${human(x.gz)}`).join("\n")
  );

  return out;
}

async function checkLoreAndNPC() {
  // Light sanity checks relying on your unit tests for deep behaviour.
  const loreIdx = path.join(root, "lore", "index.json");
  const AylaPanel = path.join(root, "src", "components", "AylaPanel.tsx");
  const dialogueEngine = path.join(root, "src", "core", "npcs", "DialogueEngine.ts");

  const loreOk = fs.existsSync(loreIdx);
  const aylaOk = fs.existsSync(AylaPanel);
  const engOk  = fs.existsSync(dialogueEngine);

  if (loreOk && aylaOk && engOk) {
    results.push(ok("Lore & NPC wiring present (lore/index.json, AylaPanel, DialogueEngine)."));
  } else {
    const missing = [
      !loreOk && "lore/index.json",
      !aylaOk && "src/components/AylaPanel.tsx",
      !engOk  && "src/core/npcs/DialogueEngine.ts"
    ].filter(Boolean).join(", ");
    results.push(warn(`Lore/NPC sanity check: missing ${missing || "nothing"}. Relying on unit tests.`));
  }
}

(async function main() {
  console.log("▶ Gorstan Ready Check\n");

  // A. Typecheck
  await run("Typecheck", `${PKG_MANAGER} -s typecheck`);

  // B. Unit tests (project script) + NPC coverage (vitest run with coverage; your vitest.config enforces thresholds)
  await run("Unit tests (project script)", `${PKG_MANAGER} -s test:run`);
  await run("NPC coverage gate (vitest + coverage)", `${PKG_MANAGER} -s vitest run tests/unit --coverage`);

  // C. Build
  await run("Production build", `${PKG_MANAGER} -s build`);

  // D. Budgets (dist scan)
  await analyzeDist();

  // E. Optional: E2E smoke (if scaffolded)
  if (MAYBE_E2E) {
    const hasPlaywright = fs.existsSync(path.join(root, "tests", "e2e")) || fs.existsSync(path.join(root, "e2e"));
    if (hasPlaywright) {
      await run("E2E smoke (Playwright)", `${PKG_MANAGER} -s test:e2e`, false);
    } else {
      results.push(warn("E2E smoke: skipped (no e2e folder found)."));
    }
  }

  // F. Lore/NPC sanity
  await checkLoreAndNPC();

  // G. Print summary & exit code
  console.log(results.join("\n\n") + "\n");
  if (allGood) {
    console.log("🎉 READY: YES — All required gates passed.");
    process.exit(0);
  } else {
    console.log("🛑 READY: NO — One or more gates failed. See notes above.");
    process.exit(1);
  }
})();
