#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

process.on('uncaughtException', e => { console.error('UNCaught', e); process.exit(1); });
process.on('unhandledRejection', e => { console.error('UNHandled Rejection', e); process.exit(1); });
console.log('[inventory] start');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
console.log('[inventory] root', root);

const includeExt = new Set(['.ts','.tsx','.js','.jsx']);

function walk(dir) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { console.error('Read dir failed', dir, e); }
  const files = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function parseFileInfo(file) {
  const stat = fs.statSync(file);
  const rel = path.relative(root, file).replace(/\\/g,'/');
  const ext = path.extname(file);
  const content = fs.readFileSync(file,'utf8');
  const lines = content.split(/\r?\n/).length;
  if (!includeExt.has(ext)) return null;
  const exportMatches = [...content.matchAll(/export\s+(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_]+)/g)].map(m=>m[1]);
  const importMatches = [...content.matchAll(/import\s+.*?from\s+['"]([^'";]+)['"];?/g)].map(m=>m[1]);
  const dynamicImports = [...content.matchAll(/import\((['"][^'"]+['"])\)/g)].map(m=>m[1]);
  const depsCount = new Set(importMatches).size;
  return { path: rel, lines, size: stat.size, exports: exportMatches.join('|'), imports: importMatches.join('|'), depsCount, dynamic: dynamicImports.join('|'), mtime: stat.mtime.toISOString(), content };
}

let rows = [];
const SCAN_DIRS = ['src','scripts'];
const EXCLUDE_DIRS = new Set(['node_modules','dist','.git','coverage','reports','public','.vercel']);

function walkScoped() {
  const collected = [];
  for (const d of SCAN_DIRS) {
    const base = path.join(root, d);
    if (!fs.existsSync(base)) continue;
    collected.push(...walkFiltered(base));
  }
  return collected;
}

function walkFiltered(dir) {
  let out = [];
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (EXCLUDE_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiltered(full)); else out.push(full);
  }
  return out;
}

try {
  const all = walkScoped();
  console.log('[inventory] total candidate files', all.length);
  rows = all.map(parseFileInfo).filter(Boolean);
  console.log(`Scanned ${rows.length} source-like files`);
} catch (e) {
  console.error('Scan failure', e);
  process.exit(1);
}

// Build dependency graph for local files (relative imports only)
const graph = new Map();
try {
  for (const r of rows) {
    const localDeps = r.imports.split('|').filter(i=> i.startsWith('.') || i.startsWith('..'));
    graph.set(r.path, localDeps.map(d => normalizeImportPath(r.path, d)));
  }
} catch (e) {
  console.error('Dependency graph build failure', e);
}

function normalizeImportPath(fromPath, imp) {
  if (!imp.startsWith('.')) return imp; // external
  const baseDir = path.dirname(path.join(root, fromPath));
  let resolved = path.relative(root, path.resolve(baseDir, imp)).replace(/\\/g,'/');
  if (!/\.[a-z]+$/i.test(resolved)) {
    // try adding extensions
    for (const ext of ['.ts','.tsx','.js','.jsx']) {
      if (fs.existsSync(path.join(root, resolved + ext))) { resolved = resolved + ext; break; }
      if (fs.existsSync(path.join(root, resolved, 'index'+ext))) { resolved = resolved + '/index'+ext; break; }
    }
  }
  return resolved;
}

// Circular dependency detection (DFS)
const circulars = [];
const visiting = new Set();
const visited = new Set();

function dfs(node, stack) {
  if (visiting.has(node)) {
    const idx = stack.indexOf(node);
    circulars.push(stack.slice(idx).concat(node));
    return;
  }
  if (visited.has(node)) return;
  visiting.add(node);
  stack.push(node);
  const deps = graph.get(node) || [];
  for (const d of deps) if (graph.has(d)) dfs(d, stack);
  stack.pop();
  visiting.delete(node);
  visited.add(node);
}
for (const node of graph.keys()) dfs(node, []);

// Duplicate utility detection (naive hash of function bodies)
import crypto from 'node:crypto';
const functionBodies = new Map();
const duplicates = [];
for (const r of rows) {
  const funcs = [...r.content.matchAll(/export\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*{([\s\S]*?)}\n/g)];
  for (const f of funcs) {
    const name = f[1];
    const body = f[2].trim().replace(/\s+/g,' ');
    const hash = crypto.createHash('md5').update(body).digest('hex');
    if (functionBodies.has(hash)) {
      functionBodies.get(hash).push(`${r.path}:${name}`);
    } else {
      functionBodies.set(hash, [`${r.path}:${name}`]);
    }
  }
}
for (const [_hash, arr] of functionBodies.entries()) {
  if (arr.length > 1) duplicates.push(arr);
}

// Write CSV
const reportDir = path.join(root, 'reports');
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir);
const csvPath = path.join(reportDir, 'code_inventory.csv');
fs.writeFileSync(csvPath, 'path,lines_of_code,size_bytes,exports,imports,deps_count,dynamic_imports,last_modified\n' + rows.map(r=>`${r.path},${r.lines},${r.size},"${r.exports}","${r.imports}",${r.depsCount},"${r.dynamic}",${r.mtime}`).join('\n'));

// Dependency graph (simple)
const graphLines = ['# Dependency Graph (simplified)', '', '```'];
for (const r of rows) {
  graphLines.push(r.path);
  r.imports.split('|').filter(Boolean).forEach(dep => {
    graphLines.push(`  -> ${dep}`);
  });
}
graphLines.push('```');
graphLines.push('\n## Dynamic Imports');
const dyn = rows.filter(r=>r.dynamic).flatMap(r=> r.dynamic.split('|').filter(Boolean).map(d=> `${r.path} -> ${d}`));
graphLines.push(...(dyn.length? dyn: ['(none)']));
graphLines.push('\n## Circular Dependencies');
graphLines.push(...(circulars.length? circulars.map(c=> c.join(' -> ')) : ['(none)']));
graphLines.push('\n## Duplicate Exported Utility Functions');
graphLines.push(...(duplicates.length? duplicates.map(d=> d.join(', ')) : ['(none)']));
try {
  fs.writeFileSync(path.join(reportDir,'dep_graph.md'), graphLines.join('\n'));
  console.log(`Inventory written: ${csvPath}`);
  process.exit(0);
} catch (err) {
  console.error('Failed writing reports', err);
  process.exit(1);
}
